import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Wallet } from "lucide-react";

export const CheckoutScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, City');

  const orderItems = [
    { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
    { name: 'Caesar Salad', quantity: 1, price: 8.99 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    navigate('/order-confirmation');
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Checkout
            </h2>
            <div className="w-9" />
          </div>

          <div className="absolute top-[120px] left-[20px] right-[20px] bottom-[20px] overflow-y-auto">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-uigray-80 [font-family:'Poppins',Helvetica]">
                  Delivery Address
                </h3>
                <Button variant="link" className="text-brandmain text-sm p-0">
                  Change
                </Button>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brandmain mt-1" />
                <div>
                  <p className="text-sm font-medium text-uigray-80 [font-family:'Poppins',Helvetica]">
                    Home
                  </p>
                  <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                    {deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-uigray-80 mb-3 [font-family:'Poppins',Helvetica]">
                Order Summary
              </h3>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-uigray-80 [font-family:'Poppins',Helvetica]">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-uigray-80">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm text-uigray-80">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Delivery Fee</p>
                    <p className="text-sm text-uigray-80">${deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <p className="text-base text-uigray-80">Total</p>
                    <p className="text-base text-brandmain">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <h3 className="font-semibold text-uigray-80 mb-3 [font-family:'Poppins',Helvetica]">
                Payment Method
              </h3>
              <div className="space-y-3">
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                    paymentMethod === 'card' ? 'border-brandmain bg-brandmain/5' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brandmain" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-uigray-80">Credit Card</p>
                    <p className="text-xs text-gray-600">**** **** **** 1234</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === 'card' ? 'border-brandmain bg-brandmain' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                    paymentMethod === 'cash' ? 'border-brandmain bg-brandmain/5' : 'border-gray-200'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-brandmain" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-uigray-80">Cash on Delivery</p>
                    <p className="text-xs text-gray-600">Pay when you receive</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === 'cash' ? 'border-brandmain bg-brandmain' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'cash' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <h3 className="font-semibold text-uigray-80 mb-3 [font-family:'Poppins',Helvetica]">
                Special Instructions
              </h3>
              <Input
                type="text"
                placeholder="Add any special instructions..."
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
              />
            </div>

            {/* Place Order Button */}
            <Button 
              onClick={handlePlaceOrder}
              className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
            >
              <span className="font-bold text-white text-sm tracking-wide">
                PLACE ORDER • ${total.toFixed(2)}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};