import { useState } from 'react';
import { AuthPage } from "./pages/AuthPage";
import { SOCDashboard } from './pages/SOCDashboard';
import { AIChatbot } from './pages/AIChatbot';
import { VulnScanner } from './pages/VulnScanner';
import { LogAnalyzer } from './pages/LogAnalyzer';
import { ThreatIntel } from './pages/ThreatIntel';
import { PhishingDetector } from './pages/PhishingDetector';
import { MalwareAnalysis } from './pages/MalwareAnalysis';
import { SecurityCopilot } from './pages/SecurityCopilot';
import { AttackPrediction } from './pages/AttackPrediction';
import { IncidentResponse } from './pages/IncidentResponse';
import { ThreatFeed } from './pages/ThreatFeed';
import { DarkWebMonitor } from './pages/DarkWebMonitor';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { LearningMode } from './pages/LearningMode';
import { ReportGenerator } from './pages/ReportGenerator';

type Page = 'dashboard' | 'chatbot' | 'scanner' | 'logs' | 'threat-intel' | 'phishing' | 'malware' | 'copilot' | 'prediction' | 'incident' | 'feed' | 'darkweb' | 'resume' | 'learning' | 'reports';

const navItems: { id: Page; label: string; icon: string; group: string }[] = [
  { id: 'dashboard', label: 'SOC Dashboard', icon: 'LayoutDashboard', group: 'Core' },
  { id: 'chatbot', label: 'AI Chatbot', icon: 'MessageSquare', group: 'Core' },
  { id: 'scanner', label: 'Vuln Scanner', icon: 'Search', group: 'Core' },
  { id: 'copilot', label: 'Security Copilot', icon: 'Bot', group: 'Core' },
  { id: 'logs', label: 'Log Analyzer', icon: 'FileText', group: 'Analysis' },
  { id: 'threat-intel', label: 'Threat Intel', icon: 'Radar', group: 'Analysis' },
  { id: 'phishing', label: 'Phishing AI', icon: 'Fish', group: 'Analysis' },
  { id: 'malware', label: 'Malware Analysis', icon: 'Bug', group: 'Analysis' },
  { id: 'prediction', label: 'Attack Prediction', icon: 'Brain', group: 'AI/ML' },
  { id: 'incident', label: 'Incident Response', icon: 'Siren', group: 'AI/ML' },
  { id: 'feed', label: 'Threat Feed', icon: 'Radio', group: 'Intelligence' },
  { id: 'darkweb', label: 'Dark Web Monitor', icon: 'Eye', group: 'Intelligence' },
  { id: 'reports', label: 'Report Generator', icon: 'FileBarChart', group: 'Tools' },
  { id: 'resume', label: 'Resume Analyzer', icon: 'UserCheck', group: 'Tools' },
  { id: 'learning', label: 'Learning Mode', icon: 'GraduationCap', group: 'Tools' },
];

import {
  LayoutDashboard, MessageSquare, Search, FileText, Radar, Fish, Bug, Bot, Brain,
  Siren, Radio, Eye, UserCheck, GraduationCap, FileBarChart, Shield, Menu, X, ChevronRight, Zap,
} from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  LayoutDashboard, MessageSquare, Search, FileText, Radar, Fish, Bug, Bot, Brain,
  Siren, Radio, Eye, UserCheck, GraduationCap, FileBarChart,
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = ['Core', 'Analysis', 'AI/ML', 'Intelligence', 'Tools'];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <SOCDashboard />;
      case 'chatbot': return <AIChatbot />;
      case 'scanner': return <VulnScanner />;
      case 'logs': return <LogAnalyzer />;
      case 'threat-intel': return <ThreatIntel />;
      case 'phishing': return <PhishingDetector />;
      case 'malware': return <MalwareAnalysis />;
      case 'copilot': return <SecurityCopilot />;
      case 'prediction': return <AttackPrediction />;
      case 'incident': return <IncidentResponse />;
      case 'feed': return <ThreatFeed />;
      case 'darkweb': return <DarkWebMonitor />;
      case 'resume': return <ResumeAnalyzer />;
      case 'learning': return <LearningMode />;
      case 'reports': return <ReportGenerator />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060a12]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#080d18] border-r border-[#1a2744] transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[#1a2744] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-base font-bold text-white leading-tight">CyberShield</h1>
              <p className="text-[10px] text-sky-400 font-mono-cyber tracking-wider">AI SECURITY OPS</p>
            </div>
          )}
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(false); }}
            className="ml-auto hidden lg:flex w-6 h-6 items-center justify-center rounded text-slate-500 hover:text-slate-300 hover:bg-[#1a2744] transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {groups.map(group => {
            const items = navItems.filter(n => n.group === group);
            return (
              <div key={group} className="mb-4">
                {sidebarOpen && (
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">{group}</p>
                )}
                {items.map(item => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all text-sm ${
                        active
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-sky-400' : ''}`} />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-[#1a2744] shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-xs text-slate-500">System Online</span>
              <span className="text-xs text-sky-400 font-mono-cyber ml-auto">v2.1</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 h-14 px-4 border-b border-[#1a2744] bg-[#080d18]/80 backdrop-blur-sm shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-medium text-slate-300">
              {navItems.find(n => n.id === currentPage)?.label}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-cyber">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              LIVE
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono-cyber text-slate-500">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
