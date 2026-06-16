import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Bug, Wifi, Lock, Eye, Activity, TrendingUp, Globe, BarChart3, Zap, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { threatEvents, attackTrendData, securityScoreData, globalThreats } from '../data/mockData';
import { severityColor, severityBg, formatDate } from '../utils/helpers';

export function SOCDashboard() {
  const [liveAlerts, setLiveAlerts] = useState(threatEvents);
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);

  const stats = [
    { label: 'Active Threats', value: liveAlerts.filter(a => a.status === 'active').length, icon: AlertTriangle, color: 'text-red-400', glow: 'cyber-glow-red' },
    { label: 'Investigating', value: liveAlerts.filter(a => a.status === 'investigating').length, icon: Eye, color: 'text-amber-400', glow: 'cyber-glow-amber' },
    { label: 'Contained', value: liveAlerts.filter(a => a.status === 'contained').length, icon: Shield, color: 'text-emerald-400', glow: 'cyber-glow-green' },
    { label: 'Total Events (24h)', value: 847, icon: Activity, color: 'text-sky-400', glow: 'cyber-glow' },
  ];

  const threatTypes = [
    { type: 'Ransomware', count: 67, icon: Lock, color: 'text-red-400' },
    { type: 'Phishing', count: 104, icon: AlertTriangle, color: 'text-amber-400' },
    { type: 'APT', count: 25, icon: Eye, color: 'text-purple-400' },
    { type: 'DDoS', count: 38, icon: Wifi, color: 'text-orange-400' },
    { type: 'Malware', count: 89, icon: Bug, color: 'text-pink-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAlerts(prev => prev.map(a => {
        if (Math.random() > 0.95) {
          return { ...a, status: a.status === 'active' ? 'investigating' : a.status === 'investigating' ? 'contained' : a.status };
        }
        return a;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className={`cyber-card p-4 ${stat.glow}`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <TrendingUp className="w-3 h-3 text-slate-600" />
            </div>
            <p className="text-2xl font-bold text-white font-mono-cyber">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Attack Trends Chart */}
        <div className="lg:col-span-2 cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Attack Trends (6 Months)</h3>
            <span className="ml-auto text-[10px] font-mono-cyber text-slate-600">LAST UPDATED: NOW</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attackTrendData}>
              <defs>
                <linearGradient id="colorRansomware" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDDoS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0c1222', border: '1px solid #1a2744', borderRadius: 8, color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="ransomware" stroke="#ef4444" fill="url(#colorRansomware)" strokeWidth={2} />
              <Area type="monotone" dataKey="phishing" stroke="#f59e0b" fill="url(#colorPhishing)" strokeWidth={2} />
              <Area type="monotone" dataKey="ddos" stroke="#0ea5e9" fill="url(#colorDDoS)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500" />Ransomware</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500" />Phishing</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-sky-500" />DDoS</span>
          </div>
        </div>

        {/* Security Posture Radar */}
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Security Posture</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={securityScoreData}>
              <PolarGrid stroke="#1a2744" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-center mt-1">
            <span className="text-lg font-bold font-mono-cyber text-sky-400">
              {Math.round(securityScoreData.reduce((a, b) => a + b.score, 0) / securityScoreData.length)}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Global Threat Map */}
        <div className="lg:col-span-2 cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Global Threat Map</h3>
            <span className="ml-auto text-[10px] font-mono-cyber text-emerald-400 pulse-dot">LIVE</span>
          </div>
          <div className="relative bg-[#0a0f1a] rounded-lg overflow-hidden" style={{ height: 250 }}>
            <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
              <ellipse cx="400" cy="200" rx="300" ry="150" fill="none" stroke="#1a2744" strokeWidth="0.5" />
              <ellipse cx="400" cy="200" rx="200" ry="100" fill="none" stroke="#1a2744" strokeWidth="0.5" />
              <line x1="100" y1="200" x2="700" y2="200" stroke="#1a2744" strokeWidth="0.5" />
              <line x1="400" y1="50" x2="400" y2="350" stroke="#1a2744" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-0">
              {globalThreats.map((threat, i) => {
                const x = ((threat.lng + 180) / 360) * 100;
                const y = ((90 - threat.lat) / 180) * 100;
                const size = Math.max(Math.min(threat.count / 100, 14), 6);
                return (
                  <div
                    key={i}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div
                      className={`rounded-full ${threat.count > 1000 ? 'bg-red-500' : threat.count > 500 ? 'bg-amber-500' : 'bg-sky-500'} opacity-60 threat-pulse`}
                      style={{ width: size, height: size }}
                    />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0c1222] border border-[#1a2744] rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10 shadow-lg">
                      <p className="font-semibold text-white">{threat.country}</p>
                      <p className="text-slate-400">{threat.count} threats</p>
                      <p className="text-slate-500 mt-1">{threat.types.join(', ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500" />High</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500" />Medium</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-sky-500" />Low</span>
          </div>
        </div>

        {/* Threat Type Breakdown */}
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Threat Types (24h)</h3>
          </div>
          <div className="space-y-3">
            {threatTypes.map(t => (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span className="text-xs text-slate-300">{t.type}</span>
                  </div>
                  <span className="text-xs font-mono-cyber text-slate-400">{t.count}</span>
                </div>
                <div className="w-full bg-[#111827] rounded-full h-1.5">
                  <div className="bg-sky-500/50 h-1.5 rounded-full" style={{ width: `${(t.count / 110) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#1a2744]">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={securityScoreData}>
                <Bar dataKey="score" fill="#0ea5e9" radius={[2, 2, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Threats Table */}
      <div className="cyber-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-200">Active Threat Alerts</h3>
          <span className="ml-auto text-[10px] font-mono-cyber text-slate-600">AUTO-REFRESH: 5s</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-[#1a2744]">
                <th className="text-left py-2 px-3 font-medium">Type</th>
                <th className="text-left py-2 px-3 font-medium">Severity</th>
                <th className="text-left py-2 px-3 font-medium">Source</th>
                <th className="text-left py-2 px-3 font-medium">Target</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {liveAlerts.map(alert => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedThreat(selectedThreat === alert.id ? null : alert.id)}
                  className={`border-b border-[#1a2744]/50 hover:bg-[#111827] cursor-pointer transition-colors ${selectedThreat === alert.id ? 'bg-sky-500/5' : ''}`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      {alert.type === 'ransomware' && <Lock className="w-3 h-3 text-red-400" />}
                      {alert.type === 'intrusion' && <Shield className="w-3 h-3 text-orange-400" />}
                      {alert.type === 'ddos' && <Wifi className="w-3 h-3 text-sky-400" />}
                      {alert.type === 'phishing' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      {alert.type === 'malware' && <Bug className="w-3 h-3 text-pink-400" />}
                      {alert.type === 'apt' && <Eye className="w-3 h-3 text-purple-400" />}
                      <span className="capitalize text-slate-300">{alert.type}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityBg(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-cyber text-slate-400">{alert.source}</td>
                  <td className="py-2.5 px-3 font-mono-cyber text-slate-400">{alert.target}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        alert.status === 'active' ? 'bg-red-400 pulse-dot' :
                        alert.status === 'investigating' ? 'bg-amber-400 pulse-dot' :
                        alert.status === 'contained' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`} />
                      <span className="capitalize text-slate-400">{alert.status}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(alert.timestamp)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedThreat && (
          <div className="mt-3 p-3 bg-[#111827] rounded-lg border border-[#1a2744] animate-fade-in">
            <p className="text-xs text-slate-300">
              {liveAlerts.find(a => a.id === selectedThreat)?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
