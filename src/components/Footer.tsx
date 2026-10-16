import { ArrowUp, Terminal, Shield } from 'lucide-react';
import AnsahLogo from './AnsahLogo';

interface FooterProps {
  onOpenAdmin: () => void;
  theme?: 'light' | 'dark';
}

export default function Footer({ onOpenAdmin, theme = 'light' }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="mb-2">
              <AnsahLogo variant="full" size={26} color={theme === 'dark' ? '#ffffff' : '#0a0a0a'} />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Systems Development &amp; Electrical Hardware Engineering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-neutral-300">
            <a href="#home" className="hover:text-black dark:hover:text-white transition-colors">Home</a>
            <a href="#software" className="hover:text-black dark:hover:text-white transition-colors">Software</a>
            <a href="#hardware" className="hover:text-black dark:hover:text-white transition-colors">Hardware</a>
            <a href="#updates" className="hover:text-black dark:hover:text-white transition-colors">Updates</a>
            <a href="#contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
            
            {/* Discreet Admin link per user requirements */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Open Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 dark:text-neutral-500 text-[11px] font-mono">
          <div>
            &copy; {new Date().getFullYear()} ANSAH Technology. Built with React, Tailwind CSS, and Three.js.
          </div>
          <div>
            Zero-database client state &middot; LocalStorage synchronized
          </div>
        </div>
      </div>
    </footer>
  );
}
