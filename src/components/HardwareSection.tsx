import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sun, Cpu, Calendar, MapPin, Maximize2, ExternalLink } from 'lucide-react';
import { HardwareAchievement, HardwareCategory } from '../types';

interface HardwareSectionProps {
  achievements: HardwareAchievement[];
  onSelectAchievement: (achievement: HardwareAchievement) => void;
}

const CATEGORIES: ('All' | HardwareCategory)[] = [
  'All',
  'CCTV Systems',
  'Solar Electrical Installations',
  'IoT & Embedded',
];

export default function HardwareSection({ achievements, onSelectAchievement }: HardwareSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | HardwareCategory>('All');

  const filteredAchievements = achievements.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const getCategoryIcon = (category: HardwareCategory) => {
    switch (category) {
      case 'CCTV Systems':
        return <Camera className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Solar Electrical Installations':
        return <Sun className="w-3.5 h-3.5 text-cyan-600" />;
      case 'IoT & Embedded':
        return <Cpu className="w-3.5 h-3.5 text-cyan-600" />;
    }
  };

  return (
    <section id="hardware" className="py-20 sm:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-cyan-400" />
              <span>Physical Infrastructure &amp; Power</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
              Hardware &amp; Electrical Deployments
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
              Commercial-grade on-premise surveillance topography, high-capacity solar photovoltaic power plants, and bespoke micro-controller circuit designs.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hardware Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredAchievements.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-all duration-200"
            >
              <div>
                {/* Photo Preview Container with Zero-Broken-Image Fallback */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 cursor-pointer"
                  onClick={() => onSelectAchievement(item)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback container if no image or image fails */}
                  <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                    {getCategoryIcon(item.category)}
                    <span className="text-xs font-mono mt-2">{item.category}</span>
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium tracking-wide flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Expand Engineering Details</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Metadata Row: Category & Date Badge (Zero-pill discipline) */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(item.category)}
                      <span className="font-mono text-neutral-700 dark:text-neutral-300">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 font-mono">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{item.dateBadge}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectAchievement(item)}
                    className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer mb-2.5"
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Technical Specifications Matrix */}
                  {item.technicalSpecs && item.technicalSpecs.length > 0 && (
                    <div className="border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 p-3 mb-6">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        Commissioning Specs
                      </div>
                      <dl className="grid grid-cols-1 gap-2 text-xs">
                        {item.technicalSpecs.map((spec) => (
                          <div key={spec.label} className="flex justify-between items-baseline gap-2 border-b border-neutral-200/50 dark:border-neutral-800 pb-1 last:border-0 last:pb-0">
                            <dt className="text-neutral-500 dark:text-neutral-400 truncate">{spec.label}</dt>
                            <dd className="font-mono font-medium text-neutral-900 dark:text-white text-right truncate tabular-nums">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {item.locationOrClient && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Site: {item.locationOrClient}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#121212] flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectAchievement(item)}
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  View Full Brief &rarr;
                </button>

                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1"
                    title="Schematics or repository"
                  >
                    <span>Schematic</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
