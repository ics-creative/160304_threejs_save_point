import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { pass } from "three/tsl";
import Floor from "./objects/Floor";
import SavePoint from "./objects/SavePoint";

/** 画像とレンダラーの準備後に描画とモーションを開始します。 */
async function init() {
  // シーンとカメラ
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0);
  scene.fog = new THREE.FogExp2(0x0, 0.03);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(12, 10.5, 0);

  // レンダラー
  const renderer = new THREE.WebGPURenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  await renderer.init();

  // 画像と3Dオブジェクト
  const texturesReady = new Promise<void>((resolve) => {
    THREE.DefaultLoadingManager.onLoad = resolve;
  });
  const savePoint = new SavePoint();
  scene.add(new Floor(), savePoint);
  await texturesReady;

  // カメラ制御
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 4, 0);
  controls.minDistance = 6;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.autoRotate = true;

  // ライト
  scene.add(new THREE.HemisphereLight(0x2080c0, 0x102040, 2));

  // ポストエフェクト
  const scenePass = pass(scene, camera);
  const sceneColor = scenePass.getTextureNode();
  const bloomPass = bloom(sceneColor, 1, 0.5, 0.3);
  const postProcessing = new THREE.RenderPipeline(renderer);
  postProcessing.outputNode = sceneColor.add(bloomPass);

  // リサイズ処理
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener("resize", resize);

  // アニメーション
  const timer = new THREE.Timer();
  timer.connect(document);
  postProcessing.render();
  requestAnimationFrame(() => savePoint.start());
  renderer.setAnimationLoop(() => {
    timer.update();
    const delta = timer.getDelta();
    controls.update(delta);
    const energy = savePoint.update(delta);
    bloomPass.strength.value = 1 + energy * 0.3;
    bloomPass.radius.value = 0.5 + energy * 0.1;
    postProcessing.render();
  });
}

init();
