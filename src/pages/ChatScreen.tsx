import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Search, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
  type: 'text' | 'property';
  property?: {
    id: number;
    image: string;
    title: string;
    price: string;
    address: string;
    beds: number;
    baths: number;
  };
}

interface Conversation {
  id: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  tags: string[];
  property?: {
    id: number;
    title: string;
  };
}

interface ChatProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    role: 'agent' | 'admin';
  };
}

const ChatScreen = ({ currentUser }: ChatProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '2',
      customer: {
        id: '102',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        isOnline: false,
      },
      lastMessage: 'When can we schedule the property tour?',
      lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
      unreadCount: 0,
      tags: ['Scheduled'],
    },
    {
      id: '3',
      customer: {
        id: '103',
        name: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        isOnline: true,
      },
      lastMessage: 'Thanks for the documents!',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 0,
      tags: ['Documents'],
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm interested in the modern villa property at 123 Luxury Lane. Could you tell me more about the neighborhood?",
      sender: 'customer',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
    },
    {
      id: '2',
      text: "Hello Sarah! Great choice. The Beverly Hills Estates neighborhood is one of the most desirable areas with excellent schools, shopping centers within 5 minutes, and beautiful parks nearby.",
      sender: 'agent',
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      type: 'text',
    },
    {
      id: '3',
      text: '',
      sender: 'agent',
      timestamp: new Date(Date.now() - 27 * 60 * 1000),
      type: 'property',
      property: {
        id: 1,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
        title: 'Modern Luxury Villa',
        price: '$1,250,000',
        address: '123 Luxury Lane, Beverly Hills',
        beds: 4,
        baths: 3,
      },
    },
    {
      id: '4',
      text: "That sounds perfect! When can we schedule a viewing? I'm available this weekend.",
      sender: 'customer',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text',
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConversations, setShowConversations] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {user} = useAuth();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversations(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const el = document.getElementById("chatContainer");
    el?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'agent',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate customer reply after 2 seconds
      setIsTyping(true);
      setTimeout(() => {
        const customerReply: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks! I'll discuss with my partner and get back to you.",
          sender: 'customer',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, customerReply]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Clear unread count for selected conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
    
    // On mobile, hide conversations after selection
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const toggleConversations = () => {
    setShowConversations(!showConversations);
  };

  const renderMessage = (message: Message) => {
    const isAgent = message.sender === 'agent';
    
    if (message.type === 'property' && message.property) {
      return (
        <div key={message.id} className={`flex justify-${isAgent ? 'end' : 'start'} mb-4`}>
          <div className={`flex ${isAgent ? 'flex-row-reverse' : 'flex-row'} max-w-full md:max-w-xs lg:max-w-md`}>
            {!isAgent && (
              <img
                src={selectedConversation.customer.avatar}
                alt={selectedConversation.customer.name}
                className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
              />
            )}
            <div className={`mx-2 flex-1 ${isAgent ? 'text-right' : ''}`}>
              <div className={`rounded-lg p-3 shadow-sm ${
                isAgent 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}>
                <div className={`flex ${isAgent ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                  <img
                    src={message.property.image}
                    alt={message.property.title}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm md:text-base ${isAgent ? 'text-white' : 'text-gray-900'} truncate`}>
                      {message.property.title}
                    </p>
                    <p className={`text-xs md:text-sm ${isAgent ? 'text-blue-100' : 'text-gray-600'} truncate`}>
                      {message.property.price} • {message.property.beds} Beds • {message.property.baths} Baths
                    </p>
                    <p className={`text-xs md:text-sm mt-1 ${isAgent ? 'text-blue-100' : 'text-gray-600'} truncate`}>
                      {message.property.address}
                    </p>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {formatTime(message.timestamp)}
              </span>
            </div>
            {isAgent && (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex justify-${isAgent ? 'end' : 'start'} mb-4`}>
        <div className={`flex ${isAgent ? 'flex-row-reverse' : 'flex-row'} max-w-full md:max-w-xs lg:max-w-md`}>
          {!isAgent && (
            <img
              src={selectedConversation.customer.avatar}
              alt={selectedConversation.customer.name}
              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
            />
          )}
          <div className={`mx-2 flex-1 ${isAgent ? 'text-right' : ''}`}>
            <div className={`rounded-lg p-3 shadow-sm ${
              isAgent 
                ? 'bg-blue-500 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 rounded-tl-none'
            }`}>
              <p className={`${isAgent ? 'text-white' : 'text-gray-800'} text-sm md:text-base break-words`}>
                {message.text}
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              {formatTime(message.timestamp)}
            </span>
          </div>
          {isAgent && (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
            />
          )}
        </div>
      </div>
    );
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${isMobile ? '' : 'mb-20'} ${user.role == 'agent' ? 'bg-gray-100' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white mt-2 shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-blue-500">Messages</h1>
            </div>
          </div>
        </header>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="container mx-auto py-8">

          {/* Page Title - Desktop */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Messages</h2>
              <p className="text-gray-600 mt-2">Communicate with agents</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className={`bg-white rounded-none md:rounded-xl shadow-lg overflow-hidden ${isMobile ? 'h-[calc(100vh-80px)]' : 'container h-[calc(800px)] mx-auto'}`}>
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className={`
            ${showConversations && isMobile ? 'absolute top-38 left-0 right-0 bottom-0 z-30 bg-white' : 'hidden'} 
            md:relative md:block md:w-1/3 lg:w-1/4
            border-r border-gray-200 flex flex-col
          `}>
            {/* Search Bar */}
            <div className="p-3 md:p-4 border-b border-gray-200">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
                <Search size={19} className='absolute left-3 top-3 text-gray-400' />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="p-3 md:p-4 flex items-center space-x-2 md:space-x-3">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={conversation.customer.avatar}
                        alt={conversation.customer.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                      {conversation.customer.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                          {conversation.customer.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center space-x-1 mt-1 flex-wrap">
                        {conversation.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              tag === 'New' 
                                ? 'bg-green-500 text-white'
                                : tag === 'Property Inquiry'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`
            ${showConversations ? 'hidden' : 'flex'} 
            md:flex flex-1 flex-col
          `}>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-3 md:p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  {isMobile && (
                    <button
                      onClick={toggleConversations}
                      className="p-1 text-gray-600 hover:text-blue-500"
                    >
                      <ChevronLeft />
                    </button>
                  )}
                  <img 
                    src={selectedConversation.customer.avatar}
                    alt={selectedConversation.customer.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {selectedConversation.customer.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 md:mr-2 ${
                        selectedConversation.customer.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      {selectedConversation.customer.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <button className="p-1 md:p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition">
                    <i className="fas fa-phone text-sm md:text-base"></i>
                  </button>
                  <button className="p-1 md:p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition">
                    <i className="fas fa-video text-sm md:text-base"></i>
                  </button>
                  <button className="p-1 md:p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition">
                    <i className="fas fa-info-circle text-sm md:text-base"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 space-y-2 md:space-y-4" >
              {/* Date Separator */}
              <div className="text-center">
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {formatDate(new Date())}
                </span>
              </div>

              {/* Messages */}
              {messages.map(renderMessage)}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex max-w-full md:max-w-xs lg:max-w-md">
                    <img
                      src={selectedConversation.customer.avatar}
                      alt={selectedConversation.customer.name}
                      className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                    />
                    <div className="mx-2">
                      <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div id="chatContainer"></div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-3 md:p-4 bg-white">
              <div className="flex space-x-2 md:space-x-3">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <Send className='md:mr-2' />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;