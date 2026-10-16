import { ArrowUpRight, Cpu, Terminal, Bot } from 'lucide-react';
import HeroThreeCanvas from './HeroThreeCanvas';
import AnsahLogo from './AnsahLogo';

interface HeroSectionProps {
  onOpenAi: () => void;
  photoUrl?: string | null;
  onUploadPhoto?: (base64: string) => void;
  onRemovePhoto?: () => void;
  theme?: 'light' | 'dark';
}

export default function HeroSection({ 
  onOpenAi, 
  photoUrl, 
  onUploadPhoto, 
  onRemovePhoto,
  theme = 'light',
}: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-black transition-colors">
      {/* Three.js Interactive Background Canvas */}
      <HeroThreeCanvas 
        photoUrl={photoUrl}
        onUploadPhoto={onUploadPhoto}
        onRemovePhoto={onRemovePhoto}
        theme={theme}
      />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 w-full pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {/* Subtle kicker with Logo Mark */}
          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-5">
            <AnsahLogo variant="mark" size={20} color={theme === 'dark' ? '#ffffff' : '#0a0a0a'} />
            <span className="text-neutral-900 dark:text-white font-bold">ANSAH Technology</span>
            <span aria-hidden="true">·</span>
            <span>Developer &amp; Hardware Engineering</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08] mb-6">
            Developer &amp; <br />
            Hardware Engineer.
          </h1>

          {/* Subtitle / Lead */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mb-8">
            Specializing in high-performance native systems (C/C++, C#, WebGL/Three.js) combined with physical infrastructure engineering: commercial CCTV network architecture, commercial solar PV arrays, and embedded firmware.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#software"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <span>Explore Software</span>
              <Terminal className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
            </a>

            <a
              href="#hardware"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span>Hardware Infrastructure</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </a>

            <button
              onClick={onOpenAi}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-400 hover:bg-white dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Ask AI Agent</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span>Inquiries</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Quantitative Proof Strip (Full-width row below hero split per portfolio design standards) */}
      <div className="relative z-10 w-full bg-white/90 dark:bg-black/90 backdrop-blur-xs border-t border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                48<span className="text-sm font-sans font-normal text-cyan-600 dark:text-cyan-400 ml-1">kWp</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Solar PV Commissioned</div>
            </div>

            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                120<span className="text-sm font-sans font-normal text-cyan-600 dark:text-cyan-400 ml-1">+</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Commercial CCTV Nodes</div>
            </div>

            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                04<span className="text-sm font-sans font-normal text-cyan-600 dark:text-cyan-400 ml-1">Stacks</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">C/C++, C#, WebGL, RTOS</div>
            </div>

            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums flex items-center gap-1.5">
                100<span className="text-sm font-sans font-normal text-cyan-600 dark:text-cyan-400">%</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Deterministic Architecture</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
