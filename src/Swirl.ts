import * as THREE from "three";

/**
 * 地面の渦のクラスです。
 */
export default class Swirl extends THREE.Object3D {
  /** フレーム毎にカウントされる値です。 */
  private _counter: number = 0;
  /** マテリアルにあてるテクスチャーです。 */
  private readonly _texture: THREE.Texture;

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super();

    // テクスチャ
    this._texture = new THREE.TextureLoader().load("img/swirl.png");
    this._texture.offset.y = -0.25;
    this._texture.wrapS = THREE.RepeatWrapping;

    // ドーナツ
    const geometry = new THREE.TorusGeometry(6, 3, 2, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0x007eff,
      map: this._texture,
      transparent: true,
      //wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.y = 0.01;
    torus.rotation.x = (90 * Math.PI) / 180;
    this.add(torus);
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update(speedRate: number) {
    this._counter += speedRate;
    const angle = (this._counter * Math.PI) / 180;
    this._texture.offset.x = -angle * 0.2;
  }
}
