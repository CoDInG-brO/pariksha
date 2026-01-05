"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-surface dark:to-background flex flex-col items-center justify-center px-6 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo & Title */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-accent/30"
          >
            {/* Book Stack SVG Logo */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="6" height="20" rx="1" transform="rotate(-12 4 6)" fill="#FB923C" />
              <rect x="5.5" y="8" width="3" height="14" rx="0.5" transform="rotate(-12 5.5 8)" fill="#FDBA74" />
              <rect x="11" y="4" width="6" height="22" rx="1" fill="#22C55E" />
              <rect x="12.5" y="6" width="3" height="16" rx="0.5" fill="#86EFAC" />
              <rect x="18" y="8" width="5" height="18" rx="1" fill="#EAB308" />
              <rect x="19.2" y="10" width="2.5" height="12" rx="0.5" fill="#FDE047" />
              <rect x="24" y="10" width="5" height="16" rx="1" fill="#06B6D4" />
              <rect x="25.2" y="12" width="2.5" height="10" rx="0.5" fill="#67E8F9" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Pariksha</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your AI-powered exam preparation partner</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gradient-to-br dark:from-surface dark:to-elevated rounded-xl p-6 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
            {showEmailLogin ? "Sign in with Email" : "Welcome Back"}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {!showEmailLogin ? (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-gray-100 rounded-lg text-gray-800 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {isGoogleLoading ? "Signing in..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                <span className="text-gray-400 dark:text-gray-500 text-xs">or</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              </div>

              {/* Email Sign In Button */}
              <button
                onClick={() => setShowEmailLogin(true)}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg text-gray-700 dark:text-white font-semibold transition-all border border-gray-200 dark:border-white/10"
              >
                <span className="text-xl">✉️</span>
                Continue with Email
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1.5 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1.5 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <input type="checkbox" className="rounded bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20" />
                  Remember me
                </label>
                <button type="button" className="text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-5 py-3 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEmailLogin(false)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm transition-colors"
              >
                ← Back to other options
              </button>
            </form>
          )}

          {/* Sign Up Link */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 grid grid-cols-3 gap-3 text-center"
        >
          <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
            <span className="text-xl">📊</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">CAT Prep</p>
          </div>
          <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
            <span className="text-xl">🔬</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">NEET Prep</p>
          </div>
          <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
            <span className="text-xl">🤖</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">AI-Powered</p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-5">
          By signing in, you agree to our{" "}
          <a href="#" className="text-accent hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-accent hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}
