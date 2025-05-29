import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      // state
      image: '',
      edit: false,
      username: '',
      searchbar: true,
      showDate: true,
      showClock: true,
      backgroundImage: '',
      localBackgroundImage: '',
      imageOpacity: 50,
      plexToken: '',
      plexURL: '',
      plexUpdateInterval: 30,
      searchEngine: 'google',
      clockFormat: '24h',
      showWeather: false,
      tabTitle: 'New Tab',

      // actions
      setImage: (url) => set({ image: url }),
      setBackgroundImage: (url) => set({ backgroundImage: url }),
      setLocalBackgroundImage: (dataUrl) => set({ localBackgroundImage: dataUrl }),
      setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
      setEdit: (flag) => set({ edit: flag }),
      toggleEdit: () => set((state) => ({ edit: !state.edit })),
      setUsername: (name) => set({ username: name }),
      setSearchbar: (show) => set({ searchbar: show }),
      setShowDate: (show) => set({ showDate: show }),
      setShowClock: (show) => set({ showClock: show }),
      setShowWeather: (show) => set({ showWeather: show }),
      setSearchEngine: (engine) => set({ searchEngine: engine }),
      setClockFormat: (format) => set({ clockFormat: format }),
      setTabTitle: (title) => set({ tabTitle: title }),
      clearAllData: () =>
        set({
          image: '',
          username: '',
          searchbar: true,
          showDate: true,
          showClock: true,
          backgroundImage: '',
          localBackgroundImage: '',
          imageOpacity: 50,
          searchEngine: 'google',
          clockFormat: '24h',
          showWeather: true,
          tabTitle: 'New Tab',
        }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        image: state.image,
        username: state.username,
        searchbar: state.searchbar,
        showDate: state.showDate,
        showClock: state.showClock,
        showWeather: state.showWeather,
        backgroundImage: state.backgroundImage,
        localBackgroundImage: state.localBackgroundImage,
        imageOpacity: state.imageOpacity,
        searchEngine: state.searchEngine,
        clockFormat: state.clockFormat,
        tabTitle: state.tabTitle,
      }),
    }
  )
);


