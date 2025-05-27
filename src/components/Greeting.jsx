import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settings';

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const store = useSettingsStore();

  useEffect(() => {
    const hour = new Date().getHours();
    let partOfDay;
    if (hour < 12) {
      partOfDay = 'Good morning';
    } else if (hour < 18) {
      partOfDay = 'Good afternoon';
    } else {
      partOfDay = 'Good evening';
    }

    // Use username from the store
    setGreeting(store.username ? `${partOfDay}, ${store.username}.` : partOfDay);
  }, [store.username]);

  return <div className="text-4xl font-medium text-white mb-6">{greeting}</div>;
};

export default Greeting;
