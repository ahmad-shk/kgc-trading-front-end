import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  startTimestamp: string | number | Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const endTime = new Date(startTimestamp).getTime() + 5 * 60 * 1000; // 5 min after start
    return Math.max(0, endTime - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const endTime = new Date(startTimestamp).getTime() + 5 * 60 * 1000;
      const remaining = Math.max(0, endTime - Date.now());

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [startTimestamp]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
};

export default CountdownTimer;
