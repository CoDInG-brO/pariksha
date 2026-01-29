"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";
const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";

const defaultProfile = {
  name: "Student Name",
  email: "student@email.com",
  phone: "+91 9876543210",
  address: "Mumbai, Maharashtra",
  dateOfBirth: "2000-01-01",
  targetExam: "JEE"
};

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(defaultProfile);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData({ ...defaultProfile, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved profile:", e);
      }
    }
    // Load profile photo
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      
      // Compress image using canvas
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas and compress
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          const maxDimension = 400;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with quality 0.7 to reduce size
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setProfilePhoto(compressedBase64);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
    // Save photo to localStorage
    if (profilePhoto) {
      localStorage.setItem(PROFILE_PHOTO_KEY, profilePhoto);
    } else {
      localStorage.removeItem(PROFILE_PHOTO_KEY);
    }
    // Dispatch storage event to update navbar and other components in real-time
    window.dispatchEvent(new Event('storage'));
    setShowSuccessDialog(true);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.back();
  };

  return (
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDialogClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-elevated rounded-2xl border border-white/10 shadow-2xl p-6 text-center w-full max-w-sm pointer-events-auto">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Profile Updated!</h3>
                <p className="text-gray-400 text-sm mb-5">Your profile has been updated successfully.</p>
                <button
                  onClick={handleDialogClose}
                  className="w-full h-7 px-3 text-[10px] bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">✏️ Edit Profile</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 mb-4">Update your personal information</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold text-4xl mb-4 border-4 border-white/20">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent font-medium transition-colors mb-2"
                >
                  {profilePhoto ? "Change Photo" : "Upload Photo"}
                </button>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-4 py-2 text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Remove Photo
                  </button>
                )}
                <p className="text-gray-500 text-xs mt-2 text-center">Max size: 2MB</p>
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
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="BOTH">Both JEE & NEET</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-2 px-5 text-sm bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer border-0"
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
