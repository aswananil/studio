'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getMoonrakerClient, ConnectionState } from '@/lib/services/moonraker';

const statusConfig: { [key in ConnectionState]: { color: string; pulse: boolean; text: string } } = {
  [ConnectionState.CONNECTED]: { color: 'bg-green-500', pulse: false, text: 'Klipper Ready' },
  [ConnectionState.RECONNECTING]: { color: 'bg-yellow-500', pulse: true, text: 'Reconnecting...' },
  [ConnectionState.DISCONNECTED]: { color: 'bg-red-500', pulse: true, text: 'Disconnected' },
  [ConnectionState.CONNECTING]: { color: 'bg-yellow-500', pulse: true, text: 'Connecting...' },
  [ConnectionState.ERROR]: { color: 'bg-red-500', pulse: false, text: 'Connection Error' },
};

export default function KlipperStatus() {
  const [status, setStatus] = useState<ConnectionState>(ConnectionState.DISCONNECTED);

  useEffect(() => {
    const client = getMoonrakerClient();
    
    const handleConnectionChange = (newState: ConnectionState) => {
      setStatus(newState);
    };

    client.addConnectionCallback(handleConnectionChange);

    return () => {
      client.removeConnectionCallback(handleConnectionChange);
    };
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
