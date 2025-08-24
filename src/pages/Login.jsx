import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login(){
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin");
  const [pass, setPass] = useState("admin");

  if (user) {
    // already logged in
    navigate("/vault", { replace: true });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    login({ name: "Guest" });
    navigate("/vault");
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-[radial-gradient(1200px_600px_at_10%_10%,rgba(99,102,241,.18),transparent_60%),radial-gradient(1000px_700px_at_90%_90%,rgba(34,197,94,.15),transparent_60%),#0b1020] text-slate-200 p-6">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left: Video */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
            <video
              className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
              src="/video/login.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          {/* Right: Enlarged Login Card */}
          <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 sm:p-10">
            <div className="mb-6 grid place-items-center">
              <div className="size-24 rounded-full bg-indigo-900/60 border-4 border-white/30 grid place-items-center text-4xl">👤</div>
            </div>
            <h1 className="text-3xl font-extrabold text-center">Welcome</h1>
            <p className="mt-1 text-center text-slate-400">Login to access your Vault</p>

            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label className="block text-sm mb-2 opacity-90">Email / Username</label>
                <input
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-slate-900/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 opacity-90">Password</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e)=>setPass(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-slate-900/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 rounded-xl font-bold text-white"
              >
                LOGIN
              </button>
              <p className="text-center text-xs text-slate-400">No credentials required. Click LOGIN to continue.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}