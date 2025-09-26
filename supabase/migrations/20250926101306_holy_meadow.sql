/*
  # Add matric number to profiles

  1. Schema Changes
    - Add `matric_number` column to `profiles` table
    - Add unique constraint on matric_number to prevent duplicates
    - Allow null values since existing users won't have matric numbers initially

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

-- Add matric_number column to profiles table
ALTER TABLE profiles 
ADD COLUMN matric_number text;

-- Add unique constraint to prevent duplicate matric numbers
-- Only enforce uniqueness for non-null values
CREATE UNIQUE INDEX profiles_matric_number_key 
ON profiles (matric_number) 
WHERE matric_number IS NOT NULL;