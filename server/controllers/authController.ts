import { Request, Response } from 'express';
import { supabaseClient } from '../services/supabase.js';

/**
 * Sign up a new user
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // If user was created successfully
    if (authData.user) {
      // Create user profile in profiles table
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: full_name || '',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue anyway, as the auth user was created successfully
      }

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name,
        },
      });
    }

    return res.status(201).json({ 
      message: 'Signup successful. Please confirm your email address.' 
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Error in signIn:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (req: Request, res: Response) => {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    console.error('Error in signOut:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get profile data
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    return res.status(200).json({
      user: data.user,
      profile: profileData || null,
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      return res.status(401).json({ error: userError.message });
    }

    if (!userData.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { full_name, avatar_url, phone, location, bio } = req.body;

    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        full_name,
        avatar_url,
        phone,
        location,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: data,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 