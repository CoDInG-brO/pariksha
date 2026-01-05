"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: "🎯",
      title: "Adaptive Learning",
      description: "AI analyzes your performance and creates personalized study plans that focus on your weak areas."
    },
    {
      icon: "📊",
      title: "Real Exam Simulation",
      description: "Experience the exact exam pattern, timing, and pressure of actual CAT and NEET exams."
    },
    {
      icon: "📈",
      title: "Detailed Analytics",
      description: "Track your progress with comprehensive insights, percentile predictions, and performance trends."
    },
    {
      icon: "🧠",
      title: "Smart Question Bank",
      description: "Access 50,000+ curated questions with varying difficulty levels and detailed explanations."
    },
    {
      icon: "⚡",
      title: "Instant Feedback",
      description: "Get immediate explanations and learn from mistakes with AI-powered answer analysis."
    },
    {
      icon: "🏆",
      title: "Compete & Compare",
      description: "See where you stand among thousands of aspirants with real-time leaderboards."
    }
  ];

  const examFeatures = {
    cat: [
      "Quantitative Aptitude with 2000+ problems",
      "Verbal Ability & Reading Comprehension",
      "Data Interpretation & Logical Reasoning",
      "Sectional and full-length mock tests",
      "IIM-specific question patterns",
      "Time management strategies"
    ],
    neet: [
      "Physics with NCERT-aligned content",
      "Chemistry - Organic, Inorganic & Physical",
      "Biology - Botany & Zoology coverage",
      "Previous year question analysis",
      "AIIMS & JIPMER pattern questions",
      "Chapter-wise practice tests"
    ]
  };

  const stats = [
    { value: "50,000+", label: "Practice Questions" },
    { value: "1,00,000+", label: "Students Enrolled" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "500+", label: "Top Rankers" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {/* Book Stack SVG Logo */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="6" width="6" height="20" rx="1" transform="rotate(-12 4 6)" fill="#FB923C" />
              <rect x="5.5" y="8" width="3" height="14" rx="0.5" transform="rotate(-12 5.5 8)" fill="#FDBA74" />
              <rect x="11" y="4" width="6" height="22" rx="1" fill="#22C55E" />
              <rect x="12.5" y="6" width="3" height="16" rx="0.5" fill="#86EFAC" />
              <rect x="18" y="8" width="5" height="18" rx="1" fill="#EAB308" />
              <rect x="19.2" y="10" width="2.5" height="12" rx="0.5" fill="#FDE047" />
              <rect x="24" y="10" width="5" height="16" rx="1" fill="#06B6D4" />
              <rect x="25.2" y="12" width="2.5" height="10" rx="0.5" fill="#67E8F9" />
            </svg>
            <span className="font-bold text-xl text-white">Pariksha</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white font-semibold transition-all shadow-lg shadow-accent/30"
            >
              Get Started Free
            </button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              🚀 Trusted by 1,00,000+ aspirants across India
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Crack <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">CAT & NEET</span>
            <br />with AI-Powered Preparation
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Experience the most advanced exam preparation platform. Personalized learning paths, 
            real exam simulations, and intelligent analytics to maximize your score.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-xl text-white font-semibold text-lg transition-all shadow-xl shadow-accent/30 flex items-center gap-2"
            >
              Start Free Trial <span>→</span>
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold text-lg transition-all border border-white/10"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Pariksha?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and helps you prepare more efficiently than ever before.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-surface to-elevated p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-all group"
              >
                <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span style={{ fontSize: '2.5rem' }}>{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam-Specific Section */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Exam Coverage</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Specialized preparation for India's most competitive exams with exam-specific strategies and content.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* CAT Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/10 p-8 rounded-2xl border border-orange-500/30 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  📊
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">CAT Preparation</h3>
                  <p className="text-orange-300">For IIM & Top B-School Aspirants</p>
                </div>
              </div>
              <ul className="space-y-3">
                {examFeatures.cat.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-orange-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/signup")}
                className="mt-8 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-white font-semibold transition-all"
              >
                Start CAT Prep →
              </button>
            </motion.div>

            {/* NEET Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/20 to-teal-500/10 p-8 rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🔬
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">NEET Preparation</h3>
                  <p className="text-green-300">For Medical College Aspirants</p>
                </div>
              </div>
              <ul className="space-y-3">
                {examFeatures.neet.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/signup")}
                className="mt-8 w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-xl text-white font-semibold transition-all"
              >
                Start NEET Prep →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of successful aspirants who cracked their dream exams with Pariksha.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                exam: "CAT 2025 - 99.5%ile",
                college: "IIM Ahmedabad",
                quote: "Pariksha's AI-powered analytics helped me identify my weak areas. The personalized study plan was a game-changer!"
              },
              {
                name: "Rahul Verma",
                exam: "NEET 2025 - AIR 156",
                college: "AIIMS Delhi",
                quote: "The question bank is incredibly comprehensive. Every question I faced in NEET, I had already practiced here."
              },
              {
                name: "Ananya Patel",
                exam: "CAT 2025 - 99.2%ile",
                college: "IIM Bangalore",
                quote: "Mock tests with real exam interface gave me the confidence I needed. Highly recommend for serious aspirants!"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-surface to-elevated p-6 rounded-2xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-accent text-sm">{testimonial.exam}</p>
                  </div>
                </div>
                <p className="text-gray-400 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-500 text-sm">Now at {testimonial.college}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-accent/20 to-blue-600/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join 1,00,000+ aspirants already preparing with Pariksha. 
              Start your free trial today – no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="px-10 py-4 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-xl text-white font-semibold text-lg transition-all shadow-xl shadow-accent/30"
              >
                Get Started Free →
              </button>
              <p className="text-gray-500 text-sm">✓ Free forever plan available</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-sm">📚</span>
              </div>
              <span className="font-bold text-white">Pariksha</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Vanna Infotech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
