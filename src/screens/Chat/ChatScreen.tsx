import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Smile, Phone } from "lucide-react";
import { BottomNavigation } from "../../components/BottomNavigation";
import { useUser } from "../../context/UserContext";
import { ChatMessage } from "../../types";
import { supabase } from "../../lib/supabase";

export const ChatScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { currentUser } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get food share info from navigation state
  const foodShareInfo = location.state?.foodShare;
  
  // Get the other user (the one we're chatting with)
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching other user:', error);
        } else {
          setOtherUser({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
          });
        }
      } catch (error) {
        console.error('Error fetching other user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchOtherUser();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !otherUser) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            message: msg.message,
            timestamp: new Date(msg.created_at),
            isRead: msg.is_read,
            messageType: msg.message_type
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentUser, otherUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser || !otherUser) return;

    const messageText = message.trim();
    setMessage(''); // Clear input immediately for better UX

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: otherUser.id,
          message: messageText,
          message_type: 'text',
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        // Restore message in input if failed
        setMessage(messageText);
      } else {
        // Add message to local state
        const newMessage: ChatMessage = {
          id: data.id,
          senderId: data.sender_id,
          receiverId: data.receiver_id,
          message: data.message,
          timestamp: new Date(data.created_at),
          isRead: data.is_read,
          messageType: data.message_type
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageText); // Restore message in input
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!currentUser || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandmain mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <Button onClick={() => navigate('/home')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] h-screen relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] z-10 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-uigray-80" />
              </Button>
              <div className="text-center flex-1">
                <div className="flex items-center justify-center space-x-3">
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-base">
                      {otherUser.name}
                    </h2>
                    {foodShareInfo && (
                      <p className="text-xs text-gray-500">About {foodShareInfo.foodName}</p>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`tel:${otherUser.phone}`)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Phone className="w-5 h-5 text-brandmain" />
              </Button>
            </div>
          </div>

          {/* Food Share Info Banner */}
          {foodShareInfo && (
            <div className="absolute top-[160px] left-[20px] right-[20px] z-10">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={foodShareInfo.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={foodShareInfo.foodName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800">{foodShareInfo.foodName}</h4>
                    <p className="text-xs text-gray-600">{foodShareInfo.quantity} • {foodShareInfo.condition}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className={`absolute ${foodShareInfo ? 'top-[260px]' : 'top-[160px]'} bottom-[160px] left-0 right-0 px-5 overflow-y-auto`}>
            <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Start your conversation about the food share!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start space-x-3 ${msg.senderId === currentUser.id ? 'justify-end' : ''}`}>
                    {msg.senderId !== currentUser.id && (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className={`flex-1 ${msg.senderId === currentUser.id ? 'text-right' : ''}`}>
                      <div className={`rounded-lg p-3 shadow-sm max-w-[250px] ${
                        msg.senderId === currentUser.id 
                          ? 'bg-brandmain text-white ml-auto' 
                          : 'bg-white text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {msg.senderId === currentUser.id && (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="absolute bottom-[80px] left-[20px] right-[20px]">
            <div className="bg-white rounded-full border border-gray-200 flex items-center px-4 py-2 shadow-sm">
              <Button variant="ghost" size="sm" className="p-2">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </Button>
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-0 bg-transparent outline-none text-sm focus:ring-0 shadow-none"
              />
              <Button variant="ghost" size="sm" className="p-2">
                <Smile className="w-4 h-4 text-gray-400" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-brandmain hover:bg-brandmain/90 rounded-full p-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </CardContent>
      </Card>
    </main>
  );
};