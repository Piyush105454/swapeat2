import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, MapPin, Clock, User, Phone, Edit } from 'lucide-react';

interface FoodShareData {
  foodName: string;
  type: 'Veg' | 'Non-Veg' | 'Vegan';
  quantity: string;
  condition: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen';
  location: string;
  availableUntil: Date;
  pickupMethod: 'Pickup only' | 'Can Deliver Nearby';
  specialNotes?: string;
  contactName: string;
  contactPhone: string;
  preferredContactTime?: string;
}

interface FoodSharePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  data: FoodShareData;
  isSubmitting?: boolean;
}

export const FoodSharePreview: React.FC<FoodSharePreviewProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  data,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = data.availableUntil.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m from now`;
    } else if (minutes > 0) {
      return `${minutes}m from now`;
    } else {
      return 'Expired';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-uigray-80">Preview Your Food Share</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview Content */}
          <div className="p-4">
            {/* Food Share Card Preview */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex space-x-4">
                {/* Placeholder Image */}
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center flex-shrink-0">
                  <div className="text-2xl">🍽️</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-uigray-80 text-base [font-family:'Poppins',Helvetica]">
                        {data.foodName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          data.type === 'Veg' ? 'bg-green-100 text-green-800' :
                          data.type === 'Vegan' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.type}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {data.condition}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-orange-600 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeRemaining()}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Quantity: {data.quantity}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{data.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{data.contactName}</span>
                    </div>
                  </div>

                  {data.specialNotes && (
                    <p className="text-xs text-gray-600 mb-2 italic">
                      Note: {data.specialNotes}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {data.pickupMethod}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Phone className="w-3 h-3 mr-1" />
                      {data.contactPhone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available until:</span>
                <span className="font-medium">{formatTime(data.availableUntil)}</span>
              </div>
              
              {data.preferredContactTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best time to contact:</span>
                  <span className="font-medium">{data.preferredContactTime}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Full location:</span>
                <span className="font-medium text-right flex-1 ml-2">{data.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onEdit}
                disabled={isSubmitting}
                className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              
              <Button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sharing...</span>
                  </div>
                ) : (
                  'Confirm & Share'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};