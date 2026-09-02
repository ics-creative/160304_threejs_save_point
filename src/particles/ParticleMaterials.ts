import * as THREE from "three/webgpu";
import imageOrb from "../img/ball.png";
import imageSpark from "../img/particle.png";

// テクスチャー
const loader = new THREE.TextureLoader();
const orbTexture = loader.load(imageOrb);
const sparkTexture = loader.load(imageSpark);
orbTexture.colorSpace = THREE.SRGBColorSpace;
sparkTexture.colorSpace = THREE.SRGBColorSpace;

const createMaterial = (texture: THREE.Texture) =>
  new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

// テクスチャーは共有し、マテリアルは粒子ごとに複製する。
export const orbMaterial = createMaterial(orbTexture);
export const sparkMaterial = createMaterial(sparkTexture);
