---
layout: default
is_project_header: false
---

# インストール方法

## Macの場合

Homebrew Caskを用意しています。
以下のコマンドにて、インストールしてください。

```sh
brew tap walk8243/cask
brew install --cask walk8243/cask/amethyst
```

インストール後、起動するためには **システム設定** > **プライバシーとセキュリティ** でAmethystを許可してください。

## Windowsの場合

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

<div class="nav">
  <a href="{{ '/' | relative_url }}" class="nav__btn nav__btn--back">トップ</a>
  <a href="{{ '/detail/setup.html' | relative_url }}" class="nav__btn nav__btn--next">初期設定</a>
</div>
