import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OPENAI_API_KEY set:', Boolean(process.env.OPENAI_API_KEY));

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST to /api/generate-report');
    const json = await request.json();
    console.log('Incoming request body:', json);

    const { activities } = json;

    if (!activities) {
      console.warn('Missing activities in request body');
      return NextResponse.json({ error: 'Activities are required' }, { status: 400 });
    }

    // 今日の日付を取得
    const today = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // OpenAIで日報生成
    const prompt = `以下の活動内容を基に、ビジネス日報を作成してください。
自然で実用的、報告に適した形式で書いてください。

【日報フォーマット】
日付: ${today}
業務内容: (活動内容を簡潔にまとめる)
成果: (達成したことや得られた結果)
課題: (問題点や改善点)
今後の予定: (次に取り組むこと)

活動内容: ${activities}`;

    console.log('Using prompt length:', prompt.length);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    console.log('OpenAI completion received:', completion?.choices?.length);

    const report = completion.choices[0]?.message?.content?.trim() || '日報生成に失敗しました。';
    console.log('Generated report preview:', report.slice(0, 200));

    // LINE通知を送信（環境変数が設定されている場合）
    if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_USER_ID) {
      try {
        console.log('Sending LINE notification...');
        const lineMessage = await sendLineNotification(report);
        console.log('LINE notification sent successfully');
      } catch (lineError) {
        console.error('Error sending LINE notification:', lineError);
        // LINE通知エラーは無視して、日報は返す
      }
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

async function sendLineNotification(report: string) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!channelAccessToken || !userId) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID is not set');
  }

  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [
        {
          type: 'text',
          text: `📋 今日の日報が生成されました\n\n${report}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LINE API error: ${response.status} ${error}`);
  }

  return response.json();
}