import { useState, useEffect } from 'react';

interface LucasNumber {
    n: number;
    result: number;
    duration: number;
}

export default function LucasNumbers() {
    const [lucasNumbers, setLucasNumbers] = useState<LucasNumber[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchLucasNumbers() {
        try {
            const response = await fetch('/api/get-lucas-numbers?limit=20');
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            console.log('Fetched data:', data);  // デバッグ用ログ
            setLucasNumbers(data);
        } catch (error) {
            console.error('Error fetching Lucas numbers:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLucasNumbers();
    }, []);

    async function handleReset() {
        try {
            const response = await fetch('/api/reset-lucas-numbers', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to reset database');
            }
            alert('Database reset successfully');
            fetchLucasNumbers(); // データベースリセット後に再度データを取得
        } catch (error) {
            console.error('Error resetting database:', error);
            alert('Failed to reset database');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Lucas Numbers</h1>
            <button onClick={handleReset}>Reset Database</button>
            {lucasNumbers.length === 0 ? (
                <p>No data available</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>n</th>
                            <th>Result</th>
                            <th>Duration (seconds)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lucasNumbers.map((num) => (
                            <tr key={num.n}>
                                <td>{num.n}</td>
                                <td>{num.result}</td>
                                <td>{num.duration.toFixed(6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}