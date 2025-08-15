import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, MapPin, Phone, Mail, Camera, LogOut } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { SwapEatLogo } from "../../components/SwapEatLogo";
import { supabase } from "../../lib/supabase";

export const ProfileScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentUser, authUser, signOut, isLoggedIn, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const user = currentUser || {
      name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'User',
      email: authUser?.email || '',
      phone: authUser?.user_metadata?.phone || ''
    };
    
    setUserInfo({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  }, [currentUser, authUser]);

  const handleSave = async () => {
    if (!authUser) return;
    
    setIsSaving(true);
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          name: userInfo.name,
          phone: userInfo.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      } else {
        setIsEditing(false);
        // Refresh user data would happen automatically through the context
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandmain mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/user-login');
    return <div>Redirecting...</div>;
  }

  // Show profile even if currentUser is still loading (use authUser data as fallback)
  const displayUser = currentUser || {
    id: authUser?.id || '',
    name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || '',
    phone: authUser?.user_metadata?.phone || '',
    avatar: authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || ''
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
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-uigray-80" />
            </Button>
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
              Profile
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-white/20 rounded-full"
            >
              <Edit className="w-5 h-5 text-uigray-80" />
            </Button>
          </div>

          <div className="absolute top-[120px] left-[20px] right-[20px] bottom-[20px] overflow-y-auto">
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto">
                  {displayUser?.avatar ? (
                    <img
                      src={displayUser.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-200">
                      <SwapEatLogo size={32} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-white border-brandmain text-brandmain"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-uigray-80 mt-3 [font-family:'Poppins',Helvetica]">
                {displayUser?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-600">SwapEat Community Member</p>
              {authUser?.email_confirmed_at && (
                <div className="flex items-center justify-center mt-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    ✓ Verified Account
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <h4 className="font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                Personal Information
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-600">👤</div>
                      <span className="text-sm text-uigray-80">{userInfo.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-uigray-80">{displayUser?.email || 'No email'}</span>
                    {authUser?.email_confirmed_at && (
                      <div className="text-green-600 text-xs">✓</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brandmain focus:ring-1 focus:ring-brandmain"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-uigray-80">{userInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-10 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="font-semibold text-white text-sm">Saving...</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-white text-sm">
                        SAVE CHANGES
                      </span>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    variant="outline"
                    className="flex-1 h-10 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="font-semibold text-sm">
                      CANCEL
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <h4 className="font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                Quick Actions
              </h4>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/orders')}
                  className="w-full h-12 justify-start space-x-3 border-gray-200 hover:bg-gray-50"
                >
                  <div className="text-lg">📋</div>
                  <span className="text-sm font-medium text-uigray-80">Order History</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start space-x-3 border-gray-200 hover:bg-gray-50"
                >
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-uigray-80">Manage Addresses</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start space-x-3 border-gray-200 hover:bg-gray-50"
                >
                  <div className="text-lg">💳</div>
                  <span className="text-sm font-medium text-uigray-80">Payment Methods</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start space-x-3 border-gray-200 hover:bg-gray-50"
                >
                  <div className="text-lg">🔔</div>
                  <span className="text-sm font-medium text-uigray-80">Notifications</span>
                </Button>
              </div>
            </div>

            {/* Logout */}
            <div className="mb-6">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 justify-center space-x-3"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold text-sm">LOGOUT</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};