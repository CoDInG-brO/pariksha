"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Student Name",
    email: "student@email.com",
    phone: "+91 9876543210",
    address: "Mumbai, Maharashtra",
    dateOfBirth: "2000-01-01",
    targetExam: "CAT"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">✏️ Edit Profile</h1>
        <p className="text-gray-400 mb-8">Update your personal information</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 sticky top-28">
              <h3 className="text-white font-bold mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold text-4xl mb-4 border-4 border-white/20">
                  👤
                </div>
                <button className="px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent font-medium transition-colors mb-2">
                  Change Photo
                </button>
                <button className="px-4 py-2 text-red-400 hover:text-red-300 text-sm transition-colors">
                  Remove Photo
                </button>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Target Exam</label>
                  <select
                    value={formData.targetExam}
                    onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="CAT">CAT</option>
                    <option value="NEET">NEET</option>
                    <option value="BOTH">Both CAT & NEET</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white font-semibold transition-all"
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
