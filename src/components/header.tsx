import KlipperStatus from './klipper-status';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-headline text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        GraftVision
      </h1>
      <KlipperStatus />
    </header>
  );
}
