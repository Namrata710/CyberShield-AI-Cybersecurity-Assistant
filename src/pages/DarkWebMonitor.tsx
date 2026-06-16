import { useState } from 'react';
import { Eye, Search, AlertTriangle, Shield, Globe, Clock, Database, KeyRound, Mail, Building2, CheckCircle, XCircle } from 'lucide-react';

interface BreachResult {
  domain: string;
  breachFound: boolean;
  breachName: string;
  breachDate: string;
  dataClasses: string[];
  recordsAffected: string;
  description: string;
  darkWebMentions: number;
  pasteMentions: number;
}

const breachDatabase: BreachResult[] = [
  {
    domain: 'acme-corp.com',
    breachFound: true,
    breachName: 'AcmeCorp Data Breach 2024',
    breachDate: 'March 2024',
    dataClasses: ['Email addresses', 'Passwords (hashed)', 'Employee IDs', 'Internal documents'],
    recordsAffected: '2.3M',
    description: 'Threat actor "DarkHarvester" posted a database containing AcmeCorp employee credentials and internal documents on a dark web marketplace.',
    darkWebMentions: 47,
    pasteMentions: 12,
  },
  {
    domain: 'techstart.io',
    breachFound: true,
    breachName: 'TechStart Credential Leak',
    breachDate: 'January 2025',
    dataClasses: ['Email addresses', 'API keys', 'Customer records', 'Source code snippets'],
    recordsAffected: '890K',
    description: 'Stealer logs containing TechStart employee credentials found in infostealer malware dump. Multiple API keys identified.',
    darkWebMentions: 23,
    pasteMentions: 8,
  },
  {
    domain: 'globalbank.com',
    breachFound: true,
    breachName: 'GlobalBank Phishing Kit Distribution',
    breachDate: 'Ongoing',
    dataClasses: ['Phishing templates', 'Customer PII', 'Financial records'],
    recordsAffected: 'Unknown',
    description: 'Phishing kits targeting GlobalBank customers actively distributed on dark web forums. Multiple threat actors offering custom phishing pages.',
    darkWebMentions: 156,
    pasteMentions: 34,
  },
];

const emailLeaks = [
  { email: 'admin@acme-corp.com', breached: true, breaches: ['AcmeCorp 2024', 'LinkedIn 2021'], passwordCompromised: true, sources: 3 },
  { email: 'cto@techstart.io', breached: true, breaches: ['TechStart 2025'], passwordCompromised: false, sources: 1 },
  { email: 'dev@globalbank.com', breached: true, breaches: ['GlobalBank Phishing Kit'], passwordCompromised: true, sources: 5 },
  { email: 'user@example.com', breached: false, breaches: [], passwordCompromised: false, sources: 0 },
];

