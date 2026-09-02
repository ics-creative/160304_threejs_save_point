import { gsap } from "gsap";
import * as THREE from "three/webgpu";
import { orbMaterial, sparkMaterial } from "./ParticleMaterials";

/** セーブポイント内を浮遊する光粒子です。 */
export default class Particle extends THREE.Sprite {
  /** 十字型のテクスチャーを使用するかどうか。 */
  private readonly _spark: boolean;
  /** 明滅前の基本色です。 */
  private readonly _color: THREE.Color;
  /** GSAPが更新する明滅値です。 */
  private readonly _motion = { twinkle: 1 };

  constructor(index: number) {
    const spark = index % 3 !== 0;
    super((spark ? sparkMaterial : orbMaterial).clone());

    this._spark = spark;
    let color = index % 4 === 0 ? 0x20c0ff : 0x0090ff;
    if (spark) color = 0x80d8ff;
    this.material.color.set(color).multiplyScalar(spark ? 2 : 1);
    this._color = this.material.color.clone();

    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.randFloat(0.5, 3);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const duration = THREE.MathUtils.randFloat(6, 10);
    const getHeight = () => 0.5 + THREE.MathUtils.randFloat(8, 12);
    const size = THREE.MathUtils.randFloat(spark ? 0.4 : 0.1, spark ? 0.6 : 0.2);
    this.position.set(x, 0.5, z);
    this.material.rotation = angle;
    this.scale.setScalar(size);

    // 上昇とフェード。高さは周期ごとに変える
    gsap
      .timeline({ repeat: -1, repeatRefresh: true })
      .fromTo(this.position, { y: 0.5 }, { y: getHeight, duration, ease: "expo.in" }, 0)
      .set(this.material, { opacity: 0 }, 0)
      .to(this.material, { opacity: 1, duration: duration - 1, ease: "expo.in" }, 0)
      .to(this.material, { opacity: 0, duration: 1, ease: "power4.in" }, duration - 1)
      .progress(Math.random());

    // 漂う動き
    gsap
      .to(this.position, {
        x: () => x + THREE.MathUtils.randFloat(-0.3, 0.3),
        z: () => z + THREE.MathUtils.randFloat(-0.3, 0.3),
        duration: THREE.MathUtils.randFloat(3, 5),
        ease: "power4.inOut",
        repeat: -1,
        repeatRefresh: true,
      })
      .progress(Math.random());

    // 細かな明滅
    gsap
      .to(this._motion, {
        twinkle: 0.8,
        duration: THREE.MathUtils.randFloat(0.05, 0.1),
        ease: "power4.inOut",
        repeat: -1,
        yoyo: true,
      })
      .progress(Math.random());
  }

  /** 発光の強さを更新します。 */
  update(energy: number, sparkle: number) {
    const brightness = this._spark ? 0.5 + sparkle * 0.5 : 0.5 + energy * 0.2 + sparkle * 0.3;
    this.material.color.copy(this._color).multiplyScalar(this._motion.twinkle * brightness);
  }
}
