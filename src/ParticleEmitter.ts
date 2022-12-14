import * as THREE from "three";
import Particle from "./Particle";

/**
 * パーティクルエミッタークラスです。
 */
export default class ParticleEmitter extends THREE.Object3D {
  /** フレーム毎にカウントされる値です。 */
  private _counter: number = 0;
  /** パーティクル格納配列です。 */
  private _pool: Particle[] = [];
  /** 生成するパーティクルの数です。 */
  private _particleNum: number = 50;
  /** パーティクルを発生させる間隔です。 */
  private _interval: number = 2;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update(speedRate: number) {
    // カウンターをインクリメント
    this._counter += speedRate;

    // パーティクルを数分更新
    const length = this._pool.length;
    for (let i = 0; i < length; i++) {
      const particle = this._pool[i];
      particle.update(speedRate);
    }

    if (Math.round(this._counter) % this._interval == 0) {
      this._addParticle();
    }
  }

  /**
   * パーティクルを追加します。
   */
  private _addParticle() {
    if (this._pool.length >= this._particleNum) {
      return;
    }
    const particle = new Particle();
    this._pool.push(particle);
    this.add(particle);
  }
}
