'use client';

import { Sprout, Bot } from 'lucide-react';

const statusMessages = [
  '🌿 Initializing GraftOS...',
  'Connecting to Moonraker...',
  'Starting MCU diagnostics...',
  'Preparing actuator array...',
];

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground font-body">
      <div className="flex flex-col items-center gap-6 text-center">
        <Sprout className="w-24 h-24 text-primary animate-sprout-glow" />
        <h1 className="text-4xl font-headline text-primary">GraftVision</h1>
        <div className="mt-4 space-y-2 text-lg text-muted-foreground">
          {statusMessages.map((msg, index) => (
            <p key={index} className={`opacity-0 fade-in-${index + 1}`}>
              {msg}
            </p>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 flex items-center gap-2 opacity-0 fade-in-logo">
        <Bot className="w-8 h-8 text-primary/70" />
        <p className="text-2xl font-headline text-primary/70">Grafito</p>
      </div>
    </div>
  );
}
