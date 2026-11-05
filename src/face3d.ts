import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ThemeMode } from './i18n';
import { computePixelDepthAndBrightness } from './portfolioLogic';

export interface Face3DController {
  setTheme: (theme: ThemeMode, customColors?: { secondary30?: string; accent10?: string; dominant60?: string }) => void;
  setPaused: (paused: boolean) => void;
  toggleWireframe: () => boolean;
  resetView: () => void;
  dispose: () => void;
}

// Pre-allocated scratch math objects outside render loop (zero GC in tick)
const _pointerNdc = new THREE.Vector2(0, 0);
const _targetRotation = new THREE.Vector2(0, 0);
const _raycaster = new THREE.Raycaster();
const _intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const _hitPoint = new THREE.Vector3(999, 999, 999);
const _dummyObj = new THREE.Object3D();
const _scratchColor = new THREE.Color();

export function initFace3DScene(
  container: HTMLElement,
  initialTheme: ThemeMode = 'dark',
  onLoadProgress?: (percent: number, stage: 'mesh' | 'ready') => void
): Face3DController {
  // 1. Software WebGL detection per threejs skill
  const isSoftwareGl = (() => {
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return true;
    }
  })();

  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  // 2. Scene, Camera & Renderer
  const scene = new THREE.Scene();
  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 360);

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0.15, 7.6);
  camera.lookAt(0, 0.05, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.innerHTML = '';
  renderer.domElement.setAttribute('aria-label', 'Malha 3D interativa de partículas do rosto de João Barão');
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // 3. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  pmremGenerator.dispose();

  // Fog matching subtle depth
  const fogColor = new THREE.Color(initialTheme === 'dark' ? '#0B0F17' : '#FAF8F5');
  scene.fog = new THREE.FogExp2(fogColor, 0.045);

  // 4. Balanced 3-Point Studio Lighting (Warm Key + Cool Hemisphere Fill + Rim Light)
  const hemiLight = new THREE.HemisphereLight(0xf3f4f6, 0x111827, 0.85);
  hemiLight.position.set(0, 6, 0);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
  keyLight.position.set(4.2, 5.5, 5.0);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x6366f1, 0.9);
  rimLight.position.set(-4.5, 2.0, -3.5);
  scene.add(rimLight);

  // 5. Root 3D Subject Group (Composite 7-Part Procedural Astrolabe Frame + Point-Cloud Portrait)
  const rootGroup = new THREE.Group();
  rootGroup.position.set(0, 0.08, 0);
  scene.add(rootGroup);

  const frameGroup = new THREE.Group();
  rootGroup.add(frameGroup);

  // Procedural brushed micro-relief bump texture for metallic & matte rings
  function createProceduralBrushedTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 2) {
      const shade = 115 + Math.floor(Math.sin(y * 0.6) * 20);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 128, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  const brushedBumpMap = createProceduralBrushedTexture();

  // Materials for the 7-part composite frame (varied roughness >= 0.25 difference across adjacent parts)
  const primaryRingMat = new THREE.MeshStandardMaterial({
    color: initialTheme === 'dark' ? 0xf3f4f6 : 0x111827,
    metalness: 0.72,
    roughness: 0.24,
    bumpMap: brushedBumpMap,
    bumpScale: 0.008,
  });

  const secondaryMatteMat = new THREE.MeshStandardMaterial({
    color: initialTheme === 'dark' ? 0x1e293b : 0xe2e8f0,
    metalness: 0.2,
    roughness: 0.78,
  });

  const accentIrisMat = new THREE.MeshStandardMaterial({
    color: 0x4f46e5,
    metalness: 0.45,
    roughness: 0.42,
  });

  // Part 1: Outer Calibration Ring (Primary Silhouette)
  const outerRingGeo = new THREE.TorusGeometry(2.38, 0.028, 16, 96);
  const outerRingMesh = new THREE.Mesh(outerRingGeo, primaryRingMat);
  frameGroup.add(outerRingMesh);

  // Part 2: Inner Gimbal Ring (Secondary Read)
  const innerGimbalGeo = new THREE.TorusGeometry(2.22, 0.016, 12, 84);
  const innerGimbalMesh = new THREE.Mesh(innerGimbalGeo, accentIrisMat);
  innerGimbalMesh.rotation.set(0.06, -0.06, 0.05);
  frameGroup.add(innerGimbalMesh);

  // Part 3: Beveled Equatorial Arc Support on Right Perimeter (ExtrudeGeometry with bevels)
  const bracketShape = new THREE.Shape();
  bracketShape.absarc(0, 0, 2.54, -Math.PI * 0.28, Math.PI * 0.28, false);
  bracketShape.absarc(0, 0, 2.46, Math.PI * 0.28, -Math.PI * 0.28, true);
  const bracketGeo = new THREE.ExtrudeGeometry(bracketShape, {
    steps: 1,
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  const rightBracketMesh = new THREE.Mesh(bracketGeo, secondaryMatteMat);
  rightBracketMesh.position.set(0, 0, -0.04);
  frameGroup.add(rightBracketMesh);

  // Part 4: Left Symmetric Beveled Arc Support on Left Perimeter
  const leftBracketMesh = new THREE.Mesh(bracketGeo, secondaryMatteMat);
  leftBracketMesh.rotation.z = Math.PI;
  leftBracketMesh.position.set(0, 0, -0.04);
  frameGroup.add(leftBracketMesh);

  // Part 5: Sculpted Base Pedestal (LatheGeometry) at bottom of the portrait ring
  const lathePoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.85, 0.0),
    new THREE.Vector2(0.72, 0.12),
    new THREE.Vector2(0.42, 0.22),
    new THREE.Vector2(0.52, 0.3),
    new THREE.Vector2(0.0, 0.3),
  ];
  const pedestalGeo = new THREE.LatheGeometry(lathePoints, 32);
  const pedestalMesh = new THREE.Mesh(pedestalGeo, secondaryMatteMat);
  pedestalMesh.position.set(0, -2.58, -0.1);
  frameGroup.add(pedestalMesh);

  // Part 6: Pedestal Accent Collar Ring
  const collarGeo = new THREE.TorusGeometry(0.55, 0.022, 12, 48);
  const collarMesh = new THREE.Mesh(collarGeo, accentIrisMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.set(0, -2.32, -0.1);
  frameGroup.add(collarMesh);

  // Part 7: InstancedMesh of 36 Precision Calibration Ticks around the perimeter (>20 repeated items)
  const tickCount = 36;
  const tickGeo = new THREE.BoxGeometry(0.022, 0.09, 0.022);
  const tickInstanced = new THREE.InstancedMesh(tickGeo, primaryRingMat, tickCount);
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2;
    const radius = 2.38;
    _dummyObj.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    _dummyObj.rotation.set(0, 0, angle + Math.PI / 2);
    const scaleMod = i % 3 === 0 ? 1.35 : 0.85;
    _dummyObj.scale.set(1, scaleMod, 1);
    _dummyObj.updateMatrix();
    tickInstanced.setMatrixAt(i, _dummyObj.matrix);
  }
  tickInstanced.instanceMatrix.needsUpdate = true;
  tickInstanced.computeBoundingSphere();
  frameGroup.add(tickInstanced);

  // Soft Radial Contact Shadow Disc beneath pedestal (disjoint depth, no Z-fighting)
  function createContactShadowTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const shadowDiscGeo = new THREE.CircleGeometry(1.75, 32);
  const shadowDiscMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.set(0, -2.595, -0.1);
  rootGroup.add(shadowDisc);

  // 6. Custom ShaderMaterial for the 3D Face Point Cloud
  const pointUniforms = {
    uTime: { value: 0 },
    uMouseWorld: { value: new THREE.Vector3(999, 999, 999) },
    uPrimaryColor: {
      value: new THREE.Color(initialTheme === 'dark' ? '#F3F4F6' : '#111827'),
    },
    uAccentColor: {
      value: new THREE.Color('#4F46E5'),
    },
    uPixelRatio: {
      value: isSoftwareGl ? 1.0 : Math.min(window.devicePixelRatio, 2),
    },
  };

  const pointsMaterial = new THREE.ShaderMaterial({
    uniforms: pointUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float aSize;
      attribute float aBrightness;
      uniform float uTime;
      uniform vec3 uMouseWorld;
      uniform float uPixelRatio;
      varying float vBrightness;
      varying float vHoverFactor;

      void main() {
        vBrightness = aBrightness;
        vec3 pos = position;

        // Subtle organic breathing motion on Z
        float breath = sin(uTime * 1.35 + pos.x * 2.2 + pos.y * 2.2) * 0.032;
        pos.z += breath;

        // Cursor elastic repulsion & wave ripple when pointer passes over the face points
        float dist = distance(pos.xy, uMouseWorld.xy);
        float radius = 0.92;
        float hoverFactor = 0.0;
        if (dist < radius) {
          float falloff = 1.0 - (dist / radius);
          float smoothFalloff = falloff * falloff * (3.0 - 2.0 * falloff);
          hoverFactor = smoothFalloff;
          vec2 dir = normalize(pos.xy - uMouseWorld.xy + vec2(0.0001));
          pos.xy += dir * smoothFalloff * 0.14;
          pos.z += smoothFalloff * 0.34 * sin(dist * 10.0 - uTime * 4.0);
        }
        vHoverFactor = hoverFactor;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (aSize * uPixelRatio * (1.0 + hoverFactor * 0.45)) * (6.2 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uPrimaryColor;
      uniform vec3 uAccentColor;
      varying float vBrightness;
      varying float vHoverFactor;

      void main() {
        // Soft circular matte dot
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.18, d) * (0.42 + vBrightness * 0.56);

        // Blend primary color (Champagne or Emerald Ink) with subtle Royal Iris on cursor wave or mid-tones
        float irisMix = clamp(vHoverFactor * 0.65 + (1.0 - vBrightness) * 0.22, 0.0, 0.78);
        vec3 finalColor = mix(uPrimaryColor, uAccentColor, irisMix);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });

  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: initialTheme === 'dark' ? 0xf3f4f6 : 0x111827,
    transparent: true,
    opacity: initialTheme === 'dark' ? 0.13 : 0.16,
  });

  let facePointsMesh: THREE.Points | null = null;
  let wireframeLinesMesh: THREE.LineSegments | null = null;
  let wireframeVisible = true;

  // Build 3D Point Cloud + Wireframe Geometry from a 2D pixel grid
  function buildMeshFromPixelData(
    imgData: Uint8ClampedArray,
    gridW: number,
    gridH: number
  ) {
    if (facePointsMesh) {
      facePointsMesh.geometry.dispose();
      rootGroup.remove(facePointsMesh);
    }
    if (wireframeLinesMesh) {
      wireframeLinesMesh.geometry.dispose();
      rootGroup.remove(wireframeLinesMesh);
    }

    const positions: number[] = [];
    const sizes: number[] = [];
    const brightnesses: number[] = [];
    const linePositions: number[] = [];

    // Store 3D coordinate index map for neighbor wireframe connections
    const coordGrid: (THREE.Vector3 | null)[][] = Array.from({ length: gridH }, () =>
      Array(gridW).fill(null)
    );
    const lumGrid: number[][] = Array.from({ length: gridH }, () => Array(gridW).fill(0));

    const aspect = gridW / gridH;
    const worldHeight = 3.75;
    const worldWidth = worldHeight * aspect;

    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        // Circular vignette crop so corners fit organically inside the astrolabe ring
        const nx = (x / (gridW - 1)) * 2 - 1;
        const ny = (y / (gridH - 1)) * 2 - 1;
        if (nx * nx + ny * ny > 0.96) continue;

        const idx = (y * gridW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        const { luminance, zDepth, pointSize, isVisible } = computePixelDepthAndBrightness(r, g, b, a);
        if (!isVisible) continue;

        // Add subtle spherical curvature so the face has natural 3D volume in addition to pixel luminance depth
        const sphericalDome = Math.sqrt(Math.max(0, 1 - (nx * nx * 0.65 + ny * ny * 0.65))) * 0.42;
        const wx = nx * (worldWidth * 0.5);
        const wy = -ny * (worldHeight * 0.5);
        const wz = zDepth * 0.45 + sphericalDome - 0.15;

        positions.push(wx, wy, wz);
        sizes.push(pointSize * (isMobile ? 1.25 : 1.0));
        brightnesses.push(luminance);

        coordGrid[y][x] = new THREE.Vector3(wx, wy, wz);
        lumGrid[y][x] = luminance;
      }
    }

    // Build subtle wireframe segments connecting high-contrast structural neighbors (glasses, nose bridge, brow, jawline)
    for (let y = 0; y < gridH - 1; y += 2) {
      for (let x = 0; x < gridW - 1; x += 2) {
        const current = coordGrid[y][x];
        if (!current) continue;
        const lum = lumGrid[y][x];

        const right = coordGrid[y][x + 1];
        const down = coordGrid[y + 1][x];

        if (right && Math.abs(lum - lumGrid[y][x + 1]) > 0.06) {
          linePositions.push(current.x, current.y, current.z, right.x, right.y, right.z);
        }
        if (down && Math.abs(lum - lumGrid[y + 1][x]) > 0.06) {
          linePositions.push(current.x, current.y, current.z, down.x, down.y, down.z);
        }
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointGeo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    pointGeo.setAttribute('aBrightness', new THREE.Float32BufferAttribute(brightnesses, 1));
    pointGeo.computeBoundingSphere();

    facePointsMesh = new THREE.Points(pointGeo, pointsMaterial);
    rootGroup.add(facePointsMesh);

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      wireframeLinesMesh = new THREE.LineSegments(lineGeo, wireframeMaterial);
      wireframeLinesMesh.visible = wireframeVisible;
      rootGroup.add(wireframeLinesMesh);
    }
  }

  // Procedural portrait fallback generator (ensures immediate 3D face point cloud even before/without image load)
  function generateProceduralPortraitGrid(gridW: number, gridH: number): Uint8ClampedArray {
    const data = new Uint8ClampedArray(gridW * gridH * 4);
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const nx = (x / (gridW - 1)) * 2 - 1;
        const ny = (y / (gridH - 1)) * 2 - 1;
        const idx = (y * gridW + x) * 4;

        // Head & shoulders silhouette + glasses + curls inspired by João Barão's reference portrait
        const headDist = Math.hypot(nx * 1.15, (ny + 0.05) * 0.92);
        const shoulders = ny > 0.45 && Math.abs(nx) < 0.85;
        let lum = 0;

        if (headDist < 0.68) {
          lum = 0.72 - headDist * 0.55;
          // Curly hair crown at top
          if (ny < -0.22) {
            lum = 0.22 + 0.14 * Math.sin(nx * 18.0) * Math.cos(ny * 18.0);
          }
          // Round glasses frames
          const leftGlass = Math.hypot(nx + 0.22, ny + 0.04);
          const rightGlass = Math.hypot(nx - 0.22, ny + 0.04);
          if (Math.abs(leftGlass - 0.16) < 0.028 || Math.abs(rightGlass - 0.16) < 0.028) {
            lum = 0.92;
          }
          // Nose bridge
          if (Math.abs(nx) < 0.045 && ny > -0.06 && ny < 0.18) {
            lum = 0.88;
          }
        } else if (shoulders) {
          // Suit lapels & white shirt collar
          lum = Math.abs(nx) < 0.24 ? 0.82 : 0.26;
        }

        const val = Math.round(Math.max(0, Math.min(1, lum)) * 255);
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }
    return data;
  }

  // Sample resolution: 96x112 on desktop (~7,500 points), 64x76 on mobile (~3,400 points) for silky 60fps
  const sampleW = isMobile ? 64 : 96;
  const sampleH = isMobile ? 76 : 112;

  // Build immediate procedural mesh first so canvas is never empty on frame 1
  buildMeshFromPixelData(generateProceduralPortraitGrid(sampleW, sampleH), sampleW, sampleH);
  onLoadProgress?.(55, 'mesh');

  // Load the real portrait image (/face-reference.jpg with fallback to /assets/aistudio/image_d0a6531b.png)
  const portraitImg = new Image();
  portraitImg.crossOrigin = 'anonymous';

  const handleImageLoaded = () => {
    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleW;
      offscreen.height = sampleH;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.drawImage(portraitImg, 0, 0, sampleW, sampleH);
        const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;
        buildMeshFromPixelData(imgData, sampleW, sampleH);
      }
    } catch {
      // Keep procedural portrait mesh if canvas is tainted
    }
    onLoadProgress?.(100, 'ready');
  };

  let triedFallback = false;
  portraitImg.onload = handleImageLoaded;
  portraitImg.onerror = () => {
    if (!triedFallback) {
      triedFallback = true;
      portraitImg.src = '/assets/aistudio/image_d0a6531b.png';
    } else {
      onLoadProgress?.(100, 'ready');
    }
  };
  portraitImg.src = '/face-reference.jpg';

  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }

  // 7. Pointer & Touch Interaction (Throttled Raycast to Z=0 plane)
  let lastPointerTime = 0;
  const onPointerMove = (clientX: number, clientY: number) => {
    const now = performance.now();
    if (now - lastPointerTime < 16) return;
    lastPointerTime = now;

    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((clientY - rect.top) / rect.height) * 2 + 1;

    _pointerNdc.set(THREE.MathUtils.clamp(nx, -1, 1), THREE.MathUtils.clamp(ny, -1, 1));
    _targetRotation.set(_pointerNdc.y * -0.24, _pointerNdc.x * 0.34);

    if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
      _raycaster.setFromCamera(_pointerNdc, camera);
      _raycaster.ray.intersectPlane(_intersectPlane, _hitPoint);
      pointUniforms.uMouseWorld.value.copy(_hitPoint);
    } else {
      pointUniforms.uMouseWorld.value.set(999, 999, 999);
    }
  };

  const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleMouseLeave = () => {
    _targetRotation.set(0, 0);
    pointUniforms.uMouseWorld.value.set(999, 999, 999);
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
  renderer.domElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  // WebGL Context Loss & Restore Safety
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(frameId);
    window.clearTimeout(frameId);
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

  // Responsive Resize
  const handleResize = () => {
    if (!container) return;
    const newW = Math.max(container.clientWidth, 280);
    const newH = Math.max(container.clientHeight, 320);
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', handleResize);

  // 8. Animation Loop with Software-WebGL Pacing (`afterDraw`) & Exponential Damping
  let frameId = 0;
  let isDisposed = false;
  let isPaused = prefersReducedMotion;
  const clock = new THREE.Clock();

  function afterDraw(cb: () => void) {
    if (isDisposed) return;
    const gl = renderer.getContext() as WebGL2RenderingContext | null;
    if (!gl || typeof gl.fenceSync !== 'function') {
      frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (isDisposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  }

  function tick() {
    if (isDisposed) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.getElapsedTime();

    if (!isPaused) {
      pointUniforms.uTime.value = elapsed;

      // Exponential damping for smooth cursor tracking
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, _targetRotation.x, 4.5, dt);
      rootGroup.rotation.y = THREE.MathUtils.damp(
        rootGroup.rotation.y,
        _targetRotation.y + Math.sin(elapsed * 0.45) * 0.06,
        4.5,
        dt
      );

      // Slow counter-rotation on astrolabe gimbal rings
      innerGimbalMesh.rotation.z = elapsed * 0.12;
      outerRingMesh.rotation.z = -elapsed * 0.05;
    }

    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }
  }

  // Start loop
  tick();

  return {
    setTheme(theme: ThemeMode, customColors?: { secondary30?: string; accent10?: string; dominant60?: string }) {
      const primaryHex =
        customColors?.secondary30 || (theme === 'dark' ? '#F3F4F6' : '#111827');
      const accentHex = customColors?.accent10 || '#4F46E5';
      const dominantHex =
        customColors?.dominant60 || (theme === 'dark' ? '#0B0F17' : '#FAF8F5');

      pointUniforms.uPrimaryColor.value.set(primaryHex);
      pointUniforms.uAccentColor.value.set(accentHex);

      _scratchColor.set(primaryHex);
      primaryRingMat.color.copy(_scratchColor);
      wireframeMaterial.color.copy(_scratchColor);
      wireframeMaterial.opacity = theme === 'dark' ? 0.13 : 0.18;

      _scratchColor.set(theme === 'dark' ? 0x1e293b : 0xe2e8f0);
      secondaryMatteMat.color.copy(_scratchColor);

      _scratchColor.set(accentHex);
      accentIrisMat.color.copy(_scratchColor);

      _scratchColor.set(dominantHex);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(_scratchColor);
      }
    },
    setPaused(paused: boolean) {
      isPaused = paused;
    },
    toggleWireframe() {
      wireframeVisible = !wireframeVisible;
      if (wireframeLinesMesh) {
        wireframeLinesMesh.visible = wireframeVisible;
      }
      return wireframeVisible;
    },
    resetView() {
      _targetRotation.set(0, 0);
      pointUniforms.uMouseWorld.value.set(999, 999, 999);
      rootGroup.rotation.set(0, 0, 0);
    },
    dispose() {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      if (facePointsMesh) facePointsMesh.geometry.dispose();
      if (wireframeLinesMesh) wireframeLinesMesh.geometry.dispose();
      outerRingGeo.dispose();
      innerGimbalGeo.dispose();
      bracketGeo.dispose();
      pedestalGeo.dispose();
      collarGeo.dispose();
      tickGeo.dispose();
      shadowDiscGeo.dispose();
      pointsMaterial.dispose();
      wireframeMaterial.dispose();
      primaryRingMat.dispose();
      secondaryMatteMat.dispose();
      accentIrisMat.dispose();
      shadowDiscMat.dispose();
      brushedBumpMap.dispose();
      envTexture.dispose();
      renderer.dispose();
    },
  };
}
