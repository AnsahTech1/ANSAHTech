import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  Box, 
  Layers, 
  RotateCw, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import { fileToBase64 } from '../services/storage';

type GeometryMode = 'photo' | 'cube' | 'icosahedron' | 'grid';

interface HeroThreeCanvasProps {
  photoUrl?: string | null;
  onUploadPhoto?: (base64: string) => void;
  onRemovePhoto?: () => void;
  theme?: 'light' | 'dark';
}

export default function HeroThreeCanvas({ 
  photoUrl, 
  onUploadPhoto, 
  onRemovePhoto,
  theme = 'light',
}: HeroThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [geoMode, setGeoMode] = useState<GeometryMode>(photoUrl ? 'photo' : 'cube');
  const [isRotating, setIsRotating] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // If a photoUrl arrives or changes, auto-switch to 'photo' mode
  useEffect(() => {
    if (photoUrl) {
      setGeoMode('photo');
    }
  }, [photoUrl]);

  // Mutable state for the animation loop
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isRotating: true,
    speedMultiplier: 1,
    geoMode: (photoUrl ? 'photo' : 'cube') as GeometryMode,
    photoUrl: photoUrl || null,
    theme: theme,
  });

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
    stateRef.current.speedMultiplier = speedMultiplier;
    stateRef.current.geoMode = geoMode;
    stateRef.current.photoUrl = photoUrl || null;
    stateRef.current.theme = theme;
  }, [isRotating, speedMultiplier, geoMode, photoUrl, theme]);

  // Handle local file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadFeedback('Please select a valid image file');
      setTimeout(() => setUploadFeedback(null), 3000);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      if (onUploadPhoto) {
        onUploadPhoto(base64);
      }
      setGeoMode('photo');
      setUploadFeedback('3D Texture Updated!');
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch {
      setUploadFeedback('Failed to encode image');
      setTimeout(() => setUploadFeedback(null), 3000);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene & Renderer
    const scene = new THREE.Scene();
    const isInitDark = stateRef.current.theme === 'dark';
    scene.background = new THREE.Color(isInitDark ? 0x000000 : 0xffffff);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Subtle studio ambient & directional light for textured models
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(4, 8, 5);
    scene.add(dirLight);

    // Parent group that handles mouse parallax and rotation
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Subtle horizontal coordinate grid
    const grid = new THREE.GridHelper(10, 20, 0x06b6d4, 0xe5e7eb);
    grid.position.y = -1.2;
    worldGroup.add(grid);

    // 2. Meshes group
    const meshGroup = new THREE.Group();
    meshGroup.position.y = 0.2;
    worldGroup.add(meshGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Cache of active meshes
    let activePhotoMesh: THREE.Group | null = null;
    let loadedPhotoUrl: string | null = null;

    // Build standard wireframe cube
    const cubeBoxGeo = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const cubeEdges = new THREE.EdgesGeometry(cubeBoxGeo);
    const cubeLineMat = new THREE.LineBasicMaterial({ color: 0x18181b, linewidth: 1.5 });
    const cubeMesh = new THREE.LineSegments(cubeEdges, cubeLineMat);

    // Inner accent octahedron
    const innerOctaGeo = new THREE.OctahedronGeometry(1.0, 0);
    const innerOctaEdges = new THREE.EdgesGeometry(innerOctaGeo);
    const cyanLineMat = new THREE.LineBasicMaterial({ color: 0x0891b2 });
    const innerOctaMesh = new THREE.LineSegments(innerOctaEdges, cyanLineMat);
    cubeMesh.add(innerOctaMesh);

    // Nested Icosahedron Wireframe
    const icosaGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icosaEdges = new THREE.WireframeGeometry(icosaGeo);
    const icosaLineMat = new THREE.LineBasicMaterial({ color: 0x18181b });
    const icosaMesh = new THREE.LineSegments(icosaEdges, icosaLineMat);

    const innerIcosaCore = new THREE.IcosahedronGeometry(0.85, 0);
    const innerIcosaEdges = new THREE.WireframeGeometry(innerIcosaCore);
    const innerIcosaMesh = new THREE.LineSegments(innerIcosaEdges, cyanLineMat);
    icosaMesh.add(innerIcosaMesh);

    // Multi-plane lattice grid
    const latticeGroup = new THREE.Group();
    const planeRes = 6;
    for (let i = -1; i <= 1; i++) {
      const planeGeo = new THREE.PlaneGeometry(2.4, 2.4, planeRes, planeRes);
      const planeEdges = new THREE.WireframeGeometry(planeGeo);
      const planeMat = new THREE.LineBasicMaterial({ 
        color: i === 0 ? 0x0891b2 : 0x27272a, 
        transparent: true, 
        opacity: i === 0 ? 0.9 : 0.45 
      });
      const plane = new THREE.LineSegments(planeEdges, planeMat);
      plane.position.z = i * 0.7;
      latticeGroup.add(plane);
    }

    // Function to build the 3D Photo Object
    const buildPhotoObject = (url: string): THREE.Group => {
      const group = new THREE.Group();

      const texture = textureLoader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // 3D Monolith Box
      const boxWidth = 2.0;
      const boxHeight = 2.2;
      const boxDepth = 0.35;
      const boxGeo = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      // Materials: front and back show the photo; sides show sleek dark titanium
      const sideMat = new THREE.MeshStandardMaterial({
        color: 0x171717,
        metalness: 0.85,
        roughness: 0.25,
      });

      const photoMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
      });

      // Box face order: right, left, top, bottom, front, back
      const materials = [
        sideMat, // right
        sideMat, // left
        sideMat, // top
        sideMat, // bottom
        photoMat, // front
        photoMat, // back
      ];

      const mesh = new THREE.Mesh(boxGeo, materials);
      group.add(mesh);

      // Wireframe bounding edges around the photo monolith
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const edgesMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
      group.add(wireframe);

      // Outer delicate orbital ring
      const ringGeo = new THREE.RingGeometry(1.8, 1.82, 48);
      const ringMat = new THREE.LineBasicMaterial({ color: 0x262626, side: THREE.DoubleSide });
      const ring = new THREE.LineLoop(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      group.add(ring);

      return group;
    };

    // Pre-warm renderer
    renderer.compile(scene, camera);

    // Pointer move listener
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetMouseX = x * 0.4;
      stateRef.current.targetMouseY = y * 0.3;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Animation loop with clock & damping
    const clock = new THREE.Clock();
    let animId: number;
    let currentMode: GeometryMode | null = null;
    let currentPhotoUrl: string | null = null;
    let currentTheme: 'light' | 'dark' = 'light';

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const targetMode = stateRef.current.geoMode;
      const targetPhoto = stateRef.current.photoUrl;
      const targetTheme = stateRef.current.theme;

      // Handle theme updates
      if (targetTheme !== currentTheme) {
        currentTheme = targetTheme;
        const isDark = currentTheme === 'dark';
        scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
        cubeLineMat.color.set(isDark ? 0xffffff : 0x18181b);
        icosaLineMat.color.set(isDark ? 0xffffff : 0x18181b);
      }

      // Handle mode or photo texture update
      if (targetMode !== currentMode || targetPhoto !== currentPhotoUrl) {
        currentMode = targetMode;
        currentPhotoUrl = targetPhoto;
        meshGroup.clear();

        if (currentMode === 'photo' && currentPhotoUrl) {
          activePhotoMesh = buildPhotoObject(currentPhotoUrl);
          meshGroup.add(activePhotoMesh);
        } else if (currentMode === 'icosahedron') {
          meshGroup.add(icosaMesh);
        } else if (currentMode === 'grid') {
          meshGroup.add(latticeGroup);
        } else {
          meshGroup.add(cubeMesh);
        }
      }

      // Smooth mouse parallax damping
      stateRef.current.mouseX = THREE.MathUtils.damp(
        stateRef.current.mouseX,
        stateRef.current.targetMouseX,
        4,
        delta
      );
      stateRef.current.mouseY = THREE.MathUtils.damp(
        stateRef.current.mouseY,
        stateRef.current.targetMouseY,
        4,
        delta
      );

      worldGroup.rotation.y = stateRef.current.mouseX;
      worldGroup.rotation.x = -stateRef.current.mouseY;

      // Object spinning
      if (stateRef.current.isRotating) {
        const speed = 0.35 * stateRef.current.speedMultiplier * delta;
        meshGroup.rotation.y += speed;
        meshGroup.rotation.x += speed * 0.45;
        grid.rotation.y += speed * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cubeBoxGeo.dispose();
      cubeEdges.dispose();
      cubeLineMat.dispose();
      innerOctaGeo.dispose();
      innerOctaEdges.dispose();
      cyanLineMat.dispose();
      icosaGeo.dispose();
      icosaEdges.dispose();
      icosaLineMat.dispose();
      innerIcosaCore.dispose();
      innerIcosaEdges.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-auto">
      {/* Hidden file input for uploading 3D photo texture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Three.js canvas mount container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle overlay gradient to blend with background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 dark:from-black/40 via-transparent to-white dark:to-black" />

      {/* Collapsible 3D Scene Control Dock (Pinned bottom center per guidelines) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* Upload feedback toast */}
        {uploadFeedback && (
          <div className="mb-2 px-3 py-1 bg-neutral-900 text-white text-xs font-mono flex items-center gap-1.5 shadow-lg border border-cyan-500">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{uploadFeedback}</span>
          </div>
        )}

        {/* Toggle Collapse Pill */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-1.5 flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs tracking-wider uppercase hover:text-black dark:hover:text-white hover:border-black dark:hover:border-neutral-500 transition-colors shadow-sm cursor-pointer"
          title={isCollapsed ? 'Show 3D Canvas Controls' : 'Hide Controls'}
        >
          <RotateCw className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>{isCollapsed ? '3D Viewport Controls' : 'Hide Controls'}</span>
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Control Bar */}
        {!isCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-md">
            
            {/* Shape & Photo Selectors */}
            <div className="flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2">
              {/* If photo exists, show 3D Photo button */}
              {photoUrl ? (
                <button
                  onClick={() => setGeoMode('photo')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    geoMode === 'photo'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="Render your uploaded photo as a 3D rotating monolith"
                >
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  <span>3D Photo</span>
                </button>
              ) : null}

              <button
                onClick={() => setGeoMode('cube')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  geoMode === 'cube'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Box className="w-3 h-3 text-cyan-400" />
                <span>Cube</span>
              </button>

              <button
                onClick={() => setGeoMode('icosahedron')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  geoMode === 'icosahedron'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <RotateCw className="w-3 h-3 text-cyan-400" />
                <span>Polyhedron</span>
              </button>

              <button
                onClick={() => setGeoMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  geoMode === 'grid'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Lattice</span>
              </button>
            </div>

            {/* Direct Upload / Replace Photo Button */}
            <div className="flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 transition-colors cursor-pointer"
                title="Upload your photo to texture the 3D rotating object"
              >
                <Upload className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>{photoUrl ? 'Update Photo' : 'Upload Photo'}</span>
              </button>

              {photoUrl && onRemovePhoto && (
                <button
                  onClick={() => {
                    onRemovePhoto();
                    setGeoMode('cube');
                  }}
                  className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="Remove custom photo and revert to wireframe"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Play/Pause & Speed */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={isRotating ? 'Pause rotation' : 'Resume rotation'}
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
              </button>

              <button
                onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
                className="px-2 py-0.5 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                title="Cycle rotation speed"
              >
                {speedMultiplier}x
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
