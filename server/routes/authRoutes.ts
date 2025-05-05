import express from 'express';
import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser, 
  updateProfile 
} from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);

export default router; 