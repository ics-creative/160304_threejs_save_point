import * as THREE from "three/webgpu";
import imagePillar from "../img/pillar.png";

/** テクスチャーが流れる円柱状の光を表示します。 */
export default class Pillar extends THREE.Object3D {
  /** 光量の倍率です。 */
  brightness = 1;
  /** 外側の光を描画するマテリアルです。 */
  private readonly _outerMaterial: THREE.MeshBasicMaterial;
  /** 内側の光を描画するマテリアルです。 */
  private readonly _innerMaterial: THREE.MeshBasicMaterial;
  /** 外側の光を流すテクスチャーです。 */
  private readonly _outerTexture: THREE.Texture;
  /** 内側の光を流すテクスチャーです。 */
  private readonly _innerTexture: THREE.Texture;

  constructor(topRadius = 3, bottomRadius = 3, height = 10) {
    super();

    const textureLoader = new THREE.TextureLoader();
    this._outerTexture = textureLoader.load(imagePillar);
    this._innerTexture = textureLoader.load(imagePillar);
    for (const texture of [this._outerTexture, this._innerTexture]) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    this._outerTexture.repeat.x = 6;
    this._innerTexture.repeat.x = 3;

    const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 64, 1, true);
    this._outerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0070e0,
      map: this._outerTexture,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });
    this._innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x40d8ff,
      map: this._innerTexture,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });

    const outer = new THREE.Mesh(geometry, this._outerMaterial);
    const inner = new THREE.Mesh(geometry, this._innerMaterial);
    outer.position.y = height / 2;
    inner.position.y = height / 2;
    inner.scale.set(0.95, 1, 0.95);
    this.scale.y = 0.8;
    this.add(outer, inner);
  }

  /** 回転・光の流れ・明るさを更新します。 */
  update(delta: number, energy: number) {
    this.scale.y = 0.8 + energy * 0.2;
    this.rotation.y += delta * 0.2;
    this._outerTexture.offset.x += delta * 0.2;
    this._innerTexture.offset.x -= delta * 0.3;
    this._outerMaterial.color
      .setRGB(energy * 0.2, 0.3 + energy * 0.4, 1)
      .multiplyScalar((1 + energy * 0.5) * this.brightness);
    this._innerMaterial.color
      .setRGB(energy * 0.4, 0.7 + energy * 0.1, 1)
      .multiplyScalar((1 + energy) * this.brightness);
    this._outerMaterial.opacity = 0.25 + energy * 0.25;
    this._innerMaterial.opacity = this._outerMaterial.opacity * 0.6;
  }
}
