import ActuatorControls from './actuator-controls';
import Diagnostics from './diagnostics';
import { Separator } from './ui/separator';

export default function ControlsPanel() {
  return (
    <aside className="w-full md:w-96 bg-black/20 p-4 md:p-6 border-l border-gray-500/30 overflow-y-auto">
      <div className="flex flex-col gap-6 h-full">
        <h2 className="text-2xl font-headline text-foreground">Control &amp; Diagnostics</h2>
        <Separator className="bg-primary/30" />
        <ActuatorControls />
        <Diagnostics />
      </div>
    </aside>
  );
}
