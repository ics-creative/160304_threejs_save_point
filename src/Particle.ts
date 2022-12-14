import * as THREE from "three";
import { Util } from "./Util";

const texture = new THREE.TextureLoader().load("img/particle.png");

const material = new THREE.SpriteMaterial({
  color: 0x007eff,
  map: texture,
  transparent: true,
  blending: THREE.AdditiveBlending,
});

/**
 * パーティクルのクラスです。
 */
export default class Particle extends THREE.Sprite {
  /** フレーム毎にカウントされる値です。 */
  private _counter: number = 0;
  /** パーティクルの速度です。 */
  private _velocity: THREE.Vector3;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(material);

    // 初期化
    this._init();
  }

  /**
   * ランダムな場所に位置を設定します。
   */
  private _init() {
    this.position.set(0, 0, 0);
    this.scale.set(1, 1, 1);
    this._velocity = new THREE.Vector3(
      Util.random(-0.015, 0.015),
      Util.random(0.05, 0.1),
      Util.random(-0.015, 0.015)
    );
    this.material.opacity = 1;
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update() {
    this._counter++;
    this.position.add(this._velocity.clone());
    this.material.opacity -= 0.009;

    const rad = Math.sin((this._counter * 30 * Math.PI) / 180);
    const scale = 0.5 + rad;
    this.scale.set(scale, scale, scale);

    if (this.material.opacity <= 0) {
      this._init();
    }
  }
}
