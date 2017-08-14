///<reference path="../typings/main.d.ts" />
///<reference path="./Util.ts" />

namespace demo {

  /**
   * パーティクルのクラスです。
   */
  export class Particle extends THREE.Sprite {

    /** フレーム毎にカウントされる値です。 */
    private _counter:number = 0;
    /** パーティクルの速度です。 */
    private _velocity:THREE.Vector3;

    /**
     * コンストラクターです。
     * @constructor
     */
    constructor() {
      super(new THREE.SpriteMaterial({
        color: 0x007eff,
        map: THREE.ImageUtils.loadTexture("img/particle.png"),
        transparent: true,
        blending: THREE.AdditiveBlending
      }));

      // 初期化
      this._init();
    }

    /**
     * ランダムな場所に位置を設定します。
     */
    private _init() {
      this.position.set(0, 0, 0);
      this.scale.set(1, 1, 1);
      this._velocity = new THREE.Vector3(
        Util.random(-0.015, 0.015),
        Util.random(0.05, 0.1),
        Util.random(-0.015, 0.015)
      );
      this.material.opacity = 1;
    }

    /**
     * フレーム毎に更新をかけます。
     */
    public update() {
      this._counter++;
      this.position.add(this._velocity.clone());
      this.material.opacity -= 0.009;

      let rad = Math.sin(this._counter * 30 * Math.PI / 180);
      let scale = 0.5 + rad;
      this.scale.set(scale, scale, scale);

      if(this.material.opacity <= 0) {
        this._init();
      }
    }

  }

}
