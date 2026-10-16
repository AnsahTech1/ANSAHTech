import { EngineeringUpdate } from '../types';
import { GitCommit, Tag } from 'lucide-react';

interface UpdatesSectionProps {
  updates: EngineeringUpdate[];
}

export default function UpdatesSection({ updates }: UpdatesSectionProps) {
  return (
    <section id="updates" className="py-20 sm:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-cyan-400" />
            <span>Changelog &amp; Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Engineering Updates
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
            A chronological release log of firmware iterations, hardware site acceptance, and systems software deployments.
          </p>
        </div>

        {/* Timeline List */}
        <div className="max-w-4xl border-l border-neutral-300 dark:border-neutral-800 ml-2 sm:ml-4 pl-6 sm:pl-8 space-y-10">
          {updates.map((update) => (
            <div key={update.id} className="relative group">
              {/* Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 bg-white dark:bg-black border-2 border-neutral-400 dark:border-neutral-600 group-hover:border-cyan-500 dark:group-hover:border-cyan-400 transition-colors" />

              {/* Meta strip (Zero-pill discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-1.5">
                <span className="text-neutral-900 dark:text-white font-medium tabular-nums">{update.date}</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-medium">{update.category}</span>
                {update.versionOrCode && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                      <span>{update.versionOrCode}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Update Title */}
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {update.title}
              </h3>

              {/* Update Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                {update.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
