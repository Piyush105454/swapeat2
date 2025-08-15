import { supabase } from '../lib/supabase';
import { ChatMessage, ChatConversation } from '../types';

export const chatService = {
  // Create or get existing conversation
  async getOrCreateConversation(
    participantIds: string[], 
    foodShareId?: string, 
    foodShareTitle?: string
  ): Promise<{ data: string | null; error: string | null }> {
    try {
      // First, try to find existing conversation
      const { data: existingConversation, error: searchError } = await supabase
        .from('chat_conversations')
        .select('id')
        .contains('participants', participantIds)
        .eq('food_share_id', foodShareId || null)
        .single();

      if (existingConversation) {
        return { data: existingConversation.id, error: null };
      }

      // Create new conversation if none exists
      const { data: newConversation, error: createError } = await supabase
        .from('chat_conversations')
        .insert({
          participants: participantIds,
          food_share_id: foodShareId,
          food_share_title: foodShareTitle,
          last_activity: new Date().toISOString()
        })
        .select('id')
        .single();

      if (createError) {
        return { data: null, error: createError.message };
      }

      return { data: newConversation.id, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create conversation' };
    }
  },

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    message: string,
    messageType: 'text' | 'image' | 'location' = 'text'
  ): Promise<{ data: ChatMessage | null; error: string | null }> {
    try {
      const { data: newMessage, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          receiver_id: receiverId,
          message,
          message_type: messageType,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Update conversation's last activity and last message
      await supabase
        .from('chat_conversations')
        .update({
          last_message_id: newMessage.id,
          last_activity: new Date().toISOString()
        })
        .eq('id', conversationId);

      // Transform to match our ChatMessage type
      const transformedMessage: ChatMessage = {
        id: newMessage.id,
        senderId: newMessage.sender_id,
        receiverId: newMessage.receiver_id,
        message: newMessage.message,
        timestamp: new Date(newMessage.created_at),
        isRead: newMessage.is_read,
        messageType: newMessage.message_type
      };

      return { data: transformedMessage, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to send message' };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<{ data: ChatMessage[] | null; error: string | null }> {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      // Transform to match our ChatMessage type
      const transformedMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        message: msg.message,
        timestamp: new Date(msg.created_at),
        isRead: msg.is_read,
        messageType: msg.message_type
      }));

      return { data: transformedMessages, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch messages' };
    }
  },

  // Get user's conversations
  async getUserConversations(userId: string): Promise<{ data: ChatConversation[] | null; error: string | null }> {
    try {
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          chat_messages!chat_conversations_last_message_id_fkey (
            id,
            sender_id,
            receiver_id,
            message,
            message_type,
            is_read,
            created_at
          )
        `)
        .contains('participants', [userId])
        .order('last_activity', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      // Transform to match our ChatConversation type
      const transformedConversations: ChatConversation[] = conversations.map(conv => ({
        id: conv.id,
        participants: conv.participants,
        lastMessage: conv.chat_messages ? {
          id: conv.chat_messages.id,
          senderId: conv.chat_messages.sender_id,
          receiverId: conv.chat_messages.receiver_id,
          message: conv.chat_messages.message,
          timestamp: new Date(conv.chat_messages.created_at),
          isRead: conv.chat_messages.is_read,
          messageType: conv.chat_messages.message_type
        } : undefined,
        lastActivity: new Date(conv.last_activity),
        foodShareId: conv.food_share_id,
        foodShareTitle: conv.food_share_title
      }));

      return { data: transformedConversations, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch conversations' };
    }
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to mark messages as read' };
    }
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            receiverId: payload.new.receiver_id,
            message: payload.new.message,
            timestamp: new Date(payload.new.created_at),
            isRead: payload.new.is_read,
            messageType: payload.new.message_type
          };
          callback(newMessage);
        }
      )
      .subscribe();

    return subscription;
  }
};