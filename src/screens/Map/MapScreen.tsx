import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Navigation } from "lucide-react";
import { BottomNavigation } from "../../components/BottomNavigation";
import { Map } from "../../components/Map";
import { mockRestaurants } from "../../data/mockData";

export const MapScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleCurrentLocation = () => {
    // This would center the map on user's current location
    // The Map component already handles this automatically
    window.location.reload(); // Simple way to refresh and re-center
  };

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen">
      <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] h-screen relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="absolute top-[60px] left-[20px] right-[20px] z-[1000]">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/home')}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-uigray-80" />
              </Button>
              <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg bg-white/90 px-4 py-2 rounded-full shadow-sm">
                Nearby Restaurants
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <Search className="w-5 h-5 text-uigray-80" />
              </Button>
            </div>
          </div>

          {/* Real Map Container */}
          <div className="absolute inset-0">
            <Map 
              restaurants={mockRestaurants}
              onRestaurantClick={handleRestaurantClick}
              className="w-full h-full"
            />
          </div>

          {/* Current Location Button */}
          <div className="absolute bottom-[100px] right-[20px] z-[1000]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCurrentLocation}
              className="w-12 h-12 p-0 rounded-full bg-white shadow-lg border-0 hover:bg-gray-50"
            >
              <Navigation className="w-5 h-5 text-brandmain" />
            </Button>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </CardContent>
      </Card>
    </main>
  );
};