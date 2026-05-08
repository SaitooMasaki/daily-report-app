'use client';

import { useState } from 'react';

export default function Home() {
  const [activities, setActivities] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activities }),
      });
      const data = await response.json();
      setReport(data.report);
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">AI日報生成アプリ</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="activities" className="block text-gray-700 font-medium mb-2">
              今日やったことを入力してください
            </label>
            <textarea
              id="activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '生成中...' : '日報生成'}
          </button>
        </form>
        {report && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">生成された日報</h2>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {report}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
