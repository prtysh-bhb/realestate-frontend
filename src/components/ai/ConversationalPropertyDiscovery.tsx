/**
 * Conversational Property Discovery Component
 * Advanced AI chat interface for natural property search and discovery
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Home,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Calendar,
  TrendingUp,
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Zap,
  Filter,
  Building2,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  properties?: PropertyCard[];
  suggestions?: string[];
  typing?: boolean;
}

interface PropertyCard {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  matchScore: number;
}

const ConversationalPropertyDiscovery = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "👋 Hi! I'm your AI property assistant. I can help you find your perfect home using natural conversation. Try saying something like:\n\n• 'Find me a 3-bedroom house near good schools'\n• 'Show properties under $500k with a backyard'\n• 'I need a modern apartment for a young professional'",
      timestamp: new Date(),
      suggestions: [
        "Find me a family home with a backyard",
        "Show me modern condos downtown",
        "Properties under $400k",
        "Houses near tech companies",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock property data
  const mockProperties: PropertyCard[] = [
    {
      id: 1,
      title: "Modern Family Home",
      price: "$485,000",
      location: "Sunset District, CA",
      beds: 4,
      baths: 3,
      sqft: 2400,
      image: "/assets/property1.jpg",
      matchScore: 95,
    },
    {
      id: 2,
      title: "Contemporary Villa",
      price: "$525,000",
      location: "Marina Bay, CA",
      beds: 3,
      baths: 2.5,
      sqft: 2100,
      image: "/assets/property2.jpg",
      matchScore: 88,
    },
    {
      id: 3,
      title: "Cozy Cottage",
      price: "$425,000",
      location: "Green Valley, CA",
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: "/assets/property3.jpg",
      matchScore: 82,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with typing indicator
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I found 3 properties that match your criteria perfectly! Here's what I discovered based on your preferences:",
        timestamp: new Date(),
        properties: mockProperties,
        suggestions: [
          "Tell me more about the first one",
          "What's the neighborhood like?",
          "Show me similar properties",
          "Schedule a viewing",
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recognition here
  };

  const handlePropertyAction = (propertyId: number, action: "favorite" | "schedule") => {
    const actionMessages = {
      favorite: "Property added to your favorites! 💙",
      schedule: "Great choice! When would you like to schedule a viewing?",
    };

    const systemMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: actionMessages[action],
      timestamp: new Date(),
      suggestions:
        action === "schedule"
          ? ["Tomorrow morning", "This weekend", "Next week", "I'll call to schedule"]
          : undefined,
    };

    setMessages((prev) => [...prev, systemMessage]);
  };

  return (
    <div className="flex flex-col h-[800px] max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-6 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-4 ring-white/30">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Conversational Property Discovery</h2>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>AI Assistant Online</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-semibold border border-white/30">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSuggestionClick={handleSuggestionClick}
            onPropertyAction={handlePropertyAction}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Quick Actions Bar */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {[
            { icon: Home, label: "Family Homes", query: "Show me family homes" },
            { icon: Building2, label: "Condos", query: "Find modern condos" },
            { icon: DollarSign, label: "Under $500k", query: "Properties under $500k" },
            { icon: MapPin, label: "Near Schools", query: "Homes near good schools" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => handleSuggestionClick(action.query)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your dream property in natural language..."
              className="w-full px-6 py-4 pr-32 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white placeholder:text-gray-500 transition-all text-base"
            />

            {/* Input Actions */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-xl flex items-center justify-center transition-all">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          💡 Tip: Be specific! Try "3-bedroom house with a pool near downtown under $600k"
        </p>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({
  message,
  onSuggestionClick,
  onPropertyAction,
}: {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
  onPropertyAction: (propertyId: number, action: "favorite" | "schedule") => void;
}) => {
  const isUser = message.type === "user";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-6 py-3 rounded-full text-sm font-medium">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-gray-300 dark:bg-gray-700" : "bg-gradient-to-br from-purple-600 to-blue-600"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-5 py-3 ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md"
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>

          {/* Timestamp */}
          <p
            className={`text-xs mt-2 ${
              isUser ? "text-purple-200" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Property Cards */}
        {message.properties && message.properties.length > 0 && (
          <div className="mt-4 space-y-3 w-full">
            {message.properties.map((property) => (
              <PropertyCardComponent
                key={property.id}
                property={property}
                onAction={onPropertyAction}
              />
            ))}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-all hover:shadow-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Message Actions (for AI messages) */}
        {!isUser && (
          <div className="flex gap-2 mt-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <ThumbsUp className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <ThumbsDown className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Property Card Component (Inline in Chat)
const PropertyCardComponent = ({
  property,
  onAction,
}: {
  property: PropertyCard;
  onAction: (propertyId: number, action: "favorite" | "schedule") => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group"
    >
      <div className="flex gap-4 p-4">
        {/* Property Image */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Match Score Badge */}
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {property.matchScore}%
          </div>
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
            {property.title}
          </h4>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {property.price}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Property Features */}
          <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.beds} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.baths} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.sqft} sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 pt-0">
        <button
          onClick={() => onAction(property.id, "favorite")}
          className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={() => onAction(property.id, "schedule")}
          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Tour
        </button>
      </div>
    </motion.div>
  );
};

export default ConversationalPropertyDiscovery;
