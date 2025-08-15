import React from 'react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, MapPin, ShoppingBag, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: MapPin, label: 'Map', path: '/map' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[375px] bg-white rounded-t-2xl shadow-lg border-t border-gray-100 px-4 py-3 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 min-w-0 ${
                isActive(item.path) ? 'text-brandmain' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};