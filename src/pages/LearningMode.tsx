import { useState } from 'react';
import { GraduationCap, BookOpen, Trophy, CheckCircle, XCircle, ChevronRight, Star, Target, Zap, RotateCcw } from 'lucide-react';
import { quizQuestions, type QuizQuestion } from '../data/mockData';

type Mode = 'quiz' | 'ctf' | 'labs';

interface CTFChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  hint: string;
  flag: string;
  solved: boolean;
}

const ctfChallenges: CTFChallenge[] = [
  { id: 'ctf1', title: 'Base64 Secret', difficulty: 'Easy', category: 'Cryptography', description: 'We intercepted this encoded message: RmxhZzogQ1RGX0JBU0U2NF9JU19FWVNFQVNZ', hint: 'Base64 encoding uses A-Z, a-z, 0-9, +, / characters', flag: 'CTF_BASE64_IS_EYESASY', solved: false },
  { id: 'ctf2', title: 'SQL Injection 101', difficulty: 'Easy', category: 'Web', description: 'The login form at challenge.example.com uses this query: SELECT * FROM users WHERE username=\'[input]\' AND password=\'[input]\'. What input bypasses auth?', hint: 'Think about closing the quote and adding OR condition', flag: '\' OR \'1\'=\'1', solved: false },
  { id: 'ctf3', title: 'Hidden in Headers', difficulty: 'Medium', category: 'Web', description: 'A website has a secret flag hidden in one of its HTTP response headers. Which custom header contains the flag?', hint: 'Use curl -I to inspect response headers, look for X- prefixed headers', flag: 'X-Secret-Flag', solved: false },
  { id: 'ctf4', title: 'Caesar Cipher', difficulty: 'Easy', category: 'Cryptography', description: 'Decrypt this message: "PELCGBYBTENZ". It uses a classic substitution cipher.', hint: 'ROT13 is a special case of Caesar cipher with shift of 13', flag: 'CRYPTOPROGRAM', solved: false },
  { id: 'ctf5', title: 'Log Analysis', difficulty: 'Medium', category: 'Forensics', description: 'In the Apache access log, one IP made 500 requests in 60 seconds to /admin/login. What type of attack is this?', hint: 'Multiple rapid requests to a login endpoint indicates...', flag: 'Brute Force', solved: false },
];

const securityLabs = [
  { id: 'lab1', title: 'XSS Attack Lab', difficulty: 'Beginner', category: 'Web Security', description: 'Learn how Cross-Site Scripting works by finding and exploiting XSS vulnerabilities in a safe environment.', concepts: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'CSP Bypass'] },
  { id: 'lab2', title: 'Network Scanning with Nmap', difficulty: 'Beginner', category: 'Network', description: 'Master network reconnaissance using Nmap to discover hosts, services, and vulnerabilities.', concepts: ['SYN Scan', 'Service Detection', 'OS Fingerprinting', 'NSE Scripts'] },
  { id: 'lab3', title: 'Password Cracking Defense', difficulty: 'Intermediate', category: 'Authentication', description: 'Understand password cracking techniques and implement proper defenses.', concepts: ['Hash Types', 'Salt & Pepper', 'bcrypt/scrypt', 'Password Policies'] },
  { id: 'lab4', title: 'Firewall Configuration', difficulty: 'Intermediate', category: 'Network', description: 'Configure iptables rules to secure a Linux server with proper network filtering.', concepts: ['Chain Rules', 'Stateful Inspection', 'NAT', 'Rate Limiting'] },
];

