# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

Supabase 認証付きの不動産管理 Web アプリ（realestate_app）。

- フロントエンド: React + Vite（JavaScript / JSX）
- ルーティング: react-router-dom
- 認証: Supabase Auth（メールアドレス＋パスワード）
- 物件データ: Supabase の `properties` テーブル（RLS で「自分が登録した物件のみ」操作可能）

### ディレクトリ構成

- `supabase/migrations/` … DB のテーブル・RLS ポリシーを定義する SQL（Supabase ダッシュボードの SQL Editor で実行する）
- `src/lib/supabaseClient.js` … Supabase クライアント（接続情報は `.env` から読み込む）
- `src/lib/propertiesApi.js` … 物件の CRUD 操作（一覧取得・登録・更新・削除）
- `src/components/PropertyForm.jsx` … 物件の新規登録・編集で共通のフォーム
- `src/contexts/AuthContext.jsx` … ログイン状態の管理と `useAuth` フック
- `src/components/ProtectedRoute.jsx` … 未ログイン時のリダイレクト（`ProtectedRoute`）、ログイン済み時のリダイレクト（`GuestRoute`）
- `src/pages/` … 画面（Login / Signup / Properties）

### 環境変数

`.env` に以下を設定する（`.gitignore` 済み。雛形は `.env.example`）。

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## コーディング規約

- コメントは日本語で書く

## よく使うコマンド

```bash
npm install      # 依存パッケージのインストール
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
```

## Git 運用ルール

**コードを変更したら、そのたびに GitHub へプッシュすること。**

1. 変更がひとまとまり完了するたびにコミットする（複数の無関係な変更を1コミットに混ぜない）
2. コミット後は必ず `git push` で GitHub のリモートへ反映する
3. 作業をローカルにだけ残したまま終了しない

### コミットメッセージ

- 変更内容が分かる簡潔な1行目を書く（日本語可）
  - 例: `物件一覧ページに価格フィルターを追加`
- 必要に応じて空行のあとに詳細を書く

### 注意事項

- `.env` や認証情報・APIキーなどの機密情報はコミットしない（`.gitignore` に追加する）
- `git push --force` など履歴を書き換える操作は、ユーザーの明示的な指示がある場合のみ行う
- プッシュに失敗した場合（リモートとの競合など）は、勝手に解決せず状況をユーザーに報告する
