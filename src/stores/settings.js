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
      blurAmount: 3,
      brightnessAmount: 0.6,
      plexToken: '',
      plexURL: '',
      plexUpdateInterval: 30,
      searchEngine: 'google',
      clockFormat: '24h',
      showWeather: false,
      tabTitle: 'New Tab',
      unsplashApiKey: '',
      unsplashCollectionId: '',
      unsplashFrequency: 'daily', // ('daily', 'weekly', 'hourly')
      iconBackgroundColor: '#000000', // hex color or 'transparent'

      // actions
      setImage: (url) => set({ image: url }),
      setBackgroundImage: (url) => set({ backgroundImage: url }),
      setLocalBackgroundImage: (dataUrl) => set({ localBackgroundImage: dataUrl }),
      setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
      setBlurAmount: (blur) => set({ blurAmount: blur }),
      setBrightnessAmount: (brightness) => set({ brightnessAmount: brightness }),
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
      setUnsplashApiKey: (key) => set({ unsplashApiKey: key }),
      setUnsplashCollectionId: (id) => set({ unsplashCollectionId: id }),
      setUnsplashFrequency: (freq) => set({ unsplashFrequency: freq }),
      setIconBackgroundColor: (color) => set({ iconBackgroundColor: color }),
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
          blurAmount: 3,
          brightnessAmount: 0.6,
          searchEngine: 'google',
          clockFormat: '24h',
          showWeather: false,
          tabTitle: 'New Tab',
          unsplashApiKey: '',
          unsplashCollectionId: '',
          unsplashFrequency: 'daily',
          iconBackgroundColor: '#000000',
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
        blurAmount: state.blurAmount,
        brightnessAmount: state.brightnessAmount,
        searchEngine: state.searchEngine,
        clockFormat: state.clockFormat,
        tabTitle: state.tabTitle,
        unsplashApiKey: state.unsplashApiKey,
        unsplashCollectionId: state.unsplashCollectionId,
        unsplashFrequency: state.unsplashFrequency,
        iconBackgroundColor: state.iconBackgroundColor,
      }),
    }
  )
);


