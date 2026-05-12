# AI日報生成アプリ

PythonとNext.jsを使って作られたAI日報生成アプリです。Web上で今日やったことを入力すると、OpenAIのAPIで日報の形に成形し、LINE Messengerで通知します。

## 機能

- Webフォームで活動内容を入力
- OpenAI GPTで日報を自動生成
- 生成された日報をLINEで通知

## セットアップ手順

### 1. 必要なツールのインストール

- **Node.js**: [https://nodejs.org/](https://nodejs.org/) からダウンロードしてインストールしてください。
- **Python**: [https://www.python.org/](https://www.python.org/) からダウンロードしてインストールしてください。インストール時にPATHに追加するオプションを選択してください。

### 2. APIキーの取得

- **OpenAI API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) から取得してください。
- **LINE Bot**: [https://developers.line.biz/](https://developers.line.biz/) でLINE Developersコンソールに登録し、チャンネルアクセストークンとユーザーIDを取得してください。

### 3. プロジェクトのセットアップ

1. プロジェクトディレクトリに移動:
   ```bash
   cd daily-report-app
   ```

2. Next.jsの依存関係をインストール:
   ```bash
   npm install
   ```

3. Pythonの依存関係をインストール:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. 環境変数を設定:
   `backend/.env` ファイルを編集し、以下の値を設定してください:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
   LINE_USER_ID=your_line_user_id_here
   ```

### 4. アプリの起動

1. バックエンドサーバーを起動 (新しいターミナルで):
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. フロントエンドを起動 (別のターミナルで):
   ```bash
   npm run dev
   ```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを使用してください。

## 使用方法

1. テキストエリアに今日やったことを入力します。
2. 「日報生成」ボタンをクリックします。
3. 生成された日報が表示され、LINEに通知されます。

## 技術スタック

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **AI**: OpenAI GPT-3.5-turbo
- **Notification**: LINE Bot API

## 注意事項

- OpenAI APIの使用には料金がかかる場合があります。
- LINE Botの設定にはLINE Developersのアカウントが必要です。
- セキュリティのため、APIキーを公開しないようにしてください。
