#  ポートフォリオプロジェクト: Taskmanager (タスクマネージャー)

日常のワークフローを効率化し、生産性を追跡するために設計された、モダンでレスポンシブなタスク管理アプリケーションです。

**[ライブデモを見る](https://your-live-project-link.vercel.app)** ---

## プロジェクト概要

このプロジェクトは、**React**における状態管理（State Management）と、**Next.js**のルーティング機能を深く理解するために開発しました。クリーンでモダンなデザインを維持しながら、リアルタイムのタスク更新を効率的に処理できる、直感的で使いやすいUIの実現を目指しました。

### 主な機能
* **動的なタスクフィルター:** 「未完了」「進行中」「完了」のステータスごとに、タスクを瞬時に並び替えることができます。
* **データの永続化:** ブラウザのローカルストレージ（LocalStorage）を利用してタスクを自動保存するため、ページをリロードしてもデータが消えません。
* **レスポンシブ対応 UI:** スマートフォン、タブレット、デスクトップのどの画面サイズからでも快適に操作できるよう完全に最適化されています。

---

## 🛠️ 技術スタックと構成

* **フロントエンド:** React, Next.js (App Router)
* **スタイリング:** CSS Modules / Tailwind CSS *(※実際に使用した方を残してください)*
* **状態管理:** React Hooks (`useState`, `useEffect`)

```text
主なプロジェクト構造:
├── components/     # 再利用可能なUIコンポーネント (TaskCard, Sidebar など)
├── context/        # グローバルな状態管理ロジック
└── app/            # Next.js のページおよびレイアウト設定


## Email creatiion
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
    return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
    )
}
This ensures the email must contain:

Characters before @
An @ symbol
Characters after @
A . followed by more characters (like .com, .jp)

So test@gmail.com ✅ and abc or 1@1 ❌

## Password creation
// Minimum 8 characters, at least one number
const passwordRegex = /^(?=.*[0-9]).{8,}$/
if (!passwordRegex.test(password)) {
    return NextResponse.json(
        { error: "Password must be at least 8 characters and contain a number" },
        { status: 400 }
    )
}