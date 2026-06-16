import { useState } from 'react';
import { Brain, Play, BarChart3, TrendingUp, Shield, Zap, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const algorithms = ['Random Forest', 'XGBoost', 'Isolation Forest', 'Neural Network'];

const featureData = [
  { name: 'Port Scan Rate', importance: 0.89 },
  { name: 'Failed Logins', importance: 0.82 },
  { name: 'Packet Size Var', importance: 0.76 },
  { name: 'Connection Duration', importance: 0.71 },
  { name: 'Protocol Anomaly', importance: 0.65 },
  { name: 'DNS Query Freq', importance: 0.58 },
  { name: 'Payload Entropy', importance: 0.52 },
  { name: 'Geo Anomaly', importance: 0.44 },
];

const predictionHistory = [
  { time: '00:00', probability: 12 },
  { time: '04:00', probability: 18 },
  { time: '08:00', probability: 45 },
  { time: '12:00', probability: 67 },
  { time: '16:00', probability: 87 },
  { time: '20:00', probability: 72 },
  { time: '24:00', probability: 34 },
];

const attackTypeData = [
  { name: 'DDoS', value: 35, color: '#ef4444' },
  { name: 'Brute Force', value: 25, color: '#f59e0b' },
  { name: 'SQL Injection', value: 20, color: '#0ea5e9' },
  { name: 'XSS', value: 12, color: '#8b5cf6' },
  { name: 'APT', value: 8, color: '#ec4899' },
];

export function AttackPrediction() {
  const [algorithm, setAlgorithm] = useState('Random Forest');
  const [training, setTraining] = useState(false);
  const [trained, setTrained] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);

  const trainModel = () => {
    setTraining(true);
    setProgress(0);
    setTrained(false);
    setPrediction(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTraining(false);
          setTrained(true);
          const prob = Math.floor(Math.random() * 40) + 60;
          setPrediction(prob);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 150);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Model Controls */}
      <div className="cyber-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Attack Prediction Model</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Train ML models using network traffic and intrusion detection datasets to predict attack probability in real-time.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {algorithms.map(algo => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                algorithm === algo
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-[#111827] border-[#1a2744] text-slate-500 hover:text-slate-300 hover:border-[#2a3d5e]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 mb-1" />
              {algo}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={trainModel} disabled={training} className="cyber-btn flex items-center gap-2 disabled:opacity-40">
            {training ? <><Activity className="w-4 h-4 animate-spin" /> Training...</> : <><Play className="w-4 h-4" /> Train Model</>}
          </button>
          <span className="text-xs text-slate-600">Algorithm: <span className="text-sky-400">{algorithm}</span></span>
        </div>

        {training && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Training {algorithm}...</span>
              <span>Epoch {Math.floor(progress / 10)}/10</span>
            </div>
            <div className="w-full bg-[#111827] rounded-full h-2">
              <div className="bg-gradient-to-r from-sky-600 to-cyan-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-[10px] font-mono-cyber">
              <span className="text-slate-600">Accuracy: {(70 + progress * 0.2).toFixed(1)}%</span>
              <span className="text-slate-600">Loss: {(0.8 - progress * 0.007).toFixed(4)}</span>
              <span className="text-slate-600">F1: {(0.65 + progress * 0.003).toFixed(3)}</span>
            </div>
          </div>
        )}
      </div>

      {trained && prediction !== null && (
        <>
          {/* Prediction Result */}
          <div className={`cyber-card p-6 ${prediction >= 70 ? 'cyber-glow-red' : prediction >= 50 ? 'cyber-glow-amber' : 'cyber-glow-green'}`}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg width="100" height="100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#111827" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round"
                    stroke={prediction >= 70 ? '#ef4444' : prediction >= 50 ? '#f59e0b' : '#22c55e'}
                    strokeDasharray={`${prediction * 2.51} 251`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold font-mono-cyber ${prediction >= 70 ? 'text-red-400' : prediction >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{prediction}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Attack Probability</p>
                <p className={`text-2xl font-bold ${prediction >= 70 ? 'text-red-400' : prediction >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {prediction >= 70 ? 'HIGH RISK' : prediction >= 50 ? 'MODERATE RISK' : 'LOW RISK'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Model: {algorithm} | Confidence: {(85 + Math.random() * 10).toFixed(1)}%</p>
                <div className="flex gap-2 mt-2">
                  {prediction >= 70 && <span className="px-2 py-0.5 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded">Immediate Action Required</span>}
                  {prediction >= 50 && prediction < 70 && <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">Monitor Closely</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Feature Importance */}
            <div className="cyber-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-200">Feature Importance</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={featureData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 1]} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} width={90} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c1222', border: '1px solid #1a2744', borderRadius: 8 }} />
                  <Bar dataKey="importance" fill="#0ea5e9" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attack Type Distribution */}
            <div className="cyber-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-200">Attack Type Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={attackTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {attackTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0c1222', border: '1px solid #1a2744', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {attackTypeData.map(a => (
                  <span key={a.name} className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} /> {a.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Prediction Timeline */}
            <div className="cyber-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-200">Prediction Timeline</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={predictionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c1222', border: '1px solid #1a2744', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="probability" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Accuracy', value: '94.2%', color: 'text-emerald-400' },
              { label: 'Precision', value: '91.8%', color: 'text-sky-400' },
              { label: 'Recall', value: '89.3%', color: 'text-amber-400' },
              { label: 'F1 Score', value: '90.5%', color: 'text-purple-400' },
            ].map(m => (
              <div key={m.label} className="cyber-card p-4 text-center">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className={`text-xl font-bold font-mono-cyber ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!trained && !training && (
        <div className="cyber-card p-8 text-center">
          <Brain className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-400 mb-1">Select an Algorithm and Train Your Model</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">Choose from Random Forest, XGBoost, Isolation Forest, or Neural Network to train an attack prediction model using network traffic datasets.</p>
        </div>
      )}
    </div>
  );
}
