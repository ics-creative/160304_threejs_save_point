# Three.jsで作るセーブポイント風エフェクト
ICS MEDIA記事「[Three.js初学者必見！エフェクト作成の基本ノウハウまとめ]()」にて解説しています。


## デモ

こちらからデモを確認できます

- [デモページ](https://ics-creative.github.io/160304_threejs_save_point/demo/index.html)


## 利用ライブラリ

- [Three.js](http://threejs.org/)


## デモの開発環境構築

デモコードはTypeScriptで書かれているので、実際に編集や実行するためには環境構築が必要です。以下にそのフローを記載します。

### 1. npmモジュールをインストール

以下のコードを実行して必要なnpmモジュールをインストールしてください。

```bash
npm install
```

モジュールのインストール完了後、typingsというモジュールによりThree.jsの型定義ファイルが自動的にダウンロードされます。

### 2. ソースコードのWatchと簡易Webサーバーの起動

以下のコマンドを実行することで、TypeScriptコードのWatchが開始され、編集後に自動的にコンパイルされます。

```bash
npm start
```

同時に簡易Webサーバーも起動するので以下のURLで確認できます。

```
http://localhost:8888/demo
```
