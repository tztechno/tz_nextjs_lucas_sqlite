import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // POSTリクエストのみを許可
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // データベースを開く
        const db = await open({
            filename: './lucas_numbers.db',
            driver: sqlite3.Database
        });

        // テーブルを削除
        await db.run('DROP TABLE IF EXISTS lucas_numbers');

        // テーブルを再作成
        await db.run(`
      CREATE TABLE lucas_numbers (
        n INTEGER PRIMARY KEY,
        result INTEGER,
        duration REAL
      )
    `);

        // データベース接続を閉じる
        await db.close();

        res.status(200).json({ message: 'Database reset successfully' });
    } catch (error) {
        console.error('Database reset error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}