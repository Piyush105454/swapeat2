import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { BottomNavigation } from "../../components/BottomNavigation";
import { useUser } from "../../context/UserContext";
import { mockUsers, mockChatConversations } from "../../data/mockData";

export const ChatListScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getUserConversations = () => {
    if (!currentUser) return [];
    
    return mockChatConversations.filter(conv => 
      conv.participants.includes(currentUser.id)
    );
  };

  const getOtherParticipant = (conversation: any) => {
    if (!currentUser) return null;
    const otherUserId = conversation.participants.find((id: string) => id !== currentUser.id);
    return otherUserId ? mockUsers[otherUserId] : null;
  };

  const conversations = getUserConversations();

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen px-4 sm:px-0">
      <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] min-h-screen relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <div className="pb-20">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pt-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-uigray-80" />
              </Button>
              <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
                Messages
              </h2>
              <div className="w-9" />
            </div>

            {/* Conversations List */}
            <div className="px-5">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Start a conversation by contacting someone about their food share
                  </p>
                  <Button
                    onClick={() => navigate('/home')}
                    className="bg-brandmain hover:bg-brandmain/90"
                  >
                    Browse Food Shares
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    if (!otherUser) return null;

                    return (
                      <div
                        key={conversation.id}
                        onClick={() => navigate(`/chat/${otherUser.id}`, {
                          state: { 
                            foodShare: conversation.foodShareId ? {
                              id: conversation.foodShareId,
                              foodName: conversation.foodShareTitle
                            } : null
                          }
                        })}
                        className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-uigray-80 text-base">
                                {otherUser.name}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {conversation.lastActivity && formatTime(conversation.lastActivity)}
                              </span>
                            </div>
                            {conversation.foodShareTitle && (
                              <p className="text-xs text-blue-600 mb-1">
                                About: {conversation.foodShareTitle}
                              </p>
                            )}
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.message}
                              </p>
                            )}
                          </div>
                          {conversation.lastMessage && !conversation.lastMessage.isRead && 
                           conversation.lastMessage.receiverId === currentUser?.id && (
                            <div className="w-3 h-3 bg-brandmain rounded-full"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </CardContent>
      </Card>
    </main>
  );
};