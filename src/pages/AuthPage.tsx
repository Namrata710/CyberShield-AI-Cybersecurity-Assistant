import { useState } from "react";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

interface AuthPageProps {
  mode: "login" | "signup";
  onLogin: () => void;
  onSwitchMode: () => void;
}

export function AuthPage({
  mode,
  onLogin,
  onSwitchMode,
}: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a12] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0ea5e922,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        <div className="bg-[#0b1220]/95 border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mt-4">
              CyberShield AI
            </h1>

            <p className="text-slate-400 mt-2">
              Advanced AI Cybersecurity Platform
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white focus:border-sky-500 outline-none"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 bg-[#111827] border border-slate-700 rounded-xl text-white focus:border-sky-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-500" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Password Strength</span>
                    <span>Strong</span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-emerald-400" />
                  </div>
                </div>

                <select className="w-full py-3 px-4 bg-[#111827] border border-slate-700 rounded-xl text-white">
                  <option>Security Analyst</option>
                  <option>SOC Engineer</option>
                  <option>Student</option>
                  <option>Administrator</option>
                </select>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
            >
              {mode === "login" ? "Login" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchMode}
              className="text-sky-400 hover:text-sky-300"
            >
              {mode === "login"
                ? "Create a new account"
                : "Already have an account?"}
            </button>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-4">
            <button
              onClick={onLogin}
              className="w-full py-3 border border-sky-500/30 rounded-xl text-sky-400 hover:bg-sky-500/10"
            >
              Demo Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}