export function LearningMode() {
  const [mode, setMode] = useState<Mode>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [ctfInput, setCtfInput] = useState('');
  const [ctfChallengesState, setCtfChallengesState] = useState(ctfChallenges);
  const [ctfHintShown, setCtfHintShown] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);

  const question = quizQuestions[currentQ];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === question.correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  const checkCTFFlag = (challengeId: string) => {
    const challenge = ctfChallengesState.find(c => c.id === challengeId);
    if (!challenge) return;
    const normalized = ctfInput.trim().toLowerCase();
    if (normalized === challenge.flag.toLowerCase()) {
      setCtfChallengesState(prev => prev.map(c => c.id === challengeId ? { ...c, solved: true } : c));
    }
    setCtfInput('');
  };

  const solvedCTF = ctfChallengesState.filter(c => c.solved).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Mode Selection */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Learning Mode</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Interactive cybersecurity education with quizzes, CTF-style challenges, and security labs with AI explanations.</p>
        <div className="flex gap-3">
          {[
            { id: 'quiz' as Mode, label: 'Security Quizzes', icon: BookOpen },
            { id: 'ctf' as Mode, label: 'CTF Challenges', icon: Trophy },
            { id: 'labs' as Mode, label: 'Security Labs', icon: Target },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === m.id ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400' : 'bg-[#111827] border border-[#1a2744] text-slate-500 hover:text-slate-300'
              }`}
            >
              <m.icon className="w-4 h-4" /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Mode */}
      {mode === 'quiz' && (
        <div className="cyber-card p-6">
          {quizComplete ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-lg font-mono-cyber text-sky-400">{score}/{quizQuestions.length} correct</p>
              <p className="text-sm text-slate-500 mt-2">{score >= 8 ? 'Expert Level!' : score >= 6 ? 'Good knowledge!' : score >= 4 ? 'Keep learning!' : 'More study needed'}</p>
              <button onClick={resetQuiz} className="cyber-btn mt-6 flex items-center gap-2 mx-auto">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono-cyber">Q{currentQ + 1}/{quizQuestions.length}</span>
                  <span className={`px-2 py-0.5 text-[10px] rounded ${
                    question.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    question.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>{question.difficulty}</span>
                  <span className="px-2 py-0.5 text-[10px] bg-[#111827] text-slate-500 rounded border border-[#1a2744]">{question.category}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono-cyber">Score: {score}/{currentQ + (selectedAnswer !== null ? 1 : 0)}</span>
              </div>

              <h3 className="text-base font-semibold text-white mb-4">{question.question}</h3>

              <div className="space-y-2 mb-4">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border ${
                      selectedAnswer === null
                        ? 'bg-[#111827] border-[#1a2744] hover:border-sky-500/30 cursor-pointer'
                        : i === question.correct
                          ? 'bg-emerald-500/5 border-emerald-500/30 cursor-default'
                          : selectedAnswer === i
                            ? 'bg-red-500/5 border-red-500/30 cursor-default'
                            : 'bg-[#111827] border-[#1a2744] opacity-50 cursor-default'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium shrink-0 ${
                      selectedAnswer !== null && i === question.correct ? 'bg-emerald-500/20 text-emerald-400' :
                      selectedAnswer === i && i !== question.correct ? 'bg-red-500/20 text-red-400' :
                      'bg-[#0a1020] text-slate-500'
                    }`}>
                      {selectedAnswer !== null && i === question.correct ? <CheckCircle className="w-4 h-4" /> :
                       selectedAnswer === i && i !== question.correct ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-slate-300">{opt}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="p-4 bg-[#111827] rounded-lg border border-[#1a2744] animate-fade-in">
                  <p className="text-xs text-slate-400 leading-relaxed"><span className="font-medium text-sky-400">Explanation:</span> {question.explanation}</p>
                  <button onClick={nextQuestion} className="cyber-btn mt-3 text-sm flex items-center gap-2">
                    {currentQ < quizQuestions.length - 1 ? 'Next Question' : 'See Results'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-[#111827] rounded-full h-1.5">
                <div className="bg-sky-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQ + (selectedAnswer !== null ? 1 : 0)) / quizQuestions.length) * 100}%` }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* CTF Mode */}
      {mode === 'ctf' && (
        <div className="space-y-4">
          <div className="cyber-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">{solvedCTF}/{ctfChallengesState.length} challenges solved</span>
              </div>
              <div className="flex gap-1">
                {ctfChallengesState.map(c => (
                  <div key={c.id} className={`w-3 h-3 rounded-full ${c.solved ? 'bg-emerald-400' : 'bg-[#1a2744]'}`} />
                ))}
              </div>
            </div>
          </div>
          {ctfChallengesState.map(ch => (
            <div key={ch.id} className={`cyber-card-hover p-4 ${ch.solved ? 'border-emerald-500/20' : ''}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 text-[10px] rounded ${
                  ch.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  ch.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>{ch.difficulty}</span>
                <span className="px-2 py-0.5 text-[10px] bg-[#111827] text-slate-500 rounded border border-[#1a2744]">{ch.category}</span>
                <h3 className="text-sm font-semibold text-white">{ch.title}</h3>
                {ch.solved && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
              </div>
              <p className="text-xs text-slate-400 mb-3">{ch.description}</p>

              {ch.solved ? (
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                  <Star className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Solved! Flag: {ch.flag}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={ctfInput}
                      onChange={e => setCtfInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && checkCTFFlag(ch.id)}
                      placeholder="Enter the flag..."
                      className="flex-1 cyber-input text-xs font-mono-cyber"
                    />
                    <button onClick={() => checkCTFFlag(ch.id)} className="cyber-btn text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Submit
                    </button>
                  </div>
                  {ctfHintShown === ch.id ? (
                    <p className="text-[10px] text-amber-400/80 px-1">Hint: {ch.hint}</p>
                  ) : (
                    <button onClick={() => setCtfHintShown(ch.id)} className="text-[10px] text-slate-600 hover:text-slate-400 px-1 transition-colors">Show Hint</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Labs Mode */}
      {mode === 'labs' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {securityLabs.map(lab => (
            <div key={lab.id} className="cyber-card-hover p-4 cursor-pointer" onClick={() => setSelectedLab(selectedLab === lab.id ? null : lab.id)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{lab.title}</h3>
                  <div className="flex gap-2 mt-0.5">
                    <span className={`px-1.5 py-0.5 text-[9px] rounded ${
                      lab.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400' :
                      lab.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>{lab.difficulty}</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-[#111827] text-slate-500 rounded">{lab.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">{lab.description}</p>

              {selectedLab === lab.id && (
                <div className="pt-3 border-t border-[#1a2744] animate-fade-in">
                  <p className="text-[10px] text-slate-500 font-medium mb-2">Concepts Covered:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.concepts.map(c => (
                      <span key={c} className="px-2 py-0.5 text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
