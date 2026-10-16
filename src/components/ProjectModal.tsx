import { useEffect } from 'react';
import { X, Github, ExternalLink, Calendar, MapPin, Terminal, Check } from 'lucide-react';
import { SoftwareProject, HardwareAchievement } from '../types';

interface ProjectModalProps {
  item: SoftwareProject | HardwareAchievement | null;
  onClose: () => void;
}

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isHardware = 'dateBadge' in item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black border border-neutral-200 hover:border-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-500 mb-2">
            <span className="text-cyan-700 font-semibold">{item.category}</span>
            <span aria-hidden="true">·</span>
            {isHardware ? (
              <span className="flex items-center gap-1 text-neutral-700">
                <Calendar className="w-3 h-3 text-neutral-400" />
                <span>{(item as HardwareAchievement).dateBadge}</span>
              </span>
            ) : (
              <span className="tabular-nums">{(item as SoftwareProject).createdAt}</span>
            )}
            {isHardware && (item as HardwareAchievement).locationOrClient && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>{(item as HardwareAchievement).locationOrClient}</span>
                </span>
              </>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {item.title}
          </h2>
        </div>

        {/* Image Preview if available */}
        {item.image && (
          <div className="mb-6 overflow-hidden border border-neutral-200 aspect-16/9 bg-neutral-100">
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Main Description */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Executive Summary
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Architecture details for Software */}
        {!isHardware && (item as SoftwareProject).architectureDetails && (
          <div className="mb-6 border-l-2 border-neutral-900 bg-neutral-50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-600" />
              <span>Architectural Specification</span>
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {(item as SoftwareProject).architectureDetails}
            </p>
          </div>
        )}

        {/* Technical Specs for Hardware */}
        {isHardware && (item as HardwareAchievement).technicalSpecs && (
          <div className="mb-6 border border-neutral-200 bg-neutral-50/60 p-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
              Commissioning Specifications
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(item as HardwareAchievement).technicalSpecs.map((spec) => (
                <div key={spec.label} className="border-b border-neutral-200/60 pb-1.5">
                  <dt className="text-neutral-500">{spec.label}</dt>
                  <dd className="font-mono font-medium text-neutral-900 mt-0.5">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Tags for Software */}
        {!isHardware && (item as SoftwareProject).tags && (
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Technology Stack
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-700">
              {(item as SoftwareProject).tags.map((tag, idx) => (
                <span key={tag} className="flex items-center">
                  <span className="bg-neutral-100 px-2 py-1 border border-neutral-200">{tag}</span>
                  {idx < (item as SoftwareProject).tags.length - 1 && <span className="text-neutral-300 ml-2">/</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Open Repository</span>
              </a>
            )}

            {!isHardware && (item as SoftwareProject).demoUrl && (
              <a
                href={(item as SoftwareProject).demoUrl}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-300 text-neutral-800 hover:border-black transition-colors"
              >
                <span>Live Interactive View</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-neutral-500 hover:text-black uppercase tracking-wider"
          >
            Dismiss [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
