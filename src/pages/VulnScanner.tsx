import { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Server, Globe, Lock, Wifi } from 'lucide-react';
import { vulnerabilities } from '../data/mockData';
import { severityBg, severityColor } from '../utils/helpers';

interface ScanResult {
  target: string;
  riskScore: number;
  openPorts: string[];
  vulns: typeof vulnerabilities;
  headers: { name: string; present: boolean; importance: string }[];
  ssl: { grade: string; issues: string[] };
  timestamp: string;
}

export function VulnScanner() {
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult | null>(null);

  const startScan = () => {
    if (!target.trim()) return;
    setScanning(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          const riskScore = Math.floor(Math.random() * 50) + 40;
          const portCount = Math.floor(Math.random() * 5) + 3;
          const openPorts = ['80', '443', '22', '21', '3306', '6379', '8080', '445', '23', '8443'].slice(0, portCount);
          const headerChecks = [
            { name: 'Strict-Transport-Security', present: Math.random() > 0.5, importance: 'High' },
            { name: 'Content-Security-Policy', present: Math.random() > 0.6, importance: 'High' },
            { name: 'X-Frame-Options', present: Math.random() > 0.4, importance: 'Medium' },
            { name: 'X-Content-Type-Options', present: Math.random() > 0.3, importance: 'Medium' },
            { name: 'X-XSS-Protection', present: Math.random() > 0.5, importance: 'Low' },
            { name: 'Referrer-Policy', present: Math.random() > 0.6, importance: 'Medium' },
            { name: 'Permissions-Policy', present: Math.random() > 0.7, importance: 'Low' },
          ];
          const sslGrade = riskScore > 70 ? 'F' : riskScore > 55 ? 'C' : riskScore > 40 ? 'B' : 'A';
          const sslIssues = riskScore > 70 ? ['Expired certificate', 'Weak cipher suites (RC4, DES)', 'SHA-1 signature algorithm'] : riskScore > 55 ? ['Missing intermediate certificate', 'TLS 1.0 supported'] : riskScore > 40 ? ['TLS 1.1 still enabled'] : [];

          setResults({
            target,
            riskScore,
            openPorts,
            vulns: vulnerabilities.slice(0, Math.floor(Math.random() * 4) + 3),
            headers: headerChecks,
            ssl: { grade: sslGrade, issues: sslIssues },
            timestamp: new Date().toISOString(),
          });
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 200);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Scan Input */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Vulnerability Scanner</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Enter a website URL or IP address to scan for vulnerabilities, open ports, and security misconfigurations.</p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={target}
              onChange={e => setTarget(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && startScan()}
              placeholder="example.com or 192.168.1.1"
              className="cyber-input w-full pl-10"
            />
          </div>
          <button onClick={startScan} disabled={scanning || !target.trim()} className="cyber-btn disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            {scanning ? <><Clock className="w-4 h-4 animate-spin" /> Scanning...</> : <><Search className="w-4 h-4" /> Scan</>}
          </button>
        </div>
        {scanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Scanning {target}...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div className="bg-gradient-to-r from-sky-600 to-cyan-400 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-slate-600 font-mono-cyber">
              {progress > 20 && <span className="text-emerald-500">PORT SCAN COMPLETE</span>}
              {progress > 50 && <span className="text-sky-400">HEADER CHECK COMPLETE</span>}
              {progress > 80 && <span className="text-amber-400">SSL ANALYSIS COMPLETE</span>}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Risk Score Overview */}
          <div className="grid lg:grid-cols-4 gap-4">
            <div className={`cyber-card p-5 ${results.riskScore >= 70 ? 'cyber-glow-red' : results.riskScore >= 50 ? 'cyber-glow-amber' : 'cyber-glow-green'}`}>
              <p className="text-xs text-slate-500 mb-2">Risk Score</p>
              <p className={`text-4xl font-bold font-mono-cyber ${severityColor(results.riskScore >= 70 ? 'critical' : results.riskScore >= 50 ? 'medium' : 'low')}`}>
                {results.riskScore}
              </p>
              <p className="text-xs text-slate-500 mt-1">out of 100</p>
            </div>
            <div className="cyber-card p-5">
              <p className="text-xs text-slate-500 mb-2">Vulnerabilities</p>
              <p className="text-4xl font-bold font-mono-cyber text-orange-400">{results.vulns.length}</p>
              <p className="text-xs text-slate-500 mt-1">issues found</p>
            </div>
            <div className="cyber-card p-5">
              <p className="text-xs text-slate-500 mb-2">Open Ports</p>
              <p className="text-4xl font-bold font-mono-cyber text-sky-400">{results.openPorts.length}</p>
              <p className="text-xs text-slate-500 mt-1">detected</p>
            </div>
            <div className="cyber-card p-5">
              <p className="text-xs text-slate-500 mb-2">SSL Grade</p>
              <p className={`text-4xl font-bold font-mono-cyber ${results.ssl.grade === 'A' ? 'text-emerald-400' : results.ssl.grade === 'B' ? 'text-amber-400' : 'text-red-400'}`}>
                {results.ssl.grade}
              </p>
              <p className="text-xs text-slate-500 mt-1">TLS assessment</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Vulnerabilities */}
            <div className="cyber-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-slate-200">Vulnerabilities Found</h3>
              </div>
              <div className="space-y-3">
                {results.vulns.map(v => (
                  <div key={v.id} className="p-3 bg-[#111827] rounded-lg border border-[#1a2744]">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityBg(v.severity)}`}>{v.severity}</span>
                        <span className="text-xs font-medium text-white">{v.name}</span>
                      </div>
                      <span className="text-[10px] font-mono-cyber text-slate-600">Port {v.port}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{v.description}</p>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-emerald-400/80">{v.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Headers + SSL */}
            <div className="space-y-4">
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Security Headers</h3>
                </div>
                <div className="space-y-2">
                  {results.headers.map(h => (
                    <div key={h.name} className="flex items-center justify-between py-1.5 px-3 rounded bg-[#111827]">
                      <div className="flex items-center gap-2">
                        {h.present ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span className="text-xs text-slate-300">{h.name}</span>
                      </div>
                      <span className={`text-[10px] ${h.importance === 'High' ? 'text-red-400' : h.importance === 'Medium' ? 'text-amber-400' : 'text-slate-500'}`}>{h.importance}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-200">SSL/TLS Analysis</h3>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold font-mono-cyber text-white">Grade:</span>
                  <span className={`text-4xl font-bold font-mono-cyber ${results.ssl.grade === 'A' ? 'text-emerald-400' : results.ssl.grade === 'B' ? 'text-amber-400' : 'text-red-400'}`}>
                    {results.ssl.grade}
                  </span>
                </div>
                {results.ssl.issues.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500 font-medium">Issues:</p>
                    {results.ssl.issues.map((issue, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-red-400">
                        <XCircle className="w-3 h-3 shrink-0" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Open Ports</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.openPorts.map(port => (
                    <span key={port} className="px-3 py-1.5 bg-[#111827] border border-[#1a2744] rounded text-xs font-mono-cyber text-slate-300">
                      <Wifi className="w-3 h-3 inline mr-1 text-sky-400" />:{port}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
