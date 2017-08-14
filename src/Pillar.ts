///<reference path="../typings/main.d.ts" />

namespace demo {

  /**
   * 光の柱クラスです。
   */
  export class Pillar extends THREE.Object3D {

    /** フレーム毎にカウントされる値です。 */
    private _counter:number = 0;
    /** マテリアルにあてるテクスチャーです。 */
    private _texture:THREE.Texture;
    /** 柱のメッシュです。 */
    private _cylinder:THREE.Mesh;

    /**
     * コンストラクターです。
     * @constructor
     * @param {number} topRadius
     * @param {number} bottomRadius
     * @param {number} height
     */
    constructor(topRadius:number, bottomRadius:number, height:number) {
      super();

      // テクスチャ
      this._texture = THREE.ImageUtils.loadTexture("img/pillar.png");
      this._texture.wrapS = THREE.RepeatWrapping;
      this._texture.repeat.set(10, 1);

      // 光の柱
      let geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 20, 1, true);
      let material = new THREE.MeshBasicMaterial({
        color: 0x007eff,
        map: this._texture,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      });
      this._cylinder = new THREE.Mesh(geometry, material);
      // 地面の高さに合わせる
      this._cylinder.position.set(0, height/2, 0);

      this.add(this._cylinder);
    }

    /**
     * フレーム毎に更新をかけます。
     */
    public update() {
      this._counter+=0.5;
      let angle = this._counter * Math.PI / 180;
      // テクスチャを上下させる
      this._texture.offset.y = 0.1 + 0.2 * Math.sin(angle*3);
      // テクスチャを回転させる
      this._texture.offset.x = angle;
    }

  }

}
