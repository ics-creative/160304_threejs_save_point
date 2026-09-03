import { gsap } from "gsap";
import * as THREE from "three/webgpu";
import MagicCircle from "../effects/MagicCircle";
import Pillar from "../effects/Pillar";
import Swirl from "../effects/Swirl";
import imageGround from "../img/ground.png";
import ParticleEmitter from "../particles/ParticleEmitter";

/** セーブポイントを構成するエフェクトとアニメーションを管理します。 */
export default class SavePoint extends THREE.Object3D {
  /** 各エフェクトで共有するアニメーション値です。 */
  private readonly _motion = { energy: 0, sparkle: 0.2 };
  /** 地面の明るさを更新するマテリアルです。 */
  private readonly _groundMaterial: THREE.MeshBasicMaterial;
  /** 地面上でまとめて展開するエフェクトです。 */
  private readonly _floorEffects = new THREE.Object3D();
  /** 三層の魔法陣です。 */
  private readonly _magicCircle = new MagicCircle();
  /** 床面を照らすポイントライトです。 */
  private readonly _light = new THREE.PointLight(0x20b0ff, 50, 4, 2);
  /** 中央から立ち上がる光柱です。 */
  private readonly _pillar = new Pillar();
  /** 中央から外側へ広がる光です。 */
  private readonly _spreadLight = new Pillar(4, 3, 2);
  /** 地面を流れる渦です。 */
  private readonly _swirl = new Swirl();
  /** 通常粒子と発動粒子を管理します。 */
  private readonly _particleEmitter = new ParticleEmitter();

  constructor() {
    super();

    // 地面の光
    const groundTexture = new THREE.TextureLoader().load(imageGround);
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    // 明輪を魔法陣の外へずらしつつ、swirlの内側へ収める
    groundTexture.repeat.setScalar(0.86);
    groundTexture.offset.setScalar(0.07);
    this._groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x0070d0,
      map: groundTexture,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 8.5), this._groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.05;

    // エフェクトの配置
    this._light.position.y = 2;
    this._spreadLight.brightness = 0.8;
    this._floorEffects.add(ground, this._spreadLight, this._swirl);
    this.add(
      this._floorEffects,
      this._magicCircle,
      this._pillar,
      this._particleEmitter,
      this._light,
    );

    // 初回モーションの開始位置
    this._pillar.position.y = -8;
    this._magicCircle.rotation.y = -Math.PI / 2;
    this._floorEffects.scale.set(0, 1, 0);
  }

  /** 各エフェクトを更新し、現在の発光の強さを返します。 */
  update(delta: number) {
    const { energy, sparkle } = this._motion;
    this._magicCircle.update(energy);
    this._pillar.update(delta, energy);
    this._spreadLight.update(delta, energy);
    this._swirl.update(delta, energy);
    this._particleEmitter.update(energy, sparkle);
    this._groundMaterial.color.setRGB(energy * 0.4, 0.4 + energy * 0.4, 1);
    this._groundMaterial.opacity = 0.65 + energy * 0.15;
    this._light.color.setRGB(energy, 0.6 + energy * 0.4, 1);
    this._light.intensity = 150 + energy * 200;
    return energy;
  }

  /** 初回の出現と周期的な明滅を開始します。 */
  start() {
    // 初回の出現
    this._magicCircle.startEntrance();
    gsap
      .timeline()
      .to(this._pillar.position, {
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      })
      .to(this._magicCircle.rotation, { y: 0, duration: 1.2, ease: "expo.out" }, 0)
      .to(this._floorEffects.scale, { x: 1, z: 1, duration: 1.2, ease: "expo.out" }, 0);

    // 予兆から発光、余韻までを一つの周期で再生
    const pulse = gsap.timeline({ delay: 0.2, repeat: -1, repeatDelay: 1 });
    pulse
      .to(this._motion, {
        energy: 0.8,
        sparkle: 1,
        duration: 1.2,
        ease: "power3.inOut",
      })
      .call(() => this._particleEmitter.emitWave(), [], "-=0.5")
      .to(this._motion, {
        energy: 0,
        sparkle: 0.2,
        duration: 3,
        ease: "power1.out",
      });
  }
}
