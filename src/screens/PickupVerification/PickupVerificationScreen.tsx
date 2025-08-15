import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export const PickupVerificationScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      // Simulate OTP verification
      navigate('/pickup-success');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/track-order')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Pickup Verification
            </h2>
            <div className="w-9" />
          </div>

          <div className="absolute top-[140px] left-[20px] right-[20px] text-center">
            {/* Security Icon */}
            <div className="w-24 h-24 bg-brandmain/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-brandmain" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
              Enter OTP Code
            </h1>
            <p className="text-gray-600 mb-8 px-4 [font-family:'Poppins',Helvetica]">
              The restaurant will provide you with a 6-digit OTP code to verify your pickup
            </p>

            {/* Order Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-8 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Order ID</span>
                  <span className="font-semibold text-uigray-80">#ORD-12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Restaurant</span>
                  <span className="font-semibold text-uigray-80">Pizza Palace</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Pickup Code</span>
                  <span className="font-bold text-brandmain">ABC123</span>
                </div>
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4 [font-family:'Poppins',Helvetica]">
                Enter the 6-digit OTP provided by the restaurant
              </p>
              
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                  />
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600 text-xl">💡</div>
                <div className="text-left">
                  <p className="font-semibold text-yellow-800 text-sm mb-1">
                    How to get OTP?
                  </p>
                  <p className="text-yellow-700 text-xs">
                    1. Show your pickup code <strong>ABC123</strong> to the restaurant staff
                    <br />
                    2. They will verify your order and provide the OTP
                    <br />
                    3. Enter the OTP here to complete pickup
                  </p>
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <Button 
              onClick={handleVerify}
              disabled={!isOtpComplete}
              className={`w-full h-12 rounded-lg transition-all duration-200 ${
                isOtpComplete 
                  ? 'bg-brandmain hover:bg-brandmain/90' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="font-bold text-white text-sm tracking-wide">
                VERIFY & PICKUP
              </span>
            </Button>

            {/* Help */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                Having trouble?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-brandmain font-semibold hover:underline"
                >
                  Contact Support
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};