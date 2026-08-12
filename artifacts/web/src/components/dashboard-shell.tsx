import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Grid2X2,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Tractor,
  X,
} from 'lucide-react';
import { FarmMark } from '@/components/farm-mark';

type UserProfile = {
  name: string;
  farmName: string;
  location: string;
};

type DashboardShellProps = {
  user: UserProfile;
  children: React.ReactNode;
  active?: 'overview' | 'marketplace';
  onSignOut: () => void;
};

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: Grid2X2, key: 'overview' as const },
  { label: 'Marketplace', href: '/marketplace', icon: Tractor, key: 'marketplace' as const },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function DashboardShell({
  user,
  children,
  active = 'overview',
  onSignOut,
}: DashboardShellProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userInitials = initials(user.name);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="dashboard-app">
      <aside className={`dashboard-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" onClick={closeMobile} aria-label="FarmShare overview">
              <FarmMark />
            </Link>
            <button
              type="button"
              className="mobile-close"
              onClick={closeMobile}
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>

          <button type="button" className="profile-switcher" aria-label="Current farm profile">
            <span className="avatar avatar-large">{userInitials}</span>
            <span className="min-w-0 text-left">
              <strong>{user.name}</strong>
              <small>{user.farmName}</small>
            </span>
            <ChevronDown className="ml-auto size-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        <div className="sidebar-nav-wrap">
          <p className="sidebar-label">Workspace</p>
          <nav className="sidebar-nav" aria-label="Workspace navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key || location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`sidebar-link ${isActive ? 'is-active' : ''}`}
                  data-testid={`link-${item.key}`}
                >
                  <Icon className="size-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button type="button" className="sidebar-link sidebar-link-muted" title="Rentals are coming soon">
              <CalendarDays className="size-[18px]" strokeWidth={1.8} />
              <span>My rentals</span>
            </button>
            <button type="button" className="sidebar-link sidebar-link-muted" title="Messages are coming soon">
              <MessageCircle className="size-[18px]" strokeWidth={1.8} />
              <span>Messages</span>
              <span className="nav-badge">2</span>
            </button>
            <button type="button" className="sidebar-link sidebar-link-muted" title="Settings are coming soon">
              <Settings className="size-[18px]" strokeWidth={1.8} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="support-card">
            <span className="support-icon">
              <CircleHelp className="size-4" />
            </span>
            <strong>Need a hand?</strong>
            <p>Visit our help center</p>
            <button type="button">Get support <span aria-hidden="true">↗</span></button>
          </div>
          <button type="button" className="sign-out-link" onClick={onSignOut} data-testid="button-sign-out">
            <LogOut className="size-[17px]" />
            Sign out
          </button>
          <p className="sidebar-legal">FarmShare v1.0 · Terms · Privacy</p>
        </div>
      </aside>

      {mobileOpen && <button type="button" className="sidebar-scrim" onClick={closeMobile} aria-label="Close navigation" />}

      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="size-5" />
            </button>
            <div className="breadcrumbs" aria-label="Breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{active === 'marketplace' ? 'Marketplace' : 'Overview'}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-button notification-button" aria-label="Notifications">
              <Bell className="size-[19px]" strokeWidth={1.8} />
              <span className="notification-count">3</span>
            </button>
            <button type="button" className="top-profile">
              <span className="avatar">{userInitials}</span>
              <span className="hidden text-left sm:block">
                <strong>{user.name}</strong>
                <small>Farm owner</small>
              </span>
              <ChevronDown className="hidden size-4 text-[hsl(var(--muted-foreground))] sm:block" />
            </button>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}