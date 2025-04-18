import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import Camera from "./Camera";
import SavePoint from "./SavePoint";

// 前回の時間 (tick内で更新するため let で宣言)
let prevTime = Date.now();

// --- Main Initialization Function ---
export async function init() {
  // シーン
  const scene = new THREE.Scene();
  // 背景色を黒に設定
  scene.background = new THREE.Color(0x000000);

  // カメラ
  const camera = new Camera();

  // レンダラー (WebGPU)
  const renderer = new WebGPURenderer({ antialias: true });
  // setPixelRatio は WebGPURenderer では通常不要だが念のため残す (内部処理される)
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // WebGPU Rendererの初期化 (非同期)
  await renderer.init();
  // 出力カラー空間を設定
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);

  // ポイントライト
  const light = new THREE.PointLight(0x555555, 100, 50, 2); // intensity=100, decay=2
  light.position.set(0.577, 0.577, 0.577);
  light.castShadow = true;
  scene.add(light);

  // 環境光 (Mainクラスに残っていたものをコメントアウトまたは削除)
  // const ambientLight = new THREE.AmbientLight(0x555555, 1); // intensity=0.5

  // 地面
  {
    const texture = new THREE.TextureLoader().load("img/tile.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(128, 128);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      bumpMap: texture,
      bumpScale: 1.0,
      roughness: 0.6,
      metalness: 0.05,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = (-90 * Math.PI) / 180;
    scene.add(plane);
  }

  // セーブポイント
  const savePoint = new SavePoint();
  scene.add(savePoint);

  // --- Resize Handler ---
  const resize = () => {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio); // 念のため残す
    renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  // --- Animation Loop ---
  const tick = () => {
    const time = Date.now();
    const diffTime = time - prevTime;
    // 60fps = 16.67ms を意図した時間の比率 (より正確には time delta を使うべきだが元のロジックを踏襲)
    const speedRate = Math.round(diffTime / 16.667);

    // カメラの更新
    camera.update(speedRate);
    // セーブポイントの更新
    savePoint.update(speedRate);

    renderer.render(scene, camera);

    prevTime = time; // 時間を更新

    requestAnimationFrame(tick); // 次のフレームを要求
  };

  // --- Event Listeners and Initial Calls ---
  resize(); // 初期リサイズ呼び出し
  window.addEventListener("resize", resize);

  // アニメーションループを開始
  tick();
}
