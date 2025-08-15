import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../../components/GoogleAuth";
import { SwapEatLogoWithText } from "../../components/SwapEatLogo";

export const WelcomeScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (response: any) => {
    console.log('Google Auth Success:', response);
    // Store user data and navigate to home
    navigate('/home');
  };

  const handleGoogleError = (error: any) => {
    console.error('Google Auth Error:', error);
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen px-4 sm:px-0">
      <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] min-h-screen relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
            {/* SwapEat Logo */}
            <SwapEatLogoWithText size={96} className="mb-8" />

            {/* Tagline */}
            <p className="text-center text-gray-600 mb-8 px-4 [font-family:'Poppins',Helvetica]">
              Share food, reduce waste, build community
            </p>

            {/* Illustration */}
            <div className="w-64 h-48 bg-gradient-to-br from-yellow-200/30 to-purple-200/30 rounded-2xl flex items-center justify-center mb-12 border border-yellow-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🤝</div>
                <div className="text-sm text-gray-600 font-medium">Food Sharing Community</div>
              </div>
            </div>

            {/* Get Started Button */}
            <GoogleAuth
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="Continue with Google"
            />
            
            <div className="w-full flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Button 
              onClick={() => navigate('/user-login')}
              className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200 mb-3"
            >
              <span className="font-bold text-white text-sm tracking-wide">
                SIGN IN WITH EMAIL
              </span>
            </Button>

            {/* Restaurant Login Link */}
            <Button
              variant="outline"
              onClick={() => navigate('/restaurant-login')}
              className="w-full h-12 border-brandmain text-brandmain hover:bg-brandmain/5 mb-4"
            >
              <span className="font-semibold text-sm">
                Restaurant Login
              </span>
            </Button>
            
            {/* Sign Up Link */}
            <p className="text-sm text-gray-600 text-center">
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