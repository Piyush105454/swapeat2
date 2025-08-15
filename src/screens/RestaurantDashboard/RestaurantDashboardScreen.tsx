import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface PendingOrder {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  orderTime: string;
  pickupCode: string;
  status: 'pending' | 'preparing' | 'ready';
}

const pendingOrders: PendingOrder[] = [
  {
    id: 'ORD-12346',
    customerName: 'John Doe',
    items: ['Margherita Pizza x2', 'Caesar Salad x1'],
    total: 37.97,
    orderTime: '2:30 PM',
    pickupCode: 'ABC123',
    status: 'preparing'
  },
  {
    id: 'ORD-12347',
    customerName: 'Jane Smith',
    items: ['Pepperoni Pizza x1', 'Garlic Bread x1'],
    total: 22.50,
    orderTime: '2:45 PM',
    pickupCode: 'DEF456',
    status: 'pending'
  },
  {
    id: 'ORD-12348',
    customerName: 'Mike Johnson',
    items: ['Veggie Pizza x1', 'Soda x2'],
    total: 19.99,
    orderTime: '2:15 PM',
    pickupCode: 'GHI789',
    status: 'ready'
  }
];

export const RestaurantDashboardScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(pendingOrders);

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'preparing' | 'ready') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const generateOTP = (orderId: string) => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`OTP for order ${orderId}: ${otp}`);
    // In real app, this would be sent to the customer
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'preparing': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between">
            <div>
              <h2 className="[font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-lg">
                Pizza Palace
              </h2>
              <p className="text-sm text-gray-600">Restaurant Dashboard</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 rounded-full relative"
              >
                <Bell className="w-5 h-5 text-uigray-80" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                <LogOut className="w-5 h-5 text-uigray-80" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute top-[140px] left-[20px] right-[20px]">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
                <p className="text-xs text-gray-600">Preparing</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
                <p className="text-xs text-gray-600">Ready</p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="absolute top-[260px] left-[20px] right-[20px] bottom-[20px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
              Active Orders
            </h3>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                        {order.customerName}
                      </h4>
                      <p className="text-xs text-gray-500">{order.id}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{order.orderTime}</p>
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

                  {/* Pickup Code */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pickup Code:</span>
                      <span className="font-bold text-lg text-brandmain">
                        {order.pickupCode}
                      </span>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="text-sm font-semibold text-brandmain">
                      ${order.total.toFixed(2)}
                    </p>

                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          size="sm"
                          className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          size="sm"
                          className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <Button
                          onClick={() => generateOTP(order.id)}
                          size="sm"
                          className="h-8 px-3 text-xs bg-brandmain hover:bg-brandmain/90"
                        >
                          Generate OTP
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};