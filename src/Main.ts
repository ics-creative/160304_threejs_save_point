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
    document.body.appendChild(this._renderer.domElement);

    // 環境光
    const light = new THREE.PointLight(0x555555, 1.6, 50);
    light.position.set(0.577, 0.577, 0.577);
    light.castShadow = true;
    this._scene.add(light);

    // 地面
    const planeTexture = new THREE.TextureLoader().load("img/tile.png");
    planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(16, 16);
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: planeTexture,
      bumpMap: planeTexture,
      bumpScale: 1.0,
      shininess: 3,
      specularMap: planeTexture,
      side: THREE.BackSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = (90 * Math.PI) / 180;
    this._scene.add(plane);

    // セーブポイント
    this._savePoint = new SavePoint();
    this._scene.add(this._savePoint);

    this._tick();
  }

  /**
   * フレーム毎のアニメーションの更新をかけます。
   */
  private _tick() {
    requestAnimationFrame(() => {
      this._tick();
    });

    // カメラの更新
    this._camera.update();
    // セーブポイントの更新
    this._savePoint.update();

    this._renderer.render(this._scene, this._camera);
  }
}
