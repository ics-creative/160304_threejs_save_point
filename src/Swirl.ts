import * as THREE from "three/webgpu";
import imageSwirl from "./img/swirl.png";

/** 地面を流れる渦状の光を表示します。 */
export default class Swirl extends THREE.Object3D {
  /** 明るさを更新するマテリアルです。 */
  private readonly _material: THREE.MeshBasicMaterial;
  /** 光の流れを動かすテクスチャーです。 */
  private readonly _texture: THREE.Texture;

  constructor() {
    super();

    this._texture = new THREE.TextureLoader().load(imageSwirl);
    this._texture.offset.y = -0.25;
    this._texture.wrapS = THREE.RepeatWrapping;
    this._texture.colorSpace = THREE.SRGBColorSpace;

    this._material = new THREE.MeshBasicMaterial({
      color: 0x0080ff,
      map: this._texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.1,
    });

    const mesh = new THREE.Mesh(new THREE.TorusGeometry(4, 1, 2, 100), this._material);
    mesh.position.y = 0.02;
    mesh.rotation.x = Math.PI / 2;
    this.add(mesh);
  }

  /** 回転・光の流れ・明るさを更新します。 */
  update(delta: number, energy: number) {
    const speed = 0.1 + energy * 0.4;
    this.rotation.y -= delta * speed;
    this._texture.offset.x -= delta * speed;
    this._material.color.setRGB(energy, 0.5 + energy * 0.5, 1).multiplyScalar(1 + energy);
    this._material.opacity = 0.35 + energy * 0.2;
  }
}
