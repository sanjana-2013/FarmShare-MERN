import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Tractor,
  TrendingUp,
} from 'lucide-react';
import { useGetCurrentUser, getGetCurrentUserQueryKey } from '@workspace/api-client-react';
import { DashboardShell } from '@/components/dashboard-shell';

type Equipment = {
  id: number;
  name: string;
  type: 'Tractor' | 'Harvester' | 'Trailer';
  location: string;
  owner: string;
  ownerInitials: string;
  price: number;
  rating: number;
  image: string;
  tone: string;
};

const equipment: Equipment[] = [
  {
    id: 1,
    name: 'John Deere 5075E',
    type: 'Tractor',
    location: 'Lincoln, Nebraska',
    owner: 'Green Valley Co-op',
    ownerInitials: 'GR',
    price: 185,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=85',
    tone: 'sage',
  },
  {
    id: 2,
    name: 'New Holland CR8.90',
    type: 'Harvester',
    location: 'Ames, Iowa',
    owner: 'Prairie Harvests',
    ownerInitials: 'PR',
    price: 320,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=85',
    tone: 'sky',
  },
  {
    id: 3,
    name: 'Massey Ferguson 8S',
    type: 'Tractor',
    location: 'Des Moines, Iowa',
    owner: 'Oak Ridge Farms',
    ownerInitials: 'OA',
    price: 210,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=900&q=85',
    tone: 'wheat',
  },
  {
    id: 4,
    name: 'Kuhn Discover XL',
    type: 'Trailer',
    location: 'Omaha, Nebraska',
    owner: 'North Star Farm',
    ownerInitials: 'NS',
    price: 95,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=900&q=85',
    tone: 'clay',
  },
];

const rentals = [
  { name: 'John Deere 5075E', detail: 'Tractor · Lincoln, Nebraska', dates: 'Oct 24 – 26', days: '3 days', amount: '$555', status: 'Confirmed', image: equipment[0].image },
  { name: 'New Holland CR8.90', detail: 'Harvester · Ames, Iowa', dates: 'Nov 02 – 04', days: '2 days', amount: '$640', status: 'Confirmed', image: equipment[1].image },
  { name: 'Massey Ferguson 8S', detail: 'Tractor · Des Moines, Iowa', dates: 'Nov 12 – 15', days: '4 days', amount: '$840', status: 'Pending', image: equipment[2].image },
];

function LoadingDashboard() {
  return (
    <main className="dashboard-loading">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-hero" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </main>
  );
}

function EquipmentCard({ item }: { item: Equipment }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="equipment-card">
      <div className={`equipment-image ${item.tone}`}>
        <img src={item.image} alt="" />
        <span className="availability-pill"><span /> Available</span>
        <button
          type="button"
          className={`bookmark-button ${saved ? 'is-saved' : ''}`}
          onClick={() => setSaved(!saved)}
          aria-label={saved ? `Remove ${item.name} from saved equipment` : `Save ${item.name}`}
        >
          <Bookmark className="size-[17px]" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="equipment-body">
        <div className="equipment-topline">
          <span className="equipment-tag">{item.type}</span>
          <span className="rating"><Star className="size-3.5" fill="currentColor" /> {item.rating}</span>
        </div>
        <h3>{item.name}</h3>
        <p className="equipment-location"><MapPin className="size-3.5" /> {item.location}</p>
        <div className="equipment-owner">
          <span className="owner-avatar">{item.ownerInitials}</span>
          <span>Shared by <strong>{item.owner}</strong></span>
        </div>
        <div className="equipment-footer">
          <span className="equipment-price">${item.price}<small>/ day</small></span>
          <button type="button" className="dark-button">View details</button>
        </div>
      </div>
    </article>
  );
}

