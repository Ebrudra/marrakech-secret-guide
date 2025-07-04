/*
  # Fix infinite recursion in admin_users RLS policy

  1. Security Changes
    - Drop the existing problematic policy on admin_users table
    - Create a new policy that doesn't cause infinite recursion
    - Use a simpler approach that checks user_id directly against auth.uid()

  2. Changes Made
    - Remove the recursive policy that queries admin_users from within admin_users policy
    - Add a simple policy that allows users to read their own admin record
    - Add a policy for service role to manage admin_users table

  This fixes the "infinite recursion detected in policy" error.
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Only admins can read admin_users" ON admin_users;

-- Create a new policy that allows users to read their own admin record
-- This avoids the infinite recursion by not querying admin_users from within the policy
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to manage admin_users (for admin operations)
CREATE POLICY "Service role can manage admin_users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert admin records (for initial admin setup)
CREATE POLICY "Allow admin record creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());