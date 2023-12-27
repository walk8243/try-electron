# Amethyst

関係しているGitHubのIssuesを表示・管理するデスクトップアプリ

![application icon](docs/img/icon_200.png)

## 使い方

### インストール

#### Macの場合

Homebrew Caskを用意しています。
以下のコマンドにて、インストールしてください。

```sh
brew tap --cask @walk8243/cask
brew install --cask @walk8243/cask/amethyst
```

インストール後、起動するためには **システム設定** > **プライバシーとセキュリティ** でAmethystを許可してください。

#### Windowsの場合

Windowsインストーラファイル `*.msi` を用意しています。
[最新のリリース](https://github.com/walk8243/amethyst-electron/releases/) からインストーラをダウンロードしてください。

ダウンロード完了後は、エクスプローラなどからダブルクリックしてインストールしてください。

以下はPowershellから操作するときの例です。

```pwsh
# インストールする場合
msiexec.exe /i "$env:userprofile\Downloads\amethyst-0.0.0-win.msi"

# アンインストールする場合
msiexec.exe /x "$env:userprofile\Downloads\amethyst-0.0.0-win.msi"
```

### 初期設定

使用するには、GitHub Tokenが必要になります。

こちら https://github.com/settings/tokens からTokenを取得してください。

## 開発者用

VSCode用の設定は作成済みです。

### コマンド

#### 初期設定

```bash
$ npm ci
```

#### 本番環境のビルド

```bash
$ npm run dist
```

注）PCの設定によっては、管理者権限が必要になることがあります。

#### 開発時の起動

VSCodeのDebuggerからも起動できます。

```bash
$ npm run dev
```

#### 検証

VSCodeの `check` taskから実行できます。

```bash
# 型チェック
$ npm run type-check

# Lint
$ npm run lint
```

### アプリケーション構成

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

### デザイン

Figmaを用いて画面デザインを作成しています。
デザインフレームワークはMaterialDesignです。

https://www.figma.com/file/yQLWa7vdPFTJxUUPtUGsmj/amethyst-electron?type=design&t=40RWPyne71Apt9tS-6
