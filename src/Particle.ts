import * as THREE from "three";
import { Util } from "./Util";

const material = new THREE.SpriteMaterial({
  color: 0x007eff,
  map: new THREE.TextureLoader().load("img/particle.png"),
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

/**
 * パーティクルのクラスです。
 */
export default class Particle extends THREE.Sprite {
  /** フレーム毎にカウントされる値です。 */
  private _counter = 0;
  /** パーティクルの速度です。 */
  private _velocity = new THREE.Vector3();

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(material.clone());

    // 初期化
    this._reset();
  }

  /**
   * ランダムな場所に位置を設定します。
   */
  private _reset() {
    const radian = Math.random() * Math.PI * 2;
    const x = Math.cos(radian) * 2;
    const z = Math.sin(radian) * 2;

    this.position.set(x, 0, z);
    this.scale.set(1, 1, 1);
    this._velocity.set(
      Util.random(-0.015, 0.015),
      Util.random(0.05, 0.1),
      Util.random(-0.015, 0.015)
    );
    this.material.opacity = 1;
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update(speedRate: number) {
    this._counter += speedRate;
    this.position.add(this._velocity.clone());
    this.material.opacity -= 0.009;

    const rad = Math.sin((this._counter * 30 * Math.PI) / 180);
    const scale = 0.75 + rad;
    this.scale.set(scale, scale, scale);

    if (this.material.opacity <= 0) {
      this._reset();
    }
  }
}
