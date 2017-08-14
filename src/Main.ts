///<reference path="../typings/main.d.ts" />
///<reference path="./Camera.ts" />
///<reference path="./SavePoint.ts" />

window.addEventListener('load', () => {
  new demo.Main();
});

namespace demo {

  /**
   * デモのメインクラスです。
   */
  export class Main {

    /** シーンオブジェクトです。 */
    private _scene:THREE.Scene;
    /** カメラオブジェクトです。 */
    private _camera:demo.Camera;
    /** レンダラーオブジェクトです。 */
    private _renderer:THREE.WebGLRenderer;
    /** セーブポイント単体です。 */
    private _savePoint:demo.SavePoint;

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
      this._renderer = new THREE.WebGLRenderer({antialias: true});
      this._renderer.setClearColor(0x83a3b7);
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this._renderer.domElement);

      // 環境光
      let light = new THREE.DirectionalLight(0x555555,1.6);
      light.position = new THREE.Vector3(0.577, 0.577, 0.577);
      light.castShadow = true;
      this._scene.add(light);

      // 地面
      let planeTexture = THREE.ImageUtils.loadTexture("img/tile.png");
      planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
      planeTexture.repeat.set(16, 16);
      let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
      let planeMaterial = new THREE.MeshPhongMaterial({
        map: planeTexture,
        bumpMap: planeTexture,
        bumpScale: 0.2,
        shininess: 3,
        specularMap: planeTexture,
        side: THREE.DoubleSide
      });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = 90 * Math.PI / 180;
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
      requestAnimationFrame(() => { this._tick() });

      // カメラの更新
      this._camera.update();
      // セーブポイントの更新
      this._savePoint.update();

      this._renderer.render(this._scene, this._camera);
    }

  }

}
