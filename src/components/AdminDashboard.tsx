import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Plus, 
  Upload, 
  Trash2, 
  RotateCcw, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  FileJson,
  Layers,
  Cpu,
  Code2,
  Box
} from 'lucide-react';
import { SoftwareProject, HardwareAchievement, SoftwareCategory, HardwareCategory } from '../types';
import { fileToBase64, storage } from '../services/storage';

interface AdminDashboardProps {
  softwareProjects: SoftwareProject[];
  hardwareAchievements: HardwareAchievement[];
  heroPhoto: string | null;
  onAddSoftware: (project: SoftwareProject) => void;
  onDeleteSoftware: (id: string) => void;
  onAddHardware: (achievement: HardwareAchievement) => void;
  onDeleteHardware: (id: string) => void;
  onUpdateHeroPhoto: (base64: string) => void;
  onRemoveHeroPhoto: () => void;
  onResetAll: () => void;
  onClose: () => void;
}

type EntryType = 'software' | 'hardware';

export default function AdminDashboard({
  softwareProjects,
  hardwareAchievements,
  heroPhoto,
  onAddSoftware,
  onDeleteSoftware,
  onAddHardware,
  onDeleteHardware,
  onUpdateHeroPhoto,
  onRemoveHeroPhoto,
  onResetAll,
  onClose,
}: AdminDashboardProps) {
  const [entryType, setEntryType] = useState<EntryType>('software');
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [softwareCategory, setSoftwareCategory] = useState<SoftwareCategory>('C/C++');
  const [hardwareCategory, setHardwareCategory] = useState<HardwareCategory>('CCTV Systems');
  const [githubUrl, setGithubUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [dateBadge, setDateBadge] = useState('Completed ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  const [siteLocation, setSiteLocation] = useState('');
  const [performanceMetric, setPerformanceMetric] = useState('');

  // Image upload & Base64 preview
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Status feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select an image file (PNG, JPG, WebP).' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      onUpdateHeroPhoto(base64);
      setStatusMessage({ type: 'success', text: '3D Hero animation texture updated with your custom photo!' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to process 3D photo.' });
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }

    // Limit to reasonable size for localStorage (under ~4MB)
    if (file.size > 4 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Image file is too large (>4MB). Please select a compressed image.' });
      return;
    }

    try {
      setIsProcessingImage(true);
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImageFileName(file.name);
      setStatusMessage({ type: 'success', text: `Image encoded to Base64 (${Math.round(file.size / 1024)} KB).` });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to encode image to Base64.' });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleClearImage = () => {
    setImageBase64('');
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Description are required fields.' });
      return;
    }

    const now = new Date().toISOString().split('T')[0];

    if (entryType === 'software') {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newProject: SoftwareProject = {
        id: 'sw-' + Date.now(),
        title: title.trim(),
        description: description.trim(),
        category: softwareCategory,
        tags: parsedTags.length > 0 ? parsedTags : [softwareCategory, 'Engineering'],
        githubUrl: githubUrl.trim() || 'https://github.com',
        image: imageBase64 || undefined,
        performanceMetric: performanceMetric.trim() || undefined,
        createdAt: now,
      };

      onAddSoftware(newProject);
      setStatusMessage({ type: 'success', text: `Software project "${newProject.title}" saved to localStorage!` });
    } else {
      const newAchievement: HardwareAchievement = {
        id: 'hw-' + Date.now(),
        title: title.trim(),
        description: description.trim(),
        category: hardwareCategory,
        dateBadge: dateBadge.trim() || 'Completed ' + now,
        image: imageBase64 || '',
        locationOrClient: siteLocation.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        technicalSpecs: [
          { label: 'Category', value: hardwareCategory },
          { label: 'Commissioned', value: dateBadge.trim() || now },
          ...(siteLocation.trim() ? [{ label: 'Site', value: siteLocation.trim() }] : []),
        ],
        createdAt: now,
      };

      onAddHardware(newAchievement);
      setStatusMessage({ type: 'success', text: `Hardware deployment "${newAchievement.title}" saved to localStorage!` });
    }

    // Reset Form
    setTitle('');
    setDescription('');
    setGithubUrl('');
    setTagsInput('');
    setPerformanceMetric('');
    setSiteLocation('');
    handleClearImage();
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const data = {
      software: softwareProjects,
      hardware: hardwareAchievements,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ansah_technology_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-300">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-500">
              Storage: <span className="text-neutral-900 font-semibold">localStorage (Client Persistent)</span>
            </span>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-neutral-300 hover:border-black text-neutral-800 transition-colors"
              title="Download JSON file backup of all projects"
            >
              <Download className="w-3.5 h-3.5 text-cyan-600" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Dashboard Header Box */}
        <div className="bg-white border border-neutral-300 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
                <Shield className="w-4 h-4 text-cyan-600" />
                <span>Private Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                Admin Project Management
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Add new Software or Hardware entries to your live portfolio without modifying code. Uploaded images convert automatically to Base64 strings saved in browser localStorage.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 border border-neutral-200 shrink-0">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                + New Entry
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'manage'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Manage ({softwareProjects.length + hardwareAchievements.length})
              </button>
            </div>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 text-xs sm:text-sm flex items-center justify-between border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs underline hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3D Hero Canvas Custom Photo Configuration */}
        <div className="bg-white border border-neutral-300 p-6 sm:p-8 mb-8 shadow-xs">
          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleHeroPhotoUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Photo Preview or Default Geometric Wireframe */}
              <div className="w-20 h-20 border border-neutral-300 bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                {heroPhoto ? (
                  <img src={heroPhoto} alt="3D Texture" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-neutral-400">
                    <Box className="w-6 h-6 mx-auto mb-1 text-neutral-500" />
                    <span className="text-[10px] font-mono leading-none block">Wireframe</span>
                  </div>
                )}
                {heroPhoto && (
                  <span className="absolute bottom-0 inset-x-0 bg-neutral-900/80 text-cyan-400 text-[9px] font-mono text-center py-0.5">
                    Active 3D
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-neutral-900">3D Animation Custom Photo</h2>
                  {heroPhoto ? (
                    <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-1.5 py-0.5 font-bold">
                      Custom Texture Loaded
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5">
                      Default Wireframe
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                  Upload your photo to map it directly onto the rotating 3D monolith in the Hero section. Your image is converted to Base64 and stored in browser localStorage.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{heroPhoto ? 'Update 3D Photo' : 'Upload 3D Photo'}</span>
              </button>

              {heroPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveHeroPhoto();
                    setStatusMessage({ type: 'success', text: 'Custom 3D photo removed; reverted to geometric wireframe.' });
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: CREATE NEW ENTRY */}
        {activeTab === 'create' && (
          <div className="bg-white border border-neutral-300 p-6 sm:p-8 shadow-xs">
            
            {/* Target Array Switcher */}
            <div className="mb-8 pb-6 border-b border-neutral-200">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
                1. Select Target Discipline
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setEntryType('software')}
                  className={`flex items-center gap-2.5 p-3 text-left border transition-all ${
                    entryType === 'software'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <Code2 className={`w-4 h-4 ${entryType === 'software' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">Software Project</div>
                    <div className={`text-[11px] ${entryType === 'software' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      C/C++, C#, WebGL, Three.js
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEntryType('hardware')}
                  className={`flex items-center gap-2.5 p-3 text-left border transition-all ${
                    entryType === 'hardware'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${entryType === 'hardware' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">Hardware Deployment</div>
                    <div className={`text-[11px] ${entryType === 'hardware' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      CCTV, Solar PV, Embedded
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    Project Title <span className="text-cyan-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={entryType === 'software' ? 'e.g. SIMD Vectorized Path Engine' : 'e.g. 32-Node 4K CCTV Infrastructure'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    Category Select <span className="text-cyan-600">*</span>
                  </label>
                  {entryType === 'software' ? (
                    <select
                      value={softwareCategory}
                      onChange={(e) => setSoftwareCategory(e.target.value as SoftwareCategory)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    >
                      <option value="C/C++">C/C++</option>
                      <option value="C#">C#</option>
                      <option value="JavaScript/HTML/CSS">JavaScript/HTML/CSS</option>
                      <option value="Three.js">Three.js</option>
                    </select>
                  ) : (
                    <select
                      value={hardwareCategory}
                      onChange={(e) => setHardwareCategory(e.target.value as HardwareCategory)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    >
                      <option value="CCTV Systems">CCTV Systems</option>
                      <option value="Solar Electrical Installations">Solar Electrical Installations</option>
                      <option value="IoT & Embedded">IoT & Embedded</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Description Text <span className="text-cyan-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    entryType === 'software'
                      ? 'Technical description of memory model, algorithms, APIs, and computational performance...'
                      : 'Field description of conduit layout, electrical specs, inverter capacity, PoE topologies, and physical enclosures...'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y"
                />
              </div>

              {/* GitHub Link & Additional Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    GitHub Link / Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username/repository"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                </div>

                {entryType === 'software' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      Language Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. C++20, AVX2, SIMD, CMake"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      Date Badge
                    </label>
                    <input
                      type="text"
                      value={dateBadge}
                      onChange={(e) => setDateBadge(e.target.value)}
                      placeholder="e.g. Completed Nov 2025"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Secondary details row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {entryType === 'software' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      Performance Metric Highlight (optional)
                    </label>
                    <input
                      type="text"
                      value={performanceMetric}
                      onChange={(e) => setPerformanceMetric(e.target.value)}
                      placeholder="e.g. 144 FPS @ 1440p (1.2M primary rays/sec)"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      Site Location / Facility (optional)
                    </label>
                    <input
                      type="text"
                      value={siteLocation}
                      onChange={(e) => setSiteLocation(e.target.value)}
                      placeholder="e.g. Seattle Commercial Logistics Hub"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                )}
              </div>

              {/* Image Upload Field (Converts to Base64 to seamlessly store in localStorage) */}
              <div className="border border-neutral-200 p-5 bg-neutral-50/50">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-1">
                  Image Upload (Auto Base64 Conversion)
                </label>
                <p className="text-xs text-neutral-500 mb-4">
                  Select any photo or diagram from your device. It will be converted to a Base64 string and stored directly inside browser localStorage so it persists across refreshes.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-300 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-white file:text-neutral-900 hover:file:bg-neutral-100 cursor-pointer"
                  />

                  {imageBase64 && (
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {/* Base64 Live Preview */}
                {imageBase64 && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 flex items-start gap-4">
                    <div className="w-32 h-24 overflow-hidden border border-neutral-300 bg-white shrink-0">
                      <img
                        src={imageBase64}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-neutral-600 space-y-1">
                      <div className="font-mono text-neutral-900 font-medium truncate max-w-md">
                        {imageFileName || 'Uploaded Image'}
                      </div>
                      <div className="text-[11px] text-cyan-700 font-mono">
                        Base64 Encoded ({Math.round(imageBase64.length / 1024)} KB)
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        Ready for persistent localStorage commit.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isProcessingImage}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Save {entryType === 'software' ? 'Software Project' : 'Hardware Deployment'}</span>
                </button>

                <div className="text-xs text-neutral-500 font-mono">
                  All changes persist in browser immediately.
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE EXISTING ENTRIES */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            
            {/* Software Entries Manager */}
            <div className="bg-white border border-neutral-300 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-600" />
                  <h2 className="text-lg font-bold text-neutral-900">
                    Existing Software Projects ({softwareProjects.length})
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-500">Live in localStorage</span>
              </div>

              <div className="divide-y divide-neutral-200">
                {softwareProjects.map((p) => (
                  <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-1">
                        <span className="text-cyan-700 font-medium">{p.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.createdAt}</span>
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900">{p.title}</h3>
                      <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="p-1.5 text-neutral-500 hover:text-black border border-neutral-200 hover:border-black transition-colors"
                          title="Open repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${p.title}"?`)) {
                            onDeleteSoftware(p.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Entries Manager */}
            <div className="bg-white border border-neutral-300 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  <h2 className="text-lg font-bold text-neutral-900">
                    Existing Hardware Deployments ({hardwareAchievements.length})
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-500">Live in localStorage</span>
              </div>

              <div className="divide-y divide-neutral-200">
                {hardwareAchievements.map((h) => (
                  <div key={h.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 max-w-xl">
                      {h.image && (
                        <div className="w-14 h-12 overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                          <img src={h.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-1">
                          <span className="text-cyan-700 font-medium">{h.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{h.dateBadge}</span>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900">{h.title}</h3>
                        <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">{h.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (confirm(`Delete hardware record "${h.title}"?`)) {
                            onDeleteHardware(h.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Delete hardware record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone: Reset to Initial Defaults */}
            <div className="bg-red-50/50 border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-red-900">Reset to Initial Engineering Data</h3>
                <p className="text-xs text-red-700 mt-1">
                  Restore default sample projects and hardware deployments if you want to wipe test edits.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data back to original defaults?')) {
                    onResetAll();
                    setStatusMessage({ type: 'success', text: 'Reset all portfolio data to factory defaults.' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 border border-red-300 bg-white hover:bg-red-700 hover:text-white transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
