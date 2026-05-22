import { useState, useEffect } from 'react';
import type { YouTubeVideo } from '../services/youtube';

export interface UserData {
  history: YouTubeVideo[];
  liked: YouTubeVideo[];
  watchLater: YouTubeVideo[];
}

const STORAGE_KEY = 'yt_clone_user_data';

const defaultData: UserData = {
  history: [],
  liked: [],
  watchLater: [],
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(defaultData);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse user data from local storage', e);
      }
    }
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const addToHistory = (video: YouTubeVideo) => {
    setUserData(prev => {
      // Remove if it already exists to put it at the top
      const filtered = prev.history.filter(v => v.id !== video.id);
      return {
        ...prev,
        history: [video, ...filtered].slice(0, 100) // Keep max 100 items
      };
    });
  };

  const toggleLike = (video: YouTubeVideo) => {
    setUserData(prev => {
      const exists = prev.liked.some(v => v.id === video.id);
      if (exists) {
        return { ...prev, liked: prev.liked.filter(v => v.id !== video.id) };
      }
      return { ...prev, liked: [video, ...prev.liked] };
    });
  };

  const toggleWatchLater = (video: YouTubeVideo) => {
    setUserData(prev => {
      const exists = prev.watchLater.some(v => v.id === video.id);
      if (exists) {
        return { ...prev, watchLater: prev.watchLater.filter(v => v.id !== video.id) };
      }
      return { ...prev, watchLater: [video, ...prev.watchLater] };
    });
  };

  return {
    userData,
    addToHistory,
    toggleLike,
    toggleWatchLater,
  };
}
