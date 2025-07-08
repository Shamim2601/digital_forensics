'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  const [checkUserId, setCheckUserId] = useState('');
  const [checkSource, setCheckSource] = useState('');
  const [checkText, setCheckText] = useState('');
  const [matchedHashes, setMatchedHashes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/logs?filter=${encodeURIComponent(filter)}`);
      const data = await res.json();
      setLogs(data.rows);
    };

    fetchData();
  }, [filter]);

  const handleCheckEntry = async () => {
    setLoading(true);
    setError(null);
    setMatchedHashes([]);

    const url = new URL('/api/hashes', window.location.origin);
    url.searchParams.append('user_id', checkUserId);
    url.searchParams.append('source', checkSource);
    // url.searchParams.append('text', checkText);

    try {
      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data.rows.length > 0) {
        setMatchedHashes(data.rows);
      } else {
        setError('❌ No matching hash entry found.');
      }
    } catch (err) {
      console.error('Error checking hash:', err);
      setError('❌ Error occurred while checking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔐 Hash Verification (Blockchain Logs)</h1>

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
      <div className="mb-6 border p-4 rounded bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-4">🔍 Check Stored Hash by Fields</h2>
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
          {/* <input
            type="text"
            placeholder="Comment Text (Exact)"
            value={checkText}
            onChange={(e) => setCheckText(e.target.value)}
            className="p-2 border rounded w-full"
          /> */}
        </div>
        <button
          onClick={handleCheckEntry}
          className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-4 py-2 rounded hover:from-purple-800 hover:to-indigo-800"
        >
          Check Hash
        </button>

        {/* Results */}
        {loading && <p className="mt-4 text-gray-500">⏳ Checking...</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {matchedHashes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">✅ Matching Hash Record(s)</h3>
            <div className="space-y-4">
              {matchedHashes.map((entry: any) => (
                <div
                  key={entry.id}
                  className="p-4 border border-gray-300 rounded bg-gray-900 text-white font-mono shadow-lg"
                >
                  <p><span className="text-purple-400">User ID:</span> {entry.user_id}</p>
                  <p><span className="text-purple-400">Source:</span> {entry.source}</p>
                  <p><span className="text-purple-400">Comment:</span> {entry.text}</p>
                  <p><span className="text-purple-400">Hash:</span> <span className="break-all">{entry.hashval}</span></p>
                  <p><span className="text-purple-400">Timestamp:</span> {new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-3">📜 Recent Logs</h2>
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
      </div>
    </main>
  );
}
