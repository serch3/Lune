import { useEffect, useState } from 'react';
import { useWeatherStore } from '@/stores/weather';

const WeatherWidget = () => {
  const token = useWeatherStore((state) => state.token);
  const lat = useWeatherStore((state) => state.lat);
  const lon = useWeatherStore((state) => state.lon);

  const [weatherData, setWeatherData] = useState(null);
  const [iconURL, setIconURL] = useState('');
  const [loaded, setLoaded] = useState(false);

  const getWeather = async () => {
    if (!token || lat === 0 || lon === 0) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData(data);
      if (data && data.weather && data.weather.length > 0) {
        setIconURL(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
      }
      setLoaded(true);
    } catch (err) {
      console.error('Error fetching weather data:', err);
    }
  };

  useEffect(() => {
    getWeather();
    const interval = setInterval(getWeather, 2 * 60 * 60 * 1000); // Update every 2 hours
    return () => clearInterval(interval);
  }, [token, lat, lon]);

  if (!loaded || !weatherData || !weatherData.main || !weatherData.weather) return null;

  return (
    <div className="flex flex-row justify-items-center items-center capitalize space-x-2">
      {iconURL && <img src={iconURL} alt="Weather icon" className="w-10 h-10" />}
      <div>
        <p>{weatherData.weather[0].description}</p>
      </div>
      <div className="flex flex-row place-content-start items-start">
        <span className="text-2xl">{parseInt(weatherData.main.temp)}</span>
        <span className="text-sm">°C</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
