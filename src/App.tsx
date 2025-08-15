import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// Import all screens
import { WelcomeScreen } from './screens/Welcome/WelcomeScreen';
import { UserLoginScreen } from './screens/UserLogin/UserLoginScreen';
import { RestaurantLoginScreen } from './screens/RestaurantLogin/RestaurantLoginScreen';
import { SignUpScreen } from './screens/SignUp/SignUpScreen';
import { HomeScreen } from './screens/Home/HomeScreen';
import { RestaurantScreen } from './screens/Restaurant/RestaurantScreen';
import { CheckoutScreen } from './screens/Checkout/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmation/OrderConfirmationScreen';
import { TrackOrderScreen } from './screens/TrackOrder/TrackOrderScreen';
import { PickupVerificationScreen } from './screens/PickupVerification/PickupVerificationScreen';
import { PickupSuccessScreen } from './screens/PickupSuccess/PickupSuccessScreen';
import { ProfileScreen } from './screens/Profile/ProfileScreen';
import { OrdersScreen } from './screens/Orders/OrdersScreen';
import { RestaurantDashboardScreen } from './screens/RestaurantDashboard/RestaurantDashboardScreen';
import { MapScreen } from './screens/Map/MapScreen';
import { ChatScreen } from './screens/Chat/ChatScreen';
import { ShareFoodScreen } from './screens/ShareFood/ShareFoodScreen';
import { ChatListScreen } from './screens/ChatList/ChatListScreen';
import { AuthCallback } from './components/AuthCallback';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
        {/* Welcome & Authentication */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/user-login" element={<UserLoginScreen />} />
        <Route path="/restaurant-login" element={<RestaurantLoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* User Flow */}
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/restaurant/:id" element={<RestaurantScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/order-confirmation" element={<OrderConfirmationScreen />} />
        <Route path="/track-order" element={<TrackOrderScreen />} />
        <Route path="/pickup-verification" element={<PickupVerificationScreen />} />
        <Route path="/pickup-success" element={<PickupSuccessScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/orders" element={<OrdersScreen />} />
        
        {/* Restaurant Flow */}
        <Route path="/restaurant-dashboard" element={<RestaurantDashboardScreen />} />
        
        {/* Additional Features */}
        <Route path="/map" element={<MapScreen />} />
        <Route path="/chat" element={<ChatListScreen />} />
        <Route path="/chat/:userId" element={<ChatScreen />} />
        <Route path="/share-food" element={<ShareFoodScreen />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;