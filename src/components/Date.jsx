import { useEffect, useState } from 'react';

function formatDate() {
  const today = new Date();
  const weekDay = today.toLocaleString('en-US', { weekday: 'long' });
  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'long' });
  return `${weekDay}, ${month} ${day}`;
}

export default function DateDisplay() {
  const [dateString, setDateString] = useState(formatDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateString(formatDate());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(intervalId);
  }, []);

  return <p className="text-xl text-gray-300">{dateString}</p>;
}
