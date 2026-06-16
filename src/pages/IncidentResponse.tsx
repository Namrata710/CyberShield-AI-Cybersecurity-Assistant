import { useState } from 'react';
import { Siren, ChevronRight, CheckCircle, Circle, AlertTriangle, Shield, FileText, Users, Clock } from 'lucide-react';
import { incidentResponsePlans } from '../data/mockData';

type Scenario = 'Database Exposure' | 'Ransomware Attack' | 'Custom';

const customPlan = {
  scenario: 'Custom Incident',
  steps: [
    { phase: 'Identification', actions: ['Determine incident type and scope', 'Identify affected systems and data', 'Assess business impact', 'Document initial findings with timestamps'] },
    { phase: 'Containment', actions: ['Implement immediate containment measures', 'Isolate affected systems', 'Preserve forensic evidence', 'Enable enhanced logging and monitoring'] },
    { phase: 'Eradication', actions: ['Remove threat from environment', 'Patch vulnerabilities exploited', 'Reset compromised credentials', 'Verify no persistence mechanisms remain'] },
    { phase: 'Recovery', actions: ['Restore systems from clean backups', 'Implement additional monitoring', 'Gradually restore normal operations', 'Validate security controls are effective'] },
    { phase: 'Lessons Learned', actions: ['Conduct post-incident review', 'Update incident response procedures', 'Implement preventive measures', 'Train team on new procedures'] },
  ],
};

export function IncidentResponse() {
  const [scenario, setScenario] = useState<Scenario>('Database Exposure');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState('');

  const currentPlan = scenario === 'Custom' ? customPlan : incidentResponsePlans.find(p => p.scenario === scenario) || incidentResponsePlans[0];

  const toggleAction = (actionKey: string) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionKey)) next.delete(actionKey);
      else next.add(actionKey);
      return next;
    });
  };

  const totalActions = currentPlan.steps.reduce((a, s) => a + s.actions.length, 0);
  const completedCount = completedActions.size;
  const progressPct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  const phaseIcons: Record<string, React.FC<any>> = {
    Identification: AlertTriangle,
    Containment: Shield,
    Eradication: Siren,
    Recovery: CheckCircle,
    Communication: Users,
    'Lessons Learned': FileText,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Scenario Selection */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Siren className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-white">Incident Response Assistant</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Select a scenario or describe your incident to generate a comprehensive response plan with containment, recovery, and communication steps.</p>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {(['Database Exposure', 'Ransomware Attack', 'Custom'] as Scenario[]).map(s => (
            <button
              key={s}
              onClick={() => { setScenario(s); setCompletedActions(new Set()); }}
              className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                scenario === s
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-[#111827] border-[#1a2744] text-slate-500 hover:text-slate-300 hover:border-[#2a3d5e]'
              }`}
            >
              {s === 'Database Exposure' && <AlertTriangle className="w-4 h-4 mb-1" />}
              {s === 'Ransomware Attack' && <Shield className="w-4 h-4 mb-1" />}
              {s === 'Custom' && <Siren className="w-4 h-4 mb-1" />}
              {s}
            </button>
          ))}
        </div>

        {scenario === 'Custom' && (
          <div className="flex gap-3">
            <input
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Describe your security incident..."
              className="flex-1 cyber-input"
            />
            <button className="cyber-btn flex items-center gap-2">
              <Siren className="w-4 h-4" /> Generate Plan
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Response Progress</span>
              <span>{completedCount}/{totalActions} actions completed</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${progressPct === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <span className="text-sm font-bold font-mono-cyber text-sky-400">{progressPct}%</span>
        </div>
      </div>

      {/* Response Plan */}
      <div className="space-y-4">
        {currentPlan.steps.map((step, stepIdx) => {
          const PhaseIcon = phaseIcons[step.phase] || Circle;
          const phaseComplete = step.actions.every(a => completedActions.has(`${stepIdx}-${a}`));
          const phaseProgress = step.actions.filter(a => completedActions.has(`${stepIdx}-${a}`)).length;

          return (
            <div key={stepIdx} className={`cyber-card p-4 ${phaseComplete ? 'border-emerald-500/20' : ''}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  phaseComplete ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-sky-500/10 border border-sky-500/20'
                }`}>
                  <PhaseIcon className={`w-4 h-4 ${phaseComplete ? 'text-emerald-400' : 'text-sky-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{step.phase}</h3>
                  <p className="text-[10px] text-slate-600">{phaseProgress}/{step.actions.length} completed</p>
                </div>
                {phaseComplete && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {stepIdx < currentPlan.steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-700" />}
              </div>
              <div className="space-y-1.5 ml-11">
                {step.actions.map((action, actionIdx) => {
                  const key = `${stepIdx}-${action}`;
                  const done = completedActions.has(key);
                  return (
                    <button
                      key={actionIdx}
                      onClick={() => toggleAction(key)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                        done ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-[#111827] border border-transparent hover:border-[#1a2744]'
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={`text-xs ${done ? 'text-emerald-400/70 line-through' : 'text-slate-300'}`}>{action}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
