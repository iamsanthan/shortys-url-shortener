import React, { useState } from 'react';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UrlForm = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.startsWith('http')) {
      toast.error('Please enter a valid URL (must start with http or https)');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        { longUrl, customAlias }
      );
      setShortUrl(response.data.shortUrl);
      toast.success('Short URL created!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <h1 className="text-4xl font-bold text-indigo-600 text-center mb-8 font-display">
          ✂️ Shortys
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Long URL
            </label>
            <input
              type="url"
              required
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/some/long/path"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Custom Alias <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="e.g. my-custom-url"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105 shadow-md"
          >
            🔗 Generate Short Link
          </button>
        </form>

        {shortUrl && (
  <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex justify-between items-center shadow-sm">
    <a
      href={shortUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-700 font-medium break-all hover:underline"
    >
      {shortUrl}
    </a>
    <button
      onClick={handleCopy}
      className="text-indigo-600 hover:text-indigo-900 transition"
      title="Copy to clipboard"
    >
      <FaCopy size={18} />
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default UrlForm;
