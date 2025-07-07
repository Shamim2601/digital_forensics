'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'Courtroom Evidence', 'Not Evidence'

  // States for checking entry
  const [checkUserId, setCheckUserId] = useState('');
  const [checkSource, setCheckSource] = useState('');
  const [checkText, setCheckText] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/logs?filter=${encodeURIComponent(filter)}`);
      const data = await res.json();
      setLogs(data.rows);
    };

    fetchData();
  }, [filter]);

  const handleCheckEntry = () => {
    const found = logs.some(
      (log) =>
        log.user_id === checkUserId &&
        log.source === checkSource &&
        log.text === checkText
    );
    setCheckResult(found ? '✅ Entry found in logs.' : '❌ Entry not found.');
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Courtroom Evidence Logs</h1>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="filter" className="mr-2 font-medium">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="Courtroom Evidence">Courtroom Evidence</option>
          <option value="Not Evidence">Not Evidence</option>
        </select>
      </div>

      {/* Check Entry Form */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">🔍 Check If Entry Exists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="User ID"
            value={checkUserId}
            onChange={(e) => setCheckUserId(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Source"
            value={checkSource}
            onChange={(e) => setCheckSource(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Comment Text (Exact)"
            value={checkText}
            onChange={(e) => setCheckText(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={handleCheckEntry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Check Entry
        </button>
        {checkResult && (
          <p className={`mt-3 font-medium ${checkResult.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {checkResult}
          </p>
        )}
      </div>

      {/* Logs Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Text</th>
            <th className="p-2 border">Prediction</th>
            <th className="p-2 border">Source</th>
            <th className="p-2 border">User ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2 border max-w-[300px] truncate" title={log.text}>{log.text}</td>
              <td className="p-2 border">{log.prediction}</td>
              <td className="p-2 border">{log.source}</td>
              <td className="p-2 border">{log.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
