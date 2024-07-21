import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const calculateLucasNumber2 = (n: number): number => {
    if (n === 0) return 2;
    if (n === 1) return 1;
    let a = 2, b = 1, c = 0;
    for (let i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return c;
};

const calculateLucasNumber = (n: number): number => {
    if (n === 0) return 2;
    if (n === 1) return 1;
    return calculateLucasNumber(n - 1) + calculateLucasNumber(n - 2);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const start = process.hrtime();
    const { value } = req.body;
    const result = calculateLucasNumber(value);
    const end = process.hrtime(start);
    const duration = end[0] + end[1] / 1e9; // seconds

    // SQLiteデータベースを開く
    const db = await open({
        filename: './lucas_numbers.db',
        driver: sqlite3.Database
    });

    // テーブルが存在しない場合は作成
    await db.exec(`
        CREATE TABLE IF NOT EXISTS lucas_numbers (
            n INTEGER PRIMARY KEY,
            result INTEGER,
            duration REAL
        )
    `);

    // 結果を挿入
    await db.run(
        'INSERT OR REPLACE INTO lucas_numbers (n, result, duration) VALUES (?, ?, ?)',
        [value, result, duration]
    );

    // データベース接続を閉じる
    await db.close();

    res.status(200).json({ result, duration });
};