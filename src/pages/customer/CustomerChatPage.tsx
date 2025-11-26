/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Search, Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatTime } from "@/helpers/customer_helper";
import { ChatMessage, getCustomerAgents, getMessages, isTypingCall, MessageFormData, readAgentMessages, sentMessage, unreadMessagesCountCustomer } from "@/api/customer/customerMessages";
import { Agent } from "@/types";
import Loader from "@/components/ui/Loader";
import echo from "@/lib/echo";
import { UnreadCountMap } from "@/api/agent/agentMessages";

const CustomerChatPage = () => {
  const { user } = useAuth();

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>();
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCountMap>();
  const selectedChatRef = useRef<number | null>(null);

  // mobile UI
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileChatOpen, setMobileChatOpen] = useState<boolean>(false);

  // conversations & messages
  const [conversations, setConversations] = useState<Agent[]>();
  const [messagesByConversation, setMessagesByConversation] = useState<ChatMessage[]>();

  // refs
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const fetchAgents = async () => {
    const data = await getCustomerAgents();
    setConversations(data.agents);
  };

  const fetchMessages = async (userId: number) => {
    const response = await getMessages(userId);
    setMessagesByConversation(response.data);
  };

  useEffect(() => {
    if(!selectedChat) return;
    selectedChatRef.current = selectedChat;
    fetchMessages(Number(selectedChat));
  }, [selectedChat]);

  const fetchUnreadCounts = async () => {
    const res = await unreadMessagesCountCustomer();
    setUnreadCounts(res.data);
  }

  // handle responsive detection
  useEffect(() => {
    fetchAgents();
    fetchUnreadCounts();

    function check() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileChatOpen(false);
      }
    }
    check();
    window.addEventListener("resize", check);
    setLoading(false);
    return () => window.removeEventListener("resize", check);
  }, []);

  // auto-scroll messages to bottom when messages change
  useEffect(() => {
    if (chatScrollRef.current) {
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 10);
    }
  }, [messagesByConversation, isTyping, selectedChat]);

  // handle selecting conversation
  const handleSelectConversation = async (conversationId: number) => {
    await readAgentMessages(conversationId);
    fetchUnreadCounts();
    setSelectedChat(conversationId);
    if (isMobile) {
      setMobileChatOpen(true);
    }
  };

  useEffect(() => {    
    if (!user?.id) return;

    echo.private(`send-message.${user?.id}`)
      .listen(".message.sent", async (data: any) => {
        if(data.sender_user_id == selectedChatRef.current){
          fetchMessages(data.sender_user_id);
          await readAgentMessages(data.sender_user_id);
        }

        fetchUnreadCounts();
      });

    echo.private(`is-typing.${user?.id}`)
    .listen(".is-typing", (data: any) => {
      if(data.sender_user_id == selectedChatRef.current){
        setIsTyping(true);
  
        setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    });
  }, [user?.id]);


  // handle sending message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || selectedChat == null || isSending) return;

    const convId = selectedChat;
    const text = messageInput.trim();

    // Create form data for API call
    const formData: MessageFormData = {
      receiver_id: convId, // Using agent ID as receiver_id
      type: "text",
      message: text,
      file: null,
      property_id: null,
      meta: null,
    };

    setMessageInput("");
    setIsSending(true);
    emitTyping(false);

    try {
      // Call Laravel API
      const response = await sentMessage(formData);

      if (response.success) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message:", response.message);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      fetchMessages(Number(selectedChat));
    }
  };

  // typing events
  const emitTyping = async (typing: boolean) => {
    // Simulate typing indicator for demo
    if (typing) {
      await isTypingCall(Number(selectedChat));
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversation = conversations?.find((c) => c.id === selectedChat);

  if(loading){
    <Loader />
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        {/* LEFT: Conversations list */}
        <div
          className={`col-span-12 md:col-span-4 border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-0 ${
            isMobile ? (mobileChatOpen ? "hidden" : "block") : "block"
          }`}
        >
          {/* Header */}
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
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          {/* Scrollable conversations list */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {conversations
              ?.filter((agent) => agent.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleSelectConversation(agent.id)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all ${
                    selectedChat === agent.id
                      ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-600 dark:border-l-emerald-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                          {agent.name.charAt(0)}
                        </div>
                        {agent.is_active && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {"Real Estate Agent"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-10 h-10">
                      {/* Unread message count can be added here */}
                      {unreadCounts && unreadCounts[agent?.id] > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 dark:bg-emerald-600 text-white text-xs font-bold rounded-full">
                          {unreadCounts[agent?.id]}
                        </span>
                      )}
                    </div>
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
                      {selectedConversation?.name?.charAt(0) ?? "A"}
                    </div>
                    {selectedConversation?.is_active && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedConversation?.name ?? "Agent"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {"Real Estate Agent"}
                    </p>
                    {/* <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {selectedConversation?.is_active ? "Online" : "Offline"}
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Scrollable Messages */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/30 min-h-0"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {messagesByConversation?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id == user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender_id == user.id ? "order-2" : "order-1"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender_id == user.id
                            ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                        }`}
                        style={{ maxWidth: "100%", maxHeight: "12rem", overflow: "auto" }}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                          message.sender_id == user.id ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[60%]">
                      <div className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedConversation?.name || "Agent"} is typing...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 text-gray-900 dark:text-white outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select an agent to start messaging</p>
                <p className="text-sm text-gray-400 mt-2">
                  Choose from your connected real estate agents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerChatPage;
