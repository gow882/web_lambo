import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ChevronRight, Facebook, Twitter, Instagram, Youtube,
  User, LogOut, Lock, Eye, EyeOff, ChevronDown,
  Gauge, Zap, Wind, Trophy, Flag, Clock, ArrowRight,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import lamboBullImg from '@/imports/Screenshot_2026-07-17_103340.png';

// ─── Lamborghini Official Logo ────────────────────────────────────────────────
const LamboBullLogo = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <ImageWithFallback
    src={lamboBullImg}
    alt="Lamborghini bull logo"
    width={size}
    height={size}
    className={`object-contain ${className}`}
    style={{ width: size, height: size }}
  />
);

const LamboWordmark = ({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes: Record<string, string> = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <span className={`font-black uppercase text-white ${sizes[size]} ${className}`}
      style={{ letterSpacing: '0.12em' }}>
      Lamborghini
    </span>
  );
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
interface AuthUser { email: string; name: string; password: string; }

const DEMO_USERS: AuthUser[] = [
  { email: 'owner@veloce.it', name: 'Marco Rossi', password: 'Lamborghini2026!' },
  { email: 'demo@veloce.it', name: 'Demo User', password: 'demo1234' },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
const GoldAccentBar = () => (
  <div className="w-12 h-[3px] bg-[#FFD700] transform -skew-x-12 mb-6"></div>
);

const SectionTitle = ({ label, title }: { label?: string; title: string }) => (
  <div className="flex flex-col mb-14">
    {label && <p className="text-[#FFD700] uppercase tracking-[0.3em] text-xs font-bold mb-3">{label}</p>}
    <GoldAccentBar />
    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest leading-tight">{title}</h2>
  </div>
);

const ClipButton = ({
  children, gold = false, onClick, className = '',
}: {
  children: React.ReactNode; gold?: boolean; onClick?: () => void; className?: string;
}) => (
  <button
    onClick={onClick}
    className={`relative px-8 py-4 font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 group
      ${gold
        ? 'bg-[#FFD700] text-black hover:bg-yellow-400'
        : 'bg-transparent text-white border border-zinc-600 hover:border-[#FFD700] hover:text-[#FFD700]'
      } ${className}`}
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}
  >
    {gold && (
      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
    )}
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

// ─── Auth Modals ──────────────────────────────────────────────────────────────
const InputField = ({
  label, type = 'text', value, onChange, placeholder, showToggle = false,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; showToggle?: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-zinc-400 uppercase tracking-widest text-xs font-semibold">{label}</label>
      <div className="relative">
        <input
          type={showToggle ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FFD700] outline-none text-white px-4 py-3 text-sm tracking-wide transition-colors duration-200 placeholder:text-zinc-600"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
        />
        {showToggle && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FFD700] transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    {children}
  </div>
);

const LoginModal = ({
  onClose, onLogin, defaultTab = 'signin',
}: {
  onClose: () => void;
  onLogin: (u: AuthUser) => void;
  defaultTab?: 'signin' | 'register';
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>(defaultTab);

  // Sign-in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siError, setSiError] = useState('');
  const [siLoading, setSiLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault(); setSiError(''); setSiLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === siEmail && u.password === siPassword);
      if (user) { onLogin(user); onClose(); }
      else setSiError('Invalid email or password.');
      setSiLoading(false);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); setRegError('');
    if (!regName.trim()) { setRegError('Please enter your full name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) { setRegError('Please enter a valid email address.'); return; }
    if (DEMO_USERS.find(u => u.email === regEmail)) { setRegError('An account with this email already exists.'); return; }
    if (regPassword.length < 8) { setRegError('Password must be at least 8 characters.'); return; }
    if (regPassword !== regConfirm) { setRegError('Passwords do not match.'); return; }
    setRegLoading(true);
    setTimeout(() => {
      const newUser: AuthUser = { email: regEmail, name: regName, password: regPassword };
      DEMO_USERS.push(newUser);
      setRegLoading(false);
      setRegSuccess(true);
    }, 700);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="relative bg-[#0a0a0a] border border-zinc-800 w-full max-w-md mx-4"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
      >
        {/* Gold top bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        {/* Logo row */}
        <div className="flex items-center gap-3 px-8 md:px-10 pt-8 pb-0">
          <LamboBullLogo size={36} />
          <LamboWordmark size="md" />
        </div>

        {/* Tabs */}
        <div className="flex mt-6 border-b border-zinc-800">
          {(['signin', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSiError(''); setRegError(''); setRegSuccess(false); }}
              className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px
                ${tab === t ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="px-8 md:px-10 py-8">
          {/* ── Sign In ── */}
          {tab === 'signin' && (
            <>
              <p className="text-zinc-500 text-sm tracking-wide mb-7">Welcome back. Sign in to your account.</p>
              <form onSubmit={handleSignIn} className="flex flex-col gap-5">
                <InputField label="Email Address" type="email" value={siEmail} onChange={setSiEmail} placeholder="your@email.com" />
                <InputField label="Password" value={siPassword} onChange={setSiPassword} placeholder="••••••••" showToggle />
                {siError && (
                  <div className="border border-red-900/60 bg-red-950/30 text-red-400 text-xs px-4 py-3 uppercase tracking-widest">
                    {siError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={siLoading}
                  className="mt-1 w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 disabled:opacity-60 transition-colors"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                >
                  {siLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
              <p className="mt-6 text-zinc-600 text-xs text-center tracking-wider">
                Demo: <span className="text-zinc-400">owner@veloce.it</span> / <span className="text-zinc-400">Lamborghini2026!</span>
              </p>
              <p className="mt-4 text-zinc-600 text-xs text-center">
                No account?{' '}
                <button onClick={() => setTab('register')} className="text-[#FFD700] hover:underline font-bold uppercase tracking-widest">
                  Create one
                </button>
              </p>
            </>
          )}

          {/* ── Register ── */}
          {tab === 'register' && (
            <>
              {regSuccess ? (
                <div className="flex flex-col items-center gap-5 py-6 text-center">
                  <div className="w-16 h-16 border-2 border-[#FFD700] flex items-center justify-center transform rotate-45">
                    <span className="transform -rotate-45 text-[#FFD700] text-xl font-black">✓</span>
                  </div>
                  <h3 className="text-white font-black uppercase tracking-widest text-lg">Account Created!</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                    Welcome to Lamborghini, <span className="text-white font-bold">{regName}</span>. Your account is ready.
                  </p>
                  <button
                    onClick={() => { setTab('signin'); setSiEmail(regEmail); setRegSuccess(false); }}
                    className="w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    Sign In Now
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-zinc-500 text-sm tracking-wide mb-7">Join the Lamborghini Owner's Club.</p>
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <InputField label="Full Name" value={regName} onChange={setRegName} placeholder="Your full name" />
                    <InputField label="Email Address" type="email" value={regEmail} onChange={setRegEmail} placeholder="your@email.com" />
                    <InputField label="Password" value={regPassword} onChange={setRegPassword} placeholder="Min. 8 characters" showToggle />
                    <InputField label="Confirm Password" value={regConfirm} onChange={setRegConfirm} placeholder="••••••••" showToggle />
                    {regError && (
                      <div className="border border-red-900/60 bg-red-950/30 text-red-400 text-xs px-4 py-3 uppercase tracking-widest">
                        {regError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="mt-1 w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 disabled:opacity-60 transition-colors"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                    >
                      {regLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                  <p className="mt-4 text-zinc-600 text-xs text-center">
                    Already have an account?{' '}
                    <button onClick={() => setTab('signin')} className="text-[#FFD700] hover:underline font-bold uppercase tracking-widest">
                      Sign in
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

const ChangePasswordModal = ({ onClose, user }: { onClose: () => void; user: AuthUser }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (current !== user.password) { setError('Current password is incorrect.'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => { user.password = next; setSuccess(true); setLoading(false); }, 600);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="relative bg-[#0a0a0a] border border-zinc-800 w-full max-w-md mx-4 p-8 md:p-10"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"><X size={20} /></button>
        <div className="flex items-center gap-3 mb-8"><Lock size={20} className="text-[#FFD700]" /><span className="text-white font-bold tracking-[0.2em] uppercase text-sm">Security</span></div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Change Password</h2>
        <p className="text-zinc-500 text-sm tracking-wide mb-8">{user.name}</p>
        {success ? (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-16 h-16 border-2 border-[#FFD700] flex items-center justify-center transform rotate-45">
              <div className="w-6 h-6 bg-[#FFD700] transform -rotate-45 flex items-center justify-center text-black text-xs font-bold">✓</div>
            </div>
            <p className="text-white font-bold uppercase tracking-widest text-center">Password Updated Successfully</p>
            <ClipButton onClick={onClose}>Close</ClipButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField label="Current Password" value={current} onChange={setCurrent} placeholder="••••••••" showToggle />
            <InputField label="New Password" value={next} onChange={setNext} placeholder="Min. 8 characters" showToggle />
            <InputField label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="••••••••" showToggle />
            {error && <div className="border border-red-900/60 bg-red-950/30 text-red-400 text-xs px-4 py-3 uppercase tracking-widest">{error}</div>}
            <ClipButton gold onClick={() => {}} className="mt-2 w-full justify-center">{loading ? 'Updating...' : 'Update Password'}</ClipButton>
          </form>
        )}
      </div>
    </ModalOverlay>
  );
};

// ─── Side Drawer Menu ─────────────────────────────────────────────────────────
const SideDrawer = ({
  isOpen, onClose, currentPage, onNavigate,
}: {
  isOpen: boolean; onClose: () => void; currentPage: string; onNavigate: (p: string) => void;
}) => {
  const menuItems = [
    { label: 'Models', page: 'models', sub: 'Revuelto · Temerario · Urus SE' },
    { label: 'Heritage', page: 'heritage', sub: 'History since 1963' },
    { label: 'Motorsport', page: 'motorsport', sub: 'GT3 · Super Trofeo · LMDh' },
    { label: 'Store', page: 'store', sub: 'Merchandise & Lifestyle' },
    { label: 'Museum', page: 'museum', sub: 'The Legend Collection' },
    { label: 'Design', page: 'design', sub: 'Ad Personam Studio' },
    { label: "Owner's Club", page: 'ownersclub', sub: 'Membership · Events · Benefits' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full z-[70] w-[320px] md:w-[400px] bg-[#080808] border-r border-zinc-900 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Gold top line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] via-[#FFD700]/60 to-transparent" />

        {/* Header row */}
        <div className="flex items-center justify-between px-8 pt-8 pb-10">
          <div className="flex items-center gap-3">
            <LamboBullLogo size={32} />
            <LamboWordmark size="sm" />
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col px-8 gap-1 flex-1">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => { onNavigate(item.page); onClose(); }}
              className={`group flex flex-col items-start py-4 border-b border-zinc-900/60 text-left transition-all duration-200 hover:pl-3 ${currentPage === item.page ? 'pl-3' : ''}`}
              style={{ transitionDelay: isOpen ? `${i * 40}ms` : '0ms' }}
            >
              <div className="flex items-center gap-3 w-full">
                <span className={`text-[10px] font-bold text-zinc-700 w-5 shrink-0`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-xl md:text-2xl font-black uppercase tracking-widest transition-colors duration-200 ${currentPage === item.page ? 'text-[#FFD700]' : 'text-zinc-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
                <ChevronRight size={14} className={`ml-auto transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 ${currentPage === item.page ? 'opacity-100 text-[#FFD700]' : 'text-[#FFD700]'}`} />
              </div>
              <span className="text-zinc-600 text-xs tracking-widest uppercase ml-8 mt-0.5 group-hover:text-zinc-500 transition-colors">{item.sub}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-8 pb-8 pt-6 border-t border-zinc-900">
          <p className="text-zinc-700 text-xs uppercase tracking-[0.25em]">Sant'Agata Bolognese · Italy</p>
          <p className="text-zinc-700 text-xs uppercase tracking-[0.25em] mt-1">Est. 1963</p>
        </div>

        {/* Decorative vertical line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFD700]/30 via-transparent to-transparent pointer-events-none" />
      </div>
    </>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({
  currentPage, setCurrentPage, user, onLoginClick, onRegisterClick, onLogout, onChangePassword,
}: {
  currentPage: string; setCurrentPage: (p: string) => void;
  user: AuthUser | null; onLoginClick: () => void; onRegisterClick: () => void; onLogout: () => void; onChangePassword: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHoveringTrigger, setIsHoveringTrigger] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Open drawer on hover with a tiny delay to avoid flicker
  const handleTriggerEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoveringTrigger(true);
    hoverTimeoutRef.current = setTimeout(() => setIsDrawerOpen(true), 120);
  };
  const handleTriggerLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoveringTrigger(false);
  };

  const navLinks = [
    { label: 'Models', page: 'models' },
    { label: 'Heritage', page: 'heritage' },
    { label: 'Motorsport', page: 'motorsport' },
    { label: "Owner's Club", page: 'ownersclub' },
  ];

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">

          {/* Hamburger trigger — always visible */}
          <div
            className="relative flex items-center flex-1"
            onMouseEnter={handleTriggerEnter}
            onMouseLeave={handleTriggerLeave}
          >
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex flex-col gap-[5px] p-2 group cursor-pointer"
              aria-label="Open menu"
            >
              <span className={`block h-[2px] bg-white transition-all duration-300 ${isHoveringTrigger || isDrawerOpen ? 'w-6 bg-[#FFD700]' : 'w-6'}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${isHoveringTrigger || isDrawerOpen ? 'w-4 bg-[#FFD700]' : 'w-4'}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${isHoveringTrigger || isDrawerOpen ? 'w-5 bg-[#FFD700]' : 'w-5'}`} />
            </button>
            {/* Hover label */}
            <span className={`ml-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-200 ${isHoveringTrigger || isDrawerOpen ? 'opacity-100 text-[#FFD700]' : 'opacity-0 text-white'}`}>
              Menu
            </span>
          </div>

          {/* Logo — true center column */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
              <div className="transition-transform duration-300 group-hover:scale-110">
                <LamboBullLogo size={44} />
              </div>
              <LamboWordmark size="md" className="hidden md:block group-hover:text-[#FFD700] transition-colors duration-300" />
            </div>
          </div>

          {/* Right side: Desktop nav + Auth */}
          <div className="flex items-center gap-8 flex-1 justify-end">
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-widest text-zinc-300 uppercase">
              {navLinks.map(link => (
                <button key={link.label} onClick={() => navigate(link.page)}
                  className={`hover:text-[#FFD700] transition-colors relative pb-1 group ${currentPage === link.page ? 'text-[#FFD700]' : ''}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-px bg-[#FFD700] transition-all duration-300 ${currentPage === link.page ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
            </nav>

            {/* Auth */}
            <div className="flex items-center">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-zinc-300 hover:text-[#FFD700] transition-colors text-sm font-semibold uppercase tracking-widest">
                    <div className="w-8 h-8 border border-[#FFD700] flex items-center justify-center">
                      <User size={14} className="text-[#FFD700]" />
                    </div>
                    <span className="hidden xl:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-[#0a0a0a] border border-zinc-800 z-50"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}>
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-white text-xs font-bold uppercase tracking-widest">{user.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsUserMenuOpen(false); onChangePassword(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-[#FFD700] hover:bg-zinc-900 transition-colors text-xs uppercase tracking-widest">
                        <Lock size={14} /> Change Password
                      </button>
                      <button onClick={() => { setIsUserMenuOpen(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors text-xs uppercase tracking-widest">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {[{ label: 'Sign In', onClick: onLoginClick }, { label: 'Register', onClick: onRegisterClick }].map(btn => (
                    <button key={btn.label} onClick={btn.onClick}
                      className="w-28 flex items-center justify-center gap-2 py-2.5 bg-[#FFD700] text-black hover:bg-yellow-400 transition-all text-xs font-bold uppercase tracking-widest"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                      <User size={14} /> {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const Hero = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90 z-10"></div>
      <img src="https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkYXJrJTIwbGFtYm9yZ2hpbmklMjBzdXBlcmNhcnxlbnwxfHx8fDE3ODQxMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1440"
        alt="Supercar Hero" className="w-full h-full object-cover opacity-80" />
    </div>
    <div className="relative z-20 text-center flex flex-col items-center mt-20 px-4 w-full max-w-[1440px]">
      <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-6">Automobili Lamborghini</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600 tracking-[0.25em] uppercase mb-8 leading-tight">
        Beyond The<br />Horizon
      </h1>
      <p className="text-zinc-400 max-w-lg text-center tracking-wider text-sm mb-10">Engineering excellence. Uncompromising performance. A legacy written in asphalt.</p>
      <div className="flex flex-col sm:flex-row gap-6">
        <ClipButton gold onClick={() => onNavigate('models')}>Explore Models <ChevronRight size={18} /></ClipButton>
        <ClipButton onClick={() => onNavigate('heritage')}>Our Heritage</ClipButton>
      </div>
    </div>
    {/* Scroll indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#FFD700]"></div>
      <p className="text-[#FFD700] text-xs uppercase tracking-[0.3em]">Scroll</p>
    </div>
  </section>
);

const HomeLineup = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const models = [
    { id: 1, name: "Revuelto", type: "V12 Hybrid", image: "https://images.unsplash.com/photo-1600510424051-30d592a75353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbGFtYm9yZ2hpbmklMjBzdXBlcmNhcnxlbnwxfHx8fDE3ODQxMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 2, name: "Temerario", type: "V8 Twin-Turbo Hybrid", image: "https://images.unsplash.com/photo-1657769106786-b6f50ac90f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbGFtYm9yZ2hpbmklMjBzdXBlcmNhcnxlbnwxfHx8fDE3ODQxMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 3, name: "Urus SE", type: "Super SUV Hybrid", image: "https://images.unsplash.com/photo-1530906358829-e84b2769270f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbGFtYm9yZ2hpbmklMjBzdXBlcmNhcnxlbnwxfHx8fDE3ODQxMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];
  return (
    <section className="bg-black py-24 w-full">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <GoldAccentBar />
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest">The Lineup</h2>
          </div>
          <button onClick={() => onNavigate('models')} className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-[#FFD700] uppercase text-xs tracking-widest font-bold transition-colors">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {models.map(model => (
            <div key={model.id} className="group relative h-[500px] lg:h-[600px] overflow-hidden cursor-pointer" onClick={() => onNavigate('models')}>
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 pointer-events-none">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-2">{model.type}</p>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider mb-6">{model.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-300 font-semibold uppercase text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Discover <ChevronRight size={16} className="text-[#FFD700]" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border border-white/10 group-hover:border-[#FFD700]/50 transition-colors duration-500 z-30 pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandSection = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <section className="bg-zinc-950 w-full overflow-hidden">
    <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950 lg:z-10"></div>
        <img src="https://images.unsplash.com/photo-1632479803237-53e868bb2133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxkYXJrJTIwbGFtYm9yZ2hpbmklMjBzdXBlcmNhcnxlbnwxfHx8fDE3ODQxMDAwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Brand Heritage" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-20 hidden lg:block"></div>
        <div className="max-w-xl">
          <div className="w-16 h-16 border border-zinc-800 mb-10 flex items-center justify-center transform rotate-45">
            <div className="w-8 h-8 border border-[#FFD700] transform -rotate-45"></div>
          </div>
          <blockquote className="text-3xl md:text-5xl font-light text-white leading-tight">
            <span className="text-[#FFD700] font-serif text-6xl leading-none mr-2">"</span>
            <em className="font-serif">We don't just build cars. We shape future legends.</em>
          </blockquote>
          <p className="mt-8 text-zinc-400 leading-relaxed uppercase tracking-widest text-sm font-semibold">The pursuit of perfection is an endless road.</p>
          <button onClick={() => onNavigate('heritage')} className="mt-12 flex items-center gap-4 text-white uppercase tracking-widest text-sm font-bold hover:text-[#FFD700] transition-colors group">
            <span className="w-12 h-px bg-white group-hover:bg-[#FFD700] transition-colors"></span>
            Our Heritage
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ─── MODELS PAGE ──────────────────────────────────────────────────────────────
const ModelsPage = () => {
  const [activeModel, setActiveModel] = useState(0);

  const models = [
    {
      name: 'Revuelto',
      tagline: 'The Future Is Hybrid',
      type: 'V12 PHEV Super Sports Car',
      year: '2023',
      price: 'From €517,000',
      color: '#FF6B35',
      specs: { power: '1,015 CV', torque: '730 Nm', speed: '350 km/h', acceleration: '2.5s 0–100' },
      description: "The Revuelto is the first HPEV (High Performance Electrified Vehicle) super sports car from Lamborghini. It combines a naturally aspirated V12 with three electric motors for a total system output exceeding 1,000 CV — a revolution in supercar engineering.",
      features: ['Carbon-fibre monocoque', 'All-wheel drive with torque vectoring', 'Active aerodynamics', 'Push-rod suspension'],
      image: 'https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
      thumb: 'https://images.unsplash.com/photo-1600510424051-30d592a75353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    },
    {
      name: 'Temerario',
      tagline: 'Twin-Turbo Revolution',
      type: 'V8 Biturbo PHEV Super Sports Car',
      year: '2024',
      price: 'From €220,000',
      color: '#00D4FF',
      specs: { power: '920 CV', torque: '730 Nm', speed: '340 km/h', acceleration: '2.7s 0–100' },
      description: "Replacing the Huracán lineage, the Temerario introduces a brand-new twin-turbocharged V8 engine paired with three electric motors. It represents a new chapter in Lamborghini's pursuit of visceral, driver-focused performance.",
      features: ['New V8 biturbo engine', 'Electric rear axle', 'Rear-wheel steering', 'Forged carbon body panels'],
      image: 'https://images.unsplash.com/photo-1596125099792-3917bf2d8095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
      thumb: 'https://images.unsplash.com/photo-1657769106786-b6f50ac90f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    },
    {
      name: 'Urus SE',
      tagline: 'The Super SUV Evolved',
      type: 'V8 Biturbo Plug-in Hybrid SUV',
      year: '2024',
      price: 'From €260,000',
      color: '#7FFF00',
      specs: { power: '800 CV', torque: '950 Nm', speed: '312 km/h', acceleration: '3.4s 0–100' },
      description: "The Urus SE redefines the super SUV segment with a plug-in hybrid powertrain that delivers unprecedented performance alongside everyday usability. With 800 CV, it is the most powerful production Urus ever built.",
      features: ['Plug-in hybrid powertrain', 'Active roll stabilization', 'All-terrain capability', 'Panoramic carbon roof'],
      image: 'https://images.unsplash.com/photo-1764693756664-769420e4ad6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
      thumb: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    },
  ];

  const m = models[activeModel];
  const specIcons = [
    { icon: Zap, label: 'Power', value: m.specs.power },
    { icon: Gauge, label: 'Torque', value: m.specs.torque },
    { icon: Wind, label: 'Top Speed', value: m.specs.speed },
    { icon: Clock, label: '0–100 km/h', value: m.specs.acceleration },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        {models.map((mod, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === activeModel ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <img src={mod.image} alt={mod.name} className="w-full h-full object-cover scale-105" />
          </div>
        ))}

        <div className="relative z-20 h-full flex flex-col justify-end pb-24 max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-bold mb-4">{m.tagline}</p>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase leading-none tracking-tight mb-4">{m.name}</h1>
          <p className="text-zinc-400 uppercase tracking-widest text-sm mb-10">{m.type} &nbsp;·&nbsp; {m.year}</p>
          <div className="flex gap-4">
            <ClipButton gold>Configure Yours <ChevronRight size={16} /></ClipButton>
            <ClipButton>Request Info</ClipButton>
          </div>
        </div>

        {/* Model selector tabs */}
        <div className="absolute bottom-10 right-6 lg:right-12 z-30 flex flex-col gap-3">
          {models.map((mod, i) => (
            <button key={i} onClick={() => setActiveModel(i)}
              className={`flex items-center gap-3 group transition-all duration-300 ${i === activeModel ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
              <span className={`text-xs uppercase tracking-widest font-bold hidden lg:block ${i === activeModel ? 'text-[#FFD700]' : 'text-white'}`}>{mod.name}</span>
              <div className={`h-12 w-[2px] transition-colors ${i === activeModel ? 'bg-[#FFD700]' : 'bg-zinc-600'}`}></div>
              <div className="w-12 h-12 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                <img src={mod.thumb} alt={mod.name} className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Specs Bar */}
      <section className="bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-900">
            {specIcons.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 gap-2">
                <Icon size={20} className="text-[#FFD700] mb-1" />
                <p className="text-white text-xl md:text-2xl font-black tracking-wide">{value}</p>
                <p className="text-zinc-500 uppercase text-xs tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle label="Engineering" title={m.name} />
            <p className="text-zinc-400 leading-relaxed text-base mb-10">{m.description}</p>
            <ul className="space-y-4">
              {m.features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-300 text-sm uppercase tracking-wider">
                  <span className="w-6 h-px bg-[#FFD700]"></span>{f}
                </li>
              ))}
            </ul>
            <p className="mt-12 text-[#FFD700] text-2xl font-black tracking-widest">{m.price}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border border-zinc-800 -z-10"></div>
            <div className="absolute -inset-8 border border-zinc-900 -z-20"></div>
            <img src={m.thumb} alt={m.name} className="w-full aspect-[4/3] object-cover"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }} />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* All Models Grid */}
      <section className="py-16 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Complete Range" title="Choose Your Lamborghini" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((mod, i) => (
              <div key={i} onClick={() => { setActiveModel(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`group cursor-pointer border transition-all duration-300 ${i === activeModel ? 'border-[#FFD700]' : 'border-zinc-800 hover:border-zinc-600'}`}>
                <div className="h-48 overflow-hidden">
                  <img src={mod.thumb} alt={mod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <p className="text-[#FFD700] text-xs uppercase tracking-widest mb-1">{mod.type}</p>
                  <h3 className="text-white text-xl font-black uppercase tracking-wider mb-2">{mod.name}</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">{mod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── HERITAGE PAGE ────────────────────────────────────────────────────────────
const HeritagePage = () => {
  const milestones = [
    { year: '1963', title: 'The Beginning', text: 'Ferruccio Lamborghini founds Automobili Lamborghini after a dispute with Ferrari, determined to build a better grand tourer. The first model, the 350 GT, debuts at the Turin Motor Show.', image: 'https://images.unsplash.com/photo-1632479803237-53e868bb2133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '1966', title: 'The Miura', text: "The mid-engine Miura stuns the world at Geneva. Often called the first supercar, it features a transversally mounted V12 and styling by a young Marcello Gandini. It redefines what an automobile can be.", image: 'https://images.unsplash.com/photo-1730016050582-7fd6a3176356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '1974', title: 'The Countach', text: 'LP 400 Countach launches a design revolution with its sharp wedge shape, scissor doors and dramatic rear wing. It defines an era and becomes the poster car of an entire generation.', image: 'https://images.unsplash.com/photo-1691117239963-abbf08feba9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '1990', title: 'The Diablo', text: 'The Diablo raises the performance bar with a top speed exceeding 325 km/h. Penned by Marcello Gandini, it pushes boundaries in both performance and design, captivating a new generation.', image: 'https://images.unsplash.com/photo-1654938900760-1419ee86bc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '2001', title: 'The Murciélago', text: 'The Murciélago marks the Audi AG era, blending Italian passion with German engineering precision. A 6.5L V12 producing 670 CV cements its place as one of the greatest supercars ever made.', image: 'https://images.unsplash.com/photo-1729244226086-366ad9015d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '2011', title: 'The Aventador', text: 'A carbon-fibre monocoque, a 6.5L V12, and unmistakeable design. The Aventador raises the standard for flagship supercars and remains in production for over a decade — a modern legend.', image: 'https://images.unsplash.com/photo-1696178946353-b2c37dc7df7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { year: '2023', title: 'The Revuelto', text: 'A new era begins. The Revuelto replaces the Aventador with a hybrid V12 powertrain producing over 1,000 CV. It is the most technologically advanced Lamborghini ever built — a testament to 60 years of innovation.', image: 'https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  ];

  const legendCars = [
    { name: 'Miura', years: '1966–1973', img: 'https://images.unsplash.com/photo-1730016050582-7fd6a3176356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Countach', years: '1974–1990', img: 'https://images.unsplash.com/photo-1696581081917-919acffdec80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Diablo', years: '1990–2001', img: 'https://images.unsplash.com/photo-1654938900760-1419ee86bc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Murciélago', years: '2001–2010', img: 'https://images.unsplash.com/photo-1729244226086-366ad9015d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[75vh] w-full flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1694718621887-2d7ff22bd77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Heritage Hero" className="w-full h-full object-cover opacity-35 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-4">Est. 1963</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none">
            Brand<br /><span className="text-[#FFD700]">Heritage</span>
          </h1>
          <p className="mt-6 text-zinc-400 max-w-lg text-sm leading-relaxed tracking-wider">
            Six decades of passion, engineering, and uncompromising performance. A story that began with a tractor maker's vision and became the world's most iconic supercar brand.
          </p>
        </div>
        {/* Year counter decoration */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-2 opacity-20">
          <div className="text-8xl font-black text-white tracking-tighter leading-none">60+</div>
          <div className="text-xs text-white uppercase tracking-[0.4em]">Years of Legend</div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="The Journey" title="Milestones" />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 lg:left-[180px] top-0 bottom-0 w-px bg-zinc-800"></div>
            <div className="space-y-0">
              {milestones.map((item, i) => (
                <div key={i} className="group relative pl-8 lg:pl-0 flex flex-col lg:flex-row gap-6 lg:gap-12 pb-16">
                  {/* Year */}
                  <div className="lg:w-[180px] lg:text-right flex-shrink-0">
                    <span className="text-3xl lg:text-4xl font-black text-[#FFD700] tracking-tight">{item.year}</span>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-0 lg:left-[180px] top-3 w-3 h-3 bg-[#FFD700] -translate-x-1/2 flex-shrink-0 z-10 group-hover:scale-150 transition-transform"></div>
                  {/* Content */}
                  <div className="lg:pl-12 flex flex-col lg:flex-row gap-6 flex-1">
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-black uppercase tracking-wider mb-3">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">{item.text}</p>
                    </div>
                    <div className="lg:w-48 h-32 lg:h-28 overflow-hidden flex-shrink-0"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Museum */}
      <section className="py-24 bg-black">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Museo Lamborghini" title="The Collection" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legendCars.map((car, i) => (
              <div key={i} className="group relative aspect-video overflow-hidden border border-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer">
                <img src={car.img} alt={car.name} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
                  <p className="text-[#FFD700] text-xs font-bold tracking-[0.2em] mb-2">{car.years}</p>
                  <h3 className="text-3xl text-white font-light uppercase tracking-wider">{car.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1963', label: 'Founded' },
              { value: '40K+', label: 'Cars Produced' },
              { value: '60+', label: 'Countries' },
              { value: '15', label: 'Iconic Models' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-black text-[#FFD700]">{stat.value}</span>
                <span className="text-zinc-500 uppercase text-xs tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── MOTORSPORT PAGE ──────────────────────────────────────────────────────────
const MotorsportPage = () => {
  const [activeRace, setActiveRace] = useState(0);

  const programs = [
    {
      name: 'GT World Challenge',
      series: 'GT3 · Global',
      color: '#FFD700',
      car: 'Lamborghini GT3 EVO',
      wins: '47',
      titles: '6',
      seasons: '12',
      description: 'The Lamborghini GT3 program competes at the highest level of GT racing across three continents. Customer teams from Asia, Europe, and North America have taken the car to countless victories.',
      image: 'https://images.unsplash.com/photo-1699138346782-8a8b211c3da2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
    },
    {
      name: 'Super Trofeo',
      series: 'One-Make Trophy · World',
      color: '#FF6B35',
      car: 'Lamborghini Super Trofeo EVO2',
      wins: '200+',
      titles: '20',
      seasons: '15',
      description: 'The Lamborghini Super Trofeo is the world\'s fastest one-make racing series. From Asia to Europe to North America, it serves as the ultimate proving ground for the next generation of motorsport talent.',
      image: 'https://images.unsplash.com/photo-1699138346491-d6f4c7e04b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
    },
    {
      name: 'Squadra Corse',
      series: 'Factory Programme · Endurance',
      color: '#00D4FF',
      car: 'Lamborghini SC63 LMDh',
      wins: '8',
      titles: '2',
      seasons: '3',
      description: 'The factory Squadra Corse programme represents Lamborghini\'s return to top-level endurance racing. The SC63 LMDh prototype competes at Le Mans, Daytona, and Spa — the ultimate stage for motorsport.',
      image: 'https://images.unsplash.com/photo-1696178946353-b2c37dc7df7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440',
    },
  ];

  const prog = programs[activeRace];

  const victories = [
    { event: "24h Daytona", year: "2024", car: "SC63 LMDh", driver: "Bortolotti / Cairoli" },
    { event: "Bathurst 12h", year: "2024", car: "GT3 EVO", driver: "Mapelli / Pepper" },
    { event: "Super Trofeo World Final", year: "2023", car: "EVO2", driver: "Schiavoni" },
    { event: "Blancpain GT Series", year: "2022", car: "GT3 EVO", driver: "Engelhart" },
    { event: "GT World Challenge Asia", year: "2022", car: "GT3 EVO", driver: "Lam / Ong" },
    { event: "Paul Ricard 1000km", year: "2021", car: "GT3 EVO", driver: "Caldarelli" },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        {programs.map((p, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === activeRace ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10"></div>
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="relative z-20 h-full flex flex-col justify-end pb-28 max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-4">
            <Flag size={16} className="text-[#FFD700]" />
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-bold">{prog.series}</p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-none tracking-tight mb-6">{prog.name}</h1>
          <div className="flex gap-10 mb-10">
            {[['Victories', prog.wins], ['Championships', prog.titles], ['Seasons', prog.seasons]].map(([label, val]) => (
              <div key={label}>
                <p className="text-3xl font-black text-[#FFD700]">{val}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
          <ClipButton gold>Explore Programme <ChevronRight size={16} /></ClipButton>
        </div>

        {/* Program selector */}
        <div className="absolute bottom-10 right-6 lg:right-12 z-30 flex gap-3">
          {programs.map((p, i) => (
            <button key={i} onClick={() => setActiveRace(i)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-all duration-300 ${i === activeRace ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Programme Detail */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle label="Programme" title={prog.car} />
              <p className="text-zinc-400 leading-relaxed mb-10">{prog.description}</p>
              <div className="grid grid-cols-3 gap-4">
                {[['Victories', prog.wins], ['Titles', prog.titles], ['Seasons', prog.seasons]].map(([label, val]) => (
                  <div key={label} className="border border-zinc-800 p-5 text-center">
                    <Trophy size={18} className="text-[#FFD700] mx-auto mb-3" />
                    <p className="text-2xl font-black text-white">{val}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-zinc-900">
              {[
                { label: "Engine", value: "5.2L V10" },
                { label: "Power", value: "620 CV" },
                { label: "Weight", value: "1,270 kg" },
                { label: "Drivetrain", value: "RWD" },
                { label: "Gearbox", value: "6-spd seq." },
                { label: "Tyres", value: "Pirelli DHE" },
              ].map((item, i) => (
                <div key={i} className="bg-black p-5 text-center">
                  <p className="text-white font-bold text-base">{item.value}</p>
                  <p className="text-zinc-600 text-xs uppercase tracking-widest mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Race Victories */}
      <section className="py-24 bg-black border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Track Record" title="Recent Victories" />
          <div className="space-y-px">
            {victories.map((v, i) => (
              <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 hover:bg-zinc-900 transition-colors px-6 py-5 border-l-2 border-transparent hover:border-[#FFD700]">
                <div className="flex items-center gap-6">
                  <span className="text-[#FFD700] font-black text-xl w-8">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-white font-bold uppercase tracking-wide">{v.event}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-0.5">{v.driver}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 sm:gap-12 pl-14 sm:pl-0">
                  <div>
                    <p className="text-zinc-300 text-xs uppercase tracking-widest">{v.car}</p>
                  </div>
                  <span className="text-[#FFD700] text-sm font-black">{v.year}</span>
                  <ChevronRight size={16} className="text-zinc-700 group-hover:text-[#FFD700] transition-colors hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-bold mb-4">Customer Racing</p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-6">Race With Lamborghini</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed mb-10">
            Join the world's most exclusive one-make racing series or campaign a GT3 car in your home championship. Lamborghini Squadra Corse customer support is second to none.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ClipButton gold>Enquire Now <ChevronRight size={16} /></ClipButton>
            <ClipButton>Download Regulations</ClipButton>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── STORE PAGE ───────────────────────────────────────────────────────────────
const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Apparel', 'Accessories', 'Scale Models', 'Lifestyle', 'Limited Edition'];

  const products = [
    { id: 1, name: 'Revuelto Driver Jacket', category: 'Apparel', price: '€890', tag: 'New', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 2, name: 'Carbon Fibre Watch', category: 'Accessories', price: '€2,400', tag: 'Limited', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 3, name: 'Bull Shield Cap', category: 'Apparel', price: '€120', tag: '', img: 'https://images.unsplash.com/photo-1559385072-5adb2c4fc83f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 4, name: '1:18 Revuelto Scale Model', category: 'Scale Models', price: '€380', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1489686995744-f47e995ffe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 5, name: 'Squadra Corse Polo', category: 'Apparel', price: '€220', tag: '', img: 'https://images.unsplash.com/photo-1764693756664-769420e4ad6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 6, name: 'Leather Passport Holder', category: 'Accessories', price: '€180', tag: '', img: 'https://images.unsplash.com/photo-1780901833117-86ade3ac08fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 7, name: 'Urus SE Diecast 1:43', category: 'Scale Models', price: '€95', tag: '', img: 'https://images.unsplash.com/photo-1596125099792-3917bf2d8095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 8, name: 'Heritage Print — Countach', category: 'Lifestyle', price: '€650', tag: 'Limited', img: 'https://images.unsplash.com/photo-1696178946353-b2c37dc7df7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
    { id: 9, name: 'Track Day Duffel Bag', category: 'Accessories', price: '€340', tag: '', img: 'https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  ];

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] w-full flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559385072-5adb2c4fc83f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Store" className="w-full h-full object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-3">Lamborghini Collection</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            The <span className="text-[#FFD700]">Store</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-sm tracking-wider max-w-lg">Carry the legend with you. Official Lamborghini merchandise, scale models, and lifestyle accessories.</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-zinc-950 border-b border-zinc-900 sticky top-[72px] z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-none px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap
                  ${activeCategory === cat ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-zinc-900 border border-zinc-900 group-hover:border-zinc-700 transition-colors duration-300"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  {product.tag && (
                    <div className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest
                      ${product.tag === 'Limited' ? 'bg-[#FFD700] text-black' : 'bg-white text-black'}`}>
                      {product.tag}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="border border-[#FFD700] px-6 py-3 text-[#FFD700] text-xs font-bold uppercase tracking-widest"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                      Add to Cart
                    </div>
                  </div>
                </div>
                <div className="pt-4 px-1">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">{product.category}</p>
                  <div className="flex justify-between items-end">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-tight max-w-[70%]">{product.name}</h3>
                    <span className="text-[#FFD700] font-black text-base">{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden border border-zinc-800 p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-8"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent pointer-events-none" />
            <div className="flex-1 relative z-10">
              <p className="text-[#FFD700] text-xs uppercase tracking-[0.4em] font-bold mb-3">Exclusive Drop</p>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                Revuelto<br />Capsule Collection
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">A curated selection of pieces designed in collaboration with Italian fashion house Zegna — celebrating the launch of the Revuelto.</p>
            </div>
            <ClipButton gold>Shop the Drop <ChevronRight size={16} /></ClipButton>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── MUSEUM PAGE ──────────────────────────────────────────────────────────────
const MuseumPage = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const exhibits = [
    {
      id: 1, era: '1960s', name: 'Miura P400', years: '1966–1973',
      engine: 'V12 3.9L', power: '350 CV', topSpeed: '280 km/h', produced: '764',
      description: "The Miura is widely considered the world's first supercar. Its transversally mounted V12 and stunning Gandini body transformed what an automobile could be. The Miura SV is the definitive version — raw, analog, intoxicating.",
      img: 'https://images.unsplash.com/photo-1730016050582-7fd6a3176356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#FF8C00',
    },
    {
      id: 2, era: '1970s', name: 'Countach LP400', years: '1974–1990',
      engine: 'V12 3.9L–5.2L', power: '375–455 CV', topSpeed: '295 km/h', produced: '1,999',
      description: "The Countach redefined automotive design forever. Its scissor doors, wedge profile, and outrageous proportions made it the poster car of an entire generation. No car before or since has provoked such visceral reaction.",
      img: 'https://images.unsplash.com/photo-1696581081917-919acffdec80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#FFD700',
    },
    {
      id: 3, era: '1990s', name: 'Diablo SE30', years: '1990–2001',
      engine: 'V12 5.7L', power: '530 CV', topSpeed: '325 km/h', produced: '2,903',
      description: "The Diablo raised the performance bar with an earth-shattering top speed and theatrical styling. The SE30 Jota limited edition — built to celebrate 30 years of the brand — remains one of the most coveted Lamborghinis ever made.",
      img: 'https://images.unsplash.com/photo-1654938900760-1419ee86bc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#00D4FF',
    },
    {
      id: 4, era: '2000s', name: 'Murciélago LP670-4 SV', years: '2001–2010',
      engine: 'V12 6.5L', power: '670 CV', topSpeed: '337 km/h', produced: '350',
      description: "The Murciélago SuperVeloce is the ultimate evolution of the line. Just 350 were built, featuring a stripped interior, fixed rear wing, and an engine tuned to its absolute limit. An analogue masterpiece in the final tradition.",
      img: 'https://images.unsplash.com/photo-1729244226086-366ad9015d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#7FFF00',
    },
    {
      id: 5, era: '2010s', name: 'Aventador LP700-4', years: '2011–2022',
      engine: 'V12 6.5L', power: '700–780 CV', topSpeed: '355 km/h', produced: '11,000+',
      description: "The Aventador was the definitive naturally-aspirated V12 supercar of its era. Its carbon-fibre monocoque, pushrod suspension, and screaming soundtrack placed it at the absolute apex of the supercar hierarchy for over a decade.",
      img: 'https://images.unsplash.com/photo-1600510424051-30d592a75353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#FF4444',
    },
    {
      id: 6, era: '2000s', name: 'Gallardo LP570-4 SL', years: '2003–2013',
      engine: 'V10 5.2L', power: '570 CV', topSpeed: '325 km/h', produced: '14,022',
      description: "The best-selling Lamborghini of all time. The Gallardo democratised the brand while maintaining true supercar DNA. The Superleggera variant stripped weight ruthlessly, delivering one of the greatest driver's cars the brand ever produced.",
      img: 'https://images.unsplash.com/photo-1657769106786-b6f50ac90f5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: '#FF6B35',
    },
  ];

  const sel = selected !== null ? exhibits[selected] : null;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1780901833117-86ade3ac08fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Museum" className="w-full h-full object-cover opacity-25 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-3">Museo Lamborghini</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            The <span className="text-[#FFD700]">Museum</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-sm max-w-lg leading-relaxed tracking-wider">
            Six decades of icons. Every machine that defined an era, preserved and celebrated in Sant'Agata Bolognese.
          </p>
        </div>
      </section>

      {/* Exhibit Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Permanent Collection" title="Icons of History" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exhibits.map((car, i) => (
              <div key={car.id} onClick={() => setSelected(selected === i ? null : i)}
                className={`group relative cursor-pointer overflow-hidden border transition-all duration-300
                  ${selected === i ? 'border-[#FFD700]' : 'border-zinc-900 hover:border-zinc-600'}`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={car.img} alt={car.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${selected === i ? 'opacity-100' : 'opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0'}`} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p style={{ color: car.color }} className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{car.era}</p>
                  <h3 className="text-white font-black text-lg uppercase tracking-wide">{car.name}</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mt-0.5">{car.years}</p>
                </div>
                {selected === i && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#FFD700] flex items-center justify-center">
                    <span className="text-black text-xs font-black">✕</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Panel */}
      {sel && (
        <section className="py-0 bg-zinc-950 border-t border-[#FFD700]/30 transition-all duration-500">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -inset-3 border border-zinc-800" />
                <img src={sel.img} alt={sel.name} className="w-full aspect-video object-cover relative z-10"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }} />
                <div className="absolute bottom-0 left-0 w-full h-[2px] z-20" style={{ background: `linear-gradient(to right, ${sel.color}, transparent)` }} />
              </div>
              <div>
                <p style={{ color: sel.color }} className="text-xs font-black uppercase tracking-[0.4em] mb-3">{sel.era}</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-2">{sel.name}</h2>
                <p className="text-zinc-500 uppercase tracking-widest text-xs mb-8">{sel.years}</p>
                <p className="text-zinc-400 leading-relaxed text-sm mb-10">{sel.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[['Engine', sel.engine], ['Power', sel.power], ['Top Speed', sel.topSpeed], ['Units Produced', sel.produced]].map(([label, val]) => (
                    <div key={label} className="border border-zinc-800 p-4">
                      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-white font-black text-base">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visit info */}
      <section className="py-20 bg-black border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { icon: '📍', label: 'Address', value: 'Via Modena, 12\n40019 Sant\'Agata Bolognese\nItaly' },
              { icon: '🕐', label: 'Opening Hours', value: 'Mon – Fri: 9:00 – 18:00\nSat – Sun: 10:00 – 17:00\nClosed on Italian public holidays' },
              { icon: '🎫', label: 'Admission', value: 'Adults: €15\nChildren (under 12): Free\nOwner\'s Club Members: Free' },
            ].map(item => (
              <div key={item.label} className="border border-zinc-800 p-8"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                <div className="text-2xl mb-4">{item.icon}</div>
                <p className="text-[#FFD700] text-xs uppercase tracking-widest font-bold mb-3">{item.label}</p>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ClipButton gold>Book Your Visit <ChevronRight size={16} /></ClipButton>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── DESIGN PAGE ──────────────────────────────────────────────────────────────
const DesignPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const adPersonamOptions = [
    {
      step: '01', title: 'Exterior Paint',
      desc: 'Choose from over 300 standard colours or commission an exclusive bespoke shade mixed specifically for you. Matte, satin, gloss, or our signature Oro Elios metallic.',
      options: ['Grigio Telesto', 'Bianco Monocerus', 'Nero Nemesis', 'Verde Citrea', 'Blu Cepheus', 'Oro Elios', 'Bespoke Color'],
      img: 'https://images.unsplash.com/photo-1764693756663-211afae0c81d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      step: '02', title: 'Interior Leather',
      desc: 'Nappa leather, Alcantara, or full-grain Connolly hide. Select from single-tone or dual-tone combinations with contrast stitching in any colour imaginable.',
      options: ['Black Nappa', 'Tan Connolly', 'Red Alcantara', 'White Quilted', 'Carbon Alcantara', 'Full Custom'],
      img: 'https://images.unsplash.com/photo-1759166499946-9ab9e7776d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      step: '03', title: 'Carbon Fibre',
      desc: 'Exposed carbon fibre packages for every surface — roof, hood, splitters, diffuser, and interior trim. Forged composite or traditional woven finish.',
      options: ['Gloss 2×2 Weave', 'Matte 2×2 Weave', 'Forged Composite', 'Gold-tinted Carbon', 'Silver Twill'],
      img: 'https://images.unsplash.com/photo-1780901833117-86ade3ac08fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      step: '04', title: 'Wheels & Brakes',
      desc: 'Forged aluminium wheels in 10 designs. Brake callipers in any colour with your personalised script. Carbon ceramic brakes available across the full range.',
      options: ['Leirion 20"', 'Performante 21"', 'Monolock 20"', 'Aesir 21"', 'Custom Painted Calipers'],
      img: 'https://images.unsplash.com/photo-1764693756618-fc101047a387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      step: '05', title: 'Personalisation',
      desc: 'Embroidered headrests with your monogram, laser-etched sill plates, bespoke floor mats, and a unique build plate bearing your name — the finishing touches that make it yours.',
      options: ['Monogram Embroidery', 'Laser-etched Sills', 'Custom Build Plate', 'Bespoke Floor Mats', 'Door Pin Engraving'],
      img: 'https://images.unsplash.com/photo-1764693756664-769420e4ad6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const current = adPersonamOptions[activeStep];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-screen w-full flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1764693756663-211afae0c81d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Design" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-4">Ad Personam Studio</p>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-none tracking-tight">
            Make It<br /><span className="text-[#FFD700]">Yours</span>
          </h1>
          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-xl tracking-wider">
            No two Lamborghinis should be alike. The Ad Personam programme offers unlimited personalisation — from a single contrasting stitch to a completely bespoke, one-of-one commission.
          </p>
          <div className="mt-10 flex gap-4">
            <ClipButton gold>Start Configuring <ChevronRight size={16} /></ClipButton>
            <ClipButton>Visit the Studio</ClipButton>
          </div>
        </div>
      </section>

      {/* Ad Personam Steps */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Ad Personam" title="The Process" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Step selector */}
            <div className="flex flex-col gap-2">
              {adPersonamOptions.map((opt, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`group flex items-start gap-6 p-5 border text-left transition-all duration-300 ${i === activeStep ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-zinc-900 hover:border-zinc-700'}`}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <span className={`text-2xl font-black shrink-0 ${i === activeStep ? 'text-[#FFD700]' : 'text-zinc-700 group-hover:text-zinc-500'}`}>{opt.step}</span>
                  <div>
                    <h3 className={`font-black uppercase tracking-wider text-base ${i === activeStep ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{opt.title}</h3>
                    {i === activeStep && <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{opt.desc}</p>}
                  </div>
                  <ChevronRight size={16} className={`ml-auto shrink-0 mt-1 transition-colors ${i === activeStep ? 'text-[#FFD700]' : 'text-zinc-800'}`} />
                </button>
              ))}
            </div>

            {/* Visual */}
            <div className="sticky top-24">
              <div className="relative mb-8">
                <div className="absolute -inset-3 border border-zinc-800 pointer-events-none" />
                <img src={current.img} alt={current.title} className="w-full aspect-[4/3] object-cover relative z-10 transition-opacity duration-500"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }} />
                <div className="absolute bottom-0 left-0 w-2/3 h-[2px] z-20 bg-gradient-to-r from-[#FFD700] to-transparent" />
              </div>
              <div>
                <p className="text-[#FFD700] text-xs uppercase tracking-[0.4em] font-bold mb-2">{current.step} — Available Options</p>
                <div className="flex flex-wrap gap-2">
                  {current.options.map(opt => (
                    <span key={opt} className="px-3 py-1.5 border border-zinc-700 text-zinc-300 text-[10px] uppercase tracking-widest hover:border-[#FFD700] hover:text-[#FFD700] transition-colors cursor-pointer">{opt}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design principles */}
      <section className="py-20 bg-black border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'No Limits', desc: 'If you can imagine it, we can build it. The Ad Personam studio has no boundaries — every request is taken seriously, no matter how extraordinary.' },
              { num: '02', title: 'Italian Artisanship', desc: 'Every bespoke Lamborghini is hand-finished by the same artisans who build the standard car. Quality is not a department — it is a mindset.' },
              { num: '03', title: 'Unique by Design', desc: 'Your specification is registered and never repeated. Your car\'s configuration is locked permanently — ensuring it remains truly one of one.' },
            ].map(item => (
              <div key={item.num} className="border border-zinc-900 p-8 hover:border-zinc-700 transition-colors"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}>
                <span className="text-5xl font-black text-zinc-900 block mb-4">{item.num}</span>
                <h3 className="text-white font-black uppercase tracking-wider text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── OWNER'S CLUB PAGE ────────────────────────────────────────────────────────
const OwnersClubPage = () => {
  const [activeTier, setActiveTier] = useState(1);
  const [applyOpen, setApplyOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', model: '', tier: 'Oro' });
  const [submitted, setSubmitted] = useState(false);

  const tiers = [
    {
      name: 'Argento', label: 'Silver', color: '#9CA3AF', bg: 'from-zinc-700/20',
      price: '€1,200 / year',
      perks: [
        'Digital membership card & welcome pack',
        'Access to Owner\'s Club online community',
        'Monthly brand newsletter & exclusives',
        'Discounts at Lamborghini Store (10%)',
        'Invitation to regional driving events',
      ],
    },
    {
      name: 'Oro', label: 'Gold', color: '#FFD700', bg: 'from-yellow-900/20',
      price: '€3,500 / year',
      perks: [
        'All Argento benefits',
        'Physical gold membership card',
        'Priority factory tour booking',
        'Invitation to exclusive annual gala dinner',
        'Discounts at Lamborghini Store (20%)',
        'Access to Accademia track day programme',
        'Dedicated owner relations manager',
      ],
    },
    {
      name: 'Diamante', label: 'Diamond', color: '#A5F3FC', bg: 'from-cyan-900/20',
      price: 'By invitation only',
      perks: [
        'All Oro benefits',
        'Private Nardo test track access',
        'One-on-one session with Lamborghini engineers',
        'Exclusive Diamante gala in Sant\'Agata',
        'First access to Squadra Corse limited editions',
        'Personalised gift from the factory',
        'Bespoke travel & concierge service',
        'Annual gift: numbered Lamborghini artwork',
      ],
    },
  ];

  const upcomingEvents = [
    {
      date: 'Aug 14–17, 2025', name: 'Bull Run Italia', location: 'Tuscany, Italy',
      desc: 'Four days driving the most scenic roads of Tuscany in convoy, culminating in a private dinner at a Florentine villa.',
      tier: 'Oro', img: 'https://images.unsplash.com/photo-1674815138812-cb373d0dcda1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 12,
    },
    {
      date: 'Sep 6, 2025', name: 'Factory Gala Evening', location: "Sant'Agata Bolognese, Italy",
      desc: 'An exclusive evening inside the Lamborghini factory. Cocktail reception, museum after-hours access, and unveiling of a new limited series.',
      tier: 'Diamante', img: 'https://images.unsplash.com/photo-1768466589631-d2b64f6a02c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 40,
    },
    {
      date: 'Oct 3–5, 2025', name: 'Nürburgring Experience', location: 'Nürburg, Germany',
      desc: 'Three days of guided lapping sessions at the legendary Nordschleife with Lamborghini factory driver coaching.',
      tier: 'Oro', img: 'https://images.unsplash.com/photo-1699138346782-8a8b211c3da2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 20,
    },
    {
      date: 'Nov 22, 2025', name: 'Tokyo Owners Evening', location: 'Tokyo, Japan',
      desc: 'Exclusive private dinner for Lamborghini owners in Japan. Hosted at a private Roppongi gallery alongside the latest models.',
      tier: 'Argento', img: 'https://images.unsplash.com/photo-1749211525078-77fe2daeb599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 30,
    },
    {
      date: 'Dec 12–14, 2025', name: 'Desert Bull — Dubai', location: 'Dubai, UAE',
      desc: 'A three-day desert convoy across the UAE dunes, followed by a skyline dinner atop Burj Khalifa.',
      tier: 'Oro', img: 'https://images.unsplash.com/photo-1768108691737-0b87dd78ff72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 16,
    },
    {
      date: 'Mar 7–9, 2026', name: 'Geneva Motor Show Gala', location: 'Geneva, Switzerland',
      desc: 'Priority seating at the Lamborghini press conference, private showroom visit, and owners-only gala breakfast.',
      tier: 'Diamante', img: 'https://images.unsplash.com/photo-1760550818632-ccaad94c859f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      spots: 25,
    },
  ];

  const tierColors: Record<string, string> = { Argento: '#9CA3AF', Oro: '#FFD700', Diamante: '#A5F3FC' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 600);
  };

  return (
    <div className="bg-black min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-screen w-full flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1768466589631-d2b64f6a02c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Owner's Club" className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          {/* Diagonal gold overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Decorative hexagon pattern */}
        <div className="absolute top-1/4 right-12 hidden lg:block opacity-10 pointer-events-none">
          {[0,1,2].map(row => (
            <div key={row} className="flex gap-3 mb-3" style={{ marginLeft: row % 2 === 1 ? '24px' : '0' }}>
              {[0,1,2,3].map(col => (
                <div key={col} className="w-10 h-10 border border-[#FFD700] transform rotate-45" />
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-4">Est. 1963 · Worldwide</p>
          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black text-white uppercase leading-none tracking-tight">
            Owner's<br /><span className="text-[#FFD700]">Club</span>
          </h1>
          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-2xl tracking-wider">
            More than a membership — a brotherhood of passion. The Lamborghini Owner's Club connects the world's most dedicated enthusiasts with exclusive experiences, private events, and direct access to the brand that moves them.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ClipButton gold onClick={() => setApplyOpen(true)}>Apply for Membership <ChevronRight size={16} /></ClipButton>
            <ClipButton onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}>View Upcoming Events</ClipButton>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 w-full border-t border-zinc-900/80 bg-black/60 backdrop-blur-sm hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="grid grid-cols-4 divide-x divide-zinc-800">
              {[['12,000+', 'Active Members'], ['60+', 'Countries'], ['200+', 'Events Per Year'], ['3', 'Membership Tiers']].map(([val, label]) => (
                <div key={label} className="flex flex-col items-center py-5 gap-1">
                  <span className="text-2xl font-black text-[#FFD700]">{val}</span>
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Membership Tiers ── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Membership" title="Choose Your Tier" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                onClick={() => setActiveTier(i)}
                className={`relative cursor-pointer border transition-all duration-400 flex flex-col bg-gradient-to-b ${tier.bg} to-transparent
                  ${activeTier === i ? 'border-[#FFD700] scale-[1.02]' : 'border-zinc-800 hover:border-zinc-600'}`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
              >
                {/* Top accent */}
                <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${tier.color}, transparent)` }} />

                <div className="p-8 flex flex-col flex-1">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] font-bold mb-1" style={{ color: tier.color }}>{tier.label}</p>
                      <h3 className="text-3xl font-black text-white uppercase tracking-wider">{tier.name}</h3>
                    </div>
                    <div className="w-12 h-12 border-2 flex items-center justify-center transform rotate-45 transition-colors"
                      style={{ borderColor: tier.color }}>
                      <div className="w-4 h-4 transform -rotate-45" style={{ background: activeTier === i ? tier.color : 'transparent', transition: 'background 0.3s' }} />
                    </div>
                  </div>

                  <p className="text-zinc-300 font-black text-lg mb-8 tracking-wide">{tier.price}</p>

                  {/* Perks */}
                  <ul className="space-y-3 flex-1">
                    {tier.perks.map((perk, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-zinc-400">
                        <span className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 rounded-none" style={{ background: tier.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={e => { e.stopPropagation(); setFormData(f => ({ ...f, tier: tier.name })); setApplyOpen(true); }}
                    className="mt-8 w-full py-4 font-black uppercase tracking-widest text-xs transition-all duration-300"
                    style={{
                      background: activeTier === i ? tier.color : 'transparent',
                      color: activeTier === i ? '#000' : tier.color,
                      border: `1px solid ${tier.color}`,
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                    }}
                  >
                    {tier.price === 'By invitation only' ? 'Request Invitation' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Deep Dive ── */}
      <section className="py-24 bg-black border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Exclusive Access" title="Member Benefits" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900">
            {[
              { icon: '🏎', title: 'Factory Tours', desc: "Walk the production line in Sant'Agata Bolognese. Watch your — or someone else's — Lamborghini come to life, guided by the engineers who built it." },
              { icon: '🏁', title: 'Track Days', desc: 'Accademia coaching sessions at circuits worldwide. From Nürburgring to Laguna Seca, push your car in a controlled, expert-led environment.' },
              { icon: '✈️', title: 'Curated Travel', desc: 'Bull Run rallies across Italy, Scandinavia, Japan, and the Middle East. Extraordinary routes, handpicked hotels, unforgettable memories.' },
              { icon: '🥂', title: 'Gala Events', desc: 'Annual galas, private dinners, and brand celebrations. Meet the designers, drivers, and engineers who shape the Lamborghini legend.' },
              { icon: '🎨', title: 'Limited Editions', desc: 'First access to limited series models and Ad Personam exclusives. Some have never been offered to the public — only to Club members.' },
              { icon: '🤝', title: 'Concierge', desc: 'Your dedicated owner relations manager handles everything from service bookings to travel logistics. Available 7 days a week.' },
            ].map(item => (
              <div key={item.title} className="bg-black p-8 hover:bg-zinc-950 transition-colors group">
                <div className="text-3xl mb-5">{item.icon}</div>
                <h3 className="text-white font-black uppercase tracking-wider text-base mb-3 group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section id="events" className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Calendar 2025–2026" title="Upcoming Events" />
          <div className="space-y-4">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="group flex flex-col lg:flex-row gap-0 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                {/* Image */}
                <div className="lg:w-64 h-44 lg:h-auto flex-shrink-0 overflow-hidden relative">
                  <img src={ev.img} alt={ev.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950 hidden lg:block" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:flex-row items-start lg:items-center gap-4 p-6 lg:p-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5"
                        style={{ background: tierColors[ev.tier] + '22', color: tierColors[ev.tier], border: `1px solid ${tierColors[ev.tier]}44` }}>
                        {ev.tier}
                      </span>
                      <span className="text-zinc-600 text-[10px] uppercase tracking-widest">{ev.location}</span>
                    </div>
                    <h3 className="text-white font-black uppercase tracking-wider text-xl mb-2 group-hover:text-[#FFD700] transition-colors">{ev.name}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-lg">{ev.desc}</p>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[#FFD700] font-black text-sm uppercase tracking-widest">{ev.date}</p>
                      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-0.5">{ev.spots} spots available</p>
                    </div>
                    <button className="px-5 py-2.5 border border-zinc-700 text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700] text-xs font-bold uppercase tracking-widest transition-all"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)' }}>
                      Reserve Spot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="py-24 bg-black border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionTitle label="Gallery" title="Life in the Club" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { img: 'https://images.unsplash.com/photo-1768466589631-d2b64f6a02c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: 'lg:col-span-2 lg:row-span-2' },
              { img: 'https://images.unsplash.com/photo-1674815138812-cb373d0dcda1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: '' },
              { img: 'https://images.unsplash.com/photo-1699138346782-8a8b211c3da2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: '' },
              { img: 'https://images.unsplash.com/photo-1768108691737-0b87dd78ff72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: '' },
              { img: 'https://images.unsplash.com/photo-1749211525078-77fe2daeb599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: '' },
              { img: 'https://images.unsplash.com/photo-1757677048902-a2fede1fea7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', span: 'lg:col-span-2' },
            ].map((item, i) => (
              <div key={i} className={`group overflow-hidden bg-zinc-900 ${item.span}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                <div className="aspect-square lg:h-full min-h-[160px]">
                  <img src={item.img} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "The Bull Run across Tuscany was the most extraordinary driving experience of my life. The roads, the people, the machines — three perfect days.", name: "Alessandro F.", location: "Milan, Italy", tier: "Oro" },
              { quote: "As a Diamante member, I had a private session with the chief test driver at Nardo. I learned more in two hours than in twenty years of track driving.", name: "James T.", location: "London, UK", tier: "Diamante" },
              { quote: "The factory tour arranged by my owner's manager was unforgettable. Seeing my Revuelto being built was unlike anything I've experienced.", name: "Yuki M.", location: "Tokyo, Japan", tier: "Oro" },
            ].map((t, i) => (
              <div key={i} className="border border-zinc-800 p-8 relative"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}>
                <div className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent" />
                <span className="text-5xl text-[#FFD700] font-serif leading-none block mb-4">"</span>
                <p className="text-zinc-300 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm uppercase tracking-wider">{t.name}</p>
                    <p className="text-zinc-600 text-xs uppercase tracking-widest mt-0.5">{t.location}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1"
                    style={{ color: tierColors[t.tier], border: `1px solid ${tierColors[t.tier]}55` }}>
                    {t.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apply CTA ── */}
      <section className="py-28 bg-black border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#FFD700]/50 via-[#FFD700]/20 to-transparent" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <LamboBullLogo size={64} className="mx-auto mb-8 opacity-80" />
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-4">Join the Brotherhood</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6">
            Become a Member
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed tracking-wider mb-12">
            The Lamborghini Owner's Club is open to all owners of new and pre-owned Lamborghini vehicles. Apply today and begin your journey into the world's most exclusive automotive community.
          </p>
          <ClipButton gold onClick={() => setApplyOpen(true)}>Apply for Membership <ChevronRight size={16} /></ClipButton>
        </div>
      </section>

      {/* ── Application Modal ── */}
      {applyOpen && (
        <ModalOverlay onClose={() => { setApplyOpen(false); setSubmitted(false); }}>
          <div className="relative bg-[#0a0a0a] border border-zinc-800 w-full max-w-lg mx-4 p-8 md:p-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent" />
            <button onClick={() => { setApplyOpen(false); setSubmitted(false); }} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"><X size={20} /></button>

            {submitted ? (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <LamboBullLogo size={56} className="opacity-90" />
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Application Received</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                  Welcome to the Lamborghini family. Your application for <span className="text-[#FFD700] font-bold">{formData.tier}</span> membership is under review. A dedicated owner relations manager will contact you within 48 hours.
                </p>
                <ClipButton gold onClick={() => { setApplyOpen(false); setSubmitted(false); }}>Close <ChevronRight size={14} /></ClipButton>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <LamboBullLogo size={36} />
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Apply for Membership</h2>
                    <p className="text-zinc-500 text-xs mt-0.5 uppercase tracking-widest">Owner's Club</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <InputField label="Full Name" value={formData.name} onChange={v => setFormData(f => ({ ...f, name: v }))} placeholder="Your full name" />
                  <InputField label="Email Address" type="email" value={formData.email} onChange={v => setFormData(f => ({ ...f, email: v }))} placeholder="your@email.com" />
                  <InputField label="Lamborghini Model Owned" value={formData.model} onChange={v => setFormData(f => ({ ...f, model: v }))} placeholder="e.g. Revuelto, Urus SE..." />
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 uppercase tracking-widest text-xs font-semibold">Membership Tier</label>
                    <div className="grid grid-cols-3 gap-2">
                      {tiers.map(tier => (
                        <button key={tier.name} type="button"
                          onClick={() => setFormData(f => ({ ...f, tier: tier.name }))}
                          className="py-3 text-xs font-bold uppercase tracking-widest border transition-all duration-200"
                          style={{
                            borderColor: formData.tier === tier.name ? tier.color : '#3f3f46',
                            color: formData.tier === tier.name ? tier.color : '#71717a',
                            background: formData.tier === tier.name ? tier.color + '15' : 'transparent',
                          }}>
                          {tier.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ClipButton gold onClick={() => {}} className="mt-2 w-full justify-center">
                    Submit Application
                  </ClipButton>
                </form>
              </>
            )}
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

// ─── OWNERSHIP PAGE ───────────────────────────────────────────────────────────
const OwnershipPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Owner's Club", 'Maintenance', 'Track Days', 'Roadside Assist'];

  const tabContent = [
    {
      title: "The Owner's Club",
      desc: "Membership in the Lamborghini Owner's Club connects you with a global community of passionate owners. Exclusive events, private factory tours, first access to limited editions, and lifelong brand relationships.",
      img: 'https://images.unsplash.com/photo-1696178946353-b2c37dc7df7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      perks: ["Private factory tours in Sant'Agata", 'Invitations to global owner gatherings', 'First access to limited series models', 'Exclusive Squadra Corse track experiences', 'Dedicated lifestyle events worldwide'],
    },
    {
      title: 'Certified Maintenance',
      desc: "Every Lamborghini deserves care that matches its engineering. Our Certified Aftersales network spans 160+ countries, with technicians trained exclusively on your model by the factory team that built it.",
      img: 'https://images.unsplash.com/photo-1780901833117-86ade3ac08fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      perks: ['Factory-trained technicians', 'Genuine OEM parts, worldwide', 'Lamborghini Certified Pre-Owned programme', 'Extended warranty packages', 'Digital service history tracking'],
    },
    {
      title: 'Track Experience Days',
      desc: "Push your Lamborghini to its absolute limits in a safe, controlled environment. Our Accademia programme is run by professional racing drivers and offers everything from introduction courses to circuit mastery.",
      img: 'https://images.unsplash.com/photo-1699138346782-8a8b211c3da2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      perks: ['Accademia driver coaching programme', 'Access to circuits across 4 continents', 'Professional racing instructor on circuit', 'Lamborghini performance fleet', 'Timed lap sessions with data analysis'],
    },
    {
      title: 'Roadside Assistance',
      desc: "Lamborghini Assistance is available 24 hours a day, 365 days a year, in over 100 countries. Operated by the Lamborghini network, our technicians speak your language and understand your car.",
      img: 'https://images.unsplash.com/photo-1764693756664-769420e4ad6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      perks: ['24/7 emergency assistance globally', '100+ country coverage', 'Factory-trained field technicians', 'Secure vehicle recovery & transport', 'Courtesy car arrangement'],
    },
  ];

  const active = tabContent[activeTab];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[65vh] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Ownership" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 w-full">
          <p className="text-[#FFD700] uppercase tracking-[0.5em] text-xs font-bold mb-3">After The Keys</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            The <span className="text-[#FFD700]">Ownership</span><br />Experience
          </h1>
          <p className="mt-5 text-zinc-400 text-sm leading-relaxed max-w-xl tracking-wider">
            Owning a Lamborghini is the beginning of a relationship, not the end of a transaction. We support every owner throughout the entire life of their car — and beyond.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-zinc-950 border-b border-zinc-900 sticky top-[72px] z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`flex-none px-8 py-5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap
                  ${activeTab === i ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-24 bg-black">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle label={tabs[activeTab]} title={active.title} />
              <p className="text-zinc-400 leading-relaxed text-sm mb-10">{active.desc}</p>
              <ul className="space-y-4 mb-10">
                {active.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-300 text-sm">
                    <span className="w-1.5 h-1.5 bg-[#FFD700] flex-shrink-0" />
                    <span className="uppercase tracking-wider">{perk}</span>
                  </li>
                ))}
              </ul>
              <ClipButton gold>Learn More <ChevronRight size={16} /></ClipButton>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 border border-zinc-900 pointer-events-none" />
              <img src={active.img} alt={active.title}
                className="w-full aspect-[4/3] object-cover relative z-10 transition-opacity duration-500"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)' }} />
              <div className="absolute bottom-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Dealer network */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
            {[['160+', 'Countries'], ['10,000+', 'Service Visits / Year'], ['5,000+', 'Trained Technicians'], ['24/7', 'Global Assistance']].map(([val, label]) => (
              <div key={label} className="border border-zinc-800 py-8 px-4">
                <p className="text-3xl md:text-4xl font-black text-[#FFD700] mb-2">{val}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-bold mb-4">Find Your Dealer</p>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-6">We're Near You</h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-10 leading-relaxed">With over 160 authorised dealers globally, expert Lamborghini care is never far away.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ClipButton gold>Find a Dealer <ChevronRight size={16} /></ClipButton>
              <ClipButton>Contact Us</ClipButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <footer className="bg-[#0a0a0a] border-t border-zinc-900 pt-20 pb-10">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => onNavigate('home')}>
            <LamboBullLogo size={32} />
            <LamboWordmark size="sm" className="group-hover:text-[#FFD700] transition-colors" />
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">Automobili Lamborghini S.p.A.<br />Via Design, 1 – 40019<br />Sant'Agata Bolognese (BO) – Italy</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Models</h4>
          <ul className="space-y-4 flex flex-col">
            {['Revuelto', 'Temerario', 'Urus SE', 'Limited Series'].map(m => (
              <button key={m} onClick={() => onNavigate('models')} className="text-left text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-wider">{m}</button>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Discover</h4>
          <ul className="space-y-4 flex flex-col">
            {[["Owner's Club", 'ownersclub'], ['Heritage', 'heritage'], ['Motorsport', 'motorsport'], ['Museum', 'museum'], ['Design', 'design']].map(([label, page]) => (
              <button key={label} onClick={() => onNavigate(page)} className="text-left text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-wider">{label}</button>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Connect</h4>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 uppercase tracking-widest">
        <p>&copy; 2026 Automobili Lamborghini S.p.A. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400">Terms of Use</a>
          <a href="#" className="hover:text-zinc-400">Cookie Settings</a>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'signin' | 'register'>('signin');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const openLogin = (tab: 'signin' | 'register' = 'signin') => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-[#FFD700] selection:text-black overflow-x-hidden">
      <Header
        currentPage={currentPage}
        setCurrentPage={navigate}
        user={user}
        onLoginClick={() => openLogin('signin')}
        onRegisterClick={() => openLogin('register')}
        onLogout={() => setUser(null)}
        onChangePassword={() => setShowChangePassword(true)}
      />

      <main>
        {currentPage === 'home' && (
          <>
            <Hero onNavigate={navigate} />
            <HomeLineup onNavigate={navigate} />
            <BrandSection onNavigate={navigate} />
          </>
        )}
        {currentPage === 'models' && <ModelsPage />}
        {currentPage === 'heritage' && <HeritagePage />}
        {currentPage === 'motorsport' && <MotorsportPage />}
        {currentPage === 'store' && <StorePage />}
        {currentPage === 'museum' && <MuseumPage />}
        {currentPage === 'design' && <DesignPage />}
        {currentPage === 'ownership' && <OwnershipPage />}
        {currentPage === 'ownersclub' && <OwnersClubPage />}
      </main>

      <Footer onNavigate={navigate} />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={u => setUser(u)} defaultTab={loginTab} />
      )}
      {showChangePassword && user && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} user={user} />
      )}
    </div>
  );
}
