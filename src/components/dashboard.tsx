import Header from '@/components/header';
import CameraFeed from '@/components/camera-feed';
import ControlsPanel from '@/components/controls-panel';

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
        <Header />
        <CameraFeed />
      </main>
      <ControlsPanel />
    </div>
  );
}
