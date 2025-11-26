/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/ChatPage.tsx
import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { MessageCircle, Search, Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { ArrowLeft } from "lucide-react";

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online?: boolean;
};

type ChatMessage = {
  id: string | number;
  conversationId: number;
  sender: "me" | "them" | "system";
  text: string;
  time?: string;
};

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_URL;
const getAuthToken = () => localStorage.getItem("token") ?? undefined;

// localStorage keys (if using persistence)
const LS_MESSAGES_KEY = "chat:messagesByConversation_v1";
const LS_CONVS_KEY = "chat:conversations_v1";
const LS_SELECTED_KEY = "chat:selectedChat_v1";

const defaultConversations: Conversation[] = [
  { id: 1, name: "John Smith", lastMessage: "Thanks for the property details!", timestamp: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Sarah Johnson", lastMessage: "When can we schedule a viewing?", timestamp: "Yesterday", unread: 0, online: false },
  { id: 3, name: "Mike Wilson", lastMessage: "I'm interested in the beach house", timestamp: "Jan 14", unread: 1, online: true },
];

const defaultMessages: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: "them", text: "Hi! I'm interested in the luxury villa listing.", time: "10:15 AM", conversationId: 1 },
    { id: 2, sender: "me", text: "Hello! I'd be happy to help you with that property. What would you like to know?", time: "10:18 AM", conversationId: 1 },
    { id: 3, sender: "them", text: "Could you provide more details about the amenities?", time: "10:20 AM", conversationId: 1 },
    { id: 4, sender: "me", text: "Of course! The villa includes a pool, gym, garden, and private parking for 3 cars.", time: "10:22 AM", conversationId: 1 },
    { id: 5, sender: "them", text: "Thanks for the property details!", time: "10:30 AM", conversationId: 1 },
  ],
};

