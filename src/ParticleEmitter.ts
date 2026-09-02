import * as THREE from "three/webgpu";
import Particle from "./Particle";
import WaveParticle from "./WaveParticle";

/** 通常粒子と発動粒子をまとめて管理します。 */
export default class ParticleEmitter extends THREE.Object3D {
  /** 常に上昇する丸と閃光です。 */
  private readonly _particles = Array.from({ length: 80 }, (_, index) => new Particle(index));
  /** 発動時に円内から立ち上がる縦光です。 */
  private readonly _waveParticles = Array.from(
    { length: 240 },
    (_, index) => new WaveParticle(index),
  );

  constructor() {
    super();
    this.add(...this._particles, ...this._waveParticles);
  }

  /** 発動粒子を時間差で再生します。 */
  emitWave() {
    for (let i = 0; i < this._waveParticles.length; i++) {
      this._waveParticles[i].trigger((i % 3) * 0.05 + Math.random() * 0.05);
    }
  }

  /** 通常粒子の発光を更新します。 */
  update(energy: number, sparkle: number) {
    for (const particle of this._particles) {
      particle.update(energy, sparkle);
    }
  }
}
