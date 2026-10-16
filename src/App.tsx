import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SoftwareSection from './components/SoftwareSection';
import HardwareSection from './components/HardwareSection';
import UpdatesSection from './components/UpdatesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProjectModal from './components/ProjectModal';
import AiAssistantModal from './components/AiAssistantModal';
import { SoftwareProject, HardwareAchievement, EngineeringUpdate } from './types';
import { storage } from './services/storage';

export default function App() {
  const [softwareProjects, setSoftwareProjects] = useState<SoftwareProject[]>(() =>
    storage.getSoftwareProjects()
  );
  const [hardwareAchievements, setHardwareAchievements] = useState<HardwareAchievement[]>(() =>
    storage.getHardwareAchievements()
  );
  const [engineeringUpdates, setEngineeringUpdates] = useState<EngineeringUpdate[]>(() =>
    storage.getEngineeringUpdates()
  );

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedItem, setSelectedItem] = useState<SoftwareProject | HardwareAchievement | null>(null);

  // Custom 3D photo texture for Hero Three.js canvas
  const [heroPhoto, setHeroPhoto] = useState<string | null>(() => storage.getHero3dPhoto());

  // Light & Dark theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storage.getTheme());

  // Sync Tailwind 'dark' class and styles on document.documentElement and body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0a0a0a';
    }
    storage.saveTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleUpdateHeroPhoto = (base64: string) => {
    setHeroPhoto(base64);
    storage.saveHero3dPhoto(base64);
  };

  const handleRemoveHeroPhoto = () => {
    setHeroPhoto(null);
    storage.removeHero3dPhoto();
  };

  // Sync with browser URL / hash for /admin or #admin
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Update hash when opening or closing admin
  const handleToggleAdmin = (open: boolean) => {
    setIsAdminOpen(open);
    if (open) {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.location.hash === '#admin') {
        history.pushState(null, '', ' ');
      }
    }
  };

  // Software Handlers
  const handleAddSoftware = (project: SoftwareProject) => {
    const updated = [project, ...softwareProjects];
    setSoftwareProjects(updated);
    storage.saveSoftwareProjects(updated);
  };

  const handleDeleteSoftware = (id: string) => {
    const updated = softwareProjects.filter((p) => p.id !== id);
    setSoftwareProjects(updated);
    storage.saveSoftwareProjects(updated);
  };

  // Hardware Handlers
  const handleAddHardware = (achievement: HardwareAchievement) => {
    const updated = [achievement, ...hardwareAchievements];
    setHardwareAchievements(updated);
    storage.saveHardwareAchievements(updated);
  };

  const handleDeleteHardware = (id: string) => {
    const updated = hardwareAchievements.filter((h) => h.id !== id);
    setHardwareAchievements(updated);
    storage.saveHardwareAchievements(updated);
  };

  // Reset to initial seed
  const handleResetAll = () => {
    const defaults = storage.resetToDefaults();
    setSoftwareProjects(defaults.software);
    setHardwareAchievements(defaults.hardware);
    setEngineeringUpdates(defaults.updates);
    setHeroPhoto(null);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'bg-white text-neutral-900'} selection:bg-neutral-900 dark:selection:bg-cyan-500 selection:text-cyan-400 dark:selection:text-black transition-colors`}>
      {isAdminOpen ? (
        <AdminDashboard
          softwareProjects={softwareProjects}
          hardwareAchievements={hardwareAchievements}
          heroPhoto={heroPhoto}
          onAddSoftware={handleAddSoftware}
          onDeleteSoftware={handleDeleteSoftware}
          onAddHardware={handleAddHardware}
          onDeleteHardware={handleDeleteHardware}
          onUpdateHeroPhoto={handleUpdateHeroPhoto}
          onRemoveHeroPhoto={handleRemoveHeroPhoto}
          onResetAll={handleResetAll}
          onClose={() => handleToggleAdmin(false)}
        />
      ) : (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAdminOpen={isAdminOpen}
            setIsAdminOpen={handleToggleAdmin}
            onOpenAi={() => setIsAiAssistantOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          <main>
            <HeroSection 
              onOpenAi={() => setIsAiAssistantOpen(true)} 
              photoUrl={heroPhoto}
              onUploadPhoto={handleUpdateHeroPhoto}
              onRemovePhoto={handleRemoveHeroPhoto}
              theme={theme}
            />
            <SoftwareSection
              projects={softwareProjects}
              onSelectProject={(p) => setSelectedItem(p)}
            />
            <HardwareSection
              achievements={hardwareAchievements}
              onSelectAchievement={(h) => setSelectedItem(h)}
            />
            <UpdatesSection updates={engineeringUpdates} />
            <ContactSection />
          </main>

          <Footer 
            onOpenAdmin={() => handleToggleAdmin(true)} 
            theme={theme}
          />

          {/* Floating AI Technical Agent Trigger */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider border border-neutral-800 dark:border-neutral-200 shadow-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer group"
            title="Ask ANSAH AI Technical Agent"
          >
            <Bot className="w-4 h-4 text-cyan-400 dark:text-cyan-600 group-hover:rotate-12 transition-transform" />
            <span>AI Agent</span>
          </button>

          {/* Project Details Modal */}
          <ProjectModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />

          {/* AI Technical Agent Modal */}
          <AiAssistantModal
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            theme={theme}
          />
        </>
      )}
    </div>
  );
}
