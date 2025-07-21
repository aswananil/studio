'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  Minus,
  Plus,
  Scissors,
  Eye,
  RefreshCw,
  Sparkles,
  OctagonX,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import AiGraftingModal from './ai-grafting-modal';

export default function ActuatorControls() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (action: string) => {
    toast({
      title: 'Action Triggered',
      description: `${action}`,
    });
  };

  const handleEmergencyStop = () => {
    toast({
      variant: 'destructive',
      title: 'EMERGENCY STOP',
      description: 'All systems halted immediately.',
    });
  };

  const axisControls = ['X', 'Y', 'Z'].map((axis) => (
    <div key={axis} className="flex items-center justify-between">
      <span className="font-bold text-lg w-8">{axis}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="w-12 h-12 glassmorphic">
          <Minus />
        </Button>
        <Button variant="outline" size="icon" className="w-12 h-12 glassmorphic">
          <Plus />
        </Button>
      </div>
    </div>
  ));

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Actuator Control</CardTitle>
          <CardDescription>Manual XYZ movement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">{axisControls}</div>
          <Separator className="bg-primary/30" />
          <div>
            <Label className="mb-2 block">Step Distance (mm)</Label>
            <RadioGroup defaultValue="5" className="flex gap-4">
              {['1', '5', '10'].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={`step-${val}`} />
                  <Label htmlFor={`step-${val}`}>{val}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Separator className="bg-primary/30" />
          <div className="grid grid-cols-2 gap-4">
            <Button className="glassmorphic" onClick={() => handleAction('Homing XYZ')}>
              <Home /> Home XYZ
            </Button>
            <Button className="glassmorphic" onClick={() => handleAction('Aligning to Stem')}>
              <Eye /> Align to Stem
            </Button>
            <Button className="bg-primary/80 text-primary-foreground hover:bg-primary" onClick={() => setIsModalOpen(true)}>
              <Sparkles /> Start Graft
            </Button>
             <Button className="glassmorphic" onClick={() => handleAction('Restarting Firmware')}>
              <RefreshCw /> Firmware Restart
            </Button>
          </div>
           <Button variant="destructive" className="w-full text-lg py-6" onClick={handleEmergencyStop}>
              <OctagonX /> Emergency Stop
            </Button>
        </CardContent>
      </Card>
      <AiGraftingModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
