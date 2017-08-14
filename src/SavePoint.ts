///<reference path="../typings/main.d.ts" />
///<reference path="./Pillar.ts" />
///<reference path="./Swirl.ts" />
///<reference path="./ParticleEmitter.ts" />

namespace demo {

  /**
   * セーブポイントのクラスです。
   */
  export class SavePoint extends THREE.Object3D {

    /** 縦長の光の柱オブジェクトです。 */
    private _pillar:demo.Pillar;
    /** 広がる光のオブジェクトです。 */
    private _pillar2:demo.Pillar;
    /** 渦のオブジェクトです。 */
    private _swirl:demo.Swirl;
    /** パーティクルエミッターオブジェクトです。 */
    private _particleEmitter:demo.ParticleEmitter;

    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
      super();

      // 光の柱
      this._pillar = new Pillar(3, 3, 10);
      this.add(this._pillar);

      // 光の柱2
      this._pillar2 = new Pillar(8, 5, 2.5);
      this.add(this._pillar2);

      // 渦
      this._swirl = new Swirl();
      this.add(this._swirl);

      // パーティクルエミッター
      this._particleEmitter = new ParticleEmitter();
      this.add(this._particleEmitter);

      // 地面の光
      let groundTexture = THREE.ImageUtils.loadTexture("img/ground.png");
      let ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 32, 32),
        new THREE.MeshBasicMaterial({
          //color: 0x007eff,
          color: 0xffffff,
          map: groundTexture,
          side: THREE.DoubleSide,
          transparent: true,
          blending: THREE.AdditiveBlending
        })
      );
      ground.scale.multiplyScalar(1.35);
      ground.rotation.x = 90 * Math.PI / 180;
      ground.position.set(0, 0.02, 0);
      this.add(ground);
    }

    /**
     * フレーム毎に更新をかけます。
     */
    public update() {
      // それぞれの更新
      this._pillar.update();
      this._pillar2.update();
      this._particleEmitter.update();
      this._swirl.update();
    }

  }

}
