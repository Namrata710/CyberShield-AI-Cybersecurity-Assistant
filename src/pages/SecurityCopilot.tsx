import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Cpu, Thermometer, Server, Shield, AlertTriangle, Activity, HardDrive, Network } from 'lucide-react';

interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  actions?: string[];
}

const copilotResponses: Record<string, { content: string; actions: string[] }> = {
  'cpu spike': {
    content: `**Possible Causes for Sudden CPU Spike:**\n\n1. **Cryptomining Malware** - Most likely if spike is sustained\n   - Check for unknown processes consuming CPU\n   - Look for network connections to mining pools\n\n2. **DDoS Attack** - If server is public-facing\n   - Check network traffic volume\n   - Review connection counts per IP\n\n3. **Infinite Process Loop** - Application bug\n   - Check application error logs\n   - Review process tree for zombie processes\n\n4. **Scheduled Task Gone Wrong** - Check crontab/Task Scheduler`,
    actions: ['Run `top` or Process Explorer to identify CPU-hungry process', 'Check network connections: `netstat -an | grep ESTABLISHED`', 'Review crontab and scheduled tasks', 'Scan for malware with EDR/YARA rules', 'Check for cryptojacking: look for stratum+tcp connections'],
  },
  'unusual network': {
    content: `**Unusual Network Activity Analysis:**\n\n1. **Data Exfiltration** - Large outbound transfers\n   - Monitor egress traffic volume\n   - Check DNS for unusual query patterns\n\n2. **C2 Communication** - Beaconing behavior\n   - Look for periodic HTTPS connections\n   - Check for DNS tunneling indicators\n\n3. **Lateral Movement** - Internal scanning\n   - Monitor for port scanning patterns\n   - Check SMB/RDP connection attempts\n\n4. **Bandwidth Abuse** - Non-business traffic`,
    actions: ['Capture and analyze network traffic with Wireshark', 'Review firewall logs for unusual destinations', 'Check DNS query logs for suspicious domains', 'Monitor data transfer volume by endpoint', 'Deploy network traffic anomaly detection'],
  },
  'suspicious login': {
    content: `**Suspicious Login Activity:**\n\n1. **Credential Stuffing** - Automated login attempts\n   - Check for multiple failed logins across accounts\n   - Review source IPs against threat intel\n\n2. **Brute Force Attack** - Targeted password guessing\n   - Count failed attempts per account\n   - Check for impossible travel patterns\n\n3. **Compromised Credentials** - Valid logins from attacker\n   - Review login times and locations\n   - Check for new device fingerprints\n\n4. **Insider Threat** - Legitimate user, malicious intent`,
    actions: ['Force password reset for affected accounts', 'Enable MFA on all accounts immediately', 'Block suspicious source IPs at firewall', 'Review session logs for lateral movement', 'Notify affected users of potential compromise'],
  },
  'ransomware': {
    content: `**Ransomware Incident Response:**\n\n1. **Identify** the ransomware variant\n2. **Isolate** affected systems immediately\n3. **Preserve** forensic evidence\n4. **Report** to law enforcement\n\n**Critical First Steps:**\n- Disconnect from network (DO NOT turn off)\n- Screenshot the ransom note\n- Identify encryption extension\n- Check ID Ransomware for variant identification`,
    actions: ['Isolate all affected systems from network', 'Take memory image before shutdown', 'Identify ransomware variant via ransom note', 'Check backup integrity immediately', 'Report to FBI IC3 or local law enforcement', 'Do NOT pay ransom - no guarantee of recovery'],
  },
  'data breach': {
    content: `**Data Breach Response Protocol:**\n\n1. **Scope Assessment** - What data was accessed?\n2. **Containment** - Stop the bleeding\n3. **Evidence Preservation** - Chain of custody\n4. **Notification** - Legal and regulatory requirements\n5. **Remediation** - Fix the root cause\n\n**Data Classification Priority:**\n- PII/PHI → Highest priority notification\n- Financial data → Fraud monitoring\n- Intellectual property → Competitive impact assessment`,
    actions: ['Determine scope and classification of exposed data', 'Revoke compromised credentials immediately', 'Enable enhanced logging and monitoring', 'Prepare regulatory breach notification', 'Engage legal counsel for notification requirements', 'Implement additional access controls'],
  },
};

function getCopilotResponse(input: string): { content: string; actions: string[] } {
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(copilotResponses)) {
    if (lower.includes(key)) return value;
  }
  if (lower.includes('malware') || lower.includes('virus')) {
    return copilotResponses['ransomware'];
  }
  return {
    content: `I can help you investigate security incidents and anomalous system behavior. Describe what you're seeing and I'll provide:\n\n- **Possible causes** ranked by likelihood\n- **Recommended checks** to confirm the issue\n- **Immediate actions** to contain the threat\n- **Investigation steps** for deeper analysis\n\nTry describing:\n- "My server CPU usage suddenly spiked"\n- "I'm seeing unusual network traffic"\n- "There are suspicious login attempts"\n- "I think we have ransomware"\n- "We may have a data breach"`,
    actions: [],
  };
}

const quickScenarios = [
  { label: 'CPU Spike', icon: Cpu, query: 'My server CPU usage suddenly spiked' },
  { label: 'Network Anomaly', icon: Network, query: 'I am seeing unusual network traffic from our server' },
  { label: 'Suspicious Logins', icon: Shield, query: 'There are suspicious login attempts on our system' },
  { label: 'Ransomware', icon: AlertTriangle, query: 'I think we have a ransomware infection' },
  { label: 'Data Breach', icon: Server, query: 'Our database may have been exposed in a data breach' },
];

export function SecurityCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'I\'m your Security Copilot - a mini SOC analyst. Describe any security incident or anomalous behavior and I\'ll help you investigate, contain, and remediate. What are you seeing?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { content, actions } = getCopilotResponse(query);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content, actions }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Quick Scenarios */}
      <div className="p-4 border-b border-[#1a2744] bg-[#080d18]/50">
        <p className="text-[10px] text-slate-600 font-medium mb-2 uppercase tracking-wider">Quick Scenarios</p>
        <div className="flex flex-wrap gap-2">
          {quickScenarios.map(s => (
            <button
              key={s.label}
              onClick={() => handleSend(s.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1a2744] rounded-lg text-xs text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all"
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
            )}
            <div className={`max-w-[80%] lg:max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`rounded-xl p-4 ${msg.role === 'user' ? 'bg-sky-600/20 border border-sky-500/20' : 'cyber-card'}`}>
                <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
              {msg.role === 'assistant' && msg.actions && msg.actions.length > 0 && (
                <div className="mt-2 p-3 bg-[#0c1222] rounded-lg border border-[#1a2744]">
                  <p className="text-[10px] text-slate-600 font-medium uppercase mb-2">Recommended Checks</p>
                  <div className="space-y-1.5">
                    {msg.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px] font-mono-cyber text-emerald-400 shrink-0">{i + 1}</span>
                        <p className="text-xs text-slate-400">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#1a2744] border border-[#2a3d5e] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-slate-400" />
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

      {/* Input */}
      <div className="p-4 lg:p-6 border-t border-[#1a2744] bg-[#080d18]/50">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Describe the security issue you're seeing..."
            className="flex-1 cyber-input"
          />
          <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="cyber-btn disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
