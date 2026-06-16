export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
}

export function severityBg(severity: string): string {
  switch (severity) {
    case 'critical': return 'severity-critical';
    case 'high': return 'severity-high';
    case 'medium': return 'severity-medium';
    case 'low': return 'severity-low';
    default: return 'severity-info';
  }
}

export function riskScoreColor(score: number): string {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

export function riskScoreRing(score: number): string {
  if (score >= 80) return 'stroke-red-500';
  if (score >= 60) return 'stroke-orange-500';
  if (score >= 40) return 'stroke-amber-500';
  return 'stroke-emerald-500';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function typeIcon(type: string): string {
  const map: Record<string, string> = {
    malware: 'Bug',
    intrusion: 'LogIn',
    ddos: 'Wifi',
    phishing: 'Fish',
    ransomware: 'Lock',
    apt: 'Eye',
  };
  return map[type] || 'AlertTriangle';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function analyzePhishing(text: string): { verdict: 'safe' | 'suspicious' | 'malicious'; confidence: number; indicators: string[]; explanation: string } {
  const indicators: string[] = [];
  const lower = text.toLowerCase();

  if (/urgent|immediately|act now|right away/i.test(text)) indicators.push('Urgent or threatening language');
  if (/verify your account|confirm your identity|update your information/i.test(text)) indicators.push('Credential harvesting request');
  if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i.test(text)) indicators.push('Shortened or suspicious URLs');
  if (/\b(free|winner|congratulations|claim your)\b/i.test(text)) indicators.push('Too-good-to-be-true offers');
  if (/dear (customer|user|member|client)/i.test(text)) indicators.push('Generic greeting instead of name');
  if (/\.exe|\.scr|\.js|\.bat|\.cmd/i.test(text)) indicators.push('Suspicious attachment types');
  if (/password|ssn|social security|credit card/i.test(text)) indicators.push('Request for sensitive information');
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(text)) indicators.push('Raw IP address in URL');
  if (/bank|paypal|amazon|microsoft|apple/i.test(lower) && /click|login|sign.?in/i.test(lower)) indicators.push('Brand impersonation with login prompt');
  if (/.{50,}\.(xyz|top|click|download|stream|club|work|date|loan)/i.test(text)) indicators.push('Suspicious top-level domain');

  let confidence: number;
  let verdict: 'safe' | 'suspicious' | 'malicious';

  if (indicators.length >= 5) {
    verdict = 'malicious';
    confidence = 85 + Math.min(indicators.length * 2, 15);
  } else if (indicators.length >= 3) {
    verdict = 'suspicious';
    confidence = 60 + indicators.length * 5;
  } else if (indicators.length >= 1) {
    verdict = 'suspicious';
    confidence = 40 + indicators.length * 8;
  } else {
    verdict = 'safe';
    confidence = 88;
  }

  const explanation = indicators.length === 0
    ? 'No phishing indicators detected. The content appears to use standard communication patterns without urgency tactics, credential requests, or suspicious links.'
    : `Detected ${indicators.length} phishing indicator${indicators.length > 1 ? 's' : ''}. ${indicators.length >= 3 ? 'Multiple indicators strongly suggest this is a phishing attempt.' : 'Some indicators present, exercise caution.'}`;

  return { verdict, confidence: Math.min(confidence, 99), indicators, explanation };
}

export function analyzeLogContent(content: string): { alerts: Array<{ type: string; severity: string; source: string; details: string; count: number; probability: number }> } {
  const alerts: Array<{ type: string; severity: string; source: string; details: string; count: number; probability: number }> = [];
  const lines = content.split('\n');
  const failedLogins: Record<string, number> = {};
  const ipConnections: Record<string, number> = {};

  lines.forEach(line => {
    const ipMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    const ip = ipMatch ? ipMatch[1] : '';

    if (/failed|denied|invalid|error/i.test(line) && ip) {
      failedLogins[ip] = (failedLogins[ip] || 0) + 1;
    }
    if (ip) {
      ipConnections[ip] = (ipConnections[ip] || 0) + 1;
    }
  });

  Object.entries(failedLogins).forEach(([ip, count]) => {
    if (count >= 10) {
      alerts.push({
        type: count >= 100 ? 'brute_force' : 'failed_login',
        severity: count >= 100 ? 'critical' : count >= 50 ? 'high' : 'medium',
        source: ip,
        details: `${count} failed login attempts detected`,
        count,
        probability: Math.min(50 + count * 0.5, 99),
      });
    }
  });

  if (/malware|trojan|backdoor|exploit/i.test(content)) {
    alerts.push({
      type: 'malware_indicator',
      severity: 'critical',
      source: ipConnections ? Object.keys(ipConnections)[0] || 'unknown' : 'unknown',
      details: 'Malware-related keywords detected in log entries',
      count: 1,
      probability: 85,
    });
  }

  if (/sudo|root|privilege|escalat/i.test(content)) {
    alerts.push({
      type: 'privilege_escalation',
      severity: 'high',
      source: Object.keys(ipConnections)[0] || 'unknown',
      details: 'Privilege escalation activity detected',
      count: 1,
      probability: 75,
    });
  }

  return { alerts };
}
