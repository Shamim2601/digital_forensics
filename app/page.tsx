// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'Courtroom Evidence', 'Not Evidence'

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/logs?filter=${encodeURIComponent(filter)}`);
      const data = await res.json();
      setLogs(data.rows);
    };

    fetchData();
  }, [filter]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Courtroom Evidence Logs</h1>

      {/* Dropdown Filter */}
      <div className="mb-4">
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
