'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function CameraFeed() {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <Card className="flex-1 flex flex-col glassmorphic overflow-hidden">
      <CardContent className="relative p-0 flex-1">
        <Image
          src="https://placehold.co/1280x720/222/333"
          alt="Live camera feed"
          data-ai-hint="plant stem"
          width={1280}
          height={720}
          className="object-cover w-full h-full"
          priority
        />
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            showOverlay ? 'opacity-100' : 'opacity-0'
          )}
        >
          <svg
            viewBox="0 0 400 300"
            className="w-2/3 h-2/3 max-w-[400px] max-h-[300px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M50,2 L2,2 L2,50"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M350,2 L398,2 L398,50"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M50,298 L2,298 L2,250"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M350,298 L398,298 L398,250"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="125"
              y="75"
              width="150"
              height="150"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="animate-pulse"
              fill="hsla(var(--primary) / 0.1)"
            />
            <text
              x="200"
              y="245"
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="12"
              fontFamily="Orbitron"
              className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
            >
              STEM DETECTED
            </text>
          </svg>
        </div>

        <div className="absolute top-4 right-4 flex items-center space-x-2 p-2 rounded-lg bg-black/50 backdrop-blur-sm">
          <Label htmlFor="overlay-switch" className="text-sm">
            Overlays
          </Label>
          <Switch
            id="overlay-switch"
            checked={showOverlay}
            onCheckedChange={setShowOverlay}
          />
        </div>
      </CardContent>
    </Card>
  );
}
