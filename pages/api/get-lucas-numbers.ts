import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // データベースを開く
        const db = await open({
            filename: './lucas_numbers.db',
            driver: sqlite3.Database
        });

        // クエリパラメータからlimitを取得（デフォルトは10）
        const limit = parseInt(req.query.limit as string) || 10;

        // データを取得
        const lucasNumbers = await db.all('SELECT * FROM lucas_numbers ORDER BY n LIMIT ?', limit);

        // データベース接続を閉じる
        await db.close();

        // 結果を返す
        res.status(200).json(lucasNumbers);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}