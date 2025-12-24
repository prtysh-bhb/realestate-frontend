/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Conversational Property Discovery Component
 * Advanced AI chat interface for natural property search and discovery
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Zap,
  Filter,
  Building2,
  Loader2,
} from "lucide-react";
import { sendAIChatMessage, getAIChatHistory } from "@/api/customer/aichat";
import {
  recommendProperty,
  getRecommendationHistory,
  getRecommendationById,
} from "@/api/customer/aidevelop";
import type {
  AIChatSession,
  AIChatMessage as ApiChatMessage,
  AIRecommendationRequest,
} from "@/api/customer/aidevelop";

/* ============================
   Component Types
============================ */

interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  properties?: PropertyCard[];
  suggestions?: string[];
  typing?: boolean;
  recommendationId?: number; // Store recommendation ID for future reference
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
  propertyId?: string;
  description?: string;
  propertyType?: string;
  yearBuilt?: number;
  status?: string;
}

/* ============================
   Main Component
============================ */

const ConversationalPropertyDiscovery = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse natural language to extract property requirements
  const parsePropertyRequirements = (text: string): AIRecommendationRequest => {
    const requirements: AIRecommendationRequest = {};

    // Parse bedrooms
    const bedroomMatch = text.match(/(\d+)\s*(?:bedroom|bed|bdr|br)/i);
    if (bedroomMatch) {
      requirements.bedrooms = parseInt(bedroomMatch[1]);
    }

    // Parse bathrooms
    const bathroomMatch = text.match(/(\d+\.?\d*)\s*(?:bathroom|bath|ba)/i);
    if (bathroomMatch) {
      requirements.bathrooms = parseFloat(bathroomMatch[1]);
    }

    // Parse budget
    const budgetMatch =
      text.match(/(?:under|less than|below)\s*\$?(\d+[kK]?)/i) ||
      text.match(/\$?(\d+[kK]?)\s*(?:budget|price|cost)/i);
    if (budgetMatch) {
      let budget = budgetMatch[1];
      if (budget.toLowerCase().includes("k")) {
        requirements.budget_max = parseInt(budget) * 1000;
      } else {
        requirements.budget_max = parseInt(budget);
      }
    }

    // Parse location keywords
    const locationKeywords = ["downtown", "suburbs", "city", "urban", "rural", "near", "close to"];
    const locationMatch =
      text.match(new RegExp(`(${locationKeywords.join("|")})\\s+([^.,]+)`, "i")) ||
      text.match(/in\s+([^.,]+)/i);
    if (locationMatch) {
      requirements.location = locationMatch[1] || locationMatch[2];
    }

    // Parse property type
    const propertyTypes = ["house", "apartment", "condo", "villa", "townhouse", "studio"];
    propertyTypes.forEach((type) => {
      if (text.toLowerCase().includes(type)) {
        requirements.property_type = type;
      }
    });

    return requirements;
  };

  // Convert API property data to PropertyCard format
  const apiPropertyToPropertyCard = (apiProperty: any, index: number): PropertyCard => {
    return {
      id: apiProperty.id ?? index + 1,
      title: apiProperty.title ?? `Property ${index + 1}`,
      price: apiProperty.price
        ? `₹${Number(apiProperty.price).toLocaleString()}`
        : "Price not available",
      location: apiProperty.location ?? apiProperty.city ?? "Location not specified",
      beds: Number(apiProperty.bedrooms ?? 0),
      baths: Number(apiProperty.bathrooms ?? 0),
      sqft: Number(apiProperty.area ?? 0),
      image: apiProperty.image_url || "/api/placeholder/400/300?text=Property",
      matchScore: Math.floor(Math.random() * 20) + 80,
      propertyType: apiProperty.property_type,
      description: apiProperty.description,
      status: apiProperty.status,
    };
  };

  // Extract properties from AI recommendation response
  const extractPropertiesFromResponse = (responseData: any): PropertyCard[] => {
  if (!responseData) return [];

  let properties: any[] = [];

  if (Array.isArray(responseData.recommendations)) {
    properties = responseData.recommendations
      .map((rec: any) => rec.property)
      .filter(Boolean);
  }

  return properties.map((prop, index) =>
    apiPropertyToPropertyCard(prop, index)
  );
};


  // Extract suggestions from AI response
  const extractSuggestionsFromResponse = (content: string): string[] => {
    // Default suggestions
    const defaultSuggestions = [
      "Tell me more about the first one",
      "What's the neighborhood like?",
      "Show me similar properties",
      "Schedule a viewing",
    ];

    // Check for specific property types in response to customize suggestions
    if (content.toLowerCase().includes("apartment") || content.toLowerCase().includes("condo")) {
      return [
        "Show me more apartments",
        "What are the amenities?",
        "Is parking included?",
        "Are pets allowed?",
      ];
    } else if (content.toLowerCase().includes("house") || content.toLowerCase().includes("villa")) {
      return [
        "Show me more houses",
        "What's the yard size?",
        "How old is the property?",
        "Any recent renovations?",
      ];
    }

    return defaultSuggestions;
  };

  // Convert API message to component message
  const apiMessageToComponentMessage = (apiMessage: ApiChatMessage): ChatMessage => {
    return {
      id: `api-${Date.now()}-${Math.random()}`,
      type: apiMessage.role,
      content: apiMessage.content,
      timestamp: apiMessage.created_at ? new Date(apiMessage.created_at) : new Date(),
      // Note: Chat API doesn't return properties directly
      suggestions: extractSuggestionsFromResponse(apiMessage.content),
    };
  };

  // Load chat history from API
  const loadChatHistory = async (sessionId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await getAIChatHistory(sessionId);

      if (response.success && response.data) {
        const session = response.data;
        const componentMessages: ChatMessage[] = session.messages.map((msg) =>
          apiMessageToComponentMessage(msg)
        );

        // Add welcome message if no messages
        if (componentMessages.length === 0) {
          componentMessages.push({
            id: "welcome",
            type: "assistant",
            content:
              "👋 Welcome back! I'm your AI property assistant. How can I help you find your perfect home today?",
            timestamp: new Date(),
            suggestions: [
              "Continue our property search",
              "Show me my saved properties",
              "Find homes with a pool",
              "Update my search criteria",
            ],
          });
        }

        setMessages(componentMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "system",
          content: "⚠️ Failed to load chat history. Starting new conversation.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Get AI property recommendations
  const getPropertyRecommendations = async (
  requirements: AIRecommendationRequest
) => {
  try {
    const response = await recommendProperty(requirements);

    if (!response?.success) {
      return {
        description:
          "I searched but couldn't find properties matching your exact criteria.",
        properties: [],
        recommendationId: null,
      };
    }

    const properties = extractPropertiesFromResponse(response);

    if (properties.length === 0) {
      return {
        description:
          "I searched but couldn't find properties matching your exact criteria. Try adjusting your requirements.",
        properties: [],
        recommendationId: null,
      };
    }

    return {
      description: `I found ${properties.length} property that matches your criteria.`,
      properties,
      recommendationId: response.recommendation_id ?? null,
    };
  } catch (error) {
    console.error("Recommendation API error:", error);
    return {
      description:
        "I'm having trouble finding properties right now. Please try again later.",
      properties: [],
      recommendationId: null,
    };
  }
};


  // Load recommendation history
  const loadRecommendationHistory = async () => {
    try {
      const response = await getRecommendationHistory(1);
      if (response.success && response.data.data.length > 0) {
        // You could show recent recommendations here
        console.log("Recent recommendations:", response.data.data);
      }
    } catch (error) {
      console.error("Failed to load recommendation history:", error);
    }
  };

  // Initialize or load session
  useEffect(() => {
    // Check if there's a saved session ID in localStorage
    const savedSessionId = localStorage.getItem("ai_chat_session_id");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadChatHistory(savedSessionId);
    }

    // Load recent recommendations
    loadRecommendationHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // First, parse requirements and get property recommendations
      const requirements = parsePropertyRequirements(userText);
      const recommendationResult = await getPropertyRecommendations(requirements);

      // Then, get AI chat response for natural conversation
      const chatResponse = await sendAIChatMessage({
        message: userText,
        session_id: sessionId,
      });

      if (!chatResponse.success || !chatResponse.data) {
        throw new Error("Invalid AI chat response");
      }

      // Save session ID (first message)
      if (!sessionId && chatResponse.data.session_id) {
        setSessionId(chatResponse.data.session_id);
        localStorage.setItem("ai_chat_session_id", chatResponse.data.session_id);
      }

      // Combine chat response with property recommendations
      const latestAssistantMessage = chatResponse.data.messages
        .filter((msg: ApiChatMessage) => msg.role === "assistant")
        .pop();

      let aiContent = "";
      if (latestAssistantMessage) {
        aiContent = latestAssistantMessage.content;
      }

      // If we have properties, append property information
      if (recommendationResult.properties.length > 0) {
        aiContent += "\n\n" + recommendationResult.description;
      }

      // Add assistant message with properties
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "assistant",
        content: aiContent,
        timestamp: new Date(),
        properties: recommendationResult.properties,
        suggestions: extractSuggestionsFromResponse(aiContent),
        recommendationId: recommendationResult.recommendationId || undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat API error:", error);

      // Fallback: try to get properties anyway
      try {
        const requirements = parsePropertyRequirements(userText);
        const recommendationResult = await getPropertyRecommendations(requirements);

        const fallbackMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: "assistant",
          content:
            recommendationResult.description || "I'll help you find properties. Let me search...",
          timestamp: new Date(),
          properties: recommendationResult.properties,
          suggestions: [
            "Search for different criteria",
            "Adjust budget range",
            "Change location",
            "Modify property type",
          ],
        };

        setMessages((prev) => [...prev, fallbackMessage]);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            type: "system",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recognition here
  };

  const handlePropertyAction = async (propertyId: number, action: "favorite" | "schedule") => {
    const actionMessages = {
      favorite: "Property added to your favorites! 💙",
      schedule: "Great choice! When would you like to schedule a viewing?",
    };

    // You could make API calls here to save favorite or schedule viewing
    try {
      // Example: Save favorite property
      // await api.post('/customer/properties/favorite', { propertyId });

      const systemMessage: ChatMessage = {
        id: `action-${Date.now()}`,
        type: "system",
        content: actionMessages[action],
        timestamp: new Date(),
        suggestions:
          action === "schedule"
            ? ["Tomorrow morning", "This weekend", "Next week", "I'll call to schedule"]
            : undefined,
      };

      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error(`Failed to ${action} property:`, error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: "system",
        content: `Failed to ${action} property. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleStartNewChat = () => {
    localStorage.removeItem("ai_chat_session_id");
    setSessionId(null);
    setMessages([
      {
        id: "welcome",
        type: "assistant",
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
  };

  const handleRegenerateResponse = async (messageId: string) => {
    // Find the user message that this AI response is based on
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex > 0 && messages[messageIndex - 1].type === "user") {
      const userMessage = messages[messageIndex - 1];
      setInputValue(userMessage.content);
      handleSend();
    }
  };

  // Quick action queries with structured requirements
  const quickActions = [
    {
      icon: Home,
      label: "Family Homes",
      query: "Find me family homes with 3+ bedrooms and a backyard",
      requirements: { bedrooms: 3, property_type: "house" },
    },
    {
      icon: Building2,
      label: "Condos",
      query: "Show modern condos in downtown area",
      requirements: { property_type: "condo", location: "downtown" },
    },
    {
      icon: DollarSign,
      label: "Under $500k",
      query: "Properties under $500,000",
      requirements: { budget_max: 500000 },
    },
    {
      icon: MapPin,
      label: "Near Schools",
      query: "Homes near good schools",
      requirements: { location: "school district" },
    },
  ];

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
              {isLoadingHistory ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <Sparkles className="w-7 h-7 animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">AI Property Assistant</h2>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>AI Assistant Online • Session: {sessionId ? "Active" : "New"}</span>
              </div>
            </div>
          </div>

          {/* Session Actions */}
          <div className="flex gap-2">
            {sessionId && (
              <button
                onClick={handleStartNewChat}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-semibold border border-white/30"
              >
                <RotateCcw className="w-4 h-4" />
                New Chat
              </button>
            )}
            <button
              onClick={loadRecommendationHistory}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-semibold border border-white/30"
            >
              <Filter className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading conversation history...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSuggestionClick={handleSuggestionClick}
                onPropertyAction={handlePropertyAction}
                onRegenerate={handleRegenerateResponse}
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
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Quick Actions Bar */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleSuggestionClick(action.query)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              disabled={isTyping || isLoadingHistory}
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
              className="w-full px-6 py-4 pr-32 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white placeholder:text-gray-500 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isTyping || isLoadingHistory}
            />

            {/* Input Actions */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={handleVoiceInput}
                disabled={isTyping || isLoadingHistory}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : isTyping || isLoadingHistory
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isTyping || isLoadingHistory
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
                disabled={isTyping || isLoadingHistory}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping || isLoadingHistory}
            whileHover={{ scale: !inputValue.trim() || isTyping || isLoadingHistory ? 1 : 1.05 }}
            whileTap={{ scale: !inputValue.trim() || isTyping || isLoadingHistory ? 1 : 0.95 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              !inputValue.trim() || isTyping || isLoadingHistory
                ? "bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
            }`}
          >
            {isTyping ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
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
  onRegenerate,
}: {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  onPropertyAction: (propertyId: number, action: "favorite" | "schedule") => void;
  onRegenerate: (messageId: string) => void;
}) => {
  const isUser = message.type === "user";
  const isSystem = message.type === "system";
  const isAssistant = message.type === "assistant";

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
        {isAssistant && (
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
            <button
              onClick={() => onRegenerate(message.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
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
            onError={(e) => {
              e.currentTarget.src = `/api/placeholder/400/300?text=${encodeURIComponent(
                property.title
              )}`;
            }}
          />
          {/* Match Score Badge */}
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {property.matchScore}%
          </div>
          {/* Property Type Badge */}
          {property.propertyType && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {property.propertyType}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">
              {property.title}
            </h4>
            {property.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  property.status.toLowerCase() === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {property.status}
              </span>
            )}
          </div>
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
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Additional Info */}
          {property.yearBuilt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Built: {property.yearBuilt}
            </p>
          )}
          {property.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {property.description}
            </p>
          )}
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
