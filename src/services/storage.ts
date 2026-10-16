import { SoftwareProject, HardwareAchievement, EngineeringUpdate } from '../types';
import { INITIAL_SOFTWARE_PROJECTS, INITIAL_HARDWARE_ACHIEVEMENTS, INITIAL_UPDATES } from '../data/initialData';

const SOFTWARE_KEY = 'vance_portfolio_software_projects';
const HARDWARE_KEY = 'vance_portfolio_hardware_achievements';
const UPDATES_KEY = 'vance_portfolio_engineering_updates';

export const storage = {
  getSoftwareProjects(): SoftwareProject[] {
    try {
      const stored = localStorage.getItem(SOFTWARE_KEY);
      if (!stored) {
        localStorage.setItem(SOFTWARE_KEY, JSON.stringify(INITIAL_SOFTWARE_PROJECTS));
        return INITIAL_SOFTWARE_PROJECTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SOFTWARE_PROJECTS;
    }
  },

  saveSoftwareProjects(projects: SoftwareProject[]): void {
    try {
      localStorage.setItem(SOFTWARE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save software projects to localStorage:', e);
    }
  },

  getHardwareAchievements(): HardwareAchievement[] {
    try {
      const stored = localStorage.getItem(HARDWARE_KEY);
      if (!stored) {
        localStorage.setItem(HARDWARE_KEY, JSON.stringify(INITIAL_HARDWARE_ACHIEVEMENTS));
        return INITIAL_HARDWARE_ACHIEVEMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_HARDWARE_ACHIEVEMENTS;
    }
  },

  saveHardwareAchievements(achievements: HardwareAchievement[]): void {
    try {
      localStorage.setItem(HARDWARE_KEY, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save hardware achievements to localStorage:', e);
    }
  },

  getEngineeringUpdates(): EngineeringUpdate[] {
    try {
      const stored = localStorage.getItem(UPDATES_KEY);
      if (!stored) {
        localStorage.setItem(UPDATES_KEY, JSON.stringify(INITIAL_UPDATES));
        return INITIAL_UPDATES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_UPDATES;
    }
  },

  saveEngineeringUpdates(updates: EngineeringUpdate[]): void {
    try {
      localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
    } catch (e) {
      console.error('Failed to save updates to localStorage:', e);
    }
  },

  getHero3dPhoto(): string | null {
    try {
      return localStorage.getItem('ansah_hero_3d_photo') || null;
    } catch {
      return null;
    }
  },

  saveHero3dPhoto(base64: string): void {
    try {
      localStorage.setItem('ansah_hero_3d_photo', base64);
    } catch (e) {
      console.error('Failed to save 3d photo to localStorage:', e);
    }
  },

  removeHero3dPhoto(): void {
    try {
      localStorage.removeItem('ansah_hero_3d_photo');
    } catch (e) {
      console.error('Failed to remove 3d photo from localStorage:', e);
    }
  },

  getTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem('ansah_portfolio_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem('ansah_portfolio_theme', theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  },

  resetToDefaults(): {
    software: SoftwareProject[];
    hardware: HardwareAchievement[];
    updates: EngineeringUpdate[];
  } {
    try {
      localStorage.setItem(SOFTWARE_KEY, JSON.stringify(INITIAL_SOFTWARE_PROJECTS));
      localStorage.setItem(HARDWARE_KEY, JSON.stringify(INITIAL_HARDWARE_ACHIEVEMENTS));
      localStorage.setItem(UPDATES_KEY, JSON.stringify(INITIAL_UPDATES));
      localStorage.removeItem('ansah_hero_3d_photo');
    } catch (e) {
      console.error('Failed to reset storage:', e);
    }
    return {
      software: INITIAL_SOFTWARE_PROJECTS,
      hardware: INITIAL_HARDWARE_ACHIEVEMENTS,
      updates: INITIAL_UPDATES
    };
  }
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
