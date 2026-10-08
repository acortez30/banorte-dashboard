// src/hooks/useTicketWithCache.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useTickets, APITicket } from "./useTickets";
import { supportService } from "@/services/support.service";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export interface TicketMessage {
  id_consumer_ticket_conversation?: number;
  customer_message: boolean;
  internal_memo: boolean;
  message: string;
  registration_date?: string;
  timestamp?: string;
  user_name?: string | null;
  name?: string | null;
}

export interface FormattedMessage {
  id: string;
  author: string;
  role: "agent" | "system" | "client";
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

const STATUS_MAP: Record<string, number> = {
  OPEN: 77,
  CLOSED: 78,
  ARCHIVED: 79,
  DELETED: 80,
  UNDER_REVIEW: 81,
};

const PRIORITY_MAP: Record<string, number> = {
  BAJA: 1,
  MEDIA: 2,
  ALTA: 3,
  CRITICA: 4,
};

export interface TicketWithMessages extends APITicket {
  messages: TicketMessage[];
}

const formatMessages = (
  messages: TicketMessage[],
  clientName?: string
): FormattedMessage[] => {
  if (!messages || !Array.isArray(messages)) return [];

  return messages.map((msg, index) => {
    let date = new Date();
    if (msg.registration_date) date = new Date(msg.registration_date);
    else if (msg.timestamp) date = new Date(msg.timestamp);

    const formattedDate = date.toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    let role: "agent" | "system" | "client" = "agent";
    if (msg.internal_memo) role = "system";
    else if (msg.customer_message) role = "client";

    let author = "";
    if (msg.internal_memo) author = "Nota Interna";
    else if (msg.customer_message) author = clientName || "Cliente";
    else author = msg.user_name || msg.name || "Soporte";

    return {
      id: msg.id_consumer_ticket_conversation?.toString() || `msg-${index}-${Date.now()}`,
      author,
      role,
      content: msg.message,
      timestamp: formattedDate,
      isInternal: msg.internal_memo || false,
    };
  });
};

const parseMessages = (response: any): TicketMessage[] => {
  const previous = response.previous_messages || [];
  const current  = response.messages          || [];
  return [...previous, ...current].map((msg: any) => ({
    id_consumer_ticket_conversation: msg.id_consumer_ticket_conversation,
    customer_message:  msg.customer_message,
    internal_memo:     msg.internal_memo || false,
    message:           msg.message,
    registration_date: msg.registration_date || msg.timestamp,
    user_name:         msg.user_name || msg.name,
    name:              msg.name,
    timestamp:         msg.timestamp,
  }));
};

export function useTicketWithCache(
  ticketId: string | undefined,
  autoRefreshInterval: number = 30000
) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { getRawTicketById, refetch } = useTickets();

