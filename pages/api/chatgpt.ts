import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

// 応答データの型定義を作成
type ResponseData = {
  text: string;
};

// OpenAI API クライアントを初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// APIハンドラ関数を定義
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // リクエストからプロンプトを取得
  const { prompt } = req.body;

  // プロンプトが空の場合 400 エラーを返す
  if (!prompt) {
    res.status(400).json({ text: 'Prompt is required' });
    return;
  }

  try {
    // OpenAI API にプロンプトを送信して回答を生成
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [{ role: "system", content: prompt }],
    });

    // 生成された回答を取得
    const message = completionResponse.choices[0]?.message?.content?.trim() || 'Sorry, there was an error.';
    res.status(200).json({ text: message });
  } catch (error) {
    // エラー処理
    console.error(error);
    res.status(500).json({ text: 'An error occurred while fetching the completion.' });
  }
}
