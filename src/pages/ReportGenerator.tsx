import { useState } from 'react';
import { FileBarChart, Download, Clock, Shield, AlertTriangle, CheckCircle, Building2, Users, FileText, ChevronDown } from 'lucide-react';

type ReportType = 'executive' | 'risk' | 'technical' | 'compliance';

export function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>('executive');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [dateRange, setDateRange] = useState('June 1-16, 2026');

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const reportTemplates = {
    executive: {
      title: 'Executive Security Summary',
      icon: Building2,
      sections: [
        { title: 'Executive Overview', content: 'Overall security posture has improved by 12% compared to the previous reporting period. Key risk areas remain in cloud infrastructure and third-party vendor access. Two critical vulnerabilities were identified and remediated within SLA.' },
        { title: 'Key Metrics', content: 'Mean Time to Detect (MTTD): 4.2 hours (down from 6.1)\nMean Time to Respond (MTTR): 2.8 hours (down from 4.3)\nVulnerability Remediation Rate: 94% within SLA\nSecurity Incident Count: 23 (down 18% MoM)\nFalse Positive Rate: 12% (down from 15%)' },
        { title: 'Critical Findings', content: '1. Two critical vulnerabilities (CVE-2026-1337, CVE-2026-1453) were discovered and patched within 48 hours\n2. Ransomware attempt detected and contained on June 8th\n3. Third-party vendor API exposed sensitive data (remediated)\n4. Insider threat detection flagged 3 anomalous data access patterns' },
        { title: 'Risk Assessment', content: 'Overall Risk Score: 62/100 (Moderate)\n- Network Security: 78/100 (Good)\n- Endpoint Protection: 65/100 (Needs Improvement)\n- Identity & Access: 82/100 (Good)\n- Data Protection: 71/100 (Moderate)\n- Cloud Security: 58/100 (Needs Improvement)\n- Application Security: 74/100 (Moderate)' },
        { title: 'Recommendations', content: '1. Invest in cloud security posture management tool\n2. Implement zero-trust network architecture\n3. Enhance endpoint detection and response coverage\n4. Deploy data loss prevention for sensitive workloads\n5. Conduct tabletop exercise for incident response plan\n6. Engage third-party penetration testing quarterly' },
      ],
    },
    risk: {
      title: 'Risk Assessment Report',
      icon: AlertTriangle,
      sections: [
        { title: 'Risk Summary', content: 'Total identified risks: 47\nCritical: 5 | High: 12 | Medium: 18 | Low: 12\nRisk trend: Downward (8% improvement from last quarter)\nResidual risk accepted: 3 items' },
        { title: 'Top Critical Risks', content: '1. Outdated TLS configuration on customer-facing APIs (CVSS 9.1)\n2. Overprivileged service accounts in AD (CVSS 8.8)\n3. Unpatched VPN gateway (CVE-2026-0006, CVSS 9.6)\n4. No MFA on privileged accounts (Business Impact: High)\n5. Single point of failure in SIEM infrastructure (Business Impact: Critical)' },
        { title: 'Risk Heat Map', content: 'Impact vs Likelihood Matrix:\n- Critical Impact / High Likelihood: 2 risks\n- Critical Impact / Medium Likelihood: 3 risks\n- High Impact / High Likelihood: 5 risks\n- High Impact / Medium Likelihood: 7 risks\n- Medium Impact / Low Likelihood: 18 risks\n- Low Impact / Low Likelihood: 12 risks' },
        { title: 'Treatment Plans', content: 'Mitigate: 35 risks (74%)\nTransfer: 5 risks (11%) - via cyber insurance\nAccept: 5 risks (11%) - low impact/likelihood\nDefer: 2 risks (4%) - pending budget approval\n\nEstimated remediation cost: $245,000\nEstimated risk reduction: 68%' },
      ],
    },
    technical: {
      title: 'Technical Security Assessment',
      icon: FileText,
      sections: [
        { title: 'Assessment Scope', content: 'External perimeter: 45 IP addresses, 12 web applications\nInternal network: 3 VLANs, 500+ endpoints\nCloud: AWS (3 accounts), Azure (1 tenant)\nWireless: 2 SSIDs, WPA3 Enterprise\nPhysical: 4 office locations' },
        { title: 'Vulnerability Findings', content: 'Total vulnerabilities discovered: 127\nCritical: 8 | High: 23 | Medium: 56 | Low: 40\n\nMost Common Vulnerabilities:\n1. Missing security headers (23 instances)\n2. Outdated TLS configurations (15 instances)\n3. Weak password policies (12 instances)\n4. Unnecessary services running (11 instances)\n5. Insufficient logging (9 instances)' },
        { title: 'Exploitation Results', content: 'Red team achieved:\n- Initial access via phishing (2/5 employees clicked)\n- Lateral movement via pass-the-hash\n- Domain admin obtained in 4 hours\n- Exfiltrated 2GB of simulated sensitive data\n- Maintained persistence for 72 hours undetected\n\nBlue team detection rate: 43% of red team actions' },
        { title: 'Network Architecture Review', content: 'Findings:\n- Flat network segments allow lateral movement\n- No microsegmentation between critical assets\n- Egress filtering insufficient\n- DNS monitoring gaps identified\n- No network traffic anomaly detection\n\nRecommendations:\n- Implement zero-trust microsegmentation\n- Deploy NDR solution\n- Enable full packet capture at egress points\n- Implement DNS monitoring with threat intel integration' },
      ],
    },
    compliance: {
      title: 'Compliance Audit Report',
      icon: Shield,
      sections: [
        { title: 'Compliance Status', content: 'SOC 2 Type II: 94% compliant (6% remediation in progress)\nNIST CSF: Maturity Level 3 (Target: Level 4)\nISO 27001: Certified (annual audit passed)\nGDPR: 98% compliant (2% action items pending)\nPCI DSS: Non-compliant (3 remediation items)' },
        { title: 'Control Gaps', content: '1. Access Review - Quarterly reviews not consistently documented\n2. Change Management - Emergency change process lacks approval trail\n3. Incident Response - Communication plan not tested in 12 months\n4. Encryption - Legacy systems still using TLS 1.0\n5. Backup Testing - Disaster recovery failover not tested quarterly' },
        { title: 'Remediation Timeline', content: 'Q3 2026: Address critical compliance gaps (3 items)\nQ4 2026: Complete access review automation\nQ1 2027: Achieve NIST CSF Level 4 maturity\nQ2 2027: PCI DSS re-certification\nOngoing: Monthly compliance monitoring and reporting' },
        { title: 'Audit Evidence', content: 'Total evidence artifacts: 847\nAutomated collection: 72%\nManual collection: 28%\n\nEvidence categories:\n- Policy documents: 23\n- Technical configurations: 312\n- Log samples: 189\n- Interview notes: 45\n- Test results: 278' },
      ],
    },
  };

  const currentReport = reportTemplates[reportType];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Configuration */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileBarChart className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Security Report Generator</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Generate professional security reports including executive summaries, risk assessments, and compliance audits.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Organization</label>
            <input value={orgName} onChange={e => setOrgName(e.target.value)} className="cyber-input w-full" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Reporting Period</label>
            <input value={dateRange} onChange={e => setDateRange(e.target.value)} className="cyber-input w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {(Object.entries(reportTemplates) as [ReportType, typeof reportTemplates.executive][]).map(([key, template]) => (
            <button
              key={key}
              onClick={() => { setReportType(key); setGenerated(false); }}
              className={`p-3 rounded-lg border text-center transition-all ${
                reportType === key
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-[#111827] border-[#1a2744] text-slate-500 hover:text-slate-300'
              }`}
            >
              <template.icon className="w-4 h-4 mx-auto mb-1" />
              <p className="text-xs font-medium">{template.title}</p>
            </button>
          ))}
        </div>

        <button onClick={generate} disabled={generating} className="cyber-btn flex items-center gap-2 disabled:opacity-40">
          {generating ? <><Clock className="w-4 h-4 animate-spin" /> Generating Report...</> : <><Download className="w-4 h-4" /> Generate {currentReport.title}</>}
        </button>
      </div>

      {/* Generated Report */}
      {generated && (
        <div className="space-y-4">
          <div className="cyber-card p-6 cyber-glow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{currentReport.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{orgName} | {dateRange}</p>
              </div>
              <button className="cyber-btn-secondary flex items-center gap-2 text-xs">
                <Download className="w-3 h-3" /> Export PDF
              </button>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Report Generated
              </span>
              <span className="text-[10px] text-slate-600 font-mono-cyber">{new Date().toISOString()}</span>
            </div>
          </div>

          {currentReport.sections.map((section, i) => (
            <div key={i} className="cyber-card p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[10px] font-mono-cyber text-sky-400">{i + 1}</span>
                {section.title}
              </h3>
              <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap pl-7">{section.content}</div>
            </div>
          ))}

          <div className="cyber-card p-4">
            <p className="text-[10px] text-slate-600 text-center">
              This report was generated by CyberShield AI Security Operations Assistant. For production use, integrate with actual security tools and data sources.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
