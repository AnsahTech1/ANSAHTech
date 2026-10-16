import { SoftwareProject, HardwareAchievement, EngineeringUpdate } from '../types';

export const INITIAL_SOFTWARE_PROJECTS: SoftwareProject[] = [
  {
    id: 'sw-1',
    title: 'Vulkan Real-Time Ray Tracer & BVH Engine',
    description: 'High-performance hardware-accelerated BVH traversal kernel written in modern C++20 with Vulkan 1.3 ray-query pipelines, spatial partitioning, and SIMD mathematical primitives.',
    category: 'C/C++',
    tags: ['C++20', 'Vulkan', 'GLSL', 'BVH', 'SIMD'],
    githubUrl: 'https://github.com/example/vulkan-bvh-tracer',
    architectureDetails: 'Zero-heap per-frame memory allocation with custom pool allocators. Bounding Volume Hierarchy constructed via surface area heuristic (SAH) with AVX2 vectorized leaf traversal.',
    performanceMetric: '144 FPS @ 1440p (1.2M primary rays/sec)',
    createdAt: '2026-03-12',
    image: '/src/assets/images/software_graphics_engine_1792141983664.jpg'
  },
  {
    id: 'sw-2',
    title: '.NET Low-Latency Telemetry Distribution Bus',
    description: 'High-throughput C# telemetry ingestion daemon processing industrial sensor streams with lock-free RingBuffer queues, Zero-Allocation Span<T> parsing, and gRPC endpoints.',
    category: 'C#',
    tags: ['C#', '.NET 9', 'gRPC', 'Channels', 'Zero-Allocation'],
    githubUrl: 'https://github.com/example/telemetry-bus-core',
    architectureDetails: 'Operates on System.Threading.Channels with custom unmanaged memory pools. Direct binary protocol deserialization using memory-mapped circular buffers.',
    performanceMetric: '850,000 packets/sec sustained at <2ms p99',
    createdAt: '2026-02-18'
  },
  {
    id: 'sw-3',
    title: 'Three.js Spatial Coordinate & Mesh Visualizer',
    description: 'Interactive WebGL spatial engine generating dynamic wireframe lattices, geometric geodesics, and procedural surface topology with real-time parametric deformation.',
    category: 'Three.js',
    tags: ['Three.js', 'WebGL', 'TypeScript', 'GLSL Shaders'],
    githubUrl: 'https://github.com/example/three-spatial-topology',
    demoUrl: '#home',
    architectureDetails: 'Custom BufferGeometry with instanced vertex buffer attributes and GLSL noise shaders. Render pipeline maintains zero-allocation frame loops.',
    performanceMetric: '60 FPS on integrated mobile GPUs',
    createdAt: '2026-01-25',
    image: '/src/assets/images/software_graphics_engine_1792141983664.jpg'
  },
  {
    id: 'sw-4',
    title: 'Embedded RTOS Sensor Hub & CAN Bus Driver',
    description: 'Hard real-time firmware in bare-metal C for ARM Cortex-M4 microcontrollers interfacing CAN 2.0B, I2C IMUs, and optical encoders with deterministic interrupt routines.',
    category: 'C/C++',
    tags: ['C', 'FreeRTOS', 'ARM Cortex', 'CAN Bus', 'Embedded'],
    githubUrl: 'https://github.com/example/rtos-canbus-firmware',
    architectureDetails: 'Zero dynamic memory allocation in runtime tasks. Ring-buffered DMA transfers for ADC and serial communication with hardware CRC checking.',
    performanceMetric: '<15μs interrupt latency',
    createdAt: '2025-11-14'
  },
  {
    id: 'sw-5',
    title: 'Industrial SCADA Energy Flow Console',
    description: 'Reactive client-side dashboard engineered with JavaScript, custom SVG telemetry gauges, and WebSocket streams for real-time solar inverter monitoring and load shedding.',
    category: 'JavaScript/HTML/CSS',
    tags: ['JavaScript', 'HTML5 Canvas', 'Tailwind CSS', 'WebSockets'],
    githubUrl: 'https://github.com/example/scada-energy-client',
    architectureDetails: 'Double-buffered HTML5 2D Canvas rendering telemetry charts at 60 Hz without DOM thrashing. Offline SQLite via WASM client storage.',
    performanceMetric: '50ms live stream round-trip sync',
    createdAt: '2025-09-30'
  },
  {
    id: 'sw-6',
    title: 'Unity Physically Based Camera Calibration Tool',
    description: 'C# editor extension and runtime utility for synchronizing virtual cameras with real-world CCTV focal lengths, lens distortion coefficients, and field-of-view matrices.',
    category: 'C#',
    tags: ['C#', 'Unity Engine', 'Computer Vision', 'Mathematics'],
    githubUrl: 'https://github.com/example/unity-cctv-lens-calibrator',
    architectureDetails: 'Implements Brown-Conrady radial and tangential distortion models using vectorized compute shaders.',
    performanceMetric: 'Sub-pixel re-projection accuracy',
    createdAt: '2025-07-22'
  }
];

