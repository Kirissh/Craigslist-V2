import { Request, Response } from 'express';
import { supabaseClient } from '../services/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import { generateAdContent } from '../services/gemini.js';

/**
 * Get all listings with optional filtering
 */
export const getListings = async (req: Request, res: Response) => {
  try {
    const {
      category,
      subcategory,
      search,
      min_price,
      max_price,
      location,
      country,
      city,
      sort_by,
      is_featured,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // Start query builder
    let query = supabaseClient
      .from('listings')
      .select('*, profiles(full_name, avatar_url)', { count: 'exact' });

    // Apply filters
    if (category) query = query.eq('category_id', category);
    if (subcategory) query = query.eq('subcategory_id', subcategory);
    if (search) query = query.textSearch('title', String(search), { type: 'websearch' });
    if (min_price) query = query.gte('price', Number(min_price));
    if (max_price) query = query.lte('price', Number(max_price));
    if (location) query = query.ilike('location', `%${location}%`);
    if (country) query = query.eq('country', country);
    if (city) query = query.eq('city', city);
    if (is_featured) query = query.eq('is_featured', is_featured === 'true');
    
    // Default to active listings only unless otherwise specified
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'active');
    }

    // Apply sorting
    if (sort_by) {
      const [field, order] = String(sort_by).split(':');
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      // Default sort by created_at (newest first)
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;
    query = query.range(start, start + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      listings: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: count ? Math.ceil(count / limitNum) : 0,
      },
    });
  } catch (error) {
    console.error('Error in getListings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a single listing by ID
 */
export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseClient
      .from('listings')
      .select('*, profiles(full_name, avatar_url, location)')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    await supabaseClient
      .from('listings')
      .update({ views: data.views + 1 })
      .eq('id', id);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getListingById:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a new listing
 */
export const createListing = async (req: Request, res: Response) => {
  try {
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      title,
      description,
      price,
      images,
      category_id,
      subcategory_id,
      location,
      country,
      city,
      is_featured,
      keywords,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category_id || !location) {
      return res.status(400).json({
        error: 'Missing required fields (title, description, price, category_id, location)',
      });
    }

    // Set expiration date (e.g., 30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data, error } = await supabaseClient
      .from('listings')
      .insert({
        id: uuidv4(),
        title,
        description,
        price: parseFloat(String(price)),
        images: images || [],
        user_id: userData.user.id,
        category_id,
        subcategory_id,
        location,
        country,
        city,
        status: 'active',
        is_featured: is_featured || false,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        keywords,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Listing created successfully',
      listing: data,
    });
  } catch (error) {
    console.error('Error in createListing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update an existing listing
 */
export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if listing exists and belongs to user
    const { data: existingListing, error: fetchError } = await supabaseClient
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (existingListing.user_id !== userData.user.id) {
      return res.status(403).json({ error: 'You can only update your own listings' });
    }

    const {
      title,
      description,
      price,
      images,
      category_id,
      subcategory_id,
      location,
      country,
      city,
      status,
      is_featured,
      keywords,
    } = req.body;

    const { data, error } = await supabaseClient
      .from('listings')
      .update({
        title,
        description,
        price: price !== undefined ? parseFloat(String(price)) : undefined,
        images,
        category_id,
        subcategory_id,
        location,
        country,
        city,
        status,
        is_featured,
        updated_at: new Date().toISOString(),
        keywords,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Listing updated successfully',
      listing: data,
    });
  } catch (error) {
    console.error('Error in updateListing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete a listing
 */
export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if listing exists and belongs to user
    const { data: existingListing, error: fetchError } = await supabaseClient
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (existingListing.user_id !== userData.user.id) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    const { error } = await supabaseClient.from('listings').delete().eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteListing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get featured listings
 */
export const getFeaturedListings = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseClient
      .from('listings')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getFeaturedListings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get listings by user
 */
export const getUserListings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = supabaseClient
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getUserListings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Generate ad content using AI
 */
export const generateAdContentWithAI = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const content = await generateAdContent(title, description, category);

    return res.status(200).json(content);
  } catch (error) {
    console.error('Error in generateAdContentWithAI:', error);
    return res.status(500).json({ error: 'Error generating content with AI' });
  }
}; 