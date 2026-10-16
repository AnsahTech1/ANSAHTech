import { useState } from 'react';
import { Menu, X, Shield, Terminal, ArrowRight, Bot, Sun, Moon } from 'lucide-react';
import AnsahLogo from './AnsahLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  onOpenAi: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isAdminOpen, 
  setIsAdminOpen, 
  onOpenAi,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Software', href: '#software' },
    { label: 'Hardware', href: '#hardware' },
    { label: 'Updates', href: '#updates' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setActiveTab(href.replace('#', ''));
    setMobileMenuOpen(false);
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Text Element Brand Wordmark with Logo */}
        <a
          href="#home"
          onClick={() => handleNavClick('#home')}
          className="group flex items-center gap-2 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          <AnsahLogo variant="full" size={30} color={theme === 'dark' ? '#ffffff' : '#0a0a0a'} />
        </a>

        {/* Zone 2: 4-5 Clean Single-Line Text Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {navLinks.map((link) => {
            const isActive = activeTab === link.href.replace('#', '') && !isAdminOpen;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  isActive
                    ? 'text-neutral-900 dark:text-white border-neutral-900 dark:border-white'
                    : 'border-transparent hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Discreet Admin */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* AI Agent Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            title="Ask ANSAH AI Technical Agent"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
            <span>AI Agent</span>
          </button>

          {/* Discreet Admin Button */}
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isAdminOpen
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
            title="Access private Admin Dashboard to add/manage entries"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Admin</span>
            {isAdminOpen && <span className="text-[10px] bg-cyan-500 text-black px-1 font-mono font-bold">Active</span>}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-cyan-600 border-b border-neutral-100 dark:border-neutral-800"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
                <span>{theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
              </span>
            </button>
            <button
              onClick={() => {
                onOpenAi();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
                <span>Ask AI Technical Agent</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Admin Dashboard</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
