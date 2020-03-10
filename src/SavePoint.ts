import * as THREE from "three";
import ParticleEmitter from "./ParticleEmitter";
import Pillar from "./Pillar";
import Swirl from "./Swirl";
/**
 * セーブポイントのクラスです。
 */
export default class SavePoint extends THREE.Object3D {
  /** 縦長の光の柱オブジェクトです。 */
  private readonly _pillar: Pillar;
  /** 広がる光のオブジェクトです。 */
  private readonly _pillar2: Pillar;
  /** 渦のオブジェクトです。 */
  private readonly _swirl: Swirl;
  /** パーティクルエミッターオブジェクトです。 */
  private readonly _particleEmitter: ParticleEmitter;

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
    const groundTexture = new THREE.TextureLoader().load("img/ground.png");
    const ground = new THREE.Mesh(
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
    ground.rotation.x = (90 * Math.PI) / 180;
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
