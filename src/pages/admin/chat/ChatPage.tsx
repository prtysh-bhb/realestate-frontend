import { useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { MessageCircle, Search, Send } from "lucide-react";

const ChatPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");

  // Mock data - replace with actual API call
  const conversations = [
    {
      id: 1,
      name: "John Smith",
      lastMessage: "Thanks for the property details!",
      timestamp: "10:30 AM",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "When can we schedule a viewing?",
      timestamp: "Yesterday",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Mike Wilson",
      lastMessage: "I'm interested in the beach house",
      timestamp: "Jan 14",
      unread: 1,
      online: true
    },
  ];

  const currentMessages = [
    { id: 1, sender: "them", text: "Hi! I'm interested in the luxury villa listing.", time: "10:15 AM" },
    { id: 2, sender: "me", text: "Hello! I'd be happy to help you with that property. What would you like to know?", time: "10:18 AM" },
    { id: 3, sender: "them", text: "Could you provide more details about the amenities?", time: "10:20 AM" },
    { id: 4, sender: "me", text: "Of course! The villa includes a pool, gym, garden, and private parking for 3 cars.", time: "10:22 AM" },
    { id: 5, sender: "them", text: "Thanks for the property details!", time: "10:30 AM" },
  ];

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Send message via API
      setMessageInput("");
    }
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          {/* Conversations List */}
          <div className="col-span-12 md:col-span-4 border-r border-gray-200 dark:border-gray-800 flex flex-col">
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
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
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

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-8 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                        J
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">John Smith</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/30">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === "me" ? "order-2" : "order-1"}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.sender === "me"
                              ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                              : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.sender === "me" ? "text-right" : "text-left"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
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
