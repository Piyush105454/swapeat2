import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              onClick={() => navigate('/signup')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Sign In
            </h2>
            <div className="w-9" />
          </div>

          {/* Welcome Back Text */}
          <div className="absolute top-[140px] left-[20px] right-[20px] text-center">
            <h1 className="[font-family:'Poppins',Helvetica] font-bold text-uigray-80 text-2xl mb-2">
              Welcome Back!
            </h1>
            <p className="[font-family:'Poppins',Helvetica] font-normal text-gray-600 text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Illustration */}
          <div className="absolute top-[220px] left-[50px] right-[50px] flex justify-center">
            <div className="w-[180px] h-[180px] bg-gradient-to-br from-brandmain/20 to-brandmain/10 rounded-full flex items-center justify-center">
              <div className="w-[100px] h-[100px] bg-brandmain/30 rounded-full flex items-center justify-center">
                <div className="w-[50px] h-[50px] bg-brandmain rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="absolute top-[440px] left-[20px] right-[20px] space-y-4">
            <div>
              <label className="block text-sm font-medium text-uigray-80 mb-2 [font-family:'Poppins',Helvetica]">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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

            {/* Forgot Password */}
            <div className="text-right">
              <Button
                variant="link"
                className="p-0 h-auto text-brandmain text-sm font-medium hover:underline"
              >
                Forgot Password?
              </Button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button 
            onClick={() => navigate('/dashboard')}
            className="absolute w-[335px] h-12 top-[620px] left-[20px] bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
          >
            <span className="[font-family:'Yu_Gothic_UI-Bold',Helvetica] font-bold text-white text-sm text-center tracking-[0.80px] leading-6 whitespace-nowrap">
              SIGN IN
            </span>
          </Button>

          {/* Sign Up Link */}
          <div className="absolute top-[690px] left-[20px] right-[20px] text-center">
            <p className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate('/signup')}
                className="p-0 h-auto text-brandmain font-semibold hover:underline"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};