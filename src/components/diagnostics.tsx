'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Cpu, Thermometer, Fan } from 'lucide-react';

export default function Diagnostics() {
  const [mcuTemp, setMcuTemp] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setMcuTemp((prev) => {
        const change = Math.random() * 4 - 2;
        const newTemp = prev + change;
        if (newTemp < 30) return 30;
        if (newTemp > 85) return 85;
        return newTemp;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const tempColor = mcuTemp > 75 ? 'text-destructive' : mcuTemp > 60 ? 'text-yellow-400' : 'text-primary';

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Diagnostics</CardTitle>
        <CardDescription>Real-time system parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            <Label>MCU Temperature</Label>
          </div>
          <span className={cn('font-bold', tempColor)}>{mcuTemp.toFixed(1)}°C</span>
        </div>
        <Progress value={mcuTemp} className="h-2 [&>div]:bg-primary" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            <Label>TMC Drivers</Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="font-medium">OK</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            <Fan className="w-5 h-5" />
            <Label>Cooling Fan</Label>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
