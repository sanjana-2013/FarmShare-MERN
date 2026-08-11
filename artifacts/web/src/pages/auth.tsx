import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';
import { ArrowRight, MapPin, ShieldCheck, Sprout, Tractor, UsersRound } from 'lucide-react';
import { useHealthCheck, useLogIn, useSignUp } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { FarmMark } from '@/components/farm-mark';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});
const signupSchema = z.object({
  name: z.string().min(2, 'Tell us your name.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  farmName: z.string().min(2, 'Give your farm a name.'),
  location: z.string().min(2, 'Add your town or region.'),
});
type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

function errorMessage(error: unknown) {
  const data = (error as { data?: { error?: string } } | undefined)?.data;
  return data?.error ?? (error instanceof Error ? error.message : 'Something went wrong. Try again.');
}

function AuthScenery() {
  return (
    <div className="relative hidden min-h-[100dvh] overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] lg:flex lg:w-[47%] lg:flex-col lg:justify-between lg:p-12">
      <div className="absolute -right-24 -top-24 size-80 rounded-full border border-[hsl(var(--primary-foreground)/.14)]" />
      <div className="absolute -right-3 top-16 size-56 rounded-full border border-[hsl(var(--primary-foreground)/.1)]" />
      <div className="absolute bottom-[-13rem] left-[-7rem] size-[31rem] rounded-full border-[36px] border-[hsl(var(--accent)/.18)]" />
      <div className="absolute bottom-10 right-16 size-24 rotate-12 border-l border-t border-[hsl(var(--accent)/.38)]" />
      <FarmMark />
      <div className="relative max-w-md">
        <p className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-[hsl(var(--accent))]"><span className="size-1.5 rounded-full bg-[hsl(var(--accent))]" /> A better way to work the land</p>
        <h1 className="font-serif text-6xl leading-[.98] tracking-[-.055em] xl:text-7xl">Good ground.<br /><span className="text-[hsl(var(--accent))]">Good neighbors.</span></h1>
        <p className="mt-7 max-w-sm text-base leading-7 text-[hsl(var(--primary-foreground)/.7)]">FarmShare is the practical home base for growers who believe a strong community makes every season more possible.</p>
      </div>
      <div className="relative grid grid-cols-3 gap-5 border-t border-[hsl(var(--primary-foreground)/.15)] pt-6">
        <div><p className="font-serif text-2xl">01</p><p className="mt-1 text-xs leading-4 text-[hsl(var(--primary-foreground)/.6)]">Meet the people<br />near your rows</p></div>
        <div><p className="font-serif text-2xl">02</p><p className="mt-1 text-xs leading-4 text-[hsl(var(--primary-foreground)/.6)]">Share what<br />you have</p></div>
        <div><p className="font-serif text-2xl">03</p><p className="mt-1 text-xs leading-4 text-[hsl(var(--primary-foreground)/.6)]">Grow more<br />together</p></div>
      </div>
    </div>
  );
}

function Field({ name, label, type = 'text', placeholder, control, testId }: { name: string; label: string; type?: string; placeholder: string; control: any; testId: string }) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-[12px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{label}</FormLabel>
        <FormControl><Input {...field} type={type} placeholder={placeholder} data-testid={testId} className="h-12 rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 text-[14px] shadow-none placeholder:text-[hsl(var(--muted-foreground)/.7)] focus-visible:ring-[hsl(var(--ring))]" /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [, setLocation] = useLocation();
  const isSignup = mode === 'signup';
  const login = useLogIn();
  const signup = useSignUp();
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const signupForm = useForm<SignupValues>({ resolver: zodResolver(signupSchema), defaultValues: { name: '', email: '', password: '', farmName: '', location: '' } });
  const activeForm = isSignup ? signupForm : loginForm;
  const mutation = isSignup ? signup : login;
  useEffect(() => {
    if (localStorage.getItem('farmshare-token')) setLocation('/dashboard');
  }, [setLocation]);

  const onLogin = (values: LoginValues) => login.mutate({ data: values }, { onSuccess: (result) => { localStorage.setItem('farmshare-token', result.token); setLocation('/dashboard'); } });
  const onSignup = (values: SignupValues) => signup.mutate({ data: values }, { onSuccess: (result) => { localStorage.setItem('farmshare-token', result.token); setLocation('/dashboard'); } });
  const error = mutation.error ? errorMessage(mutation.error) : null;

  return (
    <main className="grain flex min-h-[100dvh] bg-[hsl(var(--background))]">
      <AuthScenery />
      <section className="page-enter flex w-full flex-col lg:w-[53%]">
        <header className="flex items-center justify-between px-6 py-6 lg:hidden">
          <FarmMark />
          <Link href={isSignup ? '/login' : '/signup'} data-testid="link-mobile-auth-switch" className="text-sm font-bold text-[hsl(var(--primary))]">{isSignup ? 'Sign in' : 'Join FarmShare'}</Link>
        </header>
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
          <div className="mb-9">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[.18em] text-[hsl(var(--accent))]">{isSignup ? 'Your season starts here' : 'Welcome back, grower'}</p>
            <h2 className="font-serif text-4xl font-semibold tracking-[-.045em] text-[hsl(var(--foreground))]">{isSignup ? 'Put down roots.' : 'Back to the good work.'}</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{isSignup ? 'Create your FarmShare profile and find the people who understand your kind of work.' : 'Sign in to your FarmShare home base.'}</p>
          </div>
          <Form {...(activeForm as any)}>
            <form onSubmit={isSignup ? signupForm.handleSubmit(onSignup) : loginForm.handleSubmit(onLogin)} className="space-y-5" noValidate>
              {isSignup && <div className="grid gap-5 sm:grid-cols-2"><Field name="name" label="Your name" placeholder="Mara Ellis" control={signupForm.control} testId="input-name" /><Field name="farmName" label="Farm name" placeholder="Cedar Hollow" control={signupForm.control} testId="input-farm-name" /></div>}
              <Field name="email" label="Email address" type="email" placeholder="you@yourfarm.com" control={activeForm.control} testId="input-email" />
              <Field name="password" label="Password" type="password" placeholder="At least 8 characters" control={activeForm.control} testId="input-password" />
              {isSignup && <Field name="location" label="Location" placeholder="County, state or region" control={signupForm.control} testId="input-location" />}
              {error && <div role="alert" data-testid="status-auth-error" className="rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.08)] px-4 py-3 text-sm leading-5 text-[hsl(var(--destructive))]">{error}</div>}
              <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-auth" className="group h-12 w-full rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[3px_3px_0_hsl(var(--accent))] hover:bg-[hsl(var(--primary))]">
                {mutation.isPending ? 'Setting things up…' : isSignup ? 'Create my profile' : 'Sign in'}
                {!mutation.isPending && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
          </Form>
          <div className="mt-8 flex items-center gap-3 text-center text-sm text-[hsl(var(--muted-foreground))]"><span className="h-px flex-1 bg-[hsl(var(--border))]" /><span>{isSignup ? 'Already part of the community?' : 'New to FarmShare?'}</span><span className="h-px flex-1 bg-[hsl(var(--border))]" /></div>
          <Link href={isSignup ? '/login' : '/signup'} data-testid="link-auth-switch" className="mt-4 flex h-11 items-center justify-center rounded-xl border border-[hsl(var(--border))] text-sm font-bold text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--muted)/.6)]">{isSignup ? 'Sign in instead' : 'Create a free profile'}</Link>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-[hsl(var(--muted-foreground))]"><ShieldCheck className="size-3.5" /> Your details stay yours. FarmShare is built for real communities.</p>
        </div>
      </section>
    </main>
  );
}

export function Landing() {
  const [, setLocation] = useLocation();
  const health = useHealthCheck();
  return (
    <main className="grain min-h-[100dvh] bg-[hsl(var(--background))]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <FarmMark />
        <nav className="flex items-center gap-3"><Link href="/login" data-testid="link-landing-login" className="rounded-xl px-4 py-2 text-sm font-bold text-[hsl(var(--primary))]">Sign in</Link><Button onClick={() => setLocation('/signup')} data-testid="button-landing-join" className="rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">Join the field <ArrowRight className="size-4" /></Button></nav>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:pb-32 lg:pt-20">
        <div className="rise-in">
          <p className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-[hsl(var(--accent))]"><span className="size-2 rounded-full bg-[hsl(var(--accent))]" /> A shared future for independent farms</p>
          <h1 className="max-w-3xl font-serif text-[clamp(3.7rem,9vw,7.7rem)] leading-[.87] tracking-[-.07em] text-[hsl(var(--foreground))]">The land is <em className="text-[hsl(var(--primary))]">better</em><br />together.</h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-[hsl(var(--muted-foreground))]">A home base for farmers and small agricultural communities to share knowledge, build trust, and make the most of what is already close by.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => setLocation('/signup')} data-testid="button-landing-start" size="lg" className="h-12 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[4px_4px_0_hsl(var(--accent))]">Create your profile <ArrowRight className="size-4" /></Button><div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] px-4 text-xs text-[hsl(var(--muted-foreground))]"><span className="size-2 rounded-full bg-[hsl(var(--primary))]" />{health.isLoading ? 'Checking the gates…' : health.isError ? 'Taking a quiet moment' : 'The gates are open'}</div></div>
        </div>
        <div className="rise-in delay-2 relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] shadow-[10px_10px_0_hsl(var(--secondary))] sm:min-h-[500px] sm:p-10">
          <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[hsl(var(--accent)/.88)] [clip-path:polygon(0_30%,15%_20%,31%_31%,46%_13%,63%_28%,79%_12%,100%_24%,100%_100%,0_100%)]" />
          <div className="absolute right-8 top-10 size-24 rounded-full bg-[hsl(var(--secondary))] shadow-[0_0_0_14px_hsl(var(--secondary)/.12)]" />
          <div className="relative flex justify-between"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary-foreground)/.65)]">Field note / 001</span><Sprout className="size-5 text-[hsl(var(--accent))]" /></div>
          <div className="absolute bottom-9 left-7 right-7 z-10 sm:bottom-10 sm:left-10"><p className="max-w-sm font-serif text-4xl leading-[.98] tracking-[-.04em] sm:text-5xl">There is plenty<br />to go around.</p><div className="mt-6 flex items-center gap-3 text-xs text-[hsl(var(--primary-foreground)/.75)]"><span className="flex -space-x-2"><span className="flex size-7 items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] text-[10px] font-bold text-[hsl(var(--foreground))]">ME</span><span className="flex size-7 items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--accent))] text-[10px] font-bold">JR</span><span className="flex size-7 items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary-foreground))] text-[10px] font-bold text-[hsl(var(--primary))]">+</span></span> Built for the folks next door</div></div>
        </div>
      </section>
      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted)/.35)]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8 lg:px-12"><div className="flex gap-4"><UsersRound className="mt-1 size-5 text-[hsl(var(--accent))]" /><div><h3 className="font-serif text-xl">People, not profiles</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Know who is growing around you, and why they care.</p></div></div><div className="flex gap-4"><Tractor className="mt-1 size-5 text-[hsl(var(--accent))]" /><div><h3 className="font-serif text-xl">Practical by design</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">A place for useful things, not another feed to keep up with.</p></div></div><div className="flex gap-4"><MapPin className="mt-1 size-5 text-[hsl(var(--accent))]" /><div><h3 className="font-serif text-xl">Close to home</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Built around the trust that starts with a shared horizon.</p></div></div></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><FarmMark compact /><span>FarmShare / For the long season</span></footer>
    </main>
  );
}