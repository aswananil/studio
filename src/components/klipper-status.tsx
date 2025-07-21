'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Status = 'Ready' | 'Reconnecting' | 'Disconnected';

const statusConfig: { [key in Status]: { color: string; pulse: boolean; text: string } } = {
  Ready: { color: 'bg-green-500', pulse: false, text: 'Klipper Ready' },
  Reconnecting: { color: 'bg-yellow-500', pulse: true, text: 'Reconnecting...' },
  Disconnected: { color: 'bg-red-500', pulse: true, text: 'Disconnected' },
};

export default function KlipperStatus() {
  const [status, setStatus] = useState<Status>('Ready');

  useEffect(() => {
    const statuses: Status[] = ['Ready', 'Ready', 'Ready', 'Reconnecting', 'Disconnected'];
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setStatus(statuses[currentIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { color, pulse, text } = statusConfig[status];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg glassmorphic">
      <span
        className={cn(
          'w-3 h-3 rounded-full',
          color,
          pulse && 'animate-pulse'
        )}
      />
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
