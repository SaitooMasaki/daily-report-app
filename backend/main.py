from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from linebot import LineBotApi
from linebot.exceptions import LineBotApiError
from linebot.models import TextSendMessage
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# CORS設定（Next.jsからアクセス）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API設定
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# LINE Bot設定
line_bot_api = LineBotApi(os.getenv("LINE_CHANNEL_ACCESS_TOKEN"))
user_id = os.getenv("LINE_USER_ID")  # 通知を送るユーザーID

class ReportRequest(BaseModel):
    activities: str

@app.post("/generate-report")
async def generate_report(request: ReportRequest):
    try:
        # 今日の日付を取得
        today = datetime.now().strftime("%Y年%m月%d日")
        
        # OpenAIで日報生成
        prompt = f"""以下の活動内容を基に、ビジネス日報を作成してください。
自然で実用的、報告に適した形式で書いてください。

【日報フォーマット】
日付: {today}
業務内容: (活動内容を簡潔にまとめる)
成果: (達成したことや得られた結果)
課題: (問題点や改善点)
今後の予定: (次に取り組むこと)

活動内容: {request.activities}

上記のフォーマットに従って、自然な日本語で日報を作成してください。"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "あなたは優秀なアシスタントです。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        
        report = response.choices[0].message.content.strip()
        
        # LINEで通知
        message = f"AI生成日報:\n{report}"
        line_bot_api.push_message(user_id, TextSendMessage(text=message))
        
        return {"report": report}
    except Exception as e:
        print(f"Error: {str(e)}")  # デバッグ用
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI Daily Report API"}