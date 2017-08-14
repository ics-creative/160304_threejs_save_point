var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../typings/main.d.ts" />
var demo;
(function (demo) {
    /**
     * カメラのクラスです。
     */
    var Camera = (function (_super) {
        __extends(Camera, _super);
        /**
         * コンストラクターです。
         * @constructor
         */
        function Camera() {
            _super.call(this, 45, window.innerWidth / window.innerHeight, 1, 1000);
            /** アニメーションに用いる角度の値です。 */
            this._angle = 0;
            /** アニメーションの円軌道の半径です。 */
            this._radius = 25;
            this.position.set(this._radius, 15, 0);
            this.lookAt(new THREE.Vector3(0, 3, 0));
        }
        /**
         * 毎フレームの更新をかけます。
         */
        Camera.prototype.update = function () {
            this._angle += 0.2;
            var lad = this._angle * Math.PI / 180;
            this.position.x = this._radius * Math.sin(lad);
            this.position.z = this._radius * Math.cos(lad);
            this.lookAt(new THREE.Vector3(0, 0, 0));
        };
        return Camera;
    }(THREE.PerspectiveCamera));
    demo.Camera = Camera;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
var demo;
(function (demo) {
    /**
     * 光の柱クラスです。
     */
    var Pillar = (function (_super) {
        __extends(Pillar, _super);
        /**
         * コンストラクターです。
         * @constructor
         * @param {number} topRadius
         * @param {number} bottomRadius
         * @param {number} height
         */
        function Pillar(topRadius, bottomRadius, height) {
            _super.call(this);
            /** フレーム毎にカウントされる値です。 */
            this._counter = 0;
            // テクスチャ
            this._texture = THREE.ImageUtils.loadTexture("img/pillar.png");
            this._texture.wrapS = THREE.RepeatWrapping;
            this._texture.repeat.set(10, 1);
            // 光の柱
            var geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 20, 1, true);
            var material = new THREE.MeshBasicMaterial({
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
            this._cylinder.position.set(0, height / 2, 0);
            this.add(this._cylinder);
        }
        /**
         * フレーム毎に更新をかけます。
         */
        Pillar.prototype.update = function () {
            this._counter += 0.5;
            var angle = this._counter * Math.PI / 180;
            // テクスチャを上下させる
            this._texture.offset.y = 0.1 + 0.2 * Math.sin(angle * 3);
            // テクスチャを回転させる
            this._texture.offset.x = angle;
        };
        return Pillar;
    }(THREE.Object3D));
    demo.Pillar = Pillar;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
var demo;
(function (demo) {
    /**
     * 地面の渦のクラスです。
     */
    var Swirl = (function (_super) {
        __extends(Swirl, _super);
        /**
         * コンストラクターです。
         * @constructor
         */
        function Swirl() {
            _super.call(this);
            /** フレーム毎にカウントされる値です。 */
            this._counter = 0;
            // テクスチャ
            this._texture = THREE.ImageUtils.loadTexture("img/swirl.png");
            this._texture.offset.y = -0.25;
            this._texture.wrapS = THREE.RepeatWrapping;
            // ドーナツ
            var geometry = new THREE.TorusGeometry(6, 3, 2, 100);
            var material = new THREE.MeshBasicMaterial({
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
        Swirl.prototype.update = function () {
            this._counter++;
            var angle = this._counter * Math.PI / 180;
            this._texture.offset.x = -angle * 0.2;
        };
        return Swirl;
    }(THREE.Object3D));
    demo.Swirl = Swirl;
})(demo || (demo = {}));
var demo;
(function (demo) {
    /**
     * 便利メソッドクラスです。
     */
    var Util = (function () {
        function Util() {
        }
        /**
         * min, maxの間でランダムな数を返します。
         * @param {number} min
         * @param {number} max
         * @return number
         */
        Util.random = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        return Util;
    }());
    demo.Util = Util;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
///<reference path="./Util.ts" />
var demo;
(function (demo) {
    /**
     * パーティクルのクラスです。
     */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
         * コンストラクターです。
         * @constructor
         */
        function Particle() {
            _super.call(this, new THREE.SpriteMaterial({
                color: 0x007eff,
                map: THREE.ImageUtils.loadTexture("img/particle.png"),
                transparent: true,
                blending: THREE.AdditiveBlending
            }));
            /** フレーム毎にカウントされる値です。 */
            this._counter = 0;
            // 初期化
            this._init();
        }
        /**
         * ランダムな場所に位置を設定します。
         */
        Particle.prototype._init = function () {
            this.position.set(0, 0, 0);
            this.scale.set(1, 1, 1);
            this._velocity = new THREE.Vector3(demo.Util.random(-0.015, 0.015), demo.Util.random(0.05, 0.1), demo.Util.random(-0.015, 0.015));
            this.material.opacity = 1;
        };
        /**
         * フレーム毎に更新をかけます。
         */
        Particle.prototype.update = function () {
            this._counter++;
            this.position.add(this._velocity.clone());
            this.material.opacity -= 0.009;
            var rad = Math.sin(this._counter * 30 * Math.PI / 180);
            var scale = 0.5 + rad;
            this.scale.set(scale, scale, scale);
            if (this.material.opacity <= 0) {
                this._init();
            }
        };
        return Particle;
    }(THREE.Sprite));
    demo.Particle = Particle;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
///<reference path="./Util.ts" />
///<reference path="./Particle.ts" />
var demo;
(function (demo) {
    /**
     * パーティクルエミッタークラスです。
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        /**
         * コンストラクターです。
         * @constructor
         */
        function ParticleEmitter() {
            _super.call(this);
            /** フレーム毎にカウントされる値です。 */
            this._counter = 0;
            /** パーティクル格納配列です。 */
            this._pool = [];
            /** 生成するパーティクルの数です。 */
            this._particleNum = 10;
            /** パーティクルを発生させる間隔です。 */
            this._interval = 15;
        }
        /**
         * フレーム毎に更新をかけます。
         */
        ParticleEmitter.prototype.update = function () {
            // カウンターをインクリメント
            this._counter++;
            // パーティクルを数分更新
            var length = this._pool.length;
            for (var i = 0; i < length; i++) {
                var particle = this._pool[i];
                particle.update();
            }
            if (this._counter % this._interval == 0) {
                this._addParticle();
            }
        };
        /**
         * パーティクルを追加します。
         */
        ParticleEmitter.prototype._addParticle = function () {
            if (this._pool.length >= this._particleNum) {
                return;
            }
            var particle = new demo.Particle();
            this._pool.push(particle);
            this.add(particle);
        };
        return ParticleEmitter;
    }(THREE.Object3D));
    demo.ParticleEmitter = ParticleEmitter;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
///<reference path="./Pillar.ts" />
///<reference path="./Swirl.ts" />
///<reference path="./ParticleEmitter.ts" />
var demo;
(function (demo) {
    /**
     * セーブポイントのクラスです。
     */
    var SavePoint = (function (_super) {
        __extends(SavePoint, _super);
        /**
         * コンストラクターです。
         * @constructor
         */
        function SavePoint() {
            _super.call(this);
            // 光の柱
            this._pillar = new demo.Pillar(3, 3, 10);
            this.add(this._pillar);
            // 光の柱2
            this._pillar2 = new demo.Pillar(8, 5, 2.5);
            this.add(this._pillar2);
            // 渦
            this._swirl = new demo.Swirl();
            this.add(this._swirl);
            // パーティクルエミッター
            this._particleEmitter = new demo.ParticleEmitter();
            this.add(this._particleEmitter);
            // 地面の光
            var groundTexture = THREE.ImageUtils.loadTexture("img/ground.png");
            var ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 32, 32), new THREE.MeshBasicMaterial({
                //color: 0x007eff,
                color: 0xffffff,
                map: groundTexture,
                side: THREE.DoubleSide,
                transparent: true,
                blending: THREE.AdditiveBlending
            }));
            ground.scale.multiplyScalar(1.35);
            ground.rotation.x = 90 * Math.PI / 180;
            ground.position.set(0, 0.02, 0);
            this.add(ground);
        }
        /**
         * フレーム毎に更新をかけます。
         */
        SavePoint.prototype.update = function () {
            // それぞれの更新
            this._pillar.update();
            this._pillar2.update();
            this._particleEmitter.update();
            this._swirl.update();
        };
        return SavePoint;
    }(THREE.Object3D));
    demo.SavePoint = SavePoint;
})(demo || (demo = {}));
///<reference path="../typings/main.d.ts" />
///<reference path="./Camera.ts" />
///<reference path="./SavePoint.ts" />
window.addEventListener('load', function () {
    new demo.Main();
});
var demo;
(function (demo) {
    /**
     * デモのメインクラスです。
     */
    var Main = (function () {
        /**
         * コンストラクターです。
         * @constructor
         */
        function Main() {
            // シーン
            this._scene = new THREE.Scene();
            // カメラ
            this._camera = new demo.Camera();
            // レンダラー
            this._renderer = new THREE.WebGLRenderer({ antialias: true });
            this._renderer.setClearColor(0x83a3b7);
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this._renderer.domElement);
            // 環境光
            var light = new THREE.DirectionalLight(0x555555, 1.6);
            light.position = new THREE.Vector3(0.577, 0.577, 0.577);
            light.castShadow = true;
            this._scene.add(light);
            // 地面
            var planeTexture = THREE.ImageUtils.loadTexture("img/tile.png");
            planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
            planeTexture.repeat.set(16, 16);
            var planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
            var planeMaterial = new THREE.MeshPhongMaterial({
                map: planeTexture,
                bumpMap: planeTexture,
                bumpScale: 0.2,
                shininess: 3,
                specularMap: planeTexture,
                side: THREE.DoubleSide
            });
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = 90 * Math.PI / 180;
            this._scene.add(plane);
            // セーブポイント
            this._savePoint = new demo.SavePoint();
            this._scene.add(this._savePoint);
            this._tick();
        }
        /**
         * フレーム毎のアニメーションの更新をかけます。
         */
        Main.prototype._tick = function () {
            var _this = this;
            requestAnimationFrame(function () { _this._tick(); });
            // カメラの更新
            this._camera.update();
            // セーブポイントの更新
            this._savePoint.update();
            this._renderer.render(this._scene, this._camera);
        };
        return Main;
    }());
    demo.Main = Main;
})(demo || (demo = {}));
//# sourceMappingURL=bundle.js.map