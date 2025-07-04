import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use default values for development if environment variables are missing
const fallbackUrl = 'https://xdljkdhamkfmvsbkwlgb.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkbGprZGhhbWtmbXZzYmt3bGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NTg4MDAsImV4cCI6MjAwNTQzNDgwMH0.M9LW9ydvBOULVJRlL9GSjcXZwjBnTopnbhKwFKBqR4c';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback values for development.');
}

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          profile_picture_url: string | null;
          bio: string | null;
          role: string;
          preferences: any;
          visit_dates: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          profile_picture_url?: string | null;
          bio?: string | null;
          role?: string;
          preferences?: any;
          visit_dates?: string | null;
          language?: string;
        };
        Update: {
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          profile_picture_url?: string | null;
          bio?: string | null;
          preferences?: any;
          visit_dates?: string | null;
          language?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          parent_category_id: number | null;
          icon_url: string | null;
          description: string | null;
          created_at: string;
        };
      };
      activities: {
        Row: {
          id: number;
          name: string;
          description: string;
          category_id: number;
          owner_id: string | null;
          street_address: string | null;
          city: string | null;
          phone_number: string | null;
          website_url: string | null;
          opening_hours: any;
          price_level: number | null;
          average_rating: number;
          review_count: number;
          reservation_info: string | null;
          comments: string | null;
          latitude: number | null;
          longitude: number | null;
          is_approved: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          activity_id: number;
          user_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          activity_id: number;
          created_at: string;
        };
      };
      itineraries: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          description: string | null;
          preferences: string | null;
          start_date: string | null;
          end_date: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      itinerary_items: {
        Row: {
          id: number;
          itinerary_id: number;
          activity_id: number;
          day_number: number;
          start_time: string | null;
          order_in_day: number;
          notes: string | null;
          created_at: string;
        };
      };
      admin_users: {
        Row: {
          user_id: string;
          permissions: any;
          created_at: string;
        };
      };
    };
  };
}

// Helper functions for common queries
export const getActivities = async (categoryId?: number) => {
  let query = supabase
    .from('activities');
    
  try {
    query = query.select(`
      *,
      categories (name, slug),
      reviews (rating),
      media (media_url, is_primary)
    `)
    .eq('is_approved', true)
    .order('is_featured', { ascending: false })
    .order('average_rating', { ascending: false });
  } catch (error) {
    console.error('Error building query:', error);
    // Return a minimal query if the complex one fails
    query = supabase.from('activities').select('*')
      .eq('is_approved', true);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  return query;
};

export const getCategories = async () => {
  return supabase
    .from('categories')
    .select('*')
    .order('name');
};

export const getUserFavorites = async (userId: string) => {
  return supabase
    .from('favorites')
    .select(`
      *,
      activities (*)
    `)
    .eq('user_id', userId);
};

export const addToFavorites = async (userId: string, activityId: number) => {
  return supabase
    .from('favorites')
    .insert({ user_id: userId, activity_id: activityId });
};

export const removeFromFavorites = async (userId: string, activityId: number) => {
  return supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('activity_id', activityId);
};

export const isAdmin = async (userId: string) => {
  try {
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};