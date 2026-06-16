import { useState } from 'react';
import { FileText, Upload, AlertTriangle, Shield, Search, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { analyzeLogContent } from '../utils/helpers';
import { severityBg, severityColor } from '../utils/helpers';

interface LogResult {
  alerts: Array<{
    type: string;
    severity: string;
    source: string;
    details: string;
    count: number;
    probability: number;
  }>;
  stats: {
    totalLines: number;
    errorRate: number;
    uniqueIps: number;
    suspiciousPatterns: number;
  };
}

const sampleLogs = `Jun 16 08:15:01 server sshd[12345]: Failed password for admin from 192.168.1.10 port 22
Jun 16 08:15:02 server sshd[12346]: Failed password for admin from 192.168.1.10 port 22
Jun 16 08:15:03 server sshd[12347]: Failed password for admin from 192.168.1.10 port 22
Jun 16 08:15:04 server sshd[12348]: Failed password for admin from 192.168.1.10 port 22
Jun 16 07:30:22 firewall deny: src=185.220.101.34 dst=10.0.1.5 proto=tcp dport=443
Jun 16 07:30:23 firewall deny: src=185.220.101.34 dst=10.0.1.5 proto=tcp dport=443
Jun 16 06:45:11 ids alert: Cobalt Strike beacon detected from 10.0.45.112
Jun 16 05:20:33 server sshd[9876]: Failed password for root from 10.0.12.55 port 22
Jun 16 05:20:34 server sshd[9877]: Failed password for root from 10.0.12.55 port 22
Jun 16 04:10:55 server kernel: sudo: user dev : TTY=pts/0 ; PWD=/home/dev ; USER=root ; COMMAND=/bin/bash
Jun 16 03:22:07 ids alert: Malware signature match - Remcos RAT from 10.0.45.112
Jun 16 02:11:33 webapp error: SQL syntax error near '1=1 UNION SELECT' from 192.168.1.105
Jun 16 01:44:30 antivirus alert: Backdoor detected in /tmp/update.exe from USB device`;

export function LogAnalyzer() {
  const [logContent, setLogContent] = useState('');
  const [results, setResults] = useState<LogResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const analyzeLogs = (content: string) => {
    if (!content.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const { alerts } = analyzeLogContent(content);
      const lines = content.split('\n').filter(l => l.trim());
      const ips = new Set(lines.map(l => l.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/)?.[1]).filter(Boolean));
      const errors = lines.filter(l => /error|failed|denied|invalid/i.test(l)).length;

      setResults({
        alerts,
        stats: {
          totalLines: lines.length,
          errorRate: Math.round((errors / lines.length) * 100),
          uniqueIps: ips.size,
          suspiciousPatterns: alerts.length,
        },
      });
      setAnalyzing(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setLogContent(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Log Input */}
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Upload / Paste Logs</h3>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-lg border-2 border-dashed p-4 text-center mb-3 transition-colors ${dragActive ? 'border-sky-500 bg-sky-500/5' : 'border-[#1a2744] bg-[#0a1020]'}`}
          >
            <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Drag & drop log files here</p>
            <p className="text-[10px] text-slate-600 mt-1">Apache, Nginx, Firewall, System logs</p>
          </div>
          <textarea
            value={logContent}
            onChange={e => setLogContent(e.target.value)}
            placeholder="Paste server logs, firewall logs, or Apache/Nginx access logs here..."
            className="w-full h-48 bg-[#0a1020] border border-[#1a2744] rounded-lg p-3 text-xs font-mono-cyber text-slate-300 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={() => analyzeLogs(logContent)} disabled={analyzing || !logContent.trim()} className="cyber-btn text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {analyzing ? <><Clock className="w-3 h-3 animate-spin" /> Analyzing...</> : <><Search className="w-3 h-3" /> Analyze Logs</>}
            </button>
            <button onClick={() => { setLogContent(sampleLogs); }} className="cyber-btn-secondary text-sm flex items-center gap-2">
              <FileText className="w-3 h-3" /> Load Sample
            </button>
          </div>
        </div>

        {/* Analysis Stats */}
        <div className="space-y-4">
          {results ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="cyber-card p-4 cyber-glow">
                  <p className="text-xs text-slate-500">Total Lines</p>
                  <p className="text-2xl font-bold font-mono-cyber text-sky-400">{results.stats.totalLines}</p>
                </div>
                <div className="cyber-card p-4 cyber-glow-amber">
                  <p className="text-xs text-slate-500">Error Rate</p>
                  <p className="text-2xl font-bold font-mono-cyber text-amber-400">{results.stats.errorRate}%</p>
                </div>
                <div className="cyber-card p-4">
                  <p className="text-xs text-slate-500">Unique IPs</p>
                  <p className="text-2xl font-bold font-mono-cyber text-slate-300">{results.stats.uniqueIps}</p>
                </div>
                <div className="cyber-card p-4 cyber-glow-red">
                  <p className="text-xs text-slate-500">Suspicious Patterns</p>
                  <p className="text-2xl font-bold font-mono-cyber text-red-400">{results.stats.suspiciousPatterns}</p>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-slate-200">AI-Generated Alerts</h3>
                </div>
                <div className="space-y-3">
                  {results.alerts.map((alert, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${
                      alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                      alert.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                      'bg-amber-500/5 border-amber-500/20'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityBg(alert.severity)}`}>{alert.severity}</span>
                        <span className="text-xs font-mono-cyber text-slate-500">
                          {alert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-slate-300 font-medium">IP: <span className="font-mono-cyber text-sky-400">{alert.source}</span></p>
                        <p className="text-xs text-slate-400 mt-0.5">{alert.details}</p>
                        {alert.type === 'brute_force' && (
                          <p className="text-xs text-slate-400 mt-0.5">Failed Logins: <span className="font-mono-cyber text-red-400">{alert.count}</span></p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Probability of Attack</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#111827] rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${alert.probability > 80 ? 'bg-red-500' : alert.probability > 60 ? 'bg-amber-500' : 'bg-sky-500'}`} style={{ width: `${alert.probability}%` }} />
                          </div>
                          <span className={`text-xs font-bold font-mono-cyber ${severityColor(alert.severity)}`}>{alert.probability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="cyber-card p-8 flex flex-col items-center justify-center h-full text-center">
              <Shield className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-medium text-slate-400 mb-1">AI Log Analysis</h3>
              <p className="text-xs text-slate-600">Paste or upload server logs to detect brute force attacks, suspicious IPs, malware indicators, and privilege escalation patterns.</p>
              <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                {['Brute Force Detection', 'Suspicious IP Identification', 'Malware Indicator Analysis', 'Privilege Escalation Alerts'].map(feature => (
                  <div key={feature} className="p-3 bg-[#111827] rounded-lg">
                    <CheckCircle className="w-4 h-4 text-sky-400 mb-1" />
                    <p className="text-[10px] text-slate-500">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
