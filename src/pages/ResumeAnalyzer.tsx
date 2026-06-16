import { useState } from 'react';
import { UserCheck, Upload, FileText, Target, TrendingUp, Award, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { resumeAnalysis } from '../data/mockData';

export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);

  const sampleResume = `John Smith
Cybersecurity Analyst | 3 Years Experience

SKILLS:
- Network security monitoring
- Firewall configuration and management
- Vulnerability scanning (Nessus, OpenVAS)
- Incident response and triage
- Windows and Linux administration

EXPERIENCE:
Cybersecurity Analyst, TechCorp Inc. (2023-Present)
- Monitored SIEM alerts and performed initial triage
- Conducted vulnerability assessments on internal systems
- Responded to 150+ security incidents
- Managed firewall rules and access controls

CERTIFICATIONS:
- CompTIA Security+
- Certified Ethical Hacker (CEH)

EDUCATION:
B.S. Computer Science, State University (2022)`;

  const analyze = () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(true);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">Resume Analyzer for Security Jobs</h3>
          </div>
          <div className="border-2 border-dashed border-[#1a2744] rounded-lg p-4 text-center mb-3 bg-[#0a1020]">
            <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Paste your resume content for AI analysis</p>
          </div>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full h-56 bg-[#0a1020] border border-[#1a2744] rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={analyze} disabled={analyzing || !resumeText.trim()} className="cyber-btn text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {analyzing ? 'Analyzing...' : <><UserCheck className="w-3 h-3" /> Analyze Resume</>}
            </button>
            <button onClick={() => setResumeText(sampleResume)} className="cyber-btn-secondary text-sm flex items-center gap-2">
              <FileText className="w-3 h-3" /> Load Sample
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* ATS Score */}
              <div className="cyber-card p-5 cyber-glow">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg width="80" height="80" className="transform -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#111827" strokeWidth="6" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke={resumeAnalysis.atsScore >= 70 ? '#22c55e' : resumeAnalysis.atsScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${resumeAnalysis.atsScore * 2.01} 201`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold font-mono-cyber text-white">{resumeAnalysis.atsScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">ATS Compatibility Score</p>
                    <p className={`text-lg font-bold ${resumeAnalysis.atsScore >= 70 ? 'text-emerald-400' : resumeAnalysis.atsScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {resumeAnalysis.atsScore >= 70 ? 'Good Match' : resumeAnalysis.atsScore >= 50 ? 'Needs Improvement' : 'Low Match'}
                    </p>
                    <p className="text-[10px] text-slate-600">Based on cybersecurity keyword analysis</p>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Missing Critical Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeAnalysis.missingSkills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-red-500/5 text-red-400 border border-red-500/20 rounded">
                      <XCircle className="w-2.5 h-2.5" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Recommendations</h3>
                </div>
                <div className="space-y-2">
                  {resumeAnalysis.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-[#111827] rounded-lg">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Path */}
              <div className="cyber-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Cybersecurity Career Roadmap</h3>
                </div>
                <div className="space-y-3">
                  {resumeAnalysis.careerPath.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        i === 0 ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-[#111827] border border-[#1a2744]'
                      }`}>
                        <span className="text-[10px] font-mono-cyber text-sky-400">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-white">{step.role}</p>
                        <p className="text-[10px] text-slate-600">{step.timeline}</p>
                      </div>
                      <div className="flex gap-1">
                        {step.skills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 text-[9px] bg-[#111827] text-slate-500 rounded border border-[#1a2744]">{s}</span>
                        ))}
                      </div>
                      {i < resumeAnalysis.careerPath.length - 1 && <ChevronRight className="w-4 h-4 text-slate-700" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="cyber-card p-8 flex flex-col items-center justify-center h-full text-center">
              <UserCheck className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-medium text-slate-400">AI Resume Analyzer</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">Get ATS compatibility scores, identify missing cybersecurity skills, and receive a personalized career roadmap for security roles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
