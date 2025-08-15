export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: number;
  deliveryTime: string;
  cuisine: string;
  isOpen: boolean;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered';
  pickupCode: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface FoodShare {
  id: string;
  foodName: string;
  type: 'Veg' | 'Non-Veg' | 'Vegan';
  quantity: string;
  condition: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen';
  location: string;
  availableUntil: Date;
  pickupMethod: 'Pickup only' | 'Can Deliver Nearby';
  specialNotes?: string;
  photo?: string;
  contactName: string;
  contactPhone: string;
  preferredContactTime?: string;
  isVerified: boolean;
  createdAt: Date;
  userId: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'location';
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  foodShareId?: string;
  foodShareTitle?: string;
}