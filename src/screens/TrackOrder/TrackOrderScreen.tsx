import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle } from "lucide-react";

export const TrackOrderScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const orderStatus = [
    { step: 'Order Placed', completed: true, time: '2:30 PM' },
    { step: 'Order Confirmed', completed: true, time: '2:32 PM' },
    { step: 'Preparing Food', completed: true, time: '2:35 PM' },
    { step: 'Ready for Pickup', completed: false, time: 'Est. 3:00 PM' }
  ];

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
              Track Order
            </h2>
            <div className="w-9" />
          </div>

          <div className="absolute top-[120px] left-[20px] right-[20px] bottom-[20px] overflow-y-auto">
            {/* Order Info */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                    Order #ORD-12345
                  </h3>
                  <p className="text-sm text-gray-600">Pizza Palace</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brandmain">$37.97</p>
                  <p className="text-xs text-gray-600">Pickup Code: ABC123</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated ready time: 3:00 PM</span>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                Order Status
              </h3>
              
              <div className="space-y-4">
                {orderStatus.map((status, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      status.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {status.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        status.completed ? 'text-uigray-80' : 'text-gray-500'
                      }`}>
                        {status.step}
                      </p>
                      <p className="text-xs text-gray-500">{status.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-uigray-80 mb-3 [font-family:'Poppins',Helvetica]">
                Restaurant Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-brandmain" />
                  <div>
                    <p className="text-sm font-medium text-uigray-80">Pizza Palace</p>
                    <p className="text-xs text-gray-600">123 Restaurant St, City</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brandmain" />
                  <div>
                    <p className="text-sm font-medium text-uigray-80">+1 234 567 8900</p>
                    <p className="text-xs text-gray-600">Call restaurant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">ℹ️</div>
                <div>
                  <p className="font-semibold text-blue-800 text-sm mb-1">
                    Pickup Instructions
                  </p>
                  <p className="text-blue-700 text-xs">
                    • Show your pickup code <strong>ABC123</strong> to the restaurant staff
                    <br />
                    • Verify your order details before leaving
                    <br />
                    • You'll receive an OTP for verification at pickup
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pickup-verification')}
                className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
              >
                <span className="font-bold text-white text-sm tracking-wide">
                  I'M AT THE RESTAURANT
                </span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full h-12 border-red-500 text-red-500 hover:bg-red-50"
              >
                <span className="font-semibold text-sm">
                  CANCEL ORDER
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};