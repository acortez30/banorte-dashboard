// src/hooks/useTickets.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supportService } from "@/services/support.service";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export interface APITicket {
  id_consumer_ticket: number;
  registration_date: string;
  update_date: string;
  id_topic_ticket: number;
  topic_ticket: string;
  id_status: number;
  nombre_status: string;
  title: string;
  tracking_number_ticket: string;
  locker_name: string;
  is_active: number;
  id_user_propierty_support: number;
  is_default: number;
  first_name: string;
  id_propierty: number;
  name_propierty: string;
  address: string;
  phone_number: string;
  description: string;
  id_type_priority: number;
  priority_name: string;
  total_messages: number;
  user_support_assigned: any[];
  client_information: {
    id_user: number;
    consumer_code: string;
    unit: string;
    email: string;
    main_tlf: string | null;
    user_ticket_first_name: string;
    user_ticket_surname: string;
  };
  id_type_ticket: number;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  assignee: string;
  lockerRef: string;
  createdDate: string;
  commentsCount: number;
  rawData?: APITicket;
}

const getCompanyFromStorage = () => {
  try {
    const companyStr = localStorage.getItem("company");
    if (companyStr) return JSON.parse(companyStr);
  } catch {}
  return null;
};

const transformTicket = (apiTicket: APITicket, language: string): Ticket => {
const statusMap: Record<string, string> = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  UNDER_REVIEW: "review",       // ← debe ser "review"
  RESOLVED: "resolved",
  CLOSED: "closed",
  ARCHIVED: "archived",         // ← debe ser "archived", no "closed"
};

  const priorityMap: Record<string, string> = {
    BAJA: "low",
    MEDIA: "medium",
    ALTA: "high",
    CRITICA: "critical",
  };

  const categoryMap: Record<number, string> = {
    1: "maintenance",
    2: "technical",
    3: "access",
    4: "billing",
    5: "other",
    6: "technical",
    7: "access",
    8: "billing",
    9: "other",
  };

  const dateLocale = language === "es" ? es : enUS;
  const formattedDate = format(
    new Date(apiTicket.registration_date),
    "dd/MM/yyyy HH:mm:ss",
    { locale: dateLocale }
  );

  let assignee = apiTicket.first_name || "Unassigned";
  if (apiTicket.user_support_assigned?.length > 0) {
    const first = apiTicket.user_support_assigned[0];
    assignee = `${first.first_name} ${first.surname || ""}`.trim();
  }

  return {
    id: apiTicket.id_consumer_ticket.toString(),
    title: apiTicket.title || apiTicket.topic_ticket,
    category: categoryMap[apiTicket.id_topic_ticket] || "other",
    status: statusMap[apiTicket.nombre_status] || "open",
    priority: priorityMap[apiTicket.priority_name] || "low",
    assignee,
    lockerRef: apiTicket.locker_name || apiTicket.name_propierty,
    createdDate: formattedDate,
    commentsCount: apiTicket.total_messages || 0,
    rawData: apiTicket,
  };
};

const buildFetchParams = (language: string) => {
  const company = getCompanyFromStorage();
  const isAdmin = company?.id_user_type === 2;
  const propertyId = company?.id_propierty;

  const params: Record<string, any> = {
    language: language || "es",
    open: "true",
    review: "true",
    closed: "true",
    archived: "true",
  };

  if (isAdmin && propertyId) {
    params.to_propierty = propertyId;
  }

  return params;
};

export function useTickets(autoRefreshInterval: number = 30000) {
  const { language } = useLanguage();

  const [allTickets, setAllTickets]   = useState<Ticket[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [kpisData, setKpisData]       = useState({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedThisMonth: 0,
    avgTime: "0h",
  });

  const [searchQuery,    setSearchQuery]    = useState("");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const pollingRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef  = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const fetchTickets = useCallback(
    async (showLoading = true) => {
      if (!mountedRef.current) return;
      if (showLoading) setLoading(true);
      setError(null);

      try {
        const params = buildFetchParams(language);
        const response = await supportService.getTickets(params);

        if (!mountedRef.current) return;

        if (response.mensaje_return?.ERROR === false) {
          const raw: APITicket[] = [
            ...(response.tickets?.open     || []),
            ...(response.tickets?.review   || []),
            ...(response.tickets?.closed   || []),
            ...(response.tickets?.archived || []),
          ];

          const transformed = raw.map((t) => transformTicket(t, language));
          setAllTickets(transformed);

          if (response.kpis_support) {
            setKpisData({
              openTickets:       response.kpis_support.total_open_tickets || 0,
              inProgressTickets: response.kpis_support.in_progress        || 0,
              resolvedThisMonth: response.kpis_support.resolved_this_month || 0,
              avgTime: response.kpis_support.average_time_hours
                ? `${response.kpis_support.average_time_hours}h`
                : "0h",
            });
          } else {
            setKpisData({
              openTickets:       transformed.filter((t) => t.status === "open").length,
              inProgressTickets: transformed.filter((t) => t.status === "in_progress").length,
              resolvedThisMonth: transformed.filter((t) => t.status === "resolved").length,
              avgTime: "0h",
            });
          }
        } else {
          setError(response.mensaje_return?.ERROR_MENSAGGE || "Error fetching tickets");
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        if (mountedRef.current) setError("Failed to load tickets");
      } finally {
        if (mountedRef.current && showLoading) setLoading(false);
      }
    },
    [language]
  );

  // Carga inicial
  useEffect(() => {
    fetchTickets(true);
  }, [fetchTickets]);

  // Polling silencioso
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    pollingRef.current = setInterval(() => {
      fetchTickets(false);
    }, autoRefreshInterval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [fetchTickets, autoRefreshInterval]);

  const filteredTickets = allTickets.filter((ticket) => {
    if (statusFilter   !== "all" && ticket.status   !== statusFilter)   return false;
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && ticket.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ticket.id.toLowerCase().includes(q)        ||
        ticket.title.toLowerCase().includes(q)     ||
        ticket.assignee.toLowerCase().includes(q)  ||
        ticket.lockerRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusCount = (status: string) => {
    if (status === "all") return allTickets.length;
    return allTickets.filter((t) => t.status === status).length;
  };

  const getTicketById = (ticketId: string | number): Ticket | undefined => {
    const id = ticketId.toString();
    return allTickets.find(
      (t) =>
        t.id === id ||
        t.rawData?.id_consumer_ticket.toString() === id ||
        t.rawData?.tracking_number_ticket === id
    );
  };

  const getRawTicketById = (ticketId: string | number): APITicket | undefined => {
    return getTicketById(ticketId)?.rawData;
  };

  return {
    tickets:        allTickets,
    filteredTickets,
    loading,
    error,
    kpis:           kpisData,

    searchQuery,    setSearchQuery,
    statusFilter,   setStatusFilter,
    categoryFilter, setCategoryFilter,
    priorityFilter, setPriorityFilter,

    getStatusCount,
    getTicketById,
    getRawTicketById,
    refetch: () => fetchTickets(false),
  };
}