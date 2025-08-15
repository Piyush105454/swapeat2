import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, Star } from "lucide-react";

interface OrderHistory {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'completed' | 'cancelled';
  date: string;
  rating?: number;
}

const orderHistory: OrderHistory[] = [
  {
    id: 'ORD-12345',
    restaurantName: 'Pizza Palace',
    items: ['Margherita Pizza x2', 'Caesar Salad x1'],
    total: 37.97,
    status: 'completed',
    date: '2024-01-15',
    rating: 5
  },
  {
    id: 'ORD-12344',
    restaurantName: 'Burger Barn',
    items: ['Classic Burger x1', 'Fries x1'],
    total: 18.99,
    status: 'completed',
    date: '2024-01-12',
    rating: 4
  },
  {
    id: 'ORD-12343',
    restaurantName: 'Sushi Spot',
    items: ['California Roll x2', 'Miso Soup x1'],
    total: 24.50,
    status: 'cancelled',
    date: '2024-01-10'
  }
];

export const OrdersScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filteredOrders = orderHistory.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Order History
            </h2>
            <div className="w-9" />
          </div>

          <div className="absolute top-[120px] left-[20px] right-[20px] bottom-[80px] overflow-y-auto">
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              {[
                { key: 'all', label: 'All' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 h-8 text-xs font-medium rounded-md transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-brandmain shadow-sm'
                      : 'bg-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                    No Orders Found
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {activeTab === 'all' 
                      ? "You haven't placed any orders yet"
                      : `No ${activeTab} orders found`
                    }
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                          {order.restaurantName}
                        </h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-3">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                          • {item}
                        </p>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold text-brandmain">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        {order.status === 'completed' && order.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-uigray-80">
                              {order.rating}
                            </span>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-brandmain text-brandmain hover:bg-brandmain/5"
                        >
                          {order.status === 'completed' ? 'Reorder' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-[20px] left-[20px] right-[20px] bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-around">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/home')}
                className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              >
                <div className="text-lg">🏠</div>
                <span className="text-xs font-medium">Home</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 p-2 text-brandmain"
              >
                <div className="text-lg">📋</div>
                <span className="text-xs font-medium">Orders</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              >
                <div className="text-lg">👤</div>
                <span className="text-xs font-medium">Profile</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};