export const INITIAL_HARDWARE_ACHIEVEMENTS: HardwareAchievement[] = [
  {
    id: 'hw-1',
    title: 'Commercial Multi-Zone IP CCTV Infrastructure',
    description: 'Turnkey enterprise video security deployment across a 45,000 sq ft logistics facility. Engineered structured Cat6A cabling, waterproof rigid EMT conduit runs, redundant PoE+ switches, and on-prem NVR storage with off-site encrypted failover.',
    category: 'CCTV Systems',
    dateBadge: 'Completed Oct 2025',
    image: '/src/assets/images/cctv_commercial_system_1792141983023.jpg',
    technicalSpecs: [
      { label: 'Camera Nodes', value: '38x 8MP 4K Motorized Dome & Bullet' },
      { label: 'Storage & Retention', value: '96 TB RAID-6 (60-day raw archive)' },
      { label: 'Network Fabric', value: '10 Gbps SFP+ Fiber Uplink + PoE+' },
      { label: 'Enclosure Standard', value: 'NEMA 4X / IP67 Weatherproof' }
    ],
    locationOrClient: 'Pacific Logistics Hub',
    githubUrl: 'https://github.com/example/cctv-topological-schematic',
    createdAt: '2025-10-10'
  },
  {
    id: 'hw-2',
    title: '48 kWp Industrial Rooftop Photovoltaic Array',
    description: 'Comprehensive electrical design and commissioning of a commercial grid-tied solar system. Designed balanced string topologies, calculated conductor ampacities, integrated dual three-phase inverters, and configured zero-export protection controls.',
    category: 'Solar Electrical Installations',
    dateBadge: 'Completed Jul 2025',
    image: '/src/assets/images/solar_electrical_installation_1792141983829.jpg',
    technicalSpecs: [
      { label: 'Array Capacity', value: '48.4 kWp (110x 440W Mono-PERC)' },
      { label: 'Inverter Hardware', value: '2x 25kW Three-Phase Pure Sine' },
      { label: 'DC String Voltage', value: '680V Nominal (1000V Max)' },
      { label: 'Conduit Standard', value: '2" Heavy-Wall Rigid Galvanized Steel' }
    ],
    locationOrClient: 'Metro Technology Center',
    githubUrl: 'https://github.com/example/solar-electrical-single-line',
    createdAt: '2025-07-05'
  },
  {
    id: 'hw-3',
    title: 'Custom STM32 Edge Telemetry & Modbus Gateway',
    description: 'Designed custom 2-layer PCB with STM32F4 microcontroller, isolated RS-485 transceiver, and wide-input buck regulator (9V-36V DC) to bridge legacy solar inverter meters to modern IP networks.',
    category: 'IoT & Embedded',
    dateBadge: 'Completed Jan 2026',
    image: '/src/assets/images/embedded_iot_hardware_1792141984891.jpg',
    technicalSpecs: [
      { label: 'Microcontroller', value: 'ARM Cortex-M4 @ 168MHz' },
      { label: 'Fieldbus Protocol', value: 'Isolated RS-485 Modbus RTU' },
      { label: 'Power Isolation', value: '2.5kV Galvanic Optocoupler' },
      { label: 'Enclosure', value: 'DIN-Rail Mount Aluminum Enclosure' }
    ],
    locationOrClient: 'Industrial IoT Deployment',
    githubUrl: 'https://github.com/example/stm32-telemetry-gateway-hw',
    createdAt: '2026-01-15'
  }
];

export const INITIAL_UPDATES: EngineeringUpdate[] = [
  {
    id: 'up-1',
    date: '2026-03-28',
    title: 'Vulkan BVH Traversal Engine v1.2 Released',
    category: 'Software',
    versionOrCode: 'TAG v1.2.0',
    description: 'Integrated wide-BVH4 node compression and SIMD ray-box intersection routines, yielding a 22% improvement in primary ray traversal time.'
  },
  {
    id: 'up-2',
    date: '2026-02-14',
    title: 'Commissioned 120-Node Edge Surveillance Network',
    category: 'Hardware',
    versionOrCode: 'SITE: SEC-04',
    description: 'Completed inspection and acceptance testing for optical fiber backbone link and 4K AI-assisted optical tripwire cameras.'
  },
  {
    id: 'up-3',
    date: '2026-01-08',
    title: 'Solar Array SCADA Telemetry Bridge Deployment',
    category: 'Infrastructure',
    versionOrCode: 'SYS-PV-48',
    description: 'Integrated Modbus RTU telemetry to real-time WebSockets, streaming per-string DC voltage and thermal coefficients to central ops.'
  },
  {
    id: 'up-4',
    date: '2025-11-20',
    title: 'PCB Revision C for Industrial RTOS Sensor Hub',
    category: 'Hardware',
    versionOrCode: 'REV 3.1',
    description: 'Redesigned grounding plane and added transient voltage suppression (TVS) diodes to meet industrial EMC class B standards.'
  }
];