const ChatPage = () => {
  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);

  // mobile UI
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileChatOpen, setMobileChatOpen] = useState<boolean>(false);

  // conversations & messages
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const raw = localStorage.getItem(LS_CONVS_KEY);
      return raw ? JSON.parse(raw) : defaultConversations;
    } catch {
      return defaultConversations;
    }
  });
  const [messagesByConversation, setMessagesByConversation] = useState<Record<number, ChatMessage[]>>(() => {
    try {
      const raw = localStorage.getItem(LS_MESSAGES_KEY);
      return raw ? JSON.parse(raw) : defaultMessages;
    } catch {
      return defaultMessages;
    }
  });

  // try restore selected chat
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_SELECTED_KEY);
      if (raw) {
        const val = Number(raw);
        if (!Number.isNaN(val)) setSelectedChat(val);
      }
    } catch {}
  }, []);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // refs and socket
  const socketRef = useRef<Socket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const convListRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // persist when things change
  useEffect(() => {
    try {
      localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messagesByConversation));
      localStorage.setItem(LS_CONVS_KEY, JSON.stringify(conversations));
      if (selectedChat !== null) localStorage.setItem(LS_SELECTED_KEY, String(selectedChat));
    } catch {}
  }, [messagesByConversation, conversations, selectedChat]);

  // handle responsive detection
  useEffect(() => {
    function check() {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        // on desktop, ensure both panels visible
        setMobileChatOpen(false);
      }
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // helper: add message to state
  const pushMessage = (conversationId: number, message: ChatMessage) => {
    setMessagesByConversation((prev) => {
      const prevMessages = prev[conversationId] ?? [];
      return { ...prev, [conversationId]: [...prevMessages, message] };
    });

    // update lastMessage / timestamp in conversations array
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: message.text, timestamp: message.time ?? c.timestamp } : c))
    );
  };

  // auto-scroll messages to bottom when messages change
  useEffect(() => {
    if (chatScrollRef.current) {
      setTimeout(() => {
        chatScrollRef.current!.scrollTop = chatScrollRef.current!.scrollHeight;
      }, 10);
    }
  }, [messagesByConversation, isTyping, selectedChat]);

  useEffect(() => {
    const token = getAuthToken();
    let socket: Socket | null = null;

    try {
      socket = io(SOCKET_SERVER, {
        transports: ["websocket", "polling"],
        auth: { token },
        autoConnect: true,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;
    } catch {
      socketRef.current = null;
    }

    if (!socket) {
      setConnected(false);
      return;
    }

    socket.on("connect", () => {
      setConnected(true);
      if (selectedChat) socket.emit("chat:join", { conversationId: selectedChat });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:message", (payload: ChatMessage) => {
      const mapped: ChatMessage = {
        id: payload.id,
        conversationId: payload.conversationId,
        sender: payload.sender === "me" ? "me" : payload.sender === "system" ? "system" : "them",
        text: payload.text,
        time: payload.time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      pushMessage(mapped.conversationId, mapped);
    });

    socket.on("chat:typing", (payload: { conversationId: number; typing: boolean }) => {
      if (payload.conversationId === selectedChat) {
        setIsTyping(payload.typing);
      }
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("chat:message");
      socket?.off("chat:typing");
      try {
        socket?.disconnect();
      } catch {}
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  // join/leave room when selectedChat changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (selectedChat) {
      socket.emit("chat:join", { conversationId: selectedChat });
    }

    return () => {
      if (selectedChat) {
        socket.emit("chat:leave", { conversationId: selectedChat });
      }
    };
  }, [selectedChat]);

  // handle selecting conversation (desktop vs mobile behaviour)
  const handleSelectConversation = (conversationId: number) => {
    setSelectedChat(conversationId);
    if (isMobile) {
      setMobileChatOpen(true);
    }
  };

  // handle sending message
  const handleSendMessage = () => {
    if (!messageInput.trim() || selectedChat == null) return;

    const convId = selectedChat;
    const text = messageInput.trim();
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const localId = `local-${Date.now()}`;
    pushMessage(convId, { id: localId, conversationId: convId, sender: "me", text, time });

    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("chat:send", { conversationId: convId, text }, (ack: any) => {
        // optional ack handling
      });
    } else {
      pushMessage(convId, { id: `err-${Date.now()}`, conversationId: convId, sender: "system", text: "Message queued (offline)", time });
    }

    setMessageInput("");
    emitTyping(false);
  };

  // typing events
  const emitTyping = (typing: boolean) => {
    const socket = socketRef.current;
    if (!socket || !selectedChat) return;
    socket.emit("chat:typing", { conversationId: selectedChat, typing });
  };

  // input change (emit typing start/stop)
  const handleInputChange = (value: string) => {
    setMessageInput(value);
    if (!selectedChat) return;
    emitTyping(true);
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      emitTyping(false);
    }, 800);
  };

  const selectedMessages = selectedChat ? messagesByConversation[selectedChat] ?? [] : [];

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          {/* LEFT: Conversations list */}
          <div
            className={`col-span-12 md:col-span-4 border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-0 ${
              isMobile ? (mobileChatOpen ? "hidden" : "block") : "block"
            }`}
          >
            {/* Header (fixed) */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg">
                  <MessageCircle className="text-white" size={20} />
                </div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Messages
                </h2>
              </div>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-500"
                />
              </div>
            </div>

            {/* Scrollable conversations list */}
            <div ref={convListRef} className="flex-1 overflow-y-auto min-h-0">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all ${
                    selectedChat === conversation.id
                      ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-600 dark:border-l-emerald-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                          {conversation.name.charAt(0)}
                        </div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {conversation.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 dark:bg-emerald-600 text-white text-xs font-bold rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Chat area */}
          <div
            className={`col-span-12 md:col-span-8 flex flex-col min-h-0 ${
              isMobile ? (mobileChatOpen ? "block" : "hidden") : "block"
            }`}
          >
            {selectedChat ? (
              <>
                {/* Header with back button on mobile */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <button
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                        onClick={() => setMobileChatOpen(false)}
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft size={18} />
                      </button>
                    )}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                        {conversations.find((c) => c.id === selectedChat)?.name?.charAt(0) ?? "U"}
                      </div>
                      {conversations.find((c) => c.id === selectedChat)?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {conversations.find((c) => c.id === selectedChat)?.name ?? "User"}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {connected === null ? "Connecting..." : connected ? "Connected" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scrollable Messages (middle) */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/30 min-h-0"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {selectedMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${message.sender === "me" ? "order-2" : "order-1"}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.sender === "me"
                              ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                              : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                          }`}
                          style={{ maxWidth: "100%", maxHeight: "12rem", overflow: "auto" }}
                        >
                          <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.sender === "me" ? "text-right" : "text-left"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[60%]">
                        <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm">Typing…</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input (fixed) */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 text-gray-900 dark:text-white outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChatPage;
