import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  // Add other profile fields as needed
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(userId: string | number): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/admin-users/${userId}/admin-profile-details`);
      
      if (response.data && response.data.success) {
        setProfile(response.data.data);
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const refetch = () => {
    fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    refetch
  };
}