function StatCard({ icon, label, value, note, accent }: { icon: React.ReactNode; label: string; value: string; note: string; accent: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${accent}`}>{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span><TrendingUp className="size-3" /> {note}</span>
    </article>
  );
}

function MiniCalendar() {
  const days = [
    ['', '', 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, '', ''],
  ];
  return (
    <div className="mini-calendar">
      <div className="calendar-month"><button type="button" aria-label="Previous month"><ChevronLeft className="size-4" /></button><strong>October 2024</strong><button type="button" aria-label="Next month"><ChevronRight className="size-4" /></button></div>
      <div className="calendar-week"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
      <div className="calendar-days">
        {days.flatMap((week, weekIndex) => week.map((day, dayIndex) => (
          <span key={`${weekIndex}-${dayIndex}`} className={day === 24 ? 'is-today' : [25, 26].includes(day as number) ? 'is-range' : ''}>{day}</span>
        )))}
      </div>
    </div>
  );
}

function DashboardOverview({ user }: { user: UserProfile }) {
  return (
    <>
      <section className="page-heading overview-heading">
        <div>
          <p className="eyebrow">Tuesday, October 22, 2024</p>
          <h1>Good morning, {user.name.split(' ')[0]} <span className="heading-spark">✦</span></h1>
          <p className="heading-copy">Here’s what’s happening across your farm network today.</p>
        </div>
        <Link href="/marketplace" className="dark-button heading-action"><Search className="size-4" /> Find equipment</Link>
      </section>

      <section className="hero-banner">
        <div className="hero-sun" />
        <div className="hero-hill hero-hill-back" />
        <div className="hero-hill hero-hill-front" />
        <div className="hero-copy">
          <span className="hero-kicker"><TrendingUp className="size-3.5" /> Community impact</span>
          <h2>Share more.<br /><em>Grow together.</em></h2>
          <p>Make your idle equipment work harder for your community — and earn while you do it.</p>
          <Link href="/marketplace" className="light-button">Explore the marketplace <ArrowUpRight className="size-4" /></Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="Farm statistics">
        <StatCard icon={<CalendarDays className="size-5" />} label="Active rentals" value="3" note="2 due this week" accent="green" />
        <StatCard icon={<Tractor className="size-5" />} label="Shared equipment" value="8" note="+ $1,240 this month" accent="blue" />
        <StatCard icon={<Star className="size-5" />} label="Your rating" value="4.9" note="From 24 reviews" accent="gold" />
        <StatCard icon={<ShieldCheck className="size-5" />} label="Trust score" value="98%" note="Top 5% of owners" accent="peach" />
      </section>

      <section className="content-grid">
        <div className="panel rentals-panel">
          <div className="panel-heading">
            <div><h2>Recently rented</h2><p>Keep an eye on your upcoming equipment</p></div>
            <button type="button" className="text-link">View all <ArrowUpRight className="size-3.5" /></button>
          </div>
          <div className="rental-table">
            <div className="rental-table-head"><span>Equipment</span><span>Dates</span><span>Status</span><span>Amount</span><span /></div>
            {rentals.map((rental) => (
              <div className="rental-row" key={rental.name}>
                <div className="rental-equipment"><img src={rental.image} alt="" /><span><strong>{rental.name}</strong><small>{rental.detail}</small></span></div>
                <div><strong>{rental.dates}</strong><small>{rental.days}</small></div>
                <span className={`status-pill ${rental.status.toLowerCase()}`}>{rental.status}</span>
                <div><strong>{rental.amount}</strong><small>USD</small></div>
                <button type="button" className="row-more" aria-label={`More options for ${rental.name}`}>•••</button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel upcoming-panel">
          <div className="panel-heading"><div><h2>Upcoming</h2><p>Next 7 days</p></div><CalendarDays className="panel-heading-icon size-[19px]" /></div>
          <MiniCalendar />
          <div className="next-rental">
            <div className="next-rental-image"><img src={rentals[0].image} alt="" /></div>
            <div><strong>John Deere 5075E</strong><p>Pickup in 2 days</p></div>
            <ArrowUpRight className="ml-auto size-4" />
          </div>
        </div>
      </section>

      <MarketplacePreview />
    </>
  );
}

function MarketplacePreview() {
  return (
    <section className="marketplace-preview">
      <div className="section-heading">
        <div><p className="eyebrow">Good equipment, close by</p><h2>Popular near you</h2><p>Reliable equipment, shared by your neighbors</p></div>
        <Link href="/marketplace" className="outline-button"><SlidersHorizontal className="size-4" /> Filters</Link>
      </div>
      <div className="equipment-grid">
        {equipment.slice(0, 3).map((item) => <EquipmentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}

function Marketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All types');
  const [location, setLocationFilter] = useState('Any location');
  const [sort, setSort] = useState('Recommended');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEquipment = useMemo(() => {
    const query = search.toLowerCase().trim();
    const visible = equipment.filter((item) => {
      const matchesSearch = !query || [item.name, item.type, item.location, item.owner].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = category === 'All types' || item.type === category;
      const matchesLocation = location === 'Any location' || item.location.includes(location);
      return matchesSearch && matchesCategory && matchesLocation;
    });
    return [...visible].sort((a, b) => sort === 'Price: low to high' ? a.price - b.price : sort === 'Price: high to low' ? b.price - a.price : b.rating - a.rating);
  }, [category, location, search, sort]);

  return (
    <>
      <section className="page-heading marketplace-heading">
        <div><p className="eyebrow">Marketplace</p><h1>Find what you need.</h1><p className="heading-copy">Good equipment, fair prices, and neighbors you can trust.</p></div>
        <button type="button" className="dark-button heading-action"><span className="text-lg leading-none">+</span> Share equipment</button>
      </section>
      <section className={`marketplace-controls ${showFilters ? 'show-mobile-filter' : ''}`}>
        <label className="search-field"><Search className="size-[19px]" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search equipment, farms, or locations" aria-label="Search equipment, farms, or locations" /></label>
        <label className="select-field"><Filter className="size-[16px]" /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by type"><option>All types</option><option>Tractor</option><option>Harvester</option><option>Trailer</option></select><ChevronDown className="pointer-events-none size-4" /></label>
        <label className="select-field"><MapPin className="size-[16px]" /><select value={location} onChange={(event) => setLocationFilter(event.target.value)} aria-label="Filter by location"><option>Any location</option><option>Nebraska</option><option>Iowa</option></select><ChevronDown className="pointer-events-none size-4" /></label>
        <button type="button" className="mobile-filter-button outline-button" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="size-4" /> Filters</button>
      </section>
      <section className="marketplace-results">
        <div className="results-toolbar"><p><strong>{filteredEquipment.length}</strong> resources available near you</p><label className="sort-field"><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort resources"><option>Recommended</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown className="size-4" /></label></div>
        {filteredEquipment.length ? <div className="equipment-grid marketplace-grid">{filteredEquipment.map((item) => <EquipmentCard key={item.id} item={item} />)}</div> : <div className="empty-marketplace"><CircleDollarSign className="size-6" /><h2>No equipment found</h2><p>Try a different search or broaden your filters.</p></div>}
      </section>
    </>
  );
}

type UserProfile = {
  name: string;
  farmName: string;
  location: string;
};

export default function Dashboard({ page = 'overview' }: { page?: 'overview' | 'marketplace' }) {
  const [, setLocation] = useLocation();
  const query = useGetCurrentUser({
    query: {
      enabled: !!localStorage.getItem('farmshare-token'),
      queryKey: getGetCurrentUserQueryKey(),
    },
  });
  const user = query.data;

  useEffect(() => {
    if (query.isError || (!query.isLoading && !user)) {
      localStorage.removeItem('farmshare-token');
      setLocation('/login');
    }
  }, [query.isError, query.isLoading, user, setLocation]);

  if (query.isLoading || !user) return <LoadingDashboard />;

  const signOut = () => {
    localStorage.removeItem('farmshare-token');
    setLocation('/login');
  };

  const profile: UserProfile = {
    name: user.name,
    farmName: user.farmName,
    location: user.location,
  };

  return (
    <DashboardShell user={profile} active={page} onSignOut={signOut}>
      {page === 'marketplace' ? <Marketplace /> : <DashboardOverview user={profile} />}
    </DashboardShell>
  );
}