# 家計簿アプリ 💰

[![Vercel](https://img.shields.io/badge/Vercel-deployed-black)](https://kakeibo-app-xi.vercel.app)
![Angular](https://img.shields.io/badge/Angular-21-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2F%20Auth-orange)

クレカ明細と照らし合わせながら家計を管理できるWebアプリ。
スマホからサクッと入力できることを重視して設計しました。

## 🔗 デモ

https://kakeibo-app-xi.vercel.app

## 🛠 技術スタック

| 階層 / 機能    | 採用技術                            | 選定理由                                    |
| -------------- | ----------------------------------- | ------------------------------------------- |
| Frontend       | **Angular 21 + TypeScript**         | Reactとの比較・構造重視の設計スタイルが合う |
| 状態管理       | Angular Signals / ChangeDetectorRef | Firebase非同期処理との統合                  |
| Authentication | **Firebase Auth**                   | Googleログイン対応                          |
| Database       | **Firestore**                       | ユーザーごとのデータ分離設計                |
| グラフ         | **Chart.js**                        | 月ごとの集計を円グラフで可視化              |
| Hosting / CI   | **Vercel**                          | GitHub push → 自動デプロイ                  |

## 📝 機能一覧（実装済み）

- Googleログイン認証
- 支出の登録・編集・削除（CRUD）
- カテゴリ・決済方法・引き落とし方法のマスターデータ管理
- 月ごとの集計グラフ（カテゴリ別・引き落とし方法別）
- 引き落とし方法別の明細一覧
- 月の切り替え機能
- CSVエクスポート
- 多言語対応（日本語・英語・タガログ語）
- スマホUI最適化

## 🔍 工夫したポイント

- マスターデータと実績データの分離設計
- `ChangeDetectorRef.detectChanges()` で変更検知を手動トリガー
- Firestoreのサブコレクション設計（`users/{uid}/entries`）でデータ完全分離

## 📌 今後の予定

- CSVインポート（クレカ明細の自動取り込み）
- レシートスクショ登録

## 🚀 ローカルでの実行手順

### 通常起動

```bash
git clone https://github.com/ksk3gogodayo/kakeibo-app.git
cd kakeibo-app
npm install
ng serve
```

### Docker で起動

```bash
docker-compose up --build
```

ブラウザで http://localhost:4200 を開く
