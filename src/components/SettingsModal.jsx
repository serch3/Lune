import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettingsStore } from '@/stores/settings';
import { useLinksStore } from '@/stores/links';
import { useWeatherStore } from '@/stores/weather';
import { useModal } from '@/hooks/useModal';

const SettingInput = ({ label, id, value, onChange, type = 'text', placeholder, helpText, children }) => (
  <div className="form-control w-full py-3">
    <legend className="fieldset-legend" htmlFor={id}>
      <span className="label-text text-gray-300 text-sm">{label}</span>
    </legend>
    <input
      id={id}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full p-3"
    />
    {helpText && (
      <label className="label">
        <span className="label-text-alt text-gray-400 text-xs">{helpText}</span>
      </label>
    )}
    {children}
  </div>
);

const SettingToggle = ({ label, id, checked, onChange }) => (
  <div className="form-control">
    <label className="label cursor-pointer py-4 border-b border-neutral-700/30 flex justify-between items-center" htmlFor={id}>
      <span className="label-text text-gray-100 text-base">{label}</span>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox"
      />
    </label>
  </div>
);

export default function SettingsModal() {
  const store = useSettingsStore();
  const linksStore = useLinksStore();
  const weatherStore = useWeatherStore();
  const { isModalOpen, openModal, closeModal } = useModal();

  const [username, setUsername] = useState(store.username);
  const [searchbar, setSearchbar] = useState(store.searchbar);
  const [showDate, setShowDate] = useState(store.showDate);
  const [showClock, setShowClock] = useState(store.showClock);
  const [showWeather, setShowWeather] = useState(store.showWeather);
  const [backgroundImage, setBackgroundImage] = useState(store.backgroundImage);
  const [localBackgroundImage, setLocalBackgroundImage] = useState(store.localBackgroundImage);
  const [imageOpacity, setImageOpacity] = useState(store.imageOpacity);
  const [weatherToken, setWeatherToken] = useState(weatherStore.token);
  const [weatherLat, setWeatherLat] = useState(weatherStore.lat);
  const [weatherLon, setWeatherLon] = useState(weatherStore.lon);
  const [searchEngine, setSearchEngine] = useState(store.searchEngine);
  const [clockFormat, setClockFormat] = useState(store.clockFormat);
  const [tabTitle, setTabTitle] = useState(store.tabTitle);
  const [unsplashApiKey, setUnsplashApiKey] = useState(store.unsplashApiKey);
  const [unsplashCollectionId, setUnsplashCollectionId] = useState(store.unsplashCollectionId);
  const [unsplashFrequency, setUnsplashFrequency] = useState(store.unsplashFrequency);

  const save = () => {
    store.setUsername(username);
    store.setSearchbar(searchbar);
    store.setShowDate(showDate);
    store.setShowClock(showClock);
    store.setShowWeather(showWeather);
    store.setBackgroundImage(backgroundImage);
    store.setLocalBackgroundImage(localBackgroundImage);
    store.setImageOpacity(imageOpacity);
    weatherStore.setToken(weatherToken);
    weatherStore.setLat(weatherLat);
    weatherStore.setLon(weatherLon);
    store.setSearchEngine(searchEngine);
    store.setClockFormat(clockFormat);
    store.setTabTitle(tabTitle);
    store.setUnsplashApiKey(unsplashApiKey);
    store.setUnsplashCollectionId(unsplashCollectionId);
    store.setUnsplashFrequency(unsplashFrequency);
    closeModal();
  };

  const handleOpenModal = () => {
    setUsername(store.username);
    setSearchbar(store.searchbar);
    setShowDate(store.showDate);
    setShowClock(store.showClock);
    setShowWeather(store.showWeather);
    setBackgroundImage(store.backgroundImage);
    setLocalBackgroundImage(store.localBackgroundImage);
    setImageOpacity(store.imageOpacity);
    setWeatherToken(weatherStore.token);
    setWeatherLat(weatherStore.lat);
    setWeatherLon(weatherStore.lon);
    setSearchEngine(store.searchEngine);
    setClockFormat(store.clockFormat);
    setTabTitle(store.tabTitle);
    setUnsplashApiKey(store.unsplashApiKey);
    setUnsplashCollectionId(store.unsplashCollectionId);
    setUnsplashFrequency(store.unsplashFrequency);
    store.setEdit(false);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
  }

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      store.clearAllData();
      linksStore.clearAllData();
      weatherStore.clearAllData();
      handleCloseModal();
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const modalContent = (
    <>
      {/* Settings Trigger */}
      <button
        onClick={handleOpenModal}
        aria-label="Open settings"
        className="btn btn-ghost btn-circle fixed bottom-8 right-8 z-100 shadow-xl backdrop-blur-md hover:scale-105 active:scale-95 p-3 bg-gray-700/60 hover:bg-gray-600/80 border-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c.04.32.07.65.07.98s-.03.66-.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
      </button>

      {isModalOpen && (
        <div className="modal modal-open modal-bottom sm:modal-middle" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="modal-box backdrop-blur-lg shadow-2xl max-w-lg w-full p-0 flex flex-col rounded-t-2xl sm:rounded-2xl">
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-neutral-700/50 flex justify-between items-center">
              <h3 id="settings-title" className="font-semibold text-xl text-white">Settings</h3>
              <button onClick={handleCloseModal} aria-label="Close settings" className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 space-y-6 overflow-y-auto grow">
              <section>
                <h2 className="text-base font-medium text-gray-300 mb-3 uppercase tracking-wider">Appearance</h2>

                <div className="form-control w-full py-2">
                  <legend className="fieldset-legend" htmlFor="backgroundUrl">
                    <span className="label-text text-gray-300 text-sm">Custom Background Image URL</span>
                  </legend>
                  <div className="relative">
                    <input
                      id="backgroundUrl"
                      value={backgroundImage}
                      onChange={e => setBackgroundImage(e.target.value)}
                      type="text"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="input input-bordered w-full p-3 pr-28 rounded-md"
                    />
                    {backgroundImage && (
                      <button
                        onClick={() => setBackgroundImage('')}
                        className="btn btn-sm btn-ghost absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label="Clear image URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {backgroundImage && (
                    <div className="mt-3 p-2 border border-neutral-700/50 rounded-lg bg-gray-800/30">
                      <img src={backgroundImage} alt="Background Preview" className="max-h-32 w-full object-contain rounded" />
                    </div>
                  )}
                </div>

                <div className="form-control w-full py-2">
                  <legend className="fieldset-legend" htmlFor="localBackgroundFile">
                    <span className="label-text text-gray-300 text-sm">Local Background Image</span>
                  </legend>
                  <label
                    htmlFor="localBackgroundFile"
                    className="btn btn-outline rounded-md border-dashed border-neutral-600 hover:bg-neutral-700/50 hover:border-neutral-500 text-gray-300 font-normal p-4 w-full flex flex-col items-center justify-center cursor-pointer h-32"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to upload or drag & drop</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                  </label>
                  <input
                    type="file"
                    id="localBackgroundFile"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLocalBackgroundImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  {localBackgroundImage && (
                    <div className="mt-3 p-2 border border-neutral-700/50 rounded-lg bg-gray-800/30 relative">
                      <img src={localBackgroundImage} alt="Local Background Preview" className="max-h-32 w-full object-contain rounded" />
                      <button
                        onClick={() => {
                          setLocalBackgroundImage('');
                          const fileInput = document.getElementById('localBackgroundFile');
                          if (fileInput) fileInput.value = '';
                        }}
                        className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-gray-700/50 hover:bg-gray-600/70"
                        aria-label="Remove local image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control w-full py-1 mt-4">
                  <label className="label">
                    <span className="label-text text-gray-300 text-sm">Image Opacity</span>
                    <span className="label-text-alt text-gray-200">{imageOpacity}%</span>
                  </label>
                  <input id="imageOpacity" type="range" min="0" max="100" value={imageOpacity} onChange={e => setImageOpacity(Number(e.target.value))} className="range range-sm range-primary w-100" />
                </div>
              </section>

              <section>
                <h2 className="text-base font-medium text-gray-300 mb-3 uppercase tracking-wider">General</h2>
                <div className="bg-gray-800/50 rounded-xl divide-y divide-neutral-700/30">
                  <div className="px-5">
                    <SettingInput
                      label="Tab Title"
                      id="tabTitle"
                      value={tabTitle}
                      onChange={(e) => setTabTitle(e.target.value)}
                      placeholder="New Tab"
                      helpText="Set a custom title for your new tab page."
                    />
                  </div>
                  <div className="px-5">
                    <div className="form-control w-full py-3">
                      <legend className="fieldset-legend" htmlFor="searchEngineSelect">
                        <span className="label-text text-gray-300 text-sm">Search Engine</span>
                      </legend>
                      <select
                        id="searchEngineSelect"
                        className="select select-bordered w-full"
                        value={searchEngine}
                        onChange={(e) => setSearchEngine(e.target.value)}
                      >
                        <option value="google">Google</option>
                        <option value="duckduckgo">DuckDuckGo</option>
                        <option value="bing">Bing</option>
                        <option value="yandex">Yandex</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-medium text-gray-300 mb-3 uppercase tracking-wider">User Settings</h2>
                <div className="bg-gray-800/50 rounded-xl divide-y divide-neutral-700/30">
                  <div className="px-5"><SettingInput label="Username" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name"/></div>
                  <div className="px-5"><SettingToggle label="Show Search Bar" id="showSearchbar" checked={searchbar} onChange={e => setSearchbar(e.target.checked)}/></div>
                  <div className="px-5"><SettingToggle label="Show Date" id="showDate" checked={showDate} onChange={e => setShowDate(e.target.checked)}/></div>
                  <div className="px-5"><SettingToggle label="Show Clock" id="showClock" checked={showClock} onChange={e => setShowClock(e.target.checked)}/></div>
                  <div className="px-5">
                    <div className="form-control w-full py-3">
                      <legend className="fieldset-legend" htmlFor="clockFormatSelect">
                        <span className="label-text text-gray-300 text-sm">Clock Format</span>
                      </legend>
                      <select
                        id="clockFormatSelect"
                        className="select select-bordered w-full"
                        value={clockFormat}
                        onChange={(e) => setClockFormat(e.target.value)}
                      >
                        <option value="24h">24-hour</option>
                        <option value="12h">12-hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-medium text-gray-300 mb-3 uppercase tracking-wider">Weather Widget</h2>
                <div className="bg-gray-800/50 rounded-xl p-5 space-y-4">
                  <SettingToggle label="Show Weather" id="showWeather" checked={showWeather} onChange={(e) => setShowWeather(e.target.checked)} />
                  <SettingInput label="OpenWeather API Token" id="weatherToken" value={weatherToken} onChange={e => setWeatherToken(e.target.value)} placeholder="Your API token"/>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SettingInput label="Latitude" id="weatherLat" type="number" value={weatherLat} onChange={e => setWeatherLat(Number(e.target.value))} placeholder="e.g., 50.23"/>
                    <SettingInput label="Longitude" id="weatherLon" type="number" value={weatherLon} onChange={e => setWeatherLon(Number(e.target.value))} placeholder="e.g., 16.17"/>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-medium text-gray-300 mb-3 uppercase tracking-wider">Unsplash Background</h2>
                <div className="bg-gray-800/50 rounded-xl p-5 space-y-4">
                  <SettingInput
                    label="Unsplash API Key"
                    id="unsplashApiKey"
                    value={unsplashApiKey}
                    onChange={(e) => setUnsplashApiKey(e.target.value)}
                    placeholder="Enter your Unsplash API Key"
                    helpText="Get an API key from Unsplash Developers."
                  />
                  <SettingInput
                    label="Unsplash Collection ID (Optional)"
                    id="unsplashCollectionId"
                    value={unsplashCollectionId}
                    onChange={(e) => setUnsplashCollectionId(e.target.value)}
                    placeholder="Enter a collection ID"
                    helpText="Leave blank for random photos from Unsplash."
                  />
                  <div className="form-control w-full py-3">
                    <legend className="fieldset-legend" htmlFor="unsplashFrequencySelect">
                      <span className="label-text text-gray-300 text-sm">Update Frequency</span>
                    </legend>
                    <select
                      id="unsplashFrequencySelect"
                      className="select select-bordered w-full"
                      value={unsplashFrequency}
                      onChange={(e) => setUnsplashFrequency(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="hourly">Hourly</option>
                      <option value="manual">Manual (on page load)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="modal-action px-5 sm:px-7 py-4 flex flex-col sm:flex-row justify-between items-center rounded-b-2xl sm:rounded-b-xl">
              <button
                type="button"
                onClick={handleClearAllData}
                className="btn btn-error w-full sm:w-auto mb-3 sm:mb-0 text-white"
              >
                Clear All Data
              </button>
              <div className="flex flex-col sm:flex-row sm:space-x-3 w-full sm:w-auto">
                <button onClick={handleCloseModal} className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1">
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
          {/* Click outside to close */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseModal}>close</button>
          </form>
        </div>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
}
