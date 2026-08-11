import { Sprout } from 'lucide-react';

export function FarmMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" data-testid="brand-farmshare">
      <span className="flex size-10 items-center justify-center rounded-[13px] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[3px_3px_0_hsl(var(--primary))]">
        <Sprout className="size-5" strokeWidth={2.25} />
      </span>
      {!compact && <span className="font-serif text-[1.35rem] font-bold tracking-[-0.03em]">FarmShare</span>}
    </div>
  );
}