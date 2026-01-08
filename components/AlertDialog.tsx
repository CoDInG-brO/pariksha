"use client";
import { useEffect } from "react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export default function AlertDialog({ isOpen, onClose, title = "⚠️ Warning", message }: AlertDialogProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl p-8 max-w-md mx-4 border border-gray-200 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="text-5xl mb-4">{title.includes("⚠️") ? "⚠️" : "ℹ️"}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {title.replace("⚠️", "").trim() || "Warning"}
          </h3>
          <p className="text-gray-700 text-lg mb-8">{message}</p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all shadow-md"
          >
            OK, Got it
          </button>
        </div>
      </div>
    </div>
  );
}
