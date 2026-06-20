# AI日報生成アプリ

Next.jsで作られたAI日報生成アプリです。Web上で今日やったことを入力すると、OpenAIのAPIで日報の形に成形し、編集・コピーできます。LINE Messengerへの通知にも対応しています。

## 機能

- Webフォームで活動内容を入力
- OpenAI GPTで日報を自動生成
- 生成された日報をブラウザ上で編集・コピー
- 生成された日報をLINEで通知（環境変数設定時のみ）

## セットアップ手順

### 1. 必要なツールのインストール

- **Node.js**: [https://nodejs.org/](https://nodejs.org/) からダウンロードしてインストールしてください。
- **Python**: [https://www.python.org/](https://www.python.org/) からダウンロードしてインストールしてください。インストール時にPATHに追加するオプションを選択してください。

### 2. APIキーの取得

- **OpenAI API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) から取得してください。
- **LINE Bot**（任意）: [https://developers.line.biz/](https://developers.line.biz/) でLINE Developersコンソールに登録し、チャンネルアクセストークンとユーザーIDを取得してください。

### 3. プロジェクトのセットアップ

1. プロジェクトディレクトリに移動:
   ```bash
   cd daily-report-app
   ```

2. 依存関係をインストール:
   ```bash
   npm install
   ```

3. 環境変数を設定:
   プロジェクトルートに `.env.local` ファイルを作成し、以下の値を設定してください:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
   LINE_USER_ID=your_line_user_id_here
   ```
   ※ `LINE_CHANNEL_ACCESS_TOKEN` と `LINE_USER_ID` は未設定でも動作します（その場合はLINE通知をスキップし、日報の生成・表示のみ行います）。

### 4. アプリの起動

開発サーバーを起動します:
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを使用してください。

## 使用方法

1. テキストエリアに今日やったことを入力します。
2. 「日報生成」ボタンをクリックします。
3. 生成された日報が表示されます。必要に応じて編集し、「コピー」ボタンでクリップボードにコピーできます。
4. LINE通知が設定されている場合は、生成された日報がLINEに送信されます。

## 技術スタック

- **フレームワーク**: Next.js (App Router), TypeScript, Tailwind CSS
- **API**: Next.js API Routes (`app/api/generate-report`)
- **AI**: OpenAI GPT-3.5-turbo
- **通知**: LINE Messaging API

## 注意事項

- OpenAI APIの使用には料金がかかる場合があります。
- LINE Botの設定にはLINE Developersのアカウントが必要です。
- セキュリティのため、APIキーを公開しないようにしてください（`.env.local` は `.gitignore` で除外済みです）。
