import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getUserProfile();
        setProfile(profileData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>載入失敗：{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">個人資料</h1>
        {profile && (
          <div>
            <p>使用者名稱：{profile.username}</p>
            <p>模型生成數量：{profile.totalGenerations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;