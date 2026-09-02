import * as THREE from "three/webgpu";
import imageTile from "./img/tile.png";

/** タイル模様の床を表示します。 */
export default class Floor extends THREE.Mesh {
  constructor() {
    const texture = new THREE.TextureLoader().load(imageTile);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(128, 128);
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x102840,
      map: texture,
      bumpMap: texture,
      bumpScale: 0.5,
      roughness: 1,
    });
    super(geometry, material);

    this.rotation.x = -Math.PI / 2;
  }
}
