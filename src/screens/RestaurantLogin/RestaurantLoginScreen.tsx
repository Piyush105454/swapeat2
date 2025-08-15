import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Store } from "lucide-react";

export const RestaurantLoginScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    restaurantId: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    // Simulate restaurant login
    navigate('/restaurant-dashboard');
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
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Restaurant Login
            </h2>
            <div className="w-9" />
          </div>

          {/* Welcome Text */}
          <div className="absolute top-[140px] left-[20px] right-[20px] text-center">
            <h1 className="[font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-2xl mb-2">
              Restaurant Portal
            </h1>
            <p className="[font-family:'Poppins',Helvetica] font-normal text-gray-600 text-base">
              Manage your orders and menu
            </p>
          </div>

          {/* Illustration */}
          <div className="absolute top-[220px] left-[50px] right-[50px] flex justify-center">
            <div className="w-[180px] h-[180px] bg-gradient-to-br from-orange-200 to-orange-100 rounded-full flex items-center justify-center">
              <Store className="w-16 h-16 text-orange-600" />
            </div>
          </div>

          {/* Form */}
          <div className="absolute top-[440px] left-[20px] right-[20px] space-y-4">
            <div>
              <label className="block text-sm font-medium text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                Restaurant ID
              </label>
              <Input
                type="text"
                placeholder="Enter restaurant ID"
                value={formData.restaurantId}
                onChange={(e) => handleInputChange('restaurantId', e.target.value)}
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-white border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            onClick={handleLogin}
            className="absolute w-[335px] h-12 top-[580px] left-[20px] bg-orange-600 rounded-lg hover:bg-orange-700 transition-all duration-200"
          >
            <span className="font-bold text-white text-sm tracking-wide">
              RESTAURANT LOGIN
            </span>
          </Button>

          {/* Contact Support */}
          <div className="absolute top-[650px] left-[20px] right-[20px] text-center">
            <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
              Need help?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-orange-600 font-semibold hover:underline"
              >
                Contact Support
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};