// src/hooks/useOLCTickets.ts

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { olcTicketsService } from "@/services/olc-tickets.service";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type {
  OLCApiTicket,
  OLCTicket,
  OLCTicketStatus,
  OLCTicketPriority,
} from "@/types/olc-tickets.types";

const transformOLCTicket = (
  apiTicket: OLCApiTicket,
  language: string
): OLCTicket => {
  const statusMap: Record<string, OLCTicketStatus> = {
    ABIERTO: "open",
    EN_CURSO: "in_progress",
    RESUELTO: "resolved",
    CERRADO: "closed",
  };

  const priorityMap: Record<string, OLCTicketPriority> = {
    BAJA: "low",
    MEDIA: "medium",
    ALTA: "high",
    CRITICA: "critical",
  };

  const dateLocale = language === "es" ? es : enUS;

  const formattedCreatedDate = format(
    new Date(apiTicket.registration_date),
    "dd/MM/yyyy HH:mm:ss",
    { locale: dateLocale }
  );

  const formattedUpdatedDate = format(
    new Date(apiTicket.update_date),
    "dd/MM/yyyy HH:mm:ss",
    { locale: dateLocale }
  );

  const formattedResolvedDate = apiTicket.resolved_at
    ? format(new Date(apiTicket.resolved_at), "dd/MM/yyyy HH:mm:ss", {
        locale: dateLocale,
      })
    : null;

  return {
    id: String(apiTicket.id_olc_ticket),
    id_olc_ticket: apiTicket.id_olc_ticket,
    code: apiTicket.ticket_code,
    title: apiTicket.title,
    description: apiTicket.description,
    category: apiTicket.category_name,
    status: statusMap[apiTicket.nombre_status] || "open",
    statusName: apiTicket.nombre_status,
    priority: priorityMap[apiTicket.priority_name] || "low",
    priorityName: apiTicket.priority_name,
    origin: apiTicket.origin_name,
    assignee: apiTicket.assigned_user_name,
    assigneeEmail: apiTicket.assigned_user_email,
    hub: apiTicket.hub_name,
    hubCode: apiTicket.hub_code,
    createdDate: formattedCreatedDate,
    updatedDate: formattedUpdatedDate,
    resolvedDate: formattedResolvedDate,
    slaAtRisk: apiTicket.sla_at_risk === 1,
    messagesCount: apiTicket.messages_count ?? 0,
    rawData: apiTicket,
  };
};

export interface UseOLCTicketsOptions {
  limit?: number;
  initialOffset?: number;
}

export const useOLCTickets = (options?: UseOLCTicketsOptions) => {
  const { t, language } = useLanguage();
  const [tickets, setTickets] = useState<OLCTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(options?.initialOffset || 0);
  const [limit] = useState(options?.limit || 20);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [kpis, setKpis] = useState({
    totalActive: 0,
    inProgress: 0,
    slaAtRisk: 0,
    waiting: 0,
    resolvedThisMonth: 0,
    avgResolutionHours: null as number | null,
  });

  const cacheRef = useRef<{
    [key: string]: { data: OLCTicket[]; timestamp: number };
  }>({});

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 👇 NO mandamos status al backend — filtramos en cliente
      const response = await olcTicketsService.getTickets({
        limit,
        offset,
        search: searchQuery || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
      });

      if (response?.tickets) {
        const transformedTickets = response.tickets.map((ticket) =>
          transformOLCTicket(ticket, language)
        );

        // 🔧 PARCHE: pedir conteo de mensajes si el backend no lo devuelve
        const needsCounts = transformedTickets.some(
          (t) => t.rawData?.messages_count === undefined
        );

        let finalTickets = transformedTickets;

        if (needsCounts) {
          finalTickets = await Promise.all(
            transformedTickets.map(async (ticket) => {
              try {
                const detail = await olcTicketsService.getTicketWithMessages(
                  ticket.id_olc_ticket
                );
                return {
                  ...ticket,
                  messagesCount: detail?.messages?.length ?? 0,
                };
              } catch {
                return ticket;
              }
            })
          );
        }

        setTickets(finalTickets);
        setTotalCount(response.total || 0);

        if (response.summary) {
          setKpis({
            totalActive: response.summary.total_active,
            inProgress: response.summary.in_progress,
            slaAtRisk: response.summary.sla_at_risk,
            waiting: response.summary.waiting,
            resolvedThisMonth: response.summary.resolved_this_month,
            avgResolutionHours: response.summary.avg_resolution_hours,
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("common.error") || "Error loading tickets";
      setError(errorMessage);
      console.error("Error fetching OLC tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [
    limit,
    offset,
    searchQuery,
    categoryFilter,
    priorityFilter,
    language,
    t,
  ]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Filtra los tickets por el tab activo (en cliente, sin recargar red)
  const filteredTickets = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter((ticket) => ticket.status === statusFilter);
  }, [tickets, statusFilter]);

  // 👇 FIX: contar desde tickets en memoria, no desde el summary
  const getStatusCount = useCallback(
    (status: string): number => {
      if (status === "all") return tickets.length;
      return tickets.filter((t) => t.status === status).length;
    },
    [tickets]
  );

  const refetch = useCallback(() => {
    setOffset(0);
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    filteredTickets,
    loading,
    error,
    totalCount,
    offset,
    setOffset,
    limit,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    getStatusCount,
    kpis,
    refetch,
  };
};