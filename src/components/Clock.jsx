import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settings';

export default function Clock() {
  const { clockFormat } = useSettingsStore();
  const [time, setTime] = useState({ h: '00', m: '00', period: '' });

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      let period = '';

      if (clockFormat === '12h') {
        period = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // Handle midnight
      }
      
      setTime({ h: String(h).padStart(2, '0'), m, period });
    }

    updateTime();
    // Update every second to keep the clock precise, especially if seconds were to be added later
    const intervalId = setInterval(updateTime, 1000); 
    return () => clearInterval(intervalId);
  }, [clockFormat]);

  return (
    <div className="card backdrop-blur-sm bg-base-100/70 shadow-xl rounded-2xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-6xl font-semibold">
          <span>{time.h}</span>:<span>{time.m}</span>
          {clockFormat === '12h' && <span className="text-2xl ml-2">{time.period}</span>}
        </h2>
      </div>
    </div>
  );
}