import express from 'express';
import {
  createConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  deleteConversation,
} from '../controllers/chatbotController.js';

const router = express.Router();

// Chatbot routes
router.post('/conversations', createConversation);
router.get('/conversations', getUserConversations);
router.get('/conversations/:conversationId/messages', getConversationMessages);
router.post('/messages', sendMessage);
router.delete('/conversations/:conversationId', deleteConversation);

export default router; 