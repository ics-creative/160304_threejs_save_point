import { gsap } from "gsap";
import * as THREE from "three/webgpu";
import MagicCircle from "./MagicCircle";
import ParticleEmitter from "./ParticleEmitter";
import Pillar from "./Pillar";
import Swirl from "./Swirl";
import imageGround from "./img/ground.png";

/** セーブポイントを構成するエフェクトとアニメーションを管理します。 */
export default class SavePoint extends THREE.Object3D {
  /** 各エフェクトで共有するアニメーション値です。 */
  private readonly _motion = { energy: 0, sparkle: 0.2 };
  /** 地面の明るさを更新するマテリアルです。 */
  private readonly _groundMaterial: THREE.MeshBasicMaterial;
  /** 三層の魔法陣です。 */
  private readonly _magicCircle = new MagicCircle();
  /** 床面を照らすポイントライトです。 */
  private readonly _light = new THREE.PointLight(0x20b0ff, 50, 4, 2);
  /** 中央から立ち上がる光柱です。 */
  private readonly _pillar = new Pillar();
  /** 地面を流れる渦です。 */
  private readonly _swirl = new Swirl();
  /** 通常粒子と発動粒子を管理します。 */
  private readonly _particleEmitter = new ParticleEmitter();

  constructor() {
    super();

    // 地面の光
    const groundTexture = new THREE.TextureLoader().load(imageGround);
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    this._groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x0070d0,
      map: groundTexture,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.3,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), this._groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.05;

    // エフェクトの配置
    this._light.position.y = 2;
    this.add(
      ground,
      this._magicCircle,
      this._pillar,
      this._swirl,
      this._particleEmitter,
      this._light,
    );
    this._startTimeline();
  }

  /** 各エフェクトを更新し、現在の発光の強さを返します。 */
  update(delta: number) {
    const { energy, sparkle } = this._motion;
    this._magicCircle.update(energy);
    this._pillar.update(delta, energy);
    this._swirl.update(delta, energy);
    this._particleEmitter.update(energy, sparkle);
    this._groundMaterial.color.setRGB(energy, 0.4 + energy * 0.6, 1);
    this._groundMaterial.opacity = 0.25 + energy * 0.15;
    this._light.color.setRGB(energy, 0.6 + energy * 0.4, 1);
    this._light.intensity = 150 + energy * 250;
    return energy;
  }

  /** セーブポイントの明滅を繰り返すタイムラインを作成します。 */
  private _startTimeline() {
    // 予兆から発光、余韻までを一つの周期で再生
    const timeline = gsap.timeline({ delay: 2, repeat: -1, repeatDelay: 1 });
    timeline
      .to(this._motion, {
        energy: 0.4,
        sparkle: 0.4,
        duration: 0.8,
        ease: "power3.in",
      })
      .to(this._motion, {
        energy: 1,
        sparkle: 1,
        duration: 0.4,
        ease: "power2.inOut",
        onStart: () => this._particleEmitter.emitWave(),
      })
      .to(
        this._motion,
        {
          energy: 0,
          sparkle: 0.2,
          duration: 3,
          ease: "power1.out",
        },
        1.5,
      );
  }
}
