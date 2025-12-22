import React, { useState } from 'react';
import { checkSecurity } from '../services/api';
import { ShieldCheck, AlertTriangle, Search } from 'lucide-react';

const SecurityScanner = () => {
  const [location, setLocation] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await checkSecurity(location);
    setReport(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-kech-red p-6 text-white">
          <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
            <ShieldCheck /> Safety Scanner
          </h2>
          <p className="text-red-100 text-sm">Real-time news analysis for Marrakech streets</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleScan} className="flex gap-2 mb-8">
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter street or area name (e.g. Gueliz)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kech-red outline-none"
            />
            <button disabled={loading} className="bg-kech-red text-white p-3 rounded-lg hover:bg-red-800">
              <Search />
            </button>
          </form>

          {loading && <div className="text-center text-gray-500">Scanning news sources...</div>}

          {report && (
            <div className={`border-l-4 p-4 rounded bg-gray-50 ${
              report.risk_level === 'Low' ? 'border-green-500' : 
              report.risk_level === 'Moderate' ? 'border-yellow-500' : 'border-red-500'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{report.location}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                   report.risk_level === 'Low' ? 'bg-green-500' : 
                   report.risk_level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {report.risk_level} RISK
                </span>
              </div>
              <p className="text-gray-700 mb-4">{report.summary}</p>
              
              {report.sources.length > 0 && (
                <div className="text-xs text-gray-400">
                  Sources found: {report.sources.length} (Check local news for details)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityScanner;