  const [ticket,          setTicket]          = useState<APITicket | null>(null);
  const [messages,        setMessages]        = useState<TicketMessage[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [sendingMessage,  setSendingMessage]  = useState(false);
  const [updatingStatus,  setUpdatingStatus]  = useState(false);
  const [updatingPriority,setUpdatingPriority]= useState(false);

  // ✅ Refs para evitar stale closures en el polling
  const ticketRef         = useRef<APITicket | null>(null);
  const messagesRef       = useRef<TicketMessage[]>([]);
  const mountedRef        = useRef(true);
  const loadingRef        = useRef(false);
  const initialLoadDone   = useRef(false);
  const lastTicketIdRef   = useRef<string | undefined>(undefined);
  const pollingRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mantener refs sincronizados
  useEffect(() => { ticketRef.current   = ticket;   }, [ticket]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Cleanup al desmontar
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  /* ─── Carga inicial ─────────────────────────────────────────── */

  const loadTicketData = useCallback(async (forceRefresh = false) => {
    if (!ticketId) { setLoading(false); return; }
    if (loadingRef.current && !forceRefresh) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Intentar caché primero, salvo forceRefresh
      let ticketData: APITicket | null = null;

      if (!forceRefresh) {
        ticketData = getRawTicketById(ticketId) ?? null;
      }

      if (!ticketData) {
        const listResponse = await supportService.getTickets({
          language: language || "es",
          open: "true", closed: "true", review: "true", archived: "true",
        });

        if (listResponse.mensaje_return?.ERROR !== false) {
          throw new Error(listResponse.mensaje_return?.ERROR_MENSAGGE || "Error fetching tickets");
        }

        const allTickets = [
          ...(listResponse.tickets?.open     || []),
          ...(listResponse.tickets?.review   || []),
          ...(listResponse.tickets?.closed   || []),
          ...(listResponse.tickets?.archived || []),
        ];

        ticketData = allTickets.find(
          (t) => String(t.id_consumer_ticket) === String(ticketId)
        ) ?? null;
      }

      if (!ticketData) throw new Error("Ticket no encontrado");

      const messagesResponse = await supportService.getMessages(ticketId, language || "es");
      const messagesData = messagesResponse.mensaje_return?.ERROR === false
        ? parseMessages(messagesResponse)
        : [];

      if (mountedRef.current) {
        setTicket(ticketData);
        setMessages(messagesData);
        initialLoadDone.current = true;
        await refetch();
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error cargando ticket");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
      loadingRef.current = false;
    }
  }, [ticketId, language, getRawTicketById, refetch]);

  /* ─── Polling silencioso ────────────────────────────────────── */

  // ✅ SIN ticket/messages en deps — lee de refs
  const silentPollingRefresh = useCallback(async () => {
    if (!ticketId || !mountedRef.current) return;

    try {
      const [listResponse, messagesResponse] = await Promise.all([
        supportService.getTickets({
          language: language || "es",
          open: "true", closed: "true", review: "true", archived: "true",
        }),
        supportService.getMessages(ticketId, language || "es"),
      ]);

      if (!mountedRef.current) return;
      if (listResponse.mensaje_return?.ERROR !== false) return;

      const allTickets = [
        ...(listResponse.tickets?.open     || []),
        ...(listResponse.tickets?.review   || []),
        ...(listResponse.tickets?.closed   || []),
        ...(listResponse.tickets?.archived || []),
      ];

      const freshTicket = allTickets.find(
        (t) => String(t.id_consumer_ticket) === String(ticketId)
      );

      if (!freshTicket) {
        console.warn("⚠️ Polling: ticket no encontrado en ningún bucket");
        return;
      }

      const newMessages = messagesResponse.mensaje_return?.ERROR === false
        ? parseMessages(messagesResponse)
        : messagesRef.current;

      // ✅ Comparar contra refs — nunca contra el closure
      const current = ticketRef.current;
      const hasStatusChange   = freshTicket.nombre_status !== current?.nombre_status;
      const hasPriorityChange = freshTicket.priority_name !== current?.priority_name;
      const hasMessagesChange = newMessages.length !== messagesRef.current.length;
      const hasNewMessage =
        messagesRef.current[messagesRef.current.length - 1]?.id_consumer_ticket_conversation !==
        newMessages[newMessages.length - 1]?.id_consumer_ticket_conversation;

      if (hasStatusChange || hasPriorityChange || hasMessagesChange || hasNewMessage) {
        setTicket(freshTicket);
        setMessages(newMessages);
      }
    } catch (err) {
      console.error("❌ Polling error:", err);
    }
  }, [ticketId, language]); // ✅ Solo deps estables

  /* ─── Effects ───────────────────────────────────────────────── */

  // Reset cuando cambia el ticketId
  useEffect(() => {
    if (lastTicketIdRef.current !== ticketId) {
      lastTicketIdRef.current = ticketId;
      setTicket(null);
      setMessages([]);
      setError(null);
      initialLoadDone.current = false;
      loadingRef.current = false;
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    }
  }, [ticketId]);

  // Carga inicial + arrancar polling
  useEffect(() => {
    if (!ticketId) { setLoading(false); return; }

    loadTicketData();

    if (autoRefreshInterval > 0) {
      pollingRef.current = setInterval(silentPollingRefresh, autoRefreshInterval);
    }

    return () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    };
  }, [ticketId]); // ✅ Intencionalmente solo ticketId — el polling no debe reiniciarse por cambios de estado

  /* ─── Acciones ──────────────────────────────────────────────── */

  const sendMessage = async (message: string, isInternalMemo = false): Promise<boolean> => {
    if (!ticketId || !message.trim()) return false;
    setSendingMessage(true);
    try {
      const isHouseAccount = user?.is_house_account === true || user?.account_type === "house";
      const isSupport = user?.user_type?.toUpperCase().includes("SOPORTE") === true;

      const params: any = { message: message.trim(), language: language || "es" };
      if (isSupport && !isHouseAccount) params.internal_memo = isInternalMemo;

      const response = await supportService.sendMessage(ticketId, params, isHouseAccount, isSupport);

      if (response.mensaje_return?.ERROR === false) {
        const newMsg: TicketMessage = {
          customer_message: false,
          internal_memo: isSupport && isInternalMemo,
          message: message.trim(),
          registration_date: new Date().toISOString(),
          user_name: user?.first_name || user?.name || "Soporte",
        };
        setMessages((prev) => [...prev, newMsg]);
        setTicket((prev) => prev ? { ...prev, total_messages: (prev.total_messages || 0) + 1 } : null);
        return true;
      }
      return false;
    } catch { return false; }
    finally { setSendingMessage(false); }
  };

  const updateTicketStatus = async (newStatus: string): Promise<boolean> => {
    if (!ticketId) return false;
    const newStatusId = STATUS_MAP[newStatus];
    if (!newStatusId) return false;

    setUpdatingStatus(true);
    try {
      const response = await supportService.updateTicket(ticketId, { data: { id_status: newStatusId } });
      if (response.mensaje_return?.ERROR === false) {
        setTicket((prev) => prev ? { ...prev, nombre_status: newStatus, id_status: newStatusId } : null);
        await refetch();
        return true;
      }
      return false;
    } catch { return false; }
    finally { setUpdatingStatus(false); }
  };

  const updateTicketPriority = async (newPriority: string): Promise<boolean> => {
    if (!ticketId) return false;
    const newPriorityId = PRIORITY_MAP[newPriority];
    if (!newPriorityId) return false;

    setUpdatingPriority(true);
    try {
      const response = await supportService.updateTicket(ticketId, { data: { id_topic_ticket: newPriorityId } });
      if (response.mensaje_return?.ERROR === false) {
        setTicket((prev) => prev ? { ...prev, priority_name: newPriority, id_type_priority: newPriorityId } : null);
        await refetch();
        return true;
      }
      return false;
    } catch { return false; }
    finally { setUpdatingPriority(false); }
  };

  const refreshMessages = useCallback(async () => {
    if (!ticketId) return;
    try {
      const response = await supportService.getMessages(ticketId, language || "es");
      if (response.mensaje_return?.ERROR === false) {
        setMessages(parseMessages(response));
      }
    } catch (err) { console.error("Error refreshing messages:", err); }
  }, [ticketId, language]);

  const refreshTicket = useCallback(async () => {
    await loadTicketData(true);
  }, [loadTicketData]);

  const getFormattedMessages = useCallback((): FormattedMessage[] => {
    if (!messages.length) return [];
    const clientName = ticket?.client_information
      ? `${ticket.client_information.user_ticket_first_name || ""} ${ticket.client_information.user_ticket_surname || ""}`.trim()
      : undefined;
    return formatMessages(messages, clientName);
  }, [messages, ticket]);

  return {
    ticket, messages, loading, error,
    sendingMessage, updatingStatus, updatingPriority,
    sendMessage, updateTicketStatus, updateTicketPriority,
    getFormattedMessages, refreshMessages, refreshTicket,
  };
}