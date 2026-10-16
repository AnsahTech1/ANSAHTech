export type SoftwareCategory = 'C/C++' | 'C#' | 'JavaScript/HTML/CSS' | 'Three.js';

export type HardwareCategory = 'CCTV Systems' | 'Solar Electrical Installations' | 'IoT & Embedded';

export interface SoftwareProject {
  id: string;
  title: string;
  description: string;
  category: SoftwareCategory;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  image?: string;
  architectureDetails?: string;
  performanceMetric?: string;
  createdAt: string;
}

export interface HardwareAchievement {
  id: string;
  title: string;
  description: string;
  category: HardwareCategory;
  dateBadge: string;
  image: string;
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  locationOrClient?: string;
  githubUrl?: string;
  createdAt: string;
}

export interface EngineeringUpdate {
  id: string;
  date: string;
  title: string;
  category: 'Software' | 'Hardware' | 'Infrastructure' | 'Milestone';
  description: string;
  versionOrCode?: string;
}
