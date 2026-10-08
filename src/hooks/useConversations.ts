// import { useState, useEffect, useCallback } from "react";

// export type Conversation = {
//   id: string;
//   title: string;
//   created_at: string;
//   updated_at: string;
// };

// export type Msg = { role: "user" | "assistant"; content: string };

// export function useConversations() {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Msg[]>([]);

//   const fetchConversations = useCallback(async () => {
//     const { data } = await supabase
//       .from("conversations")
//       .select("*")
//       .order("updated_at", { ascending: false })
//       .limit(10);
//     if (data) setConversations(data as unknown as Conversation[]);
//   }, []);

//   useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations]);

//   const loadConversation = useCallback(async (id: string) => {
//     setActiveConversationId(id);
//     const { data } = await supabase
//       .from("messages")
//       .select("role, content")
//       .eq("conversation_id", id)
//       .order("created_at", { ascending: true });
//     if (data) setMessages(data as unknown as Msg[]);
//   }, []);

//   const createConversation = useCallback(async (firstMessage: string) => {
//     const title = firstMessage.slice(0, 60) + (firstMessage.length > 60 ? "..." : "");
//     const { data } = await supabase
//       .from("conversations")
//       .insert({ title })
//       .select()
//       .single();
//     if (data) {
//       const conv = data as unknown as Conversation;
//       setActiveConversationId(conv.id);
//       setConversations((prev) => [conv, ...prev]);
//       return conv.id;
//     }
//     return null;
//   }, []);

//   const saveMessage = useCallback(async (conversationId: string, role: string, content: string) => {
//     await supabase.from("messages").insert({
//       conversation_id: conversationId,
//       role,
//       content,
//     });
//     await supabase
//       .from("conversations")
//       .update({ updated_at: new Date().toISOString() })
//       .eq("id", conversationId);
//   }, []);

//   const newChat = useCallback(() => {
//     setActiveConversationId(null);
//     setMessages([]);
//   }, []);

//   return {
//     conversations,
//     activeConversationId,
//     messages,
//     setMessages,
//     loadConversation,
//     createConversation,
//     saveMessage,
//     newChat,
//     fetchConversations,
//   };
// }
