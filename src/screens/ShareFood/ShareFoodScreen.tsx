import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, AlertCircle } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { foodShareService } from "../../services/foodShareService";
import { FoodSharePreview } from "../../components/FoodSharePreview";

export const ShareFoodScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    type: 'Veg' as 'Veg' | 'Non-Veg' | 'Vegan',
    quantity: '',
    condition: 'Fresh' as 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen',
    location: '',
    availableUntilDate: '',
    availableUntilTime: '',
    pickupMethod: 'Pickup only' as 'Pickup only' | 'Can Deliver Nearby',
    specialNotes: '',
    contactName: currentUser?.name || '',
    contactPhone: currentUser?.phone || '',
    preferredContactTime: '',
    safetyConfirmed: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user makes changes
  };

  const handlePreview = () => {
    if (!isLoggedIn || !currentUser) {
      setError('You must be logged in to share food');
      return;
    }

    if (!formData.safetyConfirmed) {
      setError('Please confirm that the food is safe to eat.');
      return;
    }

    if (!formData.foodName || !formData.quantity || !formData.location ||
      !formData.availableUntilDate || !formData.availableUntilTime ||
      !formData.contactName || !formData.contactPhone) {
      setError('Please fill in all required fields');
      return;
    }

    // Combine date and time for validation
    const availableUntil = new Date(`${formData.availableUntilDate}T${formData.availableUntilTime}`);

    if (availableUntil <= new Date()) {
      setError('Available until time must be in the future');
      return;
    }

    setError('');
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Combine date and time
      const availableUntil = new Date(`${formData.availableUntilDate}T${formData.availableUntilTime}`);

      const result = await foodShareService.createFoodShare({
        foodName: formData.foodName,
        type: formData.type,
        quantity: formData.quantity,
        condition: formData.condition,
        location: formData.location,
        availableUntil,
        pickupMethod: formData.pickupMethod,
        specialNotes: formData.specialNotes || undefined,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        preferredContactTime: formData.preferredContactTime || undefined
      });

      if (result.error) {
        setError(result.error);
        setShowPreview(false);
      } else {
        // Success! Navigate back to home
        navigate('/home');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setShowPreview(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          handleInputChange('location', `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter manually.');
        }
      );
    }
  };

  const getPreviewData = () => {
    const availableUntil = new Date(`${formData.availableUntilDate}T${formData.availableUntilTime}`);
    return {
      ...formData,
      availableUntil
    };
  };

  return (
    <>
      <main className="bg-brand-light min-h-screen flex justify-center items-start w-screen px-4 sm:px-0">
        <Card className="bg-brand-light overflow-hidden w-full max-w-[375px] min-h-screen relative border-0 shadow-none">
          <CardContent className="p-0 h-full">
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <div className="flex items-center justify-between p-5 pt-16">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/home')}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5 text-uigray-80" />
                </Button>
                <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-uigray-80 text-lg">
                  Share Food
                </h2>
                <div className="w-9" />
              </div>

              <div className="flex-1 px-5 pb-8 overflow-y-auto">
                {/* Item Details Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    1. Item Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Food Name *</label>
                      <Input
                        type="text"
                        placeholder="e.g., Veg Biryani, Chocolate Cake"
                        value={formData.foodName}
                        onChange={(e) => handleInputChange('foodName', e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Type *</label>
                      <div className="flex space-x-2">
                        {['Veg', 'Non-Veg', 'Vegan'].map((type) => (
                          <Button
                            key={type}
                            variant={formData.type === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleInputChange('type', type)}
                            className={`flex-1 ${formData.type === type ? 'bg-brandmain' : ''}`}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Quantity Available *</label>
                      <Input
                        type="text"
                        placeholder="e.g., 3 servings, 2 boxes"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Condition *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Fresh', 'Near Expiry', 'Cooked Today', 'Frozen'].map((condition) => (
                          <Button
                            key={condition}
                            variant={formData.condition === condition ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleInputChange('condition', condition)}
                            className={`text-xs ${formData.condition === condition ? 'bg-brandmain' : ''}`}
                          >
                            {condition}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pickup/Delivery Info Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    2. Pickup/Delivery Info
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Location *</label>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter your address"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="flex-1 h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          className="px-3"
                        >
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-uigray-80 mb-2">Available Until Date *</label>
                        <Input
                          type="date"
                          value={formData.availableUntilDate}
                          onChange={(e) => handleInputChange('availableUntilDate', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-uigray-80 mb-2">Time *</label>
                        <Input
                          type="time"
                          value={formData.availableUntilTime}
                          onChange={(e) => handleInputChange('availableUntilTime', e.target.value)}
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Pickup Method *</label>
                      <div className="flex space-x-2">
                        {['Pickup only', 'Can Deliver Nearby'].map((method) => (
                          <Button
                            key={method}
                            variant={formData.pickupMethod === method ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleInputChange('pickupMethod', method)}
                            className={`flex-1 text-xs ${formData.pickupMethod === method ? 'bg-brandmain' : ''}`}
                          >
                            {method}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    3. Additional Info
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Special Notes</label>
                      <textarea
                        placeholder="e.g., contains nuts, spicy, requires heating"
                        value={formData.specialNotes}
                        onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                        className="w-full h-20 px-4 py-3 bg-white border border-gray-200 rounded-lg resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Photo (Optional)</label>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-dashed border-2 border-gray-300 hover:border-brandmain"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    4. Contact Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Name *</label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Phone / WhatsApp *</label>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-uigray-80 mb-2">Preferred Contact Time</label>
                      <Input
                        type="text"
                        placeholder="e.g., 6 PM - 9 PM, Anytime"
                        value={formData.preferredContactTime}
                        onChange={(e) => handleInputChange('preferredContactTime', e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Safety Consent */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-uigray-80 mb-4 [font-family:'Poppins',Helvetica]">
                    5. Consent & Safety
                  </h3>

                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="safety"
                      checked={formData.safetyConfirmed}
                      onChange={(e) => handleInputChange('safetyConfirmed', e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="safety" className="text-sm text-gray-700 cursor-pointer">
                        <AlertCircle className="w-4 h-4 inline mr-1 text-yellow-600" />
                        I confirm this food is safe to eat at the time of sharing.
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Preview Button */}
                <Button
                  onClick={handlePreview}
                  disabled={!formData.safetyConfirmed || !formData.foodName || !formData.quantity || !formData.location}
                  className="w-full h-12 bg-brandmain rounded-lg hover:bg-brandmain/90 transition-all duration-200 disabled:opacity-50"
                >
                  <span className="font-bold text-white text-sm tracking-wide">
                    PREVIEW & SHARE
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Preview Modal */}
      <FoodSharePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmit}
        onEdit={() => setShowPreview(false)}
        data={getPreviewData()}
        isSubmitting={isSubmitting}
      />
    </>
  );
};