---
layout: default
---

# 開発者向け

VSCode用の設定は作成済みです。

## コマンド

### 初期設定

```bash
$ npm ci
```

### 本番環境のビルド

```bash
$ npm run dist
```

注）PCの設定によっては、管理者権限が必要になることがあります。

### 開発時の起動

VSCodeのDebuggerからも起動できます。

```bash
$ npm run dev
```

### 検証

VSCodeの `check` taskから実行できます。

```bash
# 型チェック
$ npm run type-check

# Lint
$ npm run lint
```

### 自動フォーマット

```bash
$ npm run lint:fix
```

## アプリケーション構成

Electronアプリケーション内でNext.jsを使用しています。
多くの設定をしないために、Next.jsをルーティングに使用し、アプリケーションの初期レンダリングを高速化するためにサーバサイドレンダリングを活用しています。
Next.jsもElectronレイヤもTypeScriptで記述され、ビルド時にJavaScriptにコンパイルされます。

| Part       | Source code (Typescript) | Builds (JavaScript) |
| ---------- | ------------------------ | ------------------- |
| Next.js    | `/renderer`              | `/renderer`         |
| Electron   | `/electron-src`          | `/main`             |
| Production |                          | `/dist`             |

開発時は、HTTPサーバを起動し、Next.jsでルーティングしています。
本番環境では、HTTPサーバを起動する代わりに、静的なHTMLファイルを `output: 'export'` で事前に生成し使用しています。

## デザイン

Figmaを用いて画面デザインを作成しています。
デザインシステムはMaterialDesignです。

[amethyst-electron – Figma](https://www.figma.com/file/yQLWa7vdPFTJxUUPtUGsmj/amethyst-electron?type=design&node-id=54702%3A25457&mode=design&t=dnEOwMbSyArYYupx-1)
