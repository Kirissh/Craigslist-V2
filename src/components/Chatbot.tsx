import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, X, ChevronDown, Sparkles } from "lucide-react";
import { chatbotAPI, supabase } from "@/lib/api";
import { useLocation, useNavigate } from "react-router-dom";

// Define types for messages
interface ChatMessage {
  id?: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Define PageContext interface
interface PageContext {
  category?: string;
  subcategory?: string;
  query?: string;
  filters?: Record<string, any>;
  currentView?: 'gallery' | 'list';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);

        // Subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setIsAuthenticated(!!session);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Update page context when URL or location changes
  useEffect(() => {
    // Extract search parameters
    const searchParams = new URLSearchParams(location.search);
    
    // Extract current category from URL path
    const pathParts = location.pathname.split('/');
    const category = pathParts[2] || '';
    const subcategory = pathParts[3] || '';
    
    // Build context object
    const context: PageContext = {
      category: category || '',
      subcategory: subcategory || '',
      query: searchParams.get('q') || '',
      currentView: (searchParams.get('view') as 'gallery' | 'list') || 'gallery',
      filters: {}
    };
    
    // Add all search params as filters
    searchParams.forEach((value, key) => {
      if (key !== 'q' && key !== 'view') {
        if (context.filters) {
          context.filters[key] = value;
        }
      }
    });
    
    // Update context
    setPageContext(context);
    
    // If chatbot is open and we have a conversation, send context message
    if (isOpen && conversationId && !connectionError) {
      sendContextMessage();
    }
  }, [location.pathname, location.search, isOpen, conversationId, connectionError]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize conversation when chatbot is opened
  useEffect(() => {
    if (isOpen) {
      if (!isAuthenticated) {
        // Default welcome message for non-authenticated users
        setMessages([
          {
            role: "bot",
            content: "👋 Hi there! I'm Craigslist's AI assistant. How can I help you today? For a personalized experience, please sign in.",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      
      if (!conversationId) {
        initConversation();
      }
    }
  }, [isOpen, isAuthenticated]);

  // Reset connection error when chat is reopened
  useEffect(() => {
    if (isOpen) {
      setConnectionError(false);
    }
  }, [isOpen]);

  // Initialize conversation
  const initConversation = async () => {
    try {
      setIsTyping(true);
      setConnectionError(false);
      
      // Get user conversations
      const conversations = await chatbotAPI.getUserConversations();
      
      if (conversations && conversations.length > 0) {
        // Use the most recent conversation
        const recentConversation = conversations[0];
        setConversationId(recentConversation.id);
        
        // Load messages from this conversation
        const messagesData = await chatbotAPI.getConversationMessages(recentConversation.id);
        
        if (messagesData && messagesData.length > 0) {
          setMessages(
            messagesData.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            }))
          );
          
          // After loading messages, send a context message to make the bot aware
          if (Object.keys(pageContext).length > 0) {
            setTimeout(() => {
              sendContextMessage();
            }, 1000);
          }
        } else {
          // If no messages, create a new conversation instead
          createNewConversation();
        }
      } else {
        // Create a new conversation
        createNewConversation();
      }
    } catch (error) {
      console.error("Error initializing chatbot:", error);
      setConnectionError(true);
      setMessages([
        {
          role: "bot",
          content: "👋 Hi there! I'm having trouble connecting to my brain. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create a new conversation
  const createNewConversation = async () => {
    try {
      setIsTyping(true);
      setConnectionError(false);
      
      const newConversation = await chatbotAPI.createConversation();
      
      if (newConversation && newConversation.id) {
        setConversationId(newConversation.id);
        
        // Get welcome message for the new conversation
        const messagesData = await chatbotAPI.getConversationMessages(newConversation.id);
        
        if (messagesData && messagesData.length > 0) {
          setMessages(
            messagesData.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            }))
          );
          
          // After welcome message, send a context message
          if (Object.keys(pageContext).length > 0) {
            setTimeout(() => {
              sendContextMessage();
            }, 1000);
          }
        } else {
          // If no welcome message, display default
          setMessages([
            {
              role: "bot",
              content: "👋 Hi there! I'm Craigslist's AI assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ]);
          
          // Send context after welcome message
          if (Object.keys(pageContext).length > 0) {
            setTimeout(() => {
              sendContextMessage();
            }, 1000);
          }
        }
      } else {
        throw new Error("Failed to create conversation");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      setConnectionError(true);
      setMessages([
        {
          role: "bot",
          content: "👋 Hi there! I'm having trouble connecting to my brain. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send context information to the chatbot
  const sendContextMessage = async () => {
    if (!conversationId || !isAuthenticated) return;
    
    // Prepare context message based on current page and filters
    let contextMessage = "I'm currently ";
    
    if (pageContext.category) {
      contextMessage += `browsing the ${pageContext.category} category. `;
    } else {
      contextMessage += "on the homepage. ";
    }
    
    if (pageContext.query) {
      contextMessage += `I'm searching for "${pageContext.query}". `;
    }
    
    if (pageContext.filters && Object.keys(pageContext.filters).length > 0) {
      contextMessage += "I'm using these filters: ";
      const filterEntries = Object.entries(pageContext.filters);
      filterEntries.forEach(([key, value], index) => {
        contextMessage += `${key}: ${value}`;
        if (index < filterEntries.length - 1) {
          contextMessage += ", ";
        }
      });
      contextMessage += ". ";
    }
    
    contextMessage += `I'm viewing listings in ${pageContext.currentView || 'list'} view.`;
    
    // Send this context message silently (not displayed to user)
    try {
      await sendSilentMessage(contextMessage);
    } catch (error) {
      console.error("Error sending context:", error);
      // Don't show errors for silent context messages
    }
  };

  // Send a message silently (not shown in UI)
  const sendSilentMessage = async (message: string) => {
    if (!conversationId) return;
    
    try {
      await chatbotAPI.sendMessage(conversationId, message);
    } catch (error) {
      console.error("Silent message error:", error);
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    
    // If opening and connection error was previously detected, try reconnecting
    if (!isOpen && connectionError) {
      initConversation();
    }
  };

  // Minimize chatbot window
  const minimizeChatbot = () => {
    setIsMinimized(!isMinimized);
  };

  // Execute actions based on bot suggestions
  const executeAction = (action: string) => {
    // Handle navigation actions
    if (action.includes('navigate:')) {
      const path = action.replace('navigate:', '').trim();
      navigate(path);
      return true;
    }
    
    // Handle filter actions
    if (action.includes('filter:')) {
      const filterData = action.replace('filter:', '').trim();
      const [key, value] = filterData.split('=');
      
      if (key && value) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(key, value);
        
        // Update URL with new filter
        navigate({
          pathname: location.pathname,
          search: searchParams.toString()
        });
        return true;
      }
    }
    
    return false;
  };

  // Send message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Check if this is an action message (special commands)
    if (message.startsWith('/')) {
      const actionExecuted = executeAction(message.substring(1));
      if (actionExecuted) {
        return;
      }
    }
    
    // Create a temporary ID for the user message
    const userMessageId = `temp-${Date.now()}`;

    // Add user message to the chat immediately
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: message,
        timestamp: new Date(),
      },
    ]);

    // Clear input
    setInputMessage("");

    // Add typing indicator
    setIsTyping(true);

    try {
      // Reset connection error state
      setConnectionError(false);
      
      // Try to use the backend API
      const { userMessage, botResponse } = await chatbotAPI.sendMessage(
        conversationId!,
        message
      );

      // Remove typing indicator
      setIsTyping(false);

      // Update messages with the actual response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMessageId), // Remove temp message
        // Add actual messages with server IDs
        {
          id: userMessage.id,
          role: "user",
          content: userMessage.content,
          timestamp: new Date(userMessage.timestamp),
        },
        {
          id: botResponse.id,
          role: "bot",
          content: botResponse.content,
          timestamp: new Date(botResponse.timestamp),
        },
      ]);
      
      // Check if the response contains any actions to execute
      if (botResponse.content.includes('[ACTION:')) {
        const actionMatch = botResponse.content.match(/\[ACTION:(.*?)\]/);
        if (actionMatch && actionMatch[1]) {
          executeAction(actionMatch[1]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Set connection error state
      setConnectionError(true);
      
      // Remove typing indicator
      setIsTyping(false);
      
      // Add a fallback bot response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMessageId), // Remove temp message
        // Add user message
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: message,
          timestamp: new Date(),
        },
        // Add fallback bot message
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
      
      // Try to reconnect
      setTimeout(() => {
        if (conversationId && isAuthenticated) {
          sendSilentMessage("Are you still there? I'm back online now.");
        }
      }, 30000); // Try after 30 seconds
    }
  };

  // Handle messages for non-authenticated users with mock responses
  const handleNonAuthenticatedMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot typing
    setIsTyping(true);

    // Analyze the message to provide more relevant responses
    const lowerMessage = message.toLowerCase();
    let response = "";
    
    // Handle user asking to filter or search
    if (lowerMessage.includes('find') || 
        lowerMessage.includes('search') || 
        lowerMessage.includes('filter') ||
        lowerMessage.includes('looking for')) {
      
      // Extract potential search terms 
      let searchTerm = "";
      const keywords = ['find', 'search', 'looking for'];
      
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          const parts = lowerMessage.split(keyword);
          if (parts.length > 1) {
            searchTerm = parts[1].trim().replace(/[.?!]$/, '');
            break;
          }
        }
      }
      
      if (searchTerm) {
        // Suggest navigation with the search term
        response = `I can help you find "${searchTerm}". You can use the search bar at the top or filter by category in the left sidebar. Would you like me to search for "${searchTerm}" for you?`;
        
        // Execute the search after response
        setTimeout(() => {
          const searchParams = new URLSearchParams();
          searchParams.set('q', searchTerm);
          navigate({
            pathname: location.pathname,
            search: searchParams.toString()
          });
        }, 2000);
      } else {
        response = "You can browse listings by category or use the search function to find specific items. Our advanced filters can help you narrow down results.";
      }
    } else if (lowerMessage.includes('sell') || lowerMessage.includes('post') || lowerMessage.includes('listing')) {
      response = "If you're looking to sell an item, try the Post Ad page where our AI can help you create a great listing. Sign in to unlock all features!";
    } else if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
      response = "To create an account or sign in, click the user icon in the top right corner. Creating an account lets you save favorites and message sellers directly.";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('message') || lowerMessage.includes('seller')) {
      response = "To message sellers about their listings, you'll need to sign in. This helps keep our community safe and reduces spam.";
    } else if (lowerMessage.includes('safe') || lowerMessage.includes('scam') || lowerMessage.includes('fraud')) {
      response = "Always meet in public places, inspect items before payment, and never wire money to someone you don't know. Safety is our top priority!";
    } else {
      // Context-aware generic responses based on current page
      const contextResponses = [
        "I can help you find the right product. What are you looking for?",
        "To unlock all features including personalized assistance, please sign in or create an account.",
        "Our platform makes buying and selling easy. What would you like to know more about?",
        "If you have any questions about using Craigslist, I'm here to help!",
        "Try using specific categories or search filters to find exactly what you're looking for.",
      ];
      
      if (pageContext.category) {
        response = `I see you're browsing the ${pageContext.category} category. What specific type of item are you looking for?`;
      } else {
        response = contextResponses[Math.floor(Math.random() * contextResponses.length)];
      }
    }

    // Simulate bot response with delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!isAuthenticated) {
      // For non-authenticated users, use the mock responses
      handleNonAuthenticatedMessage(inputMessage);
      return;
    }

    // Ensure we have a conversation
    if (!conversationId) {
      createNewConversation().then(() => {
        sendMessage(inputMessage);
      });
    } else {
      sendMessage(inputMessage);
    }
  };

  // Handle retrying connection
  const handleRetryConnection = () => {
    setConnectionError(false);
    initConversation();
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
        onClick={toggleChatbot}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {/* Chatbot window */}
      {isOpen && (
        <div
          className={`fixed right-6 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-50 border ${
            isMinimized
              ? "bottom-24 h-14 w-72"
              : "bottom-24 h-96 w-72 md:w-96"
          }`}
        >
          {/* Chatbot header */}
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              <h3 className="font-medium">Craigslist Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-blue-500"
                onClick={minimizeChatbot}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-blue-500"
                onClick={toggleChatbot}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages container */}
          {!isMinimized && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-3 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "bot" && (
                      <Avatar className="h-8 w-8 mr-2 bg-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start mb-3 justify-start">
                    <Avatar className="h-8 w-8 mr-2 bg-blue-100">
                      <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                    </Avatar>
                    <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                {connectionError && (
                  <div className="flex justify-center mt-2 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRetryConnection}
                      className="text-xs"
                    >
                      Connection error. Click to retry
                    </Button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-3 border-t">
                <div className="relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="pr-10 py-2"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-blue-600"
                    disabled={isTyping || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* CSS for the typing indicator */}
      <style>
        {`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 1px;
          background-color: #bbb;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
        `}
      </style>
    </>
  );
};

export default Chatbot;
