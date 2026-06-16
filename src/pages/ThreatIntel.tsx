import { useState } from 'react';
import { Search, Shield, ExternalLink, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { cveDatabase } from '../data/mockData';
import { severityBg, severityColor } from '../utils/helpers';

type SearchType = 'cve' | 'malware' | 'technique';

const malwareEntries = [
  { id: 'M001', name: 'LockBit 3.0', type: 'Ransomware', severity: 'critical' as const, description: 'Ransomware-as-a-service with fast encryption, AES-256 + RSA-4096 hybrid approach', mitre: ['T1486', 'T1021.002', 'T1490'], mitigation: 'Isolate systems, restore from offline backups, patch initial access vectors, deploy EDR', references: ['MITRE ATT&CK S0553', 'CISA Advisory AA23-325A'] },
  { id: 'M002', name: 'Cobalt Strike', type: 'Post-Exploitation', severity: 'high' as const, description: 'Commercial penetration testing tool widely abused for adversary simulations and real attacks', mitre: ['T1059', 'T1071.001', 'T1573.002'], mitigation: 'Block known C2 IPs, monitor for beacon patterns, hunt named pipe artifacts, inspect proxy logs', references: ['MITRE ATT&CK S0154', 'Red Canary 2024 Threat Report'] },
  { id: 'M003', name: 'Emotet', type: 'Banking Trojan', severity: 'high' as const, description: 'Modular banking trojan turned botnet infrastructure, delivers secondary payloads like TrickBot and Ryuk', mitre: ['T1566.001', 'T1059.001', 'T1083'], mitigation: 'Block C2 IPs, disable Office macros, deploy email sandbox, monitor PowerShell execution', references: ['MITRE ATT&CK S0367', 'Europol Advisory'] },
  { id: 'M004', name: 'Remcos RAT', type: 'Remote Access Trojan', severity: 'critical' as const, description: 'Full remote control trojan with keylogging, screen capture, credential theft, and microphone access', mitre: ['T1056.001', 'T1113', 'T1071.001'], mitigation: 'Isolate endpoints, reset credentials, monitor outbound port 2404, deploy anti-keylogging', references: ['MITRE ATT&CK S0332', 'CISA Known Exploited'] },
];

const attackTechniques = [
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', severity: 'critical' as const, description: 'Exploits vulnerabilities in internet-facing applications to gain initial access', mitigation: 'Patch regularly, WAF deployment, network segmentation, vulnerability scanning', references: ['MITRE ATT&CK', 'OWASP Top 10'] },
  { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution', severity: 'high' as const, description: 'Abuse PowerShell commands for execution of malicious scripts and commands', mitigation: 'Constrained language mode, script block logging, AMSI, execution policy restrictions', references: ['MITRE ATT&CK', 'SANS PowerShell Security'] },
  { id: 'T1566.001', name: 'Spearphishing Attachment', tactic: 'Initial Access', severity: 'high' as const, description: 'Sends emails with malicious attachments to gain initial access to victim systems', mitigation: 'Email gateway with sandbox, disable macros, security awareness training, DMARC/DKIM/SPF', references: ['MITRE ATT&CK', 'CISA Phishing Guidance'] },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'Defense Evasion', severity: 'high' as const, description: 'Use stolen credentials to blend in with normal activity and evade detection', mitigation: 'MFA enforcement, credential monitoring, impossible travel detection, password rotation', references: ['MITRE ATT&CK', 'NIST SP 800-63B'] },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', severity: 'critical' as const, description: 'Encrypt data on target systems to disrupt availability', mitigation: 'Offline immutable backups, EDR behavioral detection, network segmentation, ransomware canary files', references: ['MITRE ATT&CK', 'CISA Ransomware Guide'] },
];

export function ThreatIntel() {
  const [searchType, setSearchType] = useState<SearchType>('cve');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<any>>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (!query.trim()) return;
    setSearched(true);
    const lower = query.toLowerCase();

    if (searchType === 'cve') {
      setResults(cveDatabase.filter(c => c.id.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower)));
    } else if (searchType === 'malware') {
      setResults(malwareEntries.filter(m => m.name.toLowerCase().includes(lower) || m.type.toLowerCase().includes(lower)));
    } else {
      setResults(attackTechniques.filter(t => t.id.toLowerCase().includes(lower) || t.name.toLowerCase().includes(lower) || t.tactic.toLowerCase().includes(lower)));
    }
  };

  const allItems = searchType === 'cve' ? cveDatabase : searchType === 'malware' ? malwareEntries : attackTechniques;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Search Controls */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Threat Intelligence Search</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Search CVEs, malware families, and MITRE ATT&CK techniques with detailed analysis and mitigation strategies.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-[#111827] rounded-lg p-1 border border-[#1a2744]">
            {(['cve', 'malware', 'technique'] as SearchType[]).map(type => (
              <button
                key={type}
                onClick={() => { setSearchType(type); setSearched(false); setResults([]); }}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all capitalize ${searchType === type ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {type === 'technique' ? 'ATT&CK' : type}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder={searchType === 'cve' ? 'CVE-2026-XXXX or keyword...' : searchType === 'malware' ? 'Malware name or type...' : 'Technique ID or name...'}
              className="cyber-input w-full pl-10"
            />
          </div>
          <button onClick={search} className="cyber-btn flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {(searched ? results : allItems).length === 0 && searched ? (
          <div className="cyber-card p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No results found for "{query}"</p>
            <p className="text-xs text-slate-600 mt-1">Try different keywords or browse the database below</p>
          </div>
        ) : (
          (searched ? results : allItems).map((item: any) => (
            <div key={item.id} className="cyber-card-hover p-4 cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase font-mono-cyber bg-sky-500/10 text-sky-400 border border-sky-500/20">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${severityBg(item.severity)}`}>{item.severity}</span>
                  <span className="text-sm text-slate-200">{item.name || item.description?.substring(0, 80) + '...'}</span>
                </div>
                {expanded === item.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>

              {expanded === item.id && (
                <div className="mt-4 pt-4 border-t border-[#1a2744] space-y-4 animate-fade-in">
                  <p className="text-sm text-slate-300">{item.description}</p>

                  {item.cvss && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">CVSS Score:</span>
                      <span className={`text-sm font-bold font-mono-cyber ${severityColor(item.severity)}`}>{item.cvss}</span>
                    </div>
                  )}

                  {item.tactic && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Tactic:</span>
                      <span className="text-xs text-sky-400">{item.tactic}</span>
                    </div>
                  )}

                  {item.type && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Type:</span>
                      <span className="text-xs text-slate-300">{item.type}</span>
                    </div>
                  )}

                  {item.mitre && item.mitre.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1.5">MITRE ATT&CK Mapping:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.mitre.map((m: string) => (
                          <span key={m} className="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-mono-cyber">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      <p className="text-xs text-slate-500 font-medium">Mitigation:</p>
                    </div>
                    <p className="text-xs text-emerald-400/90 pl-5">{item.mitigation}</p>
                  </div>

                  {item.references && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1.5">References:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.references.map((ref: string, i: number) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#111827] text-slate-400 rounded border border-[#1a2744]">
                            <ExternalLink className="w-2.5 h-2.5" /> {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sources */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {['MITRE ATT&CK', 'NIST NVD', 'OWASP', 'CISA KEV'].map(source => (
          <div key={source} className="cyber-card p-3 text-center">
            <Tag className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400 font-medium">{source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