export function DarkWebMonitor() {
  const [searchType, setSearchType] = useState<'domain' | 'email'>('domain');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BreachResult | null>(null);
  const [emailResult, setEmailResult] = useState<typeof emailLeaks[0] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const scan = () => {
    if (!query.trim()) return;
    setScanning(true);
    setProgress(0);
    setResults(null);
    setEmailResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          if (searchType === 'domain') {
            const found = breachDatabase.find(b => b.domain === query.toLowerCase());
            setResults(found || { domain: query, breachFound: false, breachName: '', breachDate: '', dataClasses: [], recordsAffected: '', description: 'No breaches found for this domain in monitored dark web sources.', darkWebMentions: 0, pasteMentions: 0 });
          } else {
            const found = emailLeaks.find(e => e.email === query.toLowerCase());
            setEmailResult(found || { email: query, breached: false, breaches: [], passwordCompromised: false, sources: 0 });
          }
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 200);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Dark Web Monitoring Simulation</h2>
          <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">DEMO ONLY</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">Search for company domain breaches or email leaks using publicly available breach datasets. This is a simulation for educational purposes.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-[#111827] rounded-lg p-1 border border-[#1a2744]">
            {(['domain', 'email'] as const).map(type => (
              <button
                key={type}
                onClick={() => { setSearchType(type); setResults(null); setEmailResult(null); }}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all capitalize ${searchType === type ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {type === 'domain' ? <><Building2 className="w-3 h-3 inline mr-1" />Domain</> : <><Mail className="w-3 h-3 inline mr-1" />Email</>}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scan()}
              placeholder={searchType === 'domain' ? 'acme-corp.com' : 'admin@acme-corp.com'}
              className="cyber-input w-full pl-10"
            />
          </div>
          <button onClick={scan} disabled={scanning || !query.trim()} className="cyber-btn flex items-center gap-2 disabled:opacity-40">
            {scanning ? <><Clock className="w-4 h-4 animate-spin" /> Scanning...</> : <><Eye className="w-4 h-4" /> Scan Dark Web</>}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <p className="text-[10px] text-slate-600">Try:</p>
          {searchType === 'domain'
            ? ['acme-corp.com', 'techstart.io', 'globalbank.com', 'example.com'].map(d => (
              <button key={d} onClick={() => setQuery(d)} className="px-2 py-0.5 text-[10px] bg-[#111827] border border-[#1a2744] rounded text-slate-500 hover:text-sky-400 transition-colors">{d}</button>
            ))
            : ['admin@acme-corp.com', 'cto@techstart.io', 'dev@globalbank.com', 'user@example.com'].map(e => (
              <button key={e} onClick={() => setQuery(e)} className="px-2 py-0.5 text-[10px] bg-[#111827] border border-[#1a2744] rounded text-slate-500 hover:text-sky-400 transition-colors">{e}</button>
            ))
          }
        </div>

        {scanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Scanning dark web sources...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div className="bg-gradient-to-r from-red-600 to-amber-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] font-mono-cyber">
              {progress > 20 && <span className="text-sky-400">PASTEBIN SITES CHECKED</span>}
              {progress > 50 && <span className="text-amber-400">FORUM INDEXES SCANNED</span>}
              {progress > 80 && <span className="text-red-400">MARKETPLACES ANALYZED</span>}
            </div>
          </div>
        )}
      </div>

      {/* Domain Results */}
      {searchType === 'domain' && results && (
        <div className={`cyber-card p-6 ${results.breachFound ? 'cyber-glow-red' : 'cyber-glow-green'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${results.breachFound ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              {results.breachFound ? <AlertTriangle className="w-7 h-7 text-red-400" /> : <CheckCircle className="w-7 h-7 text-emerald-400" />}
            </div>
            <div>
              <p className="text-xs text-slate-500">{results.domain}</p>
              <p className={`text-xl font-bold ${results.breachFound ? 'text-red-400' : 'text-emerald-400'}`}>
                {results.breachFound ? 'Breach Detected' : 'No Breach Found'}
              </p>
            </div>
          </div>

          {results.breachFound && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#111827] rounded-lg">
                  <p className="text-[10px] text-slate-600">Dark Web Mentions</p>
                  <p className="text-xl font-bold font-mono-cyber text-red-400">{results.darkWebMentions}</p>
                </div>
                <div className="p-3 bg-[#111827] rounded-lg">
                  <p className="text-[10px] text-slate-600">Paste Site Mentions</p>
                  <p className="text-xl font-bold font-mono-cyber text-amber-400">{results.pasteMentions}</p>
                </div>
                <div className="p-3 bg-[#111827] rounded-lg">
                  <p className="text-[10px] text-slate-600">Records Affected</p>
                  <p className="text-xl font-bold font-mono-cyber text-white">{results.recordsAffected}</p>
                </div>
              </div>

              <div className="p-3 bg-[#111827] rounded-lg">
                <p className="text-xs text-slate-400 mb-2"><span className="font-medium text-slate-300">{results.breachName}</span> - {results.breachDate}</p>
                <p className="text-xs text-slate-400">{results.description}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-2">Compromised Data Classes:</p>
                <div className="flex flex-wrap gap-2">
                  {results.dataClasses.map((dc, i) => (
                    <span key={i} className="px-2 py-1 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded flex items-center gap-1">
                      <XCircle className="w-2.5 h-2.5" /> {dc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-400 font-medium mb-1">Recommended Actions:</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>- Force password reset for all affected accounts</li>
                  <li>- Enable MFA on all organizational accounts</li>
                  <li>- Monitor for credential stuffing attacks</li>
                  <li>- Notify affected employees and customers</li>
                  <li>- Engage legal counsel for regulatory compliance</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Results */}
      {searchType === 'email' && emailResult && (
        <div className={`cyber-card p-6 ${emailResult.breached ? 'cyber-glow-red' : 'cyber-glow-green'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${emailResult.breached ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              {emailResult.breached ? <KeyRound className="w-7 h-7 text-red-400" /> : <CheckCircle className="w-7 h-7 text-emerald-400" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono-cyber">{emailResult.email}</p>
              <p className={`text-xl font-bold ${emailResult.breached ? 'text-red-400' : 'text-emerald-400'}`}>
                {emailResult.breached ? 'Credentials Leaked' : 'No Leaks Found'}
              </p>
            </div>
          </div>

          {emailResult.breached && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#111827] rounded-lg">
                  <p className="text-[10px] text-slate-600">Password Compromised</p>
                  <p className={`text-sm font-bold ${emailResult.passwordCompromised ? 'text-red-400' : 'text-emerald-400'}`}>
                    {emailResult.passwordCompromised ? 'YES - Change Immediately' : 'Not directly found'}
                  </p>
                </div>
                <div className="p-3 bg-[#111827] rounded-lg">
                  <p className="text-[10px] text-slate-600">Sources Found On</p>
                  <p className="text-sm font-bold font-mono-cyber text-amber-400">{emailResult.sources}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-2">Associated Breaches:</p>
                <div className="space-y-1.5">
                  {emailResult.breaches.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-[#111827] rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-slate-300">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
