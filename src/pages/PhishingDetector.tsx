import { useState } from 'react';
import { Fish, AlertTriangle, CheckCircle, XCircle, Shield, Eye, Link2, FileWarning } from 'lucide-react';
import { analyzePhishing } from '../utils/helpers';

export function PhishingDetector() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzePhishing> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const sampleEmail = `From: security@micr0soft-verify.com
Subject: URGENT: Your Microsoft Account Will Be Suspended!

Dear Valued Customer,

We have detected unusual activity on your Microsoft account. Your account will be suspended within 24 hours unless you verify your identity immediately.

Click here to verify: http://micr0soft-verify.com/login.php?id=8327

Please provide your:
- Full name
- Email address
- Password
- Credit card number for verification

This is an automated message. Do not reply.

Microsoft Security Team
support@micr0soft-verify.com`;

  const analyze = () => {
    if (!content.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(analyzePhishing(content));
      setAnalyzing(false);
    }, 1200);
  };

  const verdictConfig = {
    safe: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Safe', glow: 'cyber-glow-green' },
    suspicious: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Suspicious', glow: 'cyber-glow-amber' },
    malicious: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Malicious', glow: 'cyber-glow-red' },
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Fish className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Phishing Detection AI</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">Paste email content, URL, or suspicious message to analyze for phishing indicators.</p>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste suspicious email content, URL, or message here..."
            className="w-full h-56 bg-[#0a1020] border border-[#1a2744] rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={analyze} disabled={analyzing || !content.trim()} className="cyber-btn text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {analyzing ? 'Analyzing...' : <><Eye className="w-3 h-3" /> Analyze</>}
            </button>
            <button onClick={() => setContent(sampleEmail)} className="cyber-btn-secondary text-sm flex items-center gap-2">
              <FileWarning className="w-3 h-3" /> Load Sample
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Verdict */}
              <div className={`cyber-card p-6 ${verdictConfig[result.verdict].glow}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${verdictConfig[result.verdict].bg} border ${verdictConfig[result.verdict].border} flex items-center justify-center`}>
                    {(() => { const VIcon = verdictConfig[result.verdict].icon; return <VIcon className={`w-8 h-8 ${verdictConfig[result.verdict].color}`} />; })()}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">AI Verdict</p>
                    <p className={`text-2xl font-bold ${verdictConfig[result.verdict].color}`}>{verdictConfig[result.verdict].label}</p>
                    <p className="text-xs text-slate-500 mt-1">Confidence: <span className="font-mono-cyber text-white">{result.confidence}%</span></p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-[#111827] rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${
                    result.verdict === 'malicious' ? 'bg-red-500' : result.verdict === 'suspicious' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} style={{ width: `${result.confidence}%` }} />
                </div>
              </div>

              {/* Indicators */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Suspicious Indicators ({result.indicators.length})</h3>
                </div>
                {result.indicators.length > 0 ? (
                  <div className="space-y-2">
                    {result.indicators.map((indicator, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-[#111827] rounded-lg">
                        <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-300">{indicator}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-[#111827] rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">No phishing indicators detected</span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-200">AI Analysis</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{result.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="cyber-card p-8 flex flex-col items-center justify-center h-full text-center">
              <Fish className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-medium text-slate-400 mb-1">Phishing Detection Engine</h3>
              <p className="text-xs text-slate-600 max-w-sm">Our AI analyzes content for urgency language, credential requests, suspicious URLs, domain impersonation, and 6+ other phishing indicators.</p>
              <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                {['Urgent Language Detection', 'Domain Impersonation', 'Shortened URL Analysis', 'Credential Harvesting', 'Brand Spoofing', 'Attachment Risk'].map(f => (
                  <div key={f} className="p-2 bg-[#111827] rounded-lg">
                    <p className="text-[10px] text-slate-500">{f}</p>
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
