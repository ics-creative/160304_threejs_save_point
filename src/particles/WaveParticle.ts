import { gsap } from "gsap";
import * as THREE from "three/webgpu";
import { particleDisplayScale, sparkMaterial } from "./ParticleMaterials";

const waveColors = [0xffffff, 0xa0e0ff, 0x20c0ff, 0x4080ff];

/** 発動時に一度だけ上昇する縦長の光粒子です。 */
export default class WaveParticle extends THREE.Sprite {
  constructor(index: number) {
    super(sparkMaterial.clone());
    this.material.color.set(waveColors[index % waveColors.length]).multiplyScalar(1.5);
    this.material.opacity = 0;
    this.visible = false;
  }

  /** 指定した待ち時間で上昇を開始します。 */
  trigger(delay: number) {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.randFloat(0, 3);
    const duration = THREE.MathUtils.randFloat(1, 2);
    const height = THREE.MathUtils.randFloat(6, 10);
    const size = THREE.MathUtils.randFloat(0.2, 0.4);
    const displaySize = size * particleDisplayScale;
    this.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
    this.scale.set(displaySize * 0.5, displaySize, 1);
    this.material.opacity = 0;
    this.visible = false;

    // 上昇・伸縮・明滅を同じ時間軸で再生
    gsap
      .timeline({
        delay,
        onStart: () => {
          this.visible = true;
        },
        onComplete: () => {
          this.visible = false;
        },
      })
      .to(this.position, { y: 0.5 + height, duration, ease: "power1.out" }, 0)
      .to(
        this.scale,
        {
          keyframes: {
            y: [displaySize, displaySize * 4, displaySize],
            easeEach: "power4.inOut",
          },
          duration,
        },
        0,
      )
      .to(
        this.material,
        {
          keyframes: {
            // 0.7と1を交互にして短く明滅する
            opacity: [1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0],
            easeEach: "power4.inOut",
          },
          duration,
        },
        0,
      );
  }
}
