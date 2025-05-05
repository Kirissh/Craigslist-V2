import { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '../services/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      return res.status(401).json({
        error: 'Unauthorized: Please login to access this resource',
      });
    }

    // Store the user on the request object
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add type declaration for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
} 