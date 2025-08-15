import { Restaurant, User, FoodShare, ChatMessage, ChatConversation } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    distance: 0.8,
    deliveryTime: '25-35 min',
    cuisine: 'Italian',
    isOpen: true,
    lat: 40.7589,
    lng: -73.9851
  },
  {
    id: '2',
    name: 'Burger Barn',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    distance: 1.2,
    deliveryTime: '20-30 min',
    cuisine: 'American',
    isOpen: true,
    lat: 40.7505,
    lng: -73.9934
  },
  {
    id: '3',
    name: 'Sushi Spot',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    distance: 2.1,
    deliveryTime: '30-40 min',
    cuisine: 'Japanese',
    isOpen: false,
    lat: 40.7282,
    lng: -74.0776
  },
  {
    id: '4',
    name: 'Taco Time',
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    distance: 1.5,
    deliveryTime: '15-25 min',
    cuisine: 'Mexican',
    isOpen: true,
    lat: 40.7614,
    lng: -73.9776
  }
];

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
};

// Mock users for chat
export const mockUsers: { [key: string]: User } = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  '2': {
    id: '2',
    name: 'Sarah M.',
    email: 'sarah.m@example.com',
    phone: '+1 234 567 8901',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  '3': {
    id: '3',
    name: 'Mike R.',
    email: 'mike.r@example.com',
    phone: '+1 234 567 8902',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  '4': {
    id: '4',
    name: 'Priya S.',
    email: 'priya.s@example.com',
    phone: '+1 234 567 8903',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
};

export const mockFoodShares: FoodShare[] = [
  {
    id: '1',
    foodName: 'Veg Biryani',
    type: 'Veg',
    quantity: '3 servings',
    condition: 'Cooked Today',
    location: '123 Main St, Downtown',
    availableUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    pickupMethod: 'Pickup only',
    specialNotes: 'Freshly cooked, contains cashews and raisins',
    photo: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactName: 'Sarah M.',
    contactPhone: '+1 234 567 8901',
    preferredContactTime: '6 PM - 9 PM',
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    userId: '2'
  },
  {
    id: '2',
    foodName: 'Chocolate Cake',
    type: 'Veg',
    quantity: '1 whole cake (8 slices)',
    condition: 'Fresh',
    location: '456 Oak Ave, Midtown',
    availableUntil: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    pickupMethod: 'Can Deliver Nearby',
    specialNotes: 'Birthday cake, contains eggs and dairy. Can deliver within 2km.',
    photo: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactName: 'Mike R.',
    contactPhone: '+1 234 567 8902',
    isVerified: true,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    userId: '3'
  },
  {
    id: '3',
    foodName: 'Mixed Vegetable Curry',
    type: 'Vegan',
    quantity: '2 containers',
    condition: 'Cooked Today',
    location: '789 Pine St, Uptown',
    availableUntil: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    pickupMethod: 'Pickup only',
    specialNotes: 'Completely vegan, no onion no garlic',
    photo: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactName: 'Priya S.',
    contactPhone: '+1 234 567 8903',
    preferredContactTime: 'Anytime',
    isVerified: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    userId: '4'
  }
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    message: 'Hi! Is the Veg Biryani still available?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: true,
    messageType: 'text'
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    message: 'Yes, it is! When would you like to pick it up?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    isRead: true,
    messageType: 'text'
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    message: 'Can I come in 30 minutes?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    messageType: 'text'
  }
];

// Mock chat conversations
export const mockChatConversations: ChatConversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: mockChatMessages[2],
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    foodShareId: '1',
    foodShareTitle: 'Veg Biryani'
  }
];

// Current logged in user (this would come from authentication)
export const currentUserId = '1';