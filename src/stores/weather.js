import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWeatherStore = create(
  persist(
    (set) => ({
      // state
      lat: 0,
      lon: 0,
      token: '',

      // actions
      setLat: (newLat) => set({ lat: newLat }),
      setLon: (newLon) => set({ lon: newLon }),
      setToken: (newToken) => set({ token: newToken }),
    }),
    {
      name: 'weather-storage',  // key in localStorage
      partialize: (state) => ({
        lat: state.lat,
        lon: state.lon,
        token: state.token,
      }),
    }
  )
);
