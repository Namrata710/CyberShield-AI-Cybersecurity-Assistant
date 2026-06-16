import { useState, useEffect } from 'react';
import { Radio, Clock, AlertTriangle, Shield, Bug, Globe, Zap, ArrowUp, TrendingUp, RefreshCw } from 'lucide-react';
import { severityBg } from '../utils/helpers';

interface FeedItem {
  id: string;
  type: 'cve' | 'advisory' | 'malware' | 'campaign' | 'advisory';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  isNew: boolean;
}

const initialFeed: FeedItem[] = [
  { id: '1', type: 'cve', severity: 'critical', title: 'CVE-2026-1337: RCE in OpenSSL 3.x', description: 'Critical buffer overflow in OpenSSL allows remote code execution via crafted certificates. Affects millions of servers worldwide.', source: 'NIST NVD', timestamp: '2 min ago', isNew: true },
  { id: '2', type: 'malware', severity: 'high', title: 'New BlackCat Variant with Zero-Login Capabilities', description: 'ALPHV/BlackCat ransomware variant bypasses MFA using adversary-in-the-middle phishing kits. Active campaigns targeting financial sector.', source: 'CrowdStrike', timestamp: '15 min ago', isNew: true },
  { id: '3', type: 'campaign', severity: 'critical', title: 'APT41 Targeting Semiconductor Industry', description: 'Chinese APT group deploying new COSMICGATE backdoor against chip manufacturers in Taiwan and South Korea. Supply chain risk elevated.', source: 'Mandiant', timestamp: '1 hr ago', isNew: true },
  { id: '4', type: 'advisory', severity: 'high', title: 'CISA: Critical Infrastructure Under Active Attack', description: 'CISA advisory AA26-168A warns of Volt Typhoon pre-positioning in US critical infrastructure networks. Immediate hardening recommended.', source: 'CISA', timestamp: '2 hrs ago', isNew: false },
  { id: '5', type: 'cve', severity: 'high', title: 'CVE-2026-1453: Privilege Escalation in Linux Kernel', description: 'Local privilege escalation via use-after-free in BPF subsystem. CVSS 7.8, affects kernels 5.15+. PoC available.', source: 'Kernel.org', timestamp: '3 hrs ago', isNew: false },
  { id: '6', type: 'malware', severity: 'medium', title: 'New Cookie-Stealing Campaign Targets Browsers', description: 'Campaign using malicious Chrome extensions to steal session cookies, bypassing 2FA. Over 50,000 users affected.', source: 'Cisco Talos', timestamp: '4 hrs ago', isNew: false },
  { id: '7', type: 'advisory', severity: 'medium', title: 'OWASP Updates API Security Top 10', description: '2026 edition adds Server-Side Request Forgery and Unsafe Consumption of AI APIs to the top risk list.', source: 'OWASP', timestamp: '5 hrs ago', isNew: false },
  { id: '8', type: 'campaign', severity: 'high', title: 'LockBit 4.0 Emerges with AI-Generated Phishing', description: 'New LockBit variant uses LLM-generated phishing emails with near-perfect grammar and personalization. Detection rates significantly lower.', source: 'Recorded Future', timestamp: '6 hrs ago', isNew: false },
  { id: '9', type: 'cve', severity: 'medium', title: 'CVE-2026-1512: XSS in Popular CRM Platform', description: 'Reflected XSS vulnerability in Salesforce Lightning allows session hijacking via crafted URL parameters.', source: 'Salesforce Security', timestamp: '8 hrs ago', isNew: false },
  { id: '10', type: 'advisory', severity: 'low', title: 'NIST Publishes Post-Quantum Cryptography Migration Guide', description: 'SP 1800-38 provides implementation guidance for transitioning to quantum-resistant algorithms. Organizations should begin inventory.', source: 'NIST', timestamp: '12 hrs ago', isNew: false },
];

const newFeedItems: FeedItem[] = [
  { id: '11', type: 'cve', severity: 'critical', title: 'CVE-2026-1588: Authentication Bypass in Cisco ASA', description: 'Zero-day in Cisco Adaptive Security Appliance allows unauthenticated remote access via crafted HTTP requests.', source: 'Cisco PSIRT', timestamp: 'Just now', isNew: true },
  { id: '12', type: 'campaign', severity: 'high', title: 'Sandworm Targeting European Energy Sector', description: 'Russian GRU Unit 74455 deploying new INDUSTROYER variant against SCADA systems in European power grids.', source: 'Microsoft Threat Intel', timestamp: 'Just now', isNew: true },
];

export function ThreatFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newItem = newFeedItems[Math.floor(Math.random() * newFeedItems.length)];
        if (!feed.find(f => f.id === newItem.id)) {
          setFeed(prev => [newItem, ...prev]);
        }
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [feed]);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setFeed(prev => [...newFeedItems.filter(n => !prev.find(p => p.id === n.id)), ...prev]);
      setRefreshing(false);
    }, 1000);
  };

  const filtered = feed
    .filter(f => filter === 'all' || f.type === filter)
    .filter(f => severityFilter === 'all' || f.severity === severityFilter);

  const typeIcons = { cve: Bug, advisory: Shield, malware: Bug, campaign: Globe };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="cyber-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Real-Time Threat Feed</h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono-cyber">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> LIVE
            </span>
          </div>
          <button onClick={refresh} className="cyber-btn-secondary flex items-center gap-2 text-xs">
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'cve', 'advisory', 'malware', 'campaign'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${
                filter === f ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400' : 'bg-[#111827] border border-[#1a2744] text-slate-500 hover:text-slate-300'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
          <div className="w-px h-6 bg-[#1a2744] self-center" />
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${
                severityFilter === s ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400' : 'bg-[#111827] border border-[#1a2744] text-slate-500 hover:text-slate-300'
              }`}
            >
              {s === 'all' ? 'All Severity' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const TypeIcon = typeIcons[item.type] || AlertTriangle;
          return (
            <div key={item.id} className={`cyber-card-hover p-4 ${item.isNew ? 'border-sky-500/30' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.severity === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
                  item.severity === 'high' ? 'bg-orange-500/10 border border-orange-500/20' :
                  'bg-sky-500/10 border border-sky-500/20'
                }`}>
                  <TypeIcon className={`w-4 h-4 ${
                    item.severity === 'critical' ? 'text-red-400' :
                    item.severity === 'high' ? 'text-orange-400' : 'text-sky-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {item.isNew && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full font-medium">
                        <Zap className="w-2.5 h-2.5" /> NEW
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityBg(item.severity)}`}>{item.severity}</span>
                    <span className="px-2 py-0.5 text-[10px] bg-[#111827] text-slate-500 rounded border border-[#1a2744] capitalize">{item.type}</span>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </span>
                    <span className="text-[10px] text-sky-400/60 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {item.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Critical Alerts', value: feed.filter(f => f.severity === 'critical').length, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Active Campaigns', value: feed.filter(f => f.type === 'campaign').length, icon: Globe, color: 'text-amber-400' },
          { label: 'New CVEs', value: feed.filter(f => f.type === 'cve').length, icon: Bug, color: 'text-sky-400' },
          { label: 'Sources Tracked', value: 12, icon: TrendingUp, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="cyber-card p-3 flex items-center gap-3">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <div>
              <p className="text-lg font-bold font-mono-cyber text-white">{s.value}</p>
              <p className="text-[10px] text-slate-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
