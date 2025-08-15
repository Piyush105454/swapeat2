import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Camera, Star } from "lucide-react";

export const PickupSuccessScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handleTakePhoto = () => {
    // Simulate camera capture
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📸 Order Photo', 100, 100);
      setPhoto(canvas.toDataURL());
    }
  };

  const handleSubmitFeedback = () => {
    // Submit feedback and navigate home
    navigate('/home');
  };

  if (showFeedback) {
    return (
      <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
        <Card className="bg-brand-light overflow-hidden w-[375px] h-[812px] relative border-0 shadow-none">
          <CardContent className="p-0 h-full">
            <div className="absolute top-[60px] left-[20px] right-[20px] bottom-[20px] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-uigray-80 [font-family:'Poppins',Helvetica]">
                  Rate Your Experience
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  How was your order from Pizza Palace?
                </p>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <p className="text-center text-gray-700 mb-4 font-medium">
                  Rate your experience
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <p className="text-gray-700 mb-4 font-medium">
                  Take a photo of your order (Optional)
                </p>
                
                {photo ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={photo}
                        alt="Order photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleTakePhoto}
                      className="text-sm"
                    >
                      Retake Photo
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleTakePhoto}
                      className="text-sm border-brandmain text-brandmain hover:bg-brandmain/5"
                    >
                      Take Photo
                    </Button>
                  </div>
                )}
              </div>

              {/* Feedback Text */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <p className="text-gray-700 mb-4 font-medium">
                  Write your feedback
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:border-brandmain focus:ring-1 focus:ring-brandmain text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <Button 
                  onClick={handleSubmitFeedback}
                  className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
                >
                  <span className="font-bold text-white text-sm tracking-wide">
                    SUBMIT FEEDBACK
                  </span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/home')}
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <span className="font-semibold text-sm">
                    SKIP FOR NOW
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

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
              Pickup Successful!
            </h1>
            <p className="text-gray-600 mb-8 [font-family:'Poppins',Helvetica]">
              Your order has been successfully picked up. Enjoy your meal!
            </p>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Order ID</span>
                  <span className="font-semibold text-uigray-80">#ORD-12345</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Restaurant</span>
                  <span className="font-semibold text-uigray-80">Pizza Palace</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Pickup Time</span>
                  <span className="font-semibold text-uigray-80">3:05 PM</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Total Paid</span>
                  <span className="font-semibold text-brandmain">$37.97</span>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="bg-brandmain/5 border border-brandmain/20 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="text-brandmain text-xl">🎉</div>
                <div className="text-left">
                  <p className="font-semibold text-brandmain text-sm mb-1">
                    Thank You!
                  </p>
                  <p className="text-brandmain/80 text-xs">
                    We hope you enjoy your delicious meal. Your feedback helps us serve you better!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowFeedback(true)}
                className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200"
              >
                <span className="font-bold text-white text-sm tracking-wide">
                  RATE & REVIEW
                </span>
              </Button>
              
              <Button 
                onClick={() => navigate('/home')}
                variant="outline"
                className="w-full h-12 border-brandmain text-brandmain hover:bg-brandmain/5"
              >
                <span className="font-semibold text-sm">
                  BACK TO HOME
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};