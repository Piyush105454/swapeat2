import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Plus, Minus } from "lucide-react";
import { mockRestaurants } from "../../data/mockData";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil',
    price: 12.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Pepperoni, mozzarella, tomato sauce',
    price: 15.99,
    image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const RestaurantScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cart, setCart] = useState<{[key: string]: number}>({});
  
  const restaurant = mockRestaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
          </div>

          {/* Restaurant Image */}
          <div className="absolute top-0 left-0 right-0 h-48">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Restaurant Info */}
          <div className="absolute top-[180px] left-[20px] right-[20px] bg-white rounded-t-3xl p-6 bottom-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                {restaurant.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-uigray-80">
                    {restaurant.rating}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {restaurant.distance} km away
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                {restaurant.cuisine} • Delivery available
              </p>
            </div>

            {/* Menu Items */}
            <div className="space-y-4 pb-24">
              <h3 className="text-lg font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                Menu
              </h3>
              
              {menuItems.map((item) => (
                <div key={item.id} className="flex space-x-4 p-4 bg-gray-50 rounded-xl">
                  {/* Square Image Container */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-uigray-80 text-sm [font-family:'Poppins',Helvetica]">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 [font-family:'Poppins',Helvetica]">
                      {item.description}
                    </p>
                    <p className="text-sm font-bold text-brandmain [font-family:'Poppins',Helvetica]">
                      ${item.price}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {cart[item.id] > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    )}
                    
                    {cart[item.id] > 0 && (
                      <span className="text-sm font-medium w-6 text-center">
                        {cart[item.id]}
                      </span>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 p-0 rounded-full border-brandmain text-brandmain hover:bg-brandmain hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Button */}
          {getTotalItems() > 0 && (
            <div className="absolute bottom-[20px] left-[20px] right-[20px]">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200 flex items-center justify-between px-6"
              >
                <span className="font-bold text-white text-sm">
                  {getTotalItems()} items
                </span>
                <span className="font-bold text-white text-sm">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};