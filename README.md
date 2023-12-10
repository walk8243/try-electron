# Amethyst

関係しているGitHubのIssuesを表示・管理するデスクトップアプリ

## 使い方

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

```bash
$ npm run dev
```

### TypeScriptの型チェック

```bash
$ npm run type-check
```

## TypeScript × Next.js × Electron

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

### インストール方法

```bash
$ npx create-next-app --example with-electron-typescript with-electron-typescript-app
```

## 開発

### Figma

https://www.figma.com/file/yQLWa7vdPFTJxUUPtUGsmj/amethyst-electron?type=design&t=40RWPyne71Apt9tS-6
