import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Filter, Star, Plus, Clock, User, Phone } from "lucide-react";
import { mockRestaurants, mockFoodShares } from "../../data/mockData";
import { SwapEatLogo } from "../../components/SwapEatLogo";
import { useUser } from "../../context/UserContext";
import { BottomNavigation } from "../../components/BottomNavigation";

export const HomeScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, isLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'restaurants' | 'food-share'>('food-share');
  const [userLocation, setUserLocation] = useState<{
    address: string;
    coordinates?: { lat: number; lng: number };
  }>({
    address: 'Detecting location...'
  });

  const filteredRestaurants = mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFoodShares = mockFoodShares.filter(share =>
    share.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    share.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeRemaining = (availableUntil: Date) => {
    const now = new Date();
    const diff = availableUntil.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else if (minutes > 0) {
      return `${minutes}m left`;
    } else {
      return 'Expired';
    }
  };

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Use reverse geocoding to get address
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
              );
              const data = await response.json();
              
              if (data && data.display_name) {
                // Extract meaningful parts of the address
                const addressParts = data.display_name.split(',');
                const shortAddress = addressParts.slice(0, 2).join(',').trim();
                
                setUserLocation({
                  address: shortAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                  coordinates: { lat: latitude, lng: longitude }
                });
              } else {
                setUserLocation({
                  address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                  coordinates: { lat: latitude, lng: longitude }
                });
              }
            } catch (error) {
              console.error('Error getting address:', error);
              setUserLocation({
                address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                coordinates: { lat: latitude, lng: longitude }
              });
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            setUserLocation({
              address: 'Location unavailable'
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        setUserLocation({
          address: 'Location not supported'
        });
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen px-4 sm:px-0">
      <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] min-h-screen relative border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <div className="pb-20">
            {/* Header */}
            <div className="p-5 pt-16">
            {/* App Logo and Welcome */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SwapEatLogo size={40} className="mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-uigray-80 [font-family:'Poppins',Helvetica]">
                    SwapEat
                  </h1>
                  {currentUser && (
                    <p className="text-sm text-gray-600">
                      Welcome, {currentUser.name?.split(' ')[0] || 'User'}!
                    </p>
                  )}
                </div>
              </div>
              {!isLoggedIn && !isLoading && (
                <Button
                  onClick={() => navigate('/user-login')}
                  size="sm"
                  className="bg-brandmain hover:bg-brandmain/90 text-white px-4 py-2 rounded-lg"
                >
                  Sign In
                </Button>
              )}
              {isLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brandmain"></div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <MapPin className="w-5 h-5 text-brandmain flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 [font-family:'Poppins',Helvetica]">Deliver to</p>
                  <p className="text-sm font-semibold text-uigray-80 [font-family:'Poppins',Helvetica] truncate">
                    {userLocation.address}
                  </p>
                  {userLocation.coordinates && (
                    <p className="text-xs text-gray-400">
                      📍 {userLocation.coordinates.lat.toFixed(4)}, {userLocation.coordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/map')}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                  title="View Map"
                >
                  🗺️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-brandmain text-white hover:bg-brandmain/90 flex items-center justify-center"
                  title={currentUser ? `${currentUser.name}'s Profile` : 'Profile'}
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || '👤'}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search restaurants or cuisines"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-12 bg-white border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
              >
                <Filter className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>

            {/* Tab Navigation */}
            <div className="px-5 mb-6">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={activeTab === 'food-share' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('food-share')}
                  className={`flex-1 ${activeTab === 'food-share' ? 'bg-brandmain text-white' : 'text-gray-600'}`}
                >
                  🍽️ Food Share
                </Button>
                <Button
                  variant={activeTab === 'restaurants' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('restaurants')}
                  className={`flex-1 ${activeTab === 'restaurants' ? 'bg-brandmain text-white' : 'text-gray-600'}`}
                >
                  🏪 Restaurants
                </Button>
              </div>
            </div>

            {/* Share Food Button */}
            {activeTab === 'food-share' && (
              <div className="px-5 mb-6">
                <Button
                  onClick={() => navigate('/share-food')}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-bold text-white text-sm">
                    SHARE FOOD
                  </span>
                </Button>
              </div>
            )}

            {/* Content based on active tab */}
            <div className="px-5">
              {activeTab === 'food-share' ? (
                <>
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    Available Food Shares
                  </h3>
                  <div className="space-y-4">
                    {filteredFoodShares.map((share) => (
                      <div
                        key={share.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <div className="flex space-x-4">
                          {/* Food Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={share.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={share.foodName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-uigray-80 text-base [font-family:'Poppins',Helvetica]">
                                  {share.foodName}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    share.type === 'Veg' ? 'bg-green-100 text-green-800' :
                                    share.type === 'Vegan' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {share.type}
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {share.condition}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-xs text-orange-600 font-medium">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatTimeRemaining(share.availableUntil)}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              Quantity: {share.quantity}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{share.location.split(',')[0]}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{share.contactName}</span>
                              </div>
                            </div>

                            {share.specialNotes && (
                              <p className="text-xs text-gray-600 mb-2 italic">
                                Note: {share.specialNotes}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {share.pickupMethod}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/chat/${share.userId}`, { 
                                  state: { foodShare: share } 
                                })}
                                className="h-7 px-3 text-xs bg-brandmain hover:bg-brandmain/90"
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-uigray-80 mb-3 [font-family:'Poppins',Helvetica]">
                      Categories
                    </h3>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {['🍕 Pizza', '🍔 Burgers', '🍣 Sushi', '🌮 Mexican'].map((category, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="px-4 py-2 rounded-full border-brandmain/20 hover:bg-brandmain/5 text-sm whitespace-nowrap"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Restaurants */}
                  <div>
                    <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                      Nearby Restaurants
                    </h3>
                    <div className="space-y-4">
                      {filteredRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                          className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex space-x-4">
                            {/* Square Image Container */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-uigray-80 text-base [font-family:'Poppins',Helvetica]">
                                  {restaurant.name}
                                </h4>
                                {!restaurant.isOpen && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                    Closed
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 [font-family:'Poppins',Helvetica]">
                                {restaurant.cuisine}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-medium text-uigray-80">
                                      {restaurant.rating}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {restaurant.distance} km
                                    </span>
                                  </div>
                                </div>
                                
                                <span className="text-sm text-gray-600 [font-family:'Poppins',Helvetica]">
                                  {restaurant.deliveryTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </CardContent>
      </Card>
    </main>
  );
};