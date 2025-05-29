import React, { useEffect } from 'react';
import Clock from './components/Clock';
import DateDisplay from './components/Date';
import Greeting from './components/Greeting';
import SearchBar from './components/SearchBar';
import BackgroundImage from './components/Image';
import { useSettingsStore } from './stores/settings';
import SettingsModal from './components/SettingsModal';
import Bookmarks from './components/Bookmarks';
import WeatherWidget from './components/WeatherWidget';

const App = () => {
  const store = useSettingsStore();

  // Update document title when tab-title changes
  useEffect(() => {
    if (store.tabTitle) {
      document.title = store.tabTitle;
    }
  }, [store.tabTitle]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white antialiased overflow-hidden">
      
      <BackgroundImage />
      {store.showWeather && (
        <div className="absolute top-4 right-4 z-20">
          <WeatherWidget />
        </div>
      )}

      <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8 md:p-12 z-10 w-full">
        <div className="mb-8 text-center">
          {store.showClock && <Clock />}
          {store.showDate && <DateDisplay />}
        </div>

        <div className="mb-12 text-center">
          <Greeting />
        </div>
        {store.searchbar && <SearchBar />}
        <Bookmarks />

      </main>
      <SettingsModal />
    </div>
  );
};

export default App;