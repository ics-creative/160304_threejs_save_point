///<reference path="../typings/main.d.ts" />

namespace demo {

  /**
   * 地面の渦のクラスです。
   */
  export class Swirl extends THREE.Object3D{

    /** フレーム毎にカウントされる値です。 */
    private _counter:number = 0;
    /** マテリアルにあてるテクスチャーです。 */
    private _texture:THREE.Texture;

    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
      super();

      // テクスチャ
      this._texture = THREE.ImageUtils.loadTexture("img/swirl.png");
      this._texture.offset.y = -0.25;
      this._texture.wrapS = THREE.RepeatWrapping;

      // ドーナツ
      let geometry = new THREE.TorusGeometry(6, 3, 2, 100 );
      let material = new THREE.MeshBasicMaterial({
        color: 0x007eff,
        map: this._texture,
        transparent: true,
        //wireframe: true,
        blending: THREE.AdditiveBlending
      });
      var torus = new THREE.Mesh(geometry, material);
      torus.position.y = 0.01;
      torus.rotation.x = 90 * Math.PI / 180;
      this.add(torus);
    }

    /**
     * フレーム毎に更新をかけます。
     */
    public update() {
      this._counter++;
      let angle = this._counter * Math.PI / 180;
      this._texture.offset.x = -angle * 0.2;
    }

  }

}

