"use client";
import { useEffect, useRef, useState } from "react";

interface WebcamPreviewProps {
  isActive: boolean;
}

export default function WebcamPreview({ isActive }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Stop camera when not active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    // Start camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 160, height: 120, facingMode: "user" }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setHasPermission(true);
      } catch (error) {
        console.error("Camera error:", error);
        setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  if (hasPermission === false) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-40 h-32 bg-gray-800 rounded-lg border-2 border-red-500 flex items-center justify-center">
        <span className="text-red-400 text-xs text-center px-2">Camera access denied</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative rounded-lg overflow-hidden border-2 border-green-500 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-40 h-32 object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-white bg-black/50 px-1 rounded">REC</span>
        </div>
      </div>
    </div>
  );
}
