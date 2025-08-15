import { supabase } from '../lib/supabase';
import { FoodShare } from '../types';

export interface CreateFoodShareData {
  foodName: string;
  type: 'Veg' | 'Non-Veg' | 'Vegan';
  quantity: string;
  condition: 'Fresh' | 'Near Expiry' | 'Cooked Today' | 'Frozen';
  location: string;
  availableUntil: Date;
  pickupMethod: 'Pickup only' | 'Can Deliver Nearby';
  specialNotes?: string;
  photoUrl?: string;
  contactName: string;
  contactPhone: string;
  preferredContactTime?: string;
}

export const foodShareService = {
  // Create a new food share
  async createFoodShare(data: CreateFoodShareData): Promise<{ data: FoodShare | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data: foodShare, error } = await supabase
        .from('food_shares')
        .insert({
          user_id: user.id,
          food_name: data.foodName,
          type: data.type,
          quantity: data.quantity,
          condition: data.condition,
          location: data.location,
          available_until: data.availableUntil.toISOString(),
          pickup_method: data.pickupMethod,
          special_notes: data.specialNotes,
          photo_url: data.photoUrl,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          preferred_contact_time: data.preferredContactTime,
          is_verified: true,
          is_available: true
        })
        .select(`
          *,
          users!food_shares_user_id_fkey (
            id,
            name,
            email,
            phone,
            avatar_url
          )
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Transform to match our FoodShare type
      const transformedData: FoodShare = {
        id: foodShare.id,
        foodName: foodShare.food_name,
        type: foodShare.type,
        quantity: foodShare.quantity,
        condition: foodShare.condition,
        location: foodShare.location,
        availableUntil: new Date(foodShare.available_until),
        pickupMethod: foodShare.pickup_method,
        specialNotes: foodShare.special_notes,
        photo: foodShare.photo_url,
        contactName: foodShare.contact_name,
        contactPhone: foodShare.contact_phone,
        preferredContactTime: foodShare.preferred_contact_time,
        isVerified: foodShare.is_verified,
        createdAt: new Date(foodShare.created_at),
        userId: foodShare.user_id
      };

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create food share' };
    }
  },

  // Get all available food shares
  async getFoodShares(): Promise<{ data: FoodShare[] | null; error: string | null }> {
    try {
      const { data: foodShares, error } = await supabase
        .from('food_shares')
        .select(`
          *,
          users!food_shares_user_id_fkey (
            id,
            name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('is_available', true)
        .gte('available_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      // Transform to match our FoodShare type
      const transformedData: FoodShare[] = foodShares.map(share => ({
        id: share.id,
        foodName: share.food_name,
        type: share.type,
        quantity: share.quantity,
        condition: share.condition,
        location: share.location,
        availableUntil: new Date(share.available_until),
        pickupMethod: share.pickup_method,
        specialNotes: share.special_notes,
        photo: share.photo_url,
        contactName: share.contact_name,
        contactPhone: share.contact_phone,
        preferredContactTime: share.preferred_contact_time,
        isVerified: share.is_verified,
        createdAt: new Date(share.created_at),
        userId: share.user_id
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch food shares' };
    }
  },

  // Get food shares by user
  async getUserFoodShares(userId: string): Promise<{ data: FoodShare[] | null; error: string | null }> {
    try {
      const { data: foodShares, error } = await supabase
        .from('food_shares')
        .select(`
          *,
          users!food_shares_user_id_fkey (
            id,
            name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      // Transform to match our FoodShare type
      const transformedData: FoodShare[] = foodShares.map(share => ({
        id: share.id,
        foodName: share.food_name,
        type: share.type,
        quantity: share.quantity,
        condition: share.condition,
        location: share.location,
        availableUntil: new Date(share.available_until),
        pickupMethod: share.pickup_method,
        specialNotes: share.special_notes,
        photo: share.photo_url,
        contactName: share.contact_name,
        contactPhone: share.contact_phone,
        preferredContactTime: share.preferred_contact_time,
        isVerified: share.is_verified,
        createdAt: new Date(share.created_at),
        userId: share.user_id
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch user food shares' };
    }
  },

  // Update food share availability
  async updateFoodShareAvailability(id: string, isAvailable: boolean): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('food_shares')
        .update({ is_available: isAvailable })
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to update food share' };
    }
  },

  // Delete food share
  async deleteFoodShare(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('food_shares')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Failed to delete food share' };
    }
  }
};