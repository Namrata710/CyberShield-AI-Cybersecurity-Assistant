export interface ThreatEvent {
  id: string;
  type: 'malware' | 'intrusion' | 'ddos' | 'phishing' | 'ransomware' | 'apt';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'contained' | 'resolved';
  description: string;
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  port: string;
  service: string;
  description: string;
  fix: string;
}

export interface CVEEntry {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  published: string;
  mitre: string[];
  references: string[];
  mitigation: string;
}

export interface LogAlert {
  id: string;
  type: 'brute_force' | 'suspicious_ip' | 'malware_indicator' | 'failed_login' | 'privilege_escalation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  details: string;
  count: number;
  probability: number;
  timestamp: string;
}

export interface MalwareReport {
  hash: string;
  family: string;
  risk: 'critical' | 'high' | 'medium' | 'low';
  iocs: string[];
  mitigation: string[];
  description: string;
}

export interface PhishingResult {
  verdict: 'safe' | 'suspicious' | 'malicious';
  confidence: number;
  indicators: string[];
  explanation: string;
}

export interface AttackPrediction {
  probability: number;
  attackType: string;
  confidence: number;
  features: { name: string; importance: number }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GlobalThreat {
  country: string;
  lat: number;
  lng: number;
  count: number;
  types: string[];
}

export const threatEvents: ThreatEvent[] = [
  { id: '1', type: 'ransomware', severity: 'critical', source: '185.220.101.34', target: 'FIN-DB-01', timestamp: '2026-06-16T08:23:11Z', status: 'active', description: 'LockBit 3.0 ransomware payload detected on financial database server' },
  { id: '2', type: 'intrusion', severity: 'high', source: '10.0.45.112', target: 'WEB-SRV-03', timestamp: '2026-06-16T07:45:22Z', status: 'investigating', description: 'Unauthorized SSH access attempt with credential stuffing pattern' },
  { id: '3', type: 'ddos', severity: 'high', source: 'Multiple', target: 'CDN-EDGE-02', timestamp: '2026-06-16T06:12:33Z', status: 'contained', description: 'Volumetric DDoS attack 45Gbps against CDN edge node' },
  { id: '4', type: 'phishing', severity: 'medium', source: 'support@micros0ft-verify.com', target: 'HR Dept', timestamp: '2026-06-16T05:33:41Z', status: 'resolved', description: 'Spear-phishing email targeting HR with fake M365 login page' },
  { id: '5', type: 'malware', severity: 'critical', source: 'download.update-service.net', target: 'WS-DEV-14', timestamp: '2026-06-16T04:55:18Z', status: 'active', description: 'Cobalt Strike beacon downloaded from compromised update server' },
  { id: '6', type: 'apt', severity: 'critical', source: 'APT29 Infrastructure', target: 'MAIL-SRV-01', timestamp: '2026-06-16T03:22:07Z', status: 'investigating', description: 'Nation-state APT detected in mail server via YARA rules' },
  { id: '7', type: 'intrusion', severity: 'medium', source: '192.168.1.105', target: 'INT-WEB-02', timestamp: '2026-06-16T02:11:55Z', status: 'contained', description: 'SQL injection attempt on internal web application' },
  { id: '8', type: 'malware', severity: 'high', source: 'USB Device', target: 'WS-FIN-08', timestamp: '2026-06-16T01:44:30Z', status: 'active', description: 'Remcos RAT detected via USB auto-run on finance workstation' },
];

export const vulnerabilities: Vulnerability[] = [
  { id: 'v1', name: 'SSL Certificate Expired', severity: 'critical', port: '443', service: 'HTTPS', description: 'SSL certificate expired 30 days ago, enabling MITM attacks', fix: 'Renew SSL certificate immediately and enable auto-renewal' },
  { id: 'v2', name: 'SSH Weak Ciphers', severity: 'high', port: '22', service: 'SSH', description: 'Weak cipher suites enabled allowing decryption attacks', fix: 'Disable weak ciphers, use only aes256-ctr or chacha20-poly1305' },
  { id: 'v3', name: 'Open Redis Port', severity: 'critical', port: '6379', service: 'Redis', description: 'Redis exposed to internet without authentication', fix: 'Bind to 127.0.0.1, require authentication, use firewall rules' },
  { id: 'v4', name: 'Missing X-Frame-Options', severity: 'medium', port: '80/443', service: 'HTTP', description: 'Missing security headers allowing clickjacking attacks', fix: 'Add X-Frame-Options: DENY and Content-Security-Policy headers' },
  { id: 'v5', name: 'FTP Anonymous Login', severity: 'high', port: '21', service: 'FTP', description: 'Anonymous FTP access enabled exposing sensitive files', fix: 'Disable anonymous access, use SFTP instead of FTP' },
  { id: 'v6', name: 'SMBv1 Enabled', severity: 'high', port: '445', service: 'SMB', description: 'SMBv1 protocol enabled, vulnerable to EternalBlue exploit', fix: 'Disable SMBv1, ensure SMBv3 is the minimum version' },
  { id: 'v7', name: 'Missing HSTS Header', severity: 'low', port: '443', service: 'HTTPS', description: 'HSTS not configured, allowing protocol downgrade attacks', fix: 'Add Strict-Transport-Security header with max-age >= 1 year' },
  { id: 'v8', name: 'Telnet Service Active', severity: 'critical', port: '23', service: 'Telnet', description: 'Telnet service running with cleartext credentials', fix: 'Disable Telnet, migrate all access to SSH' },
];

export const cveDatabase: CVEEntry[] = [
  { id: 'CVE-2026-0001', description: 'Remote Code Execution in Apache Struts via OGNL injection', severity: 'critical', cvss: 9.8, published: '2026-01-15', mitre: ['T1190', 'T1059'], references: ['NIST NVD', 'Apache Advisory'], mitigation: 'Apply patches immediately, implement WAF rules, restrict OGNL expressions' },
  { id: 'CVE-2026-0002', description: 'Buffer overflow in Linux kernel BPF subsystem', severity: 'high', cvss: 7.8, published: '2026-02-20', mitre: ['T1068', 'T1548'], references: ['NIST NVD', 'Kernel Git'], mitigation: 'Update kernel to latest stable version, restrict BPF capabilities' },
  { id: 'CVE-2026-0003', description: 'SQL Injection in popular CMS admin panel', severity: 'critical', cvss: 9.1, published: '2026-03-10', mitre: ['T1190'], references: ['NIST NVD', 'OWASP'], mitigation: 'Parameterize all queries, apply vendor patches, implement input validation' },
  { id: 'CVE-2026-0004', description: 'XSS vulnerability in email client attachment handler', severity: 'medium', cvss: 5.4, published: '2026-04-05', mitre: ['T1189'], references: ['NIST NVD'], mitigation: 'Sanitize HTML content, implement CSP headers, update email client' },
  { id: 'CVE-2026-0005', description: 'Privilege escalation via Windows Print Spooler', severity: 'high', cvss: 8.8, published: '2026-05-12', mitre: ['T1068', 'T1547'], references: ['NIST NVD', 'Microsoft'], mitigation: 'Disable Print Spooler on non-print servers, apply KB updates' },
  { id: 'CVE-2026-0006', description: 'Authentication bypass in VPN gateway', severity: 'critical', cvss: 9.6, published: '2026-06-01', mitre: ['T1190', 'T1078'], references: ['NIST NVD', 'Vendor Advisory'], mitigation: 'Apply firmware update, enforce MFA, monitor for unauthorized connections' },
];

export const malwareDatabase: MalwareReport[] = [
  { hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', family: 'LockBit 3.0', risk: 'critical', iocs: ['C2: 185.220.101.34:443', 'Mutex: LB3_MUTEX_2026', 'File: .lockbit3 extension', 'Reg: HKLM\\Software\\LB3'], mitigation: ['Isolate affected systems immediately', 'Do NOT pay ransom', 'Restore from offline backups', 'Deploy EDR with LockBit signatures', 'Patch initial access vectors'], description: 'LockBit 3.0 (Black) ransomware-as-a-service. Encrypts files with AES-256 + RSA-4096, exploits SMB for lateral movement.' },
  { hash: 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a', family: 'Cobalt Strike Beacon', risk: 'high', iocs: ['C2: cdn.validate-certs.com', 'Jitter: 37s', 'User-Agent: Mozilla/4.0', 'Named Pipe: msse-*-server'], mitigation: ['Block known C2 infrastructure', 'Monitor for beacon sleep patterns', 'Hunt for named pipe artifacts', 'Review proxy logs for suspicious UAs'], description: 'Cobalt Strike beacon used for post-exploitation. Communicates with C2 via HTTPS, supports lateral movement and credential harvesting.' },
  { hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', family: 'Emotet', risk: 'high', iocs: ['C2: 91.215.85.[x]:8080', 'File: %APPDATA%\\svchost.exe', 'Reg: Run key persistence', 'Network: HTTP POST to /api/'], mitigation: ['Block known Emotet C2 IPs', 'Disable macros in Office documents', 'Deploy email gateway with sandbox', 'Monitor for suspicious PowerShell'], description: 'Emotet banking trojan turned botnet. Spreads via phishing emails with malicious macros, delivers secondary payloads.' },
  { hash: 'b7e23ec5af284c5e6c2c1c567c5c2860a1f4c5d5e6f7a8b9c0d1e2f3a4b5c6d7', family: 'Remcos RAT', risk: 'critical', iocs: ['C2: 45.33.32.156:2404', 'File: %TEMP%\\remcos.exe', 'Reg: HKCU\\Software\\Remcos', 'Keylog: keystrokes.log'], mitigation: ['Isolate infected endpoints', 'Reset all compromised credentials', 'Monitor outbound connections on port 2404', 'Deploy anti-keylogging measures'], description: 'Remcos Remote Access Trojan. Provides full remote control, keylogging, screen capture, and credential theft capabilities.' },
];

export const phishingIndicators = [
  'Urgent or threatening language',
  'Misspelled domain name',
  'Shortened or suspicious URLs',
  'Request for credentials or personal info',
  'Generic greeting instead of name',
  'Mismatched sender address',
  'Unusual attachment types (.exe, .scr, .js)',
  'Poor grammar and spelling errors',
  'Too-good-to-be-true offers',
  'Impersonation of authority figures',
];

export const logAlerts: LogAlert[] = [
  { id: 'la1', type: 'brute_force', severity: 'critical', source: '192.168.1.10', details: '250 failed SSH login attempts in 5 minutes', count: 250, probability: 92, timestamp: '2026-06-16T08:15:00Z' },
  { id: 'la2', type: 'suspicious_ip', severity: 'high', source: '185.220.101.34', details: 'Known Tor exit node accessing internal resources', count: 15, probability: 78, timestamp: '2026-06-16T07:30:00Z' },
  { id: 'la3', type: 'malware_indicator', severity: 'critical', source: '10.0.45.112', details: 'Cobalt Strike beacon pattern detected in outbound traffic', count: 8, probability: 95, timestamp: '2026-06-16T06:45:00Z' },
  { id: 'la4', type: 'failed_login', severity: 'medium', source: '10.0.12.55', details: 'Repeated failed login attempts for admin account', count: 45, probability: 65, timestamp: '2026-06-16T05:20:00Z' },
  { id: 'la5', type: 'privilege_escalation', severity: 'high', source: '10.0.45.112', details: 'User escalated to root without sudo - possible kernel exploit', count: 2, probability: 88, timestamp: '2026-06-16T04:10:00Z' },
];

export const globalThreats: GlobalThreat[] = [
  { country: 'United States', lat: 38.9, lng: -77.0, count: 2847, types: ['ransomware', 'phishing', 'apt'] },
  { country: 'Russia', lat: 55.7, lng: 37.6, count: 1923, types: ['apt', 'malware', 'ddos'] },
  { country: 'China', lat: 39.9, lng: 116.4, count: 1654, types: ['apt', 'intrusion', 'espionage'] },
  { country: 'Brazil', lat: -15.8, lng: -47.9, count: 1203, types: ['banking_trojan', 'phishing'] },
  { country: 'Germany', lat: 52.5, lng: 13.4, count: 987, types: ['malware', 'ransomware'] },
  { country: 'India', lat: 28.6, lng: 77.2, count: 876, types: ['phishing', 'ransomware'] },
  { country: 'United Kingdom', lat: 51.5, lng: -0.1, count: 756, types: ['phishing', 'apt'] },
  { country: 'North Korea', lat: 39.0, lng: 125.7, count: 654, types: ['apt', 'espionage', 'cryptomining'] },
  { country: 'Iran', lat: 35.7, lng: 51.4, count: 543, types: ['apt', 'ddos', 'intrusion'] },
  { country: 'Japan', lat: 35.7, lng: 139.7, count: 432, types: ['phishing', 'malware'] },
  { country: 'Australia', lat: -33.9, lng: 151.2, count: 321, types: ['phishing', 'ransomware'] },
  { country: 'Ukraine', lat: 50.4, lng: 30.5, count: 298, types: ['malware', 'ddos'] },
];

export const quizQuestions: QuizQuestion[] = [
  { id: 'q1', question: 'What type of attack exploits vulnerabilities in SQL queries through user input?', options: ['XSS', 'SQL Injection', 'CSRF', 'Clickjacking'], correct: 1, explanation: 'SQL Injection occurs when untrusted data is sent to an interpreter as part of a command or query, allowing attackers to execute arbitrary SQL commands.', category: 'Web Security', difficulty: 'easy' },
  { id: 'q2', question: 'Which MITRE ATT&CK technique describes credential dumping from memory?', options: ['T1003', 'T1059', 'T1078', 'T1190'], correct: 0, explanation: 'T1003 (OS Credential Dumping) covers techniques like LSASS memory dumping with Mimikatz to extract credentials.', category: 'ATT&CK', difficulty: 'medium' },
  { id: 'q3', question: 'What is the primary purpose of a DMZ in network architecture?', options: ['Data encryption', 'Network segmentation', 'To serve as a buffer zone between trusted and untrusted networks', 'Intrusion detection'], correct: 2, explanation: 'A DMZ (Demilitarized Zone) acts as a buffer between internal trusted networks and external untrusted networks, hosting public-facing services.', category: 'Network Security', difficulty: 'easy' },
  { id: 'q4', question: 'Which encryption algorithm is considered quantum-resistant?', options: ['RSA-2048', 'AES-256', 'Kyber', 'ECC P-256'], correct: 2, explanation: 'Kyber is a lattice-based key encapsulation mechanism selected by NIST for post-quantum cryptography. RSA and ECC are vulnerable to Shor\'s algorithm on quantum computers.', category: 'Cryptography', difficulty: 'hard' },
  { id: 'q5', question: 'What does the "kill chain" model describe in cybersecurity?', options: ['A firewall rule ordering system', 'Stages of a cyberattack from recon to exfiltration', 'A malware removal procedure', 'An encryption key rotation schedule'], correct: 1, explanation: 'The Cyber Kill Chain (Lockheed Martin) describes 7 stages: Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, Actions on Objectives.', category: 'Defense', difficulty: 'medium' },
  { id: 'q6', question: 'Which port is commonly used for HTTPS traffic?', options: ['80', '443', '8080', '22'], correct: 1, explanation: 'Port 443 is the standard port for HTTPS (HTTP over TLS/SSL), while port 80 is used for unencrypted HTTP.', category: 'Network Security', difficulty: 'easy' },
  { id: 'q7', question: 'What is the OWASP Top 10?', options: ['Top 10 security tools', 'A list of the 10 most critical web application security risks', '10 encryption standards', 'Top 10 firewall rules'], correct: 1, explanation: 'The OWASP Top 10 is a standard awareness document representing the 10 most critical security risks to web applications, updated periodically.', category: 'Web Security', difficulty: 'easy' },
  { id: 'q8', question: 'What technique does Mimikatz primarily use to extract credentials?', options: ['Brute force', 'Registry manipulation', 'LSASS memory dumping', 'Packet sniffing'], correct: 2, explanation: 'Mimikatz extracts credentials by dumping the LSASS (Local Security Authority Subsystem Service) process memory, which stores password hashes and Kerberos tickets.', category: 'Offensive Security', difficulty: 'medium' },
  { id: 'q9', question: 'In zero-trust architecture, what is the core principle?', options: ['Trust the internal network', 'Never trust, always verify', 'Use only VPN for access', 'Encrypt all traffic'], correct: 1, explanation: 'Zero Trust operates on "never trust, always verify" - no user or system is trusted by default regardless of network location. Every access request must be authenticated and authorized.', category: 'Architecture', difficulty: 'medium' },
  { id: 'q10', question: 'What is the difference between a vulnerability and an exploit?', options: ['They are the same thing', 'A vulnerability is a weakness; an exploit is code that takes advantage of it', 'An exploit is a weakness; a vulnerability takes advantage of it', 'Exploits only exist in hardware'], correct: 1, explanation: 'A vulnerability is a flaw or weakness in a system. An exploit is specific code or technique that leverages that vulnerability to achieve an unintended behavior.', category: 'Fundamentals', difficulty: 'easy' },
];

export const attackTrendData = [
  { month: 'Jan', ransomware: 45, phishing: 82, apt: 12, ddos: 35, malware: 67 },
  { month: 'Feb', ransomware: 52, phishing: 78, apt: 15, ddos: 41, malware: 72 },
  { month: 'Mar', ransomware: 48, phishing: 91, apt: 18, ddos: 28, malware: 65 },
  { month: 'Apr', ransomware: 61, phishing: 85, apt: 22, ddos: 33, malware: 78 },
  { month: 'May', ransomware: 55, phishing: 96, apt: 19, ddos: 45, malware: 81 },
  { month: 'Jun', ransomware: 67, phishing: 104, apt: 25, ddos: 38, malware: 89 },
];

export const securityScoreData = [
  { category: 'Network', score: 78 },
  { category: 'Endpoint', score: 65 },
  { category: 'Identity', score: 82 },
  { category: 'Data', score: 71 },
  { category: 'Cloud', score: 58 },
  { category: 'App Sec', score: 74 },
];

export const incidentResponsePlans = [
  {
    scenario: 'Database Exposure',
    steps: [
      { phase: 'Identification', actions: ['Confirm data exposure scope', 'Identify affected databases and tables', 'Determine data classification (PII, PHI, financial)', 'Log all findings with timestamps'] },
      { phase: 'Containment', actions: ['Immediately revoke unnecessary database access', 'Enable audit logging on affected databases', 'Apply network segmentation to limit access', 'Preserve forensic evidence - do not destroy logs'] },
      { phase: 'Eradication', actions: ['Rotate all database credentials', 'Patch the vulnerability that caused exposure', 'Remove any unauthorized access mechanisms', 'Scan for persistence mechanisms'] },
      { phase: 'Recovery', actions: ['Verify data integrity against backups', 'Implement enhanced monitoring', 'Gradually restore normal access with least privilege', 'Validate security controls are effective'] },
      { phase: 'Communication', actions: ['Notify CISO and legal within 1 hour', 'Prepare customer notification if PII involved', 'Document timeline for regulatory reporting', 'Brief executive leadership with impact assessment'] },
    ]
  },
  {
    scenario: 'Ransomware Attack',
    steps: [
      { phase: 'Identification', actions: ['Identify ransomware variant', 'Determine encryption scope', 'Locate patient zero', 'Assess backup integrity'] },
      { phase: 'Containment', actions: ['Isolate affected systems immediately', 'Disable shared drives and network connections', 'Block C2 communication at firewall', 'Preserve memory images before shutdown'] },
      { phase: 'Eradication', actions: ['Remove ransomware binaries', 'Clean persistence mechanisms', 'Reset all domain credentials', 'Validate no lateral movement remains'] },
      { phase: 'Recovery', actions: ['Restore from clean offline backups', 'Rebuild systems from known-good images', 'Implement additional monitoring', 'Phased reconnection to network'] },
      { phase: 'Communication', actions: ['Do NOT pay ransom without legal counsel', 'Report to law enforcement (FBI IC3)', 'Prepare breach notification', 'Engage incident response retainer if needed'] },
    ]
  }
];

export const resumeAnalysis = {
  missingSkills: ['Cloud Security (AWS/Azure)', 'SIEM Administration', 'Incident Response', 'Threat Hunting', 'Container Security', 'SOAR Platform'],
  atsScore: 62,
  recommendations: [
    'Add CISSP or CompTIA Security+ certification',
    'Include SIEM tools experience (Splunk, QRadar, Sentinel)',
    'Quantify security achievements (reduced incidents by X%)',
    'Add cloud security keywords (AWS Security Hub, Azure Sentinel)',
    'Include scripting languages (Python, PowerShell for automation)',
    'Mention compliance frameworks (NIST, ISO 27001, SOC 2)',
  ],
  careerPath: [
    { role: 'Security Analyst', timeline: 'Current - 1 year', skills: ['SIEM', 'Incident Triage', 'Vulnerability Scanning'] },
    { role: 'Senior Security Analyst', timeline: '1-3 years', skills: ['Threat Hunting', 'Malware Analysis', 'SOAR'] },
    { role: 'Security Engineer', timeline: '3-5 years', skills: ['Architecture', 'Automation', 'Cloud Security'] },
    { role: 'Security Architect / CISO', timeline: '5-10 years', skills: ['Strategy', 'Governance', 'Risk Management'] },
  ]
};
