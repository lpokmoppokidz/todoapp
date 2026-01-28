import React from "react";
import { motion } from "framer-motion";
// Removed Shadcn imports to simplify learning
// import { Card, ... } from "./ui/card";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { cn } from "../lib/utils";

const AuthPage = ({ authState, error, onChange, onSubmit, onToggle }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50 border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-8">
          <div className="text-center pb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-12 h-12 bg-slate-900 rounded-xl mx-auto mb-6 shadow-lg flex items-center justify-center"
            >
               <div className="w-6 h-6 border-2 border-white rounded-md"></div>
            </motion.div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {authState.mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-slate-500">
              {authState.mode === "login"
                ? "Sign in to your workspace."
                : "Start your free trial today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="space-y-5"
            >
              {authState.mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authState.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  Email
                </label>
                <input
                  type="email"
                  value={authState.email}
                  onChange={(event) => onChange("email", event.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  Password
                </label>
                <input
                  type="password"
                  value={authState.password}
                  onChange={(event) => onChange("password", event.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all duration-200"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-lg shadow-slate-900/20 transition-all duration-200 transform active:scale-[0.98]"
              >
                {authState.mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </motion.div>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-slate-500">
              {authState.mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={onToggle}
                className="ml-1.5 font-bold text-slate-900 hover:underline transition-all"
              >
                {authState.mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
