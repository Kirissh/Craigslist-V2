import { Request, Response } from 'express';
import { supabase } from '../db/supabaseClient';
import config from '../config/config';

// Try to use Google Gemini API directly since we don't have LangChain dependencies
const generateAIResponse = async (messages: any[], systemPrompt: string) => {
  try {
    // Simple implementation to send messages to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + config.gemini.apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates && 
                data.candidates[0] && 
                data.candidates[0].content && 
                data.candidates[0].content.parts && 
                data.candidates[0].content.parts[0] && 
                data.candidates[0].content.parts[0].text;
                
    return text || "Sorry, I wasn't able to generate a response at this time.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// System prompt template for the chatbot
const getSystemPrompt = (userContext: string) => `
You are a helpful assistant for a classified ads marketplace called 'Craigslist'. 
Your role is to help users navigate the platform, find listings, and provide helpful advice.

When helping users:
1. Be conversational and friendly.
2. Provide specific, actionable advice related to buying, selling, or finding services.
3. Be aware of common scams and safety concerns for classified marketplaces.
4. If asked about listings or categories, respond based on the user's current context.
5. You can suggest searches or filters to help users find what they're looking for.

If the user provides location information in their messages, use that to personalize your responses.
If you don't know the answer to a question, be honest about your limitations.

You can respond with actions using [ACTION:command] syntax:
- [ACTION:navigate:/housing] - Navigate to the housing section
- [ACTION:filter:price=500] - Apply a price filter
- [ACTION:navigate:/post-ad] - Navigate to post a new ad

Current user context: ${userContext}
`;

// Function to get user context from the database if available
const getUserContext = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('last_viewed_category, last_search_query, location')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user context:', error);
      return 'No specific context available.';
    }
    
    if (!data) {
      return 'No specific context available.';
    }
    
    let contextString = '';
    if (data.last_viewed_category) {
      contextString += `Recently viewed category: ${data.last_viewed_category}. `;
    }
    
    if (data.last_search_query) {
      contextString += `Recent search query: "${data.last_search_query}". `;
    }
    
    if (data.location) {
      contextString += `User location: ${data.location}. `;
    }
    
    return contextString || 'No specific context available.';
  } catch (error) {
    console.error('Error in getUserContext:', error);
    return 'No specific context available.';
  }
};

// Create conversation
export const createConversation = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Create a new conversation
    const { data: conversation, error } = await supabase
      .from('chatbot_conversations')
      .insert({
        user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ error: 'Failed to create conversation' });
    }
    
    // Create initial bot welcome message
    const userContext = await getUserContext(user_id);
    const systemPrompt = getSystemPrompt(userContext);
    
    // Generate initial welcome message
    const initialMessage = await generateAIResponse([
      { role: 'user', content: "Hello, I'm new to Craigslist. Can you help me?" }
    ], systemPrompt);
    
    // Store the bot message in the database
    const { data: message, error: messageError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'bot',
        content: initialMessage || "👋 Hi there! I'm Craigslist's AI assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (messageError) {
      console.error('Error creating welcome message:', messageError);
      // Continue anyway since the conversation was created
    }
    
    return res.status(201).json({
      id: conversation.id,
      user_id: conversation.user_id,
      created_at: conversation.created_at,
      messages: message ? [message] : []
    });
  } catch (error) {
    console.error('Error in createConversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user conversations
export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get conversation messages
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const { conversation_id } = req.params;
    
    if (!conversation_id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Send message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversation_id, content, user_id } = req.body;
    
    if (!conversation_id || !content) {
      return res.status(400).json({ error: 'Conversation ID and content are required' });
    }
    
    // Store user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (userMessageError) {
      console.error('Error storing user message:', userMessageError);
      return res.status(500).json({ error: 'Failed to store user message' });
    }
    
    // Retrieve conversation history for context (last 10 messages)
    const { data: conversationHistory, error: historyError } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
      // Continue anyway with less context
    }
    
    // Add system message
    const userContextInfo = user_id ? await getUserContext(user_id) : 'No specific context available.';
    const systemPrompt = getSystemPrompt(userContextInfo);
    
    // Prepare messages for AI
    let messages = [];
    
    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      // Reverse to get chronological order
      const orderedHistory = [...conversationHistory].reverse();
      
      // Convert to the format we need
      messages = orderedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    } else {
      // If no history, just use the current message
      messages = [{ role: 'user', content }];
    }
    
    // Generate response using the AI
    const botResponseContent = await generateAIResponse(messages, systemPrompt);
    
    // Store bot response
    const { data: botResponse, error: botResponseError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id,
        role: 'bot',
        content: botResponseContent,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (botResponseError) {
      console.error('Error storing bot response:', botResponseError);
      return res.status(500).json({ error: 'Failed to store bot response' });
    }
    
    // Update conversation updated_at timestamp
    await supabase
      .from('chatbot_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation_id);
    
    return res.status(200).json({
      userMessage,
      botResponse
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify the conversation belongs to the user
    const { data: conversationData, error: conversationError } = await supabase
      .from('chatbot_conversations')
      .select('user_id')
      .eq('id', conversationId)
      .single();

    if (conversationError || !conversationData) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversationData.user_id !== userData.user.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this conversation' });
    }

    // Delete messages first (due to foreign key constraints)
    const { error: messagesError } = await supabase
      .from('chatbot_messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (messagesError) {
      return res.status(400).json({ error: messagesError.message });
    }

    // Delete conversation
    const { error } = await supabase
      .from('chatbot_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 