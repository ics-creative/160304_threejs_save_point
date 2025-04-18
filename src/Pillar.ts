import * as THREE from "three";

/**
 * 光の柱クラスです。
 */
export default class Pillar extends THREE.Object3D {
  /** フレーム毎にカウントされる値です。 */
  private _counter: number = 0;
  /** マテリアルにあてるテクスチャーです。 */
  private readonly _texture: THREE.Texture;
  /** 柱のメッシュです。 */
  private readonly _cylinder: THREE.Mesh;

  /**
   * コンストラクターです。
   * @param {number} topRadius
   * @param {number} bottomRadius
   * @param {number} height
   */
  constructor(topRadius: number, bottomRadius: number, height: number) {
    super();

    // テクスチャ
    this._texture = new THREE.TextureLoader().load("img/pillar.png");
    this._texture.wrapS = THREE.RepeatWrapping;
    this._texture.repeat.set(10, 1);
    this._texture.colorSpace = THREE.SRGBColorSpace;

    // 光の柱
    const geometry = new THREE.CylinderGeometry(
      topRadius,
      bottomRadius,
      height,
      20,
      1,
      true,
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0x007eff,
      map: this._texture,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    this._cylinder = new THREE.Mesh(geometry, material);
    // 地面の高さに合わせる
    this._cylinder.position.set(0, height / 2, 0);

    this.add(this._cylinder);
  }

  /**
   * フレーム毎に更新をかけます。
   */
  public update(speedRate: number) {
    // console.log(speedRate * 1.0);
    this._counter += speedRate;
    // this._counter = this._counter + 0.5 * speedRate;
    const angle = (this._counter * Math.PI) / 180;

    // テクスチャを上下させる
    this._texture.offset.y = 0.1 + 0.2 * Math.sin(angle * 3);
    // テクスチャを回転させる
    this._texture.offset.x = angle;
  }
}
