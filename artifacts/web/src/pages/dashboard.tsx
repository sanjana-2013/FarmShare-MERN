import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, CalendarDays, CheckCircle2, LogOut, MapPin, Sprout, UsersRound } from 'lucide-react';
import { useGetCurrentUser, getGetCurrentUserQueryKey } from '@workspace/api-client-react';
import { FarmMark } from '@/components/farm-mark';

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const query = useGetCurrentUser({ query: { enabled: !!localStorage.getItem('farmshare-token'), queryKey: getGetCurrentUserQueryKey() } });
  const user = query.data;

  useEffect(() => {
    if (query.isError || (!query.isLoading && !user)) {
      localStorage.removeItem('farmshare-token');
      setLocation('/login');
    }
  }, [query.isError, query.isLoading, user, setLocation]);

  const signOut = () => {
    localStorage.removeItem('farmshare-token');
    setLocation('/login');
  };

  if (query.isLoading || !user) {
    return <main className="grain min-h-[100dvh] bg-[hsl(var(--background))] p-6"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-10 w-32 rounded-lg bg-[hsl(var(--muted))]" /><div className="mt-24 h-12 max-w-sm rounded-lg bg-[hsl(var(--muted))]" /><div className="mt-5 h-5 max-w-md rounded bg-[hsl(var(--muted))]" /><div className="mt-14 grid gap-5 md:grid-cols-3"><div className="h-44 rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-44 rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-44 rounded-2xl bg-[hsl(var(--muted))]" /></div></div></main>;
  }

  return (
    <main className="grain min-h-[100dvh] bg-[hsl(var(--background))]">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.86)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <FarmMark />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-bold" data-testid="text-nav-user">{user.name}</p><p className="font-mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Field member</p></div>
            <div className="flex size-10 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-xs font-bold text-[hsl(var(--foreground))]" data-testid="avatar-user">{initials(user.name)}</div>
            <button onClick={signOut} data-testid="button-sign-out" aria-label="Sign out" className="ml-1 rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"><LogOut className="size-4" /></button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <section className="page-enter relative overflow-hidden rounded-[1.7rem] bg-[hsl(var(--primary))] px-6 py-9 text-[hsl(var(--primary-foreground))] sm:px-10 sm:py-12">
          <div className="absolute -right-16 -top-24 size-64 rounded-full border-[28px] border-[hsl(var(--accent)/.23)]" />
          <div className="absolute bottom-[-4rem] right-[24%] size-32 rounded-full bg-[hsl(var(--accent)/.14)]" />
          <div className="relative max-w-xl">
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]"><Sprout className="size-3.5" /> Your FarmShare home base</p>
            <h1 className="font-serif text-4xl leading-[.98] tracking-[-.05em] sm:text-6xl" data-testid="heading-dashboard">Good to see you, {user.name.split(' ')[0]}.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--primary-foreground)/.72)]">Your profile is planted. We are preparing the tools that will help nearby growers make more of what they have.</p>
          </div>
        </section>
        <section className="mt-8 grid gap-5 md:grid-cols-[1.1fr_.9fr]">
          <article className="rise-in delay-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">Your profile</p><h2 className="mt-2 font-serif text-3xl tracking-[-.04em]" data-testid="text-profile-name">{user.farmName}</h2></div><div className="flex size-11 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--primary))]"><Sprout className="size-5" /></div></div>
            <div className="mt-7 space-y-4 border-t border-[hsl(var(--border))] pt-5"><div className="flex items-center gap-3 text-sm"><UsersRound className="size-4 text-[hsl(var(--accent))]" /><span data-testid="text-profile-user">{user.name}</span></div><div className="flex items-center gap-3 text-sm"><MapPin className="size-4 text-[hsl(var(--accent))]" /><span data-testid="text-profile-location">{user.location}</span></div><div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]"><CheckCircle2 className="size-4 text-[hsl(var(--primary))]" /><span data-testid="status-profile-ready">Profile ready to grow</span></div></div>
          </article>
          <article className="rise-in delay-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.48)] p-6 sm:p-8">
            <CalendarDays className="size-6 text-[hsl(var(--primary))]" /><p className="mt-8 font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Coming soon</p><h2 className="mt-2 font-serif text-3xl leading-none tracking-[-.04em]">Your local<br />resource shelf.</h2><p className="mt-4 text-sm leading-6 text-[hsl(var(--foreground)/.68)]">Soon you will be able to see what your community has to share, right when you need it.</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">We are tending the details <ArrowRight className="size-3.5" /></span>
          </article>
        </section>
        <section className="rise-in delay-3 mt-5 rounded-2xl border border-dashed border-[hsl(var(--border))] p-6 sm:flex sm:items-center sm:justify-between sm:p-8"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">The first furrow</p><h2 className="mt-2 font-serif text-2xl tracking-[-.03em]">You are early. That matters.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">Keep your profile close. When the first sharing tools arrive, you will be ready to make your next good connection.</p></div><Link href="/" data-testid="link-dashboard-home" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] sm:mt-0">About FarmShare <ArrowRight className="size-4" /></Link></section>
      </div>
    </main>
  );
}