-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_shares table
CREATE TABLE IF NOT EXISTS public.food_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    food_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Veg', 'Non-Veg', 'Vegan')) NOT NULL,
    quantity TEXT NOT NULL,
    condition TEXT CHECK (condition IN ('Fresh', 'Near Expiry', 'Cooked Today', 'Frozen')) NOT NULL,
    location TEXT NOT NULL,
    available_until TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_method TEXT CHECK (pickup_method IN ('Pickup only', 'Can Deliver Nearby')) NOT NULL,
    special_notes TEXT,
    photo_url TEXT,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    preferred_contact_time TEXT,
    is_verified BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participants UUID[] NOT NULL,
    food_share_id UUID REFERENCES public.food_shares(id) ON DELETE SET NULL,
    food_share_title TEXT,
    last_message_id UUID,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('text', 'image', 'location')) DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for last_message_id
ALTER TABLE public.chat_conversations 
ADD CONSTRAINT fk_last_message 
FOREIGN KEY (last_message_id) REFERENCES public.chat_messages(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_shares_user_id ON public.food_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_food_shares_available ON public.food_shares(is_available, available_until);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participants ON public.chat_conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own profile and other users' basic info
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Food shares policies
CREATE POLICY "Anyone can view available food shares" ON public.food_shares
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can create their own food shares" ON public.food_shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food shares" ON public.food_shares
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food shares" ON public.food_shares
    FOR DELETE USING (auth.uid() = user_id);

-- Chat conversations policies
CREATE POLICY "Users can view conversations they participate in" ON public.chat_conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations" ON public.chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

CREATE POLICY "Users can update conversations they participate in" ON public.chat_conversations
    FOR UPDATE USING (auth.uid() = ANY(participants));

-- Chat messages policies
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can send messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_shares_updated_at BEFORE UPDATE ON public.food_shares
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();