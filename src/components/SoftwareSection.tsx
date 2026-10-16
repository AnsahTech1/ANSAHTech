import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Github, ExternalLink, Info, Code2, Terminal } from 'lucide-react';
import { SoftwareProject, SoftwareCategory } from '../types';

interface SoftwareSectionProps {
  projects: SoftwareProject[];
  onSelectProject: (project: SoftwareProject) => void;
}

const CATEGORIES: ('All' | SoftwareCategory)[] = [
  'All',
  'C/C++',
  'C#',
  'JavaScript/HTML/CSS',
  'Three.js',
];

export default function SoftwareSection({ projects, onSelectProject }: SoftwareSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | SoftwareCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects by category and real-time search query (title & description)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="software" className="py-20 sm:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-cyan-400" />
            <span>Systems &amp; Interactive Graphics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Software Engineering
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
            Low-level systems code, real-time shaders, and reactive web applications engineered for deterministic throughput and zero memory bloat.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          
          {/* Real-time Search Input Field */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or keywords..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-neutral-400 hover:text-black dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Category Segmented Controls (Functional buttons per guidelines) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-cyan-400 dark:text-cyan-600' : 'text-neutral-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Search Status */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          <div className="flex items-center gap-2">
            <span>Showing {filteredProjects.length} of {projects.length} software projects</span>
            {searchQuery && (
              <>
                <span aria-hidden="true">·</span>
                <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              </>
            )}
          </div>
          {searchQuery && filteredProjects.length === 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Software Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-8">
            <Code2 className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-900 dark:text-white">No matching projects found</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Try adjusting your search query or switching language categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-all duration-200 p-6 relative"
              >
                {/* Top Info & Metadata (Zero-pill discipline: unboxed text with separators) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    <span className="font-mono text-cyan-700 dark:text-cyan-400 font-medium">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{project.createdAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2.5">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Architecture spec or performance metric highlight if present */}
                  {project.performanceMetric && (
                    <div className="text-xs font-mono text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 p-2 mb-4 border border-neutral-200/60 dark:border-neutral-700 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="truncate">{project.performanceMetric}</span>
                    </div>
                  )}

                  {/* Tags: unboxed text with typographic bullet separator per anti-slop rules */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tag} className="flex items-center">
                        <span className="text-neutral-700 dark:text-neutral-300">{tag}</span>
                        {tIdx < project.tags.length - 1 && <span className="text-neutral-300 dark:text-neutral-600 ml-2">/</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1 cursor-pointer"
                    title="Inspect architecture specification"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Specs</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
