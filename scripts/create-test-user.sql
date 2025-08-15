-- Create test users for development
-- Run this in Supabase SQL Editor after running the main setup.sql

-- Insert test users (these will be linked to auth.users when they sign up)
INSERT INTO public.users (id, email, name, phone, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'test1@swapeat.com', 'Alice Johnson', '+1 555 0101', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('22222222-2222-2222-2222-222222222222', 'test2@swapeat.com', 'Bob Smith', '+1 555 0102', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('33333333-3333-3333-3333-333333333333', 'test3@swapeat.com', 'Carol Davis', '+1 555 0103', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (id) DO NOTHING;

-- Insert test food shares
INSERT INTO public.food_shares (
  user_id, food_name, type, quantity, condition, location, 
  available_until, pickup_method, special_notes, photo_url, 
  contact_name, contact_phone, preferred_contact_time, is_verified, is_available
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Homemade Vegetable Biryani',
    'Veg',
    '4 servings',
    'Cooked Today',
    '123 Main Street, Downtown, City',
    NOW() + INTERVAL '6 hours',
    'Pickup only',
    'Freshly cooked with organic vegetables. Contains cashews and raisins.',
    'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Alice Johnson',
    '+1 555 0101',
    '6 PM - 9 PM',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Birthday Chocolate Cake',
    'Veg',
    '1 whole cake (8 slices)',
    'Fresh',
    '456 Oak Avenue, Midtown, City',
    NOW() + INTERVAL '3 hours',
    'Can Deliver Nearby',
    'Leftover from birthday party. Contains eggs and dairy. Can deliver within 2km.',
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Bob Smith',
    '+1 555 0102',
    'Anytime',
    true,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Vegan Lentil Curry',
    'Vegan',
    '3 containers',
    'Cooked Today',
    '789 Pine Street, Uptown, City',
    NOW() + INTERVAL '8 hours',
    'Pickup only',
    'Completely vegan, no onion no garlic. Made with organic lentils.',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Carol Davis',
    '+1 555 0103',
    '7 AM - 10 AM, 6 PM - 9 PM',
    true,
    true
  );

-- Create a test conversation
INSERT INTO public.chat_conversations (participants, food_share_id, food_share_title, last_activity) VALUES
  (ARRAY['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'], 
   (SELECT id FROM public.food_shares WHERE food_name = 'Homemade Vegetable Biryani' LIMIT 1),
   'Homemade Vegetable Biryani',
   NOW() - INTERVAL '10 minutes');

-- Add some test messages
INSERT INTO public.chat_messages (
  conversation_id, sender_id, receiver_id, message, message_type, is_read
) VALUES
  (
    (SELECT id FROM public.chat_conversations LIMIT 1),
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Hi! Is the Vegetable Biryani still available?',
    'text',
    true
  ),
  (
    (SELECT id FROM public.chat_conversations LIMIT 1),
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Yes, it is! When would you like to pick it up?',
    'text',
    true
  ),
  (
    (SELECT id FROM public.chat_conversations LIMIT 1),
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Can I come in 30 minutes?',
    'text',
    false
  );

-- Update the conversation with the last message
UPDATE public.chat_conversations 
SET last_message_id = (SELECT id FROM public.chat_messages ORDER BY created_at DESC LIMIT 1),
    last_activity = NOW()
WHERE id = (SELECT id FROM public.chat_conversations LIMIT 1);