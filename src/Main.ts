import { Loader } from "three";
import * as THREE from "three";
import Camera from "./Camera";
import SavePoint from "./SavePoint";

/**
 * デモのメインクラスです。
 */
export default class Main {
  /** シーンオブジェクトです。 */
  private readonly _scene: THREE.Scene;
  /** カメラオブジェクトです。 */
  private readonly _camera: Camera;
  /** レンダラーオブジェクトです。 */
  private _renderer: THREE.WebGLRenderer;
  /** セーブポイント単体です。 */
  private readonly _savePoint: SavePoint;
  private _prevTime = Date.now();

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    // シーン
    this._scene = new THREE.Scene();

    // カメラ
    this._camera = new Camera();

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    // 出力カラー空間を設定 (r152以降)
    this._renderer.outputColorSpace = THREE.SRGBColorSpace;
    // もしr152より古いバージョンをお使いの場合は、以下を使用します
    // this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);

    // 環境光
    const light = new THREE.PointLight(0x555555, 500, 50);
    light.position.set(0.577, 0.577, 0.577);
    light.castShadow = true;
    this._scene.add(light);

    // 地面
    {
      const texture = new THREE.TextureLoader().load("img/tile.png");
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(128, 128);
      // アンチエリアスを無効にする
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 1.0,
        shininess: 3,
        specularMap: texture,
        side: THREE.BackSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = (90 * Math.PI) / 180;
      this._scene.add(plane);
    }

    // セーブポイント
    this._savePoint = new SavePoint();
    this._scene.add(this._savePoint);

    this._tick();

    // リサイズ処理
    this._resize();
    window.addEventListener("resize", () => {
      this._resize();
    });
  }

  /**
   * フレーム毎のアニメーションの更新をかけます。
   */
  private _tick() {
    const time = Date.now();
    const diffTime = time - this._prevTime;
    const speedRate = Math.round(diffTime / 16.667); // 60fps = 16.67ms を意図した時間の比率

    // カメラの更新
    this._camera.update(speedRate);
    // セーブポイントの更新
    this._savePoint.update(speedRate);

    this._renderer.render(this._scene, this._camera);

    this._prevTime = time;

    requestAnimationFrame(() => {
      this._tick();
    });
  }

  private _resize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
}
