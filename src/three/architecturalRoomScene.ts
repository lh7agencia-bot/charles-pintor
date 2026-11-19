import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createContactShadowTexture,
  createFinishMaps,
  createPorcelainFloorTexture,
  PAINT_FINISHES,
  PaintFinishType,
} from './proceduralTextures';

export type LightingMood = 'day' | 'warm';

export interface RoomSceneController {
  setWallColor: (hex: string) => void;
  setFinish: (finish: PaintFinishType) => void;
  setLightingMood: (mood: LightingMood) => void;
  resetCamera: () => void;
  dispose: () => void;
}

const DEFAULT_CAM_POS = new THREE.Vector3(3.15, 2.05, 4.45);
const DEFAULT_TARGET = new THREE.Vector3(0.0, 1.25, -0.35);

function detectSoftwareGl(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function mountArchitecturalRoomScene(
  container: HTMLElement,
  initialColorHex: string,
  initialFinish: PaintFinishType,
  initialMood: LightingMood,
): RoomSceneController {
  const isSoftwareGl = detectSoftwareGl();

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const rect = container.getBoundingClientRect();
  const width = Math.max(rect.width, 320);
  const height = Math.max(rect.height, 360);
  renderer.setSize(width, height);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const horizonColor = new THREE.Color('#E8ECF4');
  scene.background = horizonColor;
  scene.fog = new THREE.Fog(horizonColor, 8.5, 22);

  // Studio Environment Map (RoomEnvironment + PMREMGenerator)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.62;
  pmremGenerator.dispose();

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 45);
  camera.position.copy(DEFAULT_CAM_POS);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(DEFAULT_TARGET);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 2.6;
  controls.maxDistance = 7.4;
  controls.minPolarAngle = 0.45;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.minAzimuthAngle = -Math.PI / 3;
  controls.maxAzimuthAngle = Math.PI / 2.2;
  controls.update();

  // Warm / Cool Studio Lighting Rig (1 shadow caster max)
  const hemiLight = new THREE.HemisphereLight('#DCE8FA', '#B8B0A4', 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight('#FFF5E4', 2.1);
  keyLight.position.set(4.5, 6.2, 4.8);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -4.2;
  keyLight.shadow.camera.right = 4.2;
  keyLight.shadow.camera.top = 4.2;
  keyLight.shadow.camera.bottom = -4.2;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#BFD6FA', 0.65);
  rimLight.position.set(-4.2, 3.2, -2.5);
  scene.add(rimLight);

  const lampPointLight = new THREE.PointLight('#FFD79A', 1.2, 5.5, 2);
  lampPointLight.position.set(-1.35, 1.72, -0.78);
  scene.add(lampPointLight);

  // Disposables tracking
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // Floor (porcelain tiles)
  const floorTex = createPorcelainFloorTexture(maxAnisotropy);
  textures.push(floorTex.map, floorTex.roughnessMap);

  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: floorTex.map,
      roughnessMap: floorTex.roughnessMap,
      roughness: 0.34,
      metalness: 0.04,
    }),
  );
  const floorMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(18, 18)),
    floorMat,
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Finish maps cache per finish
  const finishMapsCache = new Map<
    PaintFinishType,
    ReturnType<typeof createFinishMaps>
  >();
  const getFinishMaps = (finish: PaintFinishType) => {
    if (!finishMapsCache.has(finish)) {
      const maps = createFinishMaps(finish, maxAnisotropy);
      textures.push(maps.bumpMap, maps.roughnessMap, maps.colorVariationMap);
      finishMapsCache.set(finish, maps);
    }
    return finishMapsCache.get(finish)!;
  };

  const initialFinishSpec =
    PAINT_FINISHES.find((f) => f.id === initialFinish) ?? PAINT_FINISHES[1];
  const initialMaps = getFinishMaps(initialFinish);

  // Hero painted wall material (MeshPhysicalMaterial for realistic clearcoat/sheen)
  const paintedWallMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialColorHex),
      map: initialMaps.colorVariationMap,
      bumpMap: initialMaps.bumpMap,
      bumpScale: initialFinishSpec.bumpScale,
      roughnessMap: initialMaps.roughnessMap,
      roughness: initialFinishSpec.roughness,
      metalness: 0.02,
      clearcoat: initialFinishSpec.clearcoat,
      clearcoatRoughness: 0.32,
    }),
  );

  const sideWallMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3F5F8'),
      roughness: 0.85,
      metalness: 0.0,
    }),
  );

  const trimWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.35,
      metalness: 0.02,
    }),
  );

  const walnutMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5A3D28'),
      roughness: 0.58,
      metalness: 0.04,
    }),
  );

  const brassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      roughness: 0.22,
      metalness: 0.92,
    }),
  );

  const ceramicMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ECE8DF'),
      roughness: 0.25,
      metalness: 0.05,
    }),
  );

  // 1. Architectural Room Group (Composite > 10 parts)
  const roomGroup = new THREE.Group();
  scene.add(roomGroup);

  // Main hero feature wall (back)
  const backWall = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.2, 3.1, 0.18)),
    paintedWallMat,
  );
  backWall.position.set(0, 1.55, -1.3);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // Architectural recessed return wall (left)
  const leftWall = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 3.1, 3.2)),
    sideWallMat,
  );
  leftWall.position.set(-2.51, 1.55, 0.21);
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  // Crown molding & sculpted baseboard using ExtrudeGeometry with bevel
  const baseboardShape = new THREE.Shape();
  baseboardShape.moveTo(0, 0);
  baseboardShape.lineTo(0.035, 0);
  baseboardShape.lineTo(0.035, 0.13);
  baseboardShape.lineTo(0.015, 0.16);
  baseboardShape.lineTo(0, 0.16);
  baseboardShape.closePath();

  const baseboardGeo = trackGeo(
    new THREE.ExtrudeGeometry(baseboardShape, {
      depth: 5.02,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
    }),
  );
  const backBaseboard = new THREE.Mesh(baseboardGeo, trimWhiteMat);
  backBaseboard.rotation.y = Math.PI / 2;
  backBaseboard.position.set(-2.42, 0.002, -1.21);
  backBaseboard.castShadow = true;
  backBaseboard.receiveShadow = true;
  roomGroup.add(backBaseboard);

  const leftBaseboardGeo = trackGeo(
    new THREE.ExtrudeGeometry(baseboardShape, {
      depth: 3.02,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
    }),
  );
  const leftBaseboard = new THREE.Mesh(leftBaseboardGeo, trimWhiteMat);
  leftBaseboard.position.set(-2.42, 0.002, -1.21);
  leftBaseboard.receiveShadow = true;
  roomGroup.add(leftBaseboard);

  // Decorative boiserie / wall paneling molding frames on the painted wall (offset cleanly from wall face)
  const boiserieGroup = new THREE.Group();
  const framePositions = [-1.45, 0.0, 1.45];
  const barHGeo = trackGeo(new THREE.BoxGeometry(1.12, 0.036, 0.022));
  const barVGeo = trackGeo(new THREE.BoxGeometry(0.036, 1.72, 0.022));

  framePositions.forEach((fx) => {
    const topBar = new THREE.Mesh(barHGeo, paintedWallMat);
    topBar.position.set(fx, 2.55, -1.196);
    topBar.castShadow = true;

    const botBar = new THREE.Mesh(barHGeo, paintedWallMat);
    botBar.position.set(fx, 0.83, -1.196);
    botBar.castShadow = true;

    const lBar = new THREE.Mesh(barVGeo, paintedWallMat);
    lBar.position.set(fx - 0.542, 1.69, -1.196);
    lBar.castShadow = true;

    const rBar = new THREE.Mesh(barVGeo, paintedWallMat);
    rBar.position.set(fx + 0.542, 1.69, -1.196);
    rBar.castShadow = true;

    boiserieGroup.add(topBar, botBar, lBar, rBar);
  });
  roomGroup.add(boiserieGroup);

  // Subtle architectural ceiling crown molding along top of walls
  const backCrown = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.2, 0.09, 0.05)),
    trimWhiteMat,
  );
  backCrown.position.set(0, 3.055, -1.19);
  backCrown.receiveShadow = true;
  roomGroup.add(backCrown);

  const leftCrown = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.05, 0.09, 3.2)),
    trimWhiteMat,
  );
  leftCrown.position.set(-2.405, 3.055, 0.21);
  leftCrown.receiveShadow = true;
  roomGroup.add(leftCrown);

  // 2. Modern Credenza Console Group (Bottom-center pivoted at y=0)
  const consoleGroup = new THREE.Group();
  consoleGroup.position.set(0.15, 0, -0.82);

  const consoleBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.15, 0.44, 0.48)),
    walnutMat,
  );
  consoleBody.position.y = 0.44;
  consoleBody.castShadow = true;
  consoleBody.receiveShadow = true;
  consoleGroup.add(consoleBody);

  // Console top slab (light stone/travertine contrast)
  const consoleTop = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.2, 0.038, 0.51)),
    ceramicMat,
  );
  consoleTop.position.y = 0.679;
  consoleTop.castShadow = true;
  consoleTop.receiveShadow = true;
  consoleGroup.add(consoleTop);

  // Brass legs & drawer handles
  const legGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.012, 0.22, 16));
  const legOffsets: [number, number][] = [
    [-0.95, -0.18],
    [0.95, -0.18],
    [-0.95, 0.18],
    [0.95, 0.18],
  ];
  legOffsets.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, brassMat);
    leg.position.set(lx, 0.11, lz);
    leg.castShadow = true;
    consoleGroup.add(leg);
  });

  const handleGeo = trackGeo(new THREE.BoxGeometry(0.16, 0.014, 0.02));
  [-0.68, 0, 0.68].forEach((hx) => {
    const handle = new THREE.Mesh(handleGeo, brassMat);
    handle.position.set(hx, 0.48, 0.248);
    consoleGroup.add(handle);
  });
  roomGroup.add(consoleGroup);

  // 3. Sculptural Brass Floor Lamp (LatheGeometry shade + TubeGeometry arc stem)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-1.72, 0, -0.78);

  const lampBase = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.19, 0.21, 0.04, 28)),
    brassMat,
  );
  lampBase.position.y = 0.02;
  lampBase.castShadow = true;
  lampBase.receiveShadow = true;
  lampGroup.add(lampBase);

  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.04, 0),
    new THREE.Vector3(0, 1.35, 0),
    new THREE.Vector3(0.12, 1.82, 0.02),
    new THREE.Vector3(0.36, 1.76, 0.02),
  ]);
  const stemMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(stemCurve, 28, 0.014, 12, false)),
    brassMat,
  );
  stemMesh.castShadow = true;
  lampGroup.add(stemMesh);

  const shadePoints = [
    new THREE.Vector2(0.02, 0.14),
    new THREE.Vector2(0.11, 0.11),
    new THREE.Vector2(0.16, 0.0),
  ];
  const shadeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0B3D91'),
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide,
    }),
  );
  const lampShade = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(shadePoints, 28)),
    shadeMat,
  );
  lampShade.position.set(0.36, 1.63, 0.02);
  lampShade.castShadow = true;
  lampGroup.add(lampShade);

  const bulbMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff3d6,
      emissive: new THREE.Color('#FFD28A'),
      emissiveIntensity: 1.5,
      roughness: 0.2,
    }),
  );
  const lampBulb = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.036, 16, 16)),
    bulbMat,
  );
  lampBulb.position.set(0.36, 1.67, 0.02);
  lampGroup.add(lampBulb);
  roomGroup.add(lampGroup);

  // 4. Decorative Ceramic Vase (LatheGeometry) & Framed Artwork on Console/Wall
  const vasePoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.085, 0),
    new THREE.Vector2(0.115, 0.12),
    new THREE.Vector2(0.065, 0.26),
    new THREE.Vector2(0.075, 0.32),
    new THREE.Vector2(0.058, 0.32),
  ];
  const vaseMesh = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(vasePoints, 28)),
    ceramicMat,
  );
  vaseMesh.position.set(-0.55, 0.698, -0.8);
  vaseMesh.castShadow = true;
  vaseMesh.receiveShadow = true;
  roomGroup.add(vaseMesh);

  // Brass-framed minimal canvas artwork resting on wall center
  const artGroup = new THREE.Group();
  artGroup.position.set(0.0, 1.69, -1.19);
  const artFrame = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.84, 1.12, 0.035)),
    brassMat,
  );
  artFrame.castShadow = true;
  const artCanvas = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.76, 1.04, 0.042)),
    ceramicMat,
  );
  const artAccent = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.21, 32)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.4,
        metalness: 0.5,
      }),
    ),
  );
  artAccent.position.set(0.04, 0.06, 0.023);
  artGroup.add(artFrame, artCanvas, artAccent);
  roomGroup.add(artGroup);

  // 5. Soft Radial Contact Shadows beneath furniture & lamp (y = 0.015)
  const contactTex = createContactShadowTexture();
  textures.push(contactTex);
  const contactMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
  );
  const consoleShadow = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(2.6, 0.95)),
    contactMat,
  );
  consoleShadow.rotation.x = -Math.PI / 2;
  consoleShadow.position.set(0.15, 0.012, -0.82);
  roomGroup.add(consoleShadow);

  const lampShadow = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.36, 24)),
    contactMat,
  );
  lampShadow.rotation.x = -Math.PI / 2;
  lampShadow.position.set(-1.72, 0.012, -0.78);
  roomGroup.add(lampShadow);

  // Smooth Camera & Lighting Transition State
  let targetCamPos: THREE.Vector3 | null = null;
  let targetLookAt: THREE.Vector3 | null = null;
  const targetWallColor = new THREE.Color(initialColorHex);

  const applyMoodImmediate = (mood: LightingMood) => {
    if (mood === 'warm') {
      keyLight.color.set('#FFD8A6');
      keyLight.intensity = 1.65;
      hemiLight.intensity = 0.55;
      lampPointLight.intensity = 2.6;
      bulbMat.emissiveIntensity = 2.4;
      renderer.toneMappingExposure = 1.02;
    } else {
      keyLight.color.set('#FFF6E8');
      keyLight.intensity = 2.15;
      hemiLight.intensity = 0.88;
      lampPointLight.intensity = 0.95;
      bulbMat.emissiveIntensity = 1.1;
      renderer.toneMappingExposure = 1.1;
    }
  };
  applyMoodImmediate(initialMood);

  // Coalesced On-Demand Rendering + Software WebGL afterDraw Guard
  let frameId = 0;
  let disposed = false;
  let renderBusy = false;
  let renderDirty = false;
  let lastTickTime = performance.now();

  function afterDraw(cb: () => void) {
    if (disposed) return;
    try {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
        return;
      }
    } catch {
      // Fallback if fenceSync unavailable
    }
    frameId = window.setTimeout(cb, 80);
  }

  function requestRender() {
    if (disposed) return;
    if (renderBusy) {
      renderDirty = true;
      return;
    }
    renderBusy = true;
    frameId = requestAnimationFrame((now) => {
      if (disposed) return;
      renderDirty = false;
      const dt = Math.min((now - lastTickTime) / 1000, 0.05);
      lastTickTime = now;

      let needsAnotherFrame = false;

      // Smooth color transition
      if (!paintedWallMat.color.equals(targetWallColor)) {
        const alpha = 1 - Math.exp(-9 * Math.max(dt, 0.016));
        paintedWallMat.color.lerp(targetWallColor, alpha);
        if (
          Math.abs(paintedWallMat.color.r - targetWallColor.r) < 0.002 &&
          Math.abs(paintedWallMat.color.g - targetWallColor.g) < 0.002 &&
          Math.abs(paintedWallMat.color.b - targetWallColor.b) < 0.002
        ) {
          paintedWallMat.color.copy(targetWallColor);
        } else {
          needsAnotherFrame = true;
        }
      }

      // Smooth camera reset damping
      if (targetCamPos && targetLookAt) {
        const k = 7.5;
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          targetCamPos.x,
          k,
          Math.max(dt, 0.016),
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          targetCamPos.y,
          k,
          Math.max(dt, 0.016),
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          targetCamPos.z,
          k,
          Math.max(dt, 0.016),
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          targetLookAt.x,
          k,
          Math.max(dt, 0.016),
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          targetLookAt.y,
          k,
          Math.max(dt, 0.016),
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          targetLookAt.z,
          k,
          Math.max(dt, 0.016),
        );

        if (
          camera.position.distanceTo(targetCamPos) < 0.01 &&
          controls.target.distanceTo(targetLookAt) < 0.01
        ) {
          camera.position.copy(targetCamPos);
          controls.target.copy(targetLookAt);
          targetCamPos = null;
          targetLookAt = null;
        } else {
          needsAnotherFrame = true;
        }
      }

      const dampingMoving = controls.update();
      if (dampingMoving && !isSoftwareGl) {
        needsAnotherFrame = true;
      }

      renderer.render(scene, camera);

      const done = () => {
        renderBusy = false;
        if (renderDirty || needsAnotherFrame) {
          requestRender();
        }
      };

      if (isSoftwareGl) {
        afterDraw(done);
      } else {
        done();
      }
    });
  }

  controls.addEventListener('start', () => {
    targetCamPos = null;
    targetLookAt = null;
  });
  controls.addEventListener('change', () => {
    requestRender();
  });

  const handleResize = () => {
    if (disposed) return;
    const r = container.getBoundingClientRect();
    const w = Math.max(r.width, 320);
    const h = Math.max(r.height, 360);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    requestRender();
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);

  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }
  requestRender();

  return {
    setWallColor: (hex: string) => {
      targetWallColor.set(hex);
      if (isSoftwareGl) {
        paintedWallMat.color.copy(targetWallColor);
      }
      requestRender();
    },
    setFinish: (finish: PaintFinishType) => {
      const spec = PAINT_FINISHES.find((f) => f.id === finish) ?? PAINT_FINISHES[1];
      const maps = getFinishMaps(finish);
      paintedWallMat.map = maps.colorVariationMap;
      paintedWallMat.bumpMap = maps.bumpMap;
      paintedWallMat.bumpScale = spec.bumpScale;
      paintedWallMat.roughnessMap = maps.roughnessMap;
      paintedWallMat.roughness = spec.roughness;
      paintedWallMat.clearcoat = spec.clearcoat;
      paintedWallMat.needsUpdate = true;
      requestRender();
    },
    setLightingMood: (mood: LightingMood) => {
      applyMoodImmediate(mood);
      requestRender();
    },
    resetCamera: () => {
      if (isSoftwareGl) {
        camera.position.copy(DEFAULT_CAM_POS);
        controls.target.copy(DEFAULT_TARGET);
        controls.update();
      } else {
        targetCamPos = DEFAULT_CAM_POS.clone();
        targetLookAt = DEFAULT_TARGET.clone();
      }
      requestRender();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
