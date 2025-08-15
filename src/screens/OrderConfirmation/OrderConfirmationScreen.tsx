import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, MapPin } from "lucide-react";

export const OrderConfirmationScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const orderDetails = {
    orderId: '#ORD-12345',
    restaurant: 'Pizza Palace',
    estimatedTime: '25-35 minutes',
    total: 37.97,
    pickupCode: 'ABC123'
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <div className="absolute top-[100px] left-[20px] right-[20px] text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-8 [font-family:'Poppins',Helvetica]">
              Your order has been placed successfully
            </p>

            {/* Order Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6 text-left">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Order ID</span>
                  <span className="font-semibold text-uigray-80">{orderDetails.orderId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Restaurant</span>
                  <span className="font-semibold text-uigray-80">{orderDetails.restaurant}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Total Amount</span>
                  <span className="font-semibold text-brandmain">${orderDetails.total}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Pickup Code</span>
                  <span className="font-bold text-lg text-brandmain bg-brandmain/10 px-3 py-1 rounded-lg">
                    {orderDetails.pickupCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-brandmain" />
                <div className="text-left">
                  <p className="font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                    Estimated Preparation Time
                  </p>
                  <p className="text-sm text-gray-600">
                    {orderDetails.estimatedTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600 text-xl">⚠️</div>
                <div className="text-left">
                  <p className="font-semibold text-yellow-800 text-sm mb-1">
                    Important Note
                  </p>
                  <p className="text-yellow-700 text-xs">
                    Please show your pickup code <strong>{orderDetails.pickupCode}</strong> at the restaurant for order verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/track-order')}
                className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
              >
                <span className="font-bold text-white text-sm tracking-wide">
                  TRACK ORDER
                </span>
              </Button>
              
              <Button 
                onClick={() => navigate('/home')}
                variant="outline"
                className="w-full h-12 border-brandmain text-brandmain hover:bg-brandmain/5"
              >
                <span className="font-semibold text-sm">
                  CONTINUE SHOPPING
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};