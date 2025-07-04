/*
  # Initial Database Schema for Marrakech Guide

  1. Core Tables
    - users (authentication and profiles)
    - categories (activity categories)
    - activities (main content)
    - tags (for filtering)
    
  2. User Interactions
    - reviews (user ratings and comments)
    - favorites (user saved activities)
    - media (photos and videos)
    
  3. Planning
    - itineraries (user trip plans)
    - itinerary_items (activities in itineraries)
    
  4. Admin
    - admin_users (admin access control)
    
  5. Security
    - Enable RLS on all tables
    - Create appropriate policies
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url VARCHAR(255),
  bio TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  preferences JSONB DEFAULT '[]',
  visit_dates VARCHAR(255),
  language VARCHAR(2) DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_category_id INTEGER REFERENCES categories(id),
  icon_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  owner_id UUID REFERENCES users(id),
  street_address VARCHAR(255),
  city VARCHAR(100) DEFAULT 'Marrakech',
  state_province VARCHAR(100) DEFAULT 'Marrakech-Safi',
  postal_code VARCHAR(20),
  country_code VARCHAR(2) DEFAULT 'MA',
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  phone_number VARCHAR(50),
  website_url VARCHAR(255),
  opening_hours JSONB,
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  reservation_info TEXT,
  comments TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity tags junction table
CREATE TABLE IF NOT EXISTS activity_tags (
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, tag_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id)
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id),
  media_url VARCHAR(255) NOT NULL,
  caption TEXT,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  preferences TEXT,
  start_date DATE,
  end_date DATE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary items table
CREATE TABLE IF NOT EXISTS itinerary_items (
  id SERIAL PRIMARY KEY,
  itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  start_time TIME,
  order_in_day INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '["read", "write"]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data and update their own profile
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories are public read
CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (true);

-- Tags are public read
CREATE POLICY "Tags are public" ON tags
  FOR SELECT USING (true);

-- Activities are public read, admins can write
CREATE POLICY "Activities are public read" ON activities
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Admins can manage activities" ON activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Activity tags follow activities
CREATE POLICY "Activity tags are public read" ON activity_tags
  FOR SELECT USING (true);

-- Reviews are public read, users can write their own
CREATE POLICY "Reviews are public read" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- Favorites are private to users
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Media is public read, users can upload
CREATE POLICY "Media is public read" ON media
  FOR SELECT USING (true);

CREATE POLICY "Users can upload media" ON media
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by_user_id);

-- Itineraries are private to users unless public
CREATE POLICY "Users can read own itineraries" ON itineraries
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own itineraries" ON itineraries
  FOR ALL USING (auth.uid() = user_id);

-- Itinerary items follow itineraries
CREATE POLICY "Users can read itinerary items" ON itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE id = itinerary_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can manage own itinerary items" ON itinerary_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE id = itinerary_id 
      AND user_id = auth.uid()
    )
  );

-- Admin users can only be read by admins
CREATE POLICY "Only admins can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_location ON activities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_activities_rating ON activities(average_rating);
CREATE INDEX IF NOT EXISTS idx_reviews_activity ON reviews(activity_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_activity ON favorites(activity_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON itinerary_items(itinerary_id);

-- Function to update activity rating when reviews change
CREATE OR REPLACE FUNCTION update_activity_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE activities 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE activity_id = COALESCE(NEW.activity_id, OLD.activity_id)
      AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE activity_id = COALESCE(NEW.activity_id, OLD.activity_id)
      AND is_approved = true
    )
  WHERE id = COALESCE(NEW.activity_id, OLD.activity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update activity rating
CREATE TRIGGER update_activity_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();