// Sound effects utility using Web Audio API
// No external files needed - generates tones programmatically

let audioContext: AudioContext | null = null;

// Initialize AudioContext (must be called after user interaction)
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Play a success/correct sound (pleasant ascending tone)
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.log("Audio not available");
  }
}

// Play an incorrect/wrong sound (descending tone)
export function playIncorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
    oscillator.frequency.setValueAtTime(293.66, ctx.currentTime + 0.15); // D4
    
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (error) {
    console.log("Audio not available");
  }
}

// Check if sound effects are enabled in localStorage
export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const settings = localStorage.getItem("pariksha_settings");
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      return parsed.soundEffects ?? false;
    } catch {
      return false;
    }
  }
  return false;
}

// Save sound settings
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  const settings = localStorage.getItem("pariksha_settings");
  let parsed: Record<string, any> = {};
  if (settings) {
    try {
      parsed = JSON.parse(settings);
    } catch {
      parsed = {};
    }
  }
  parsed.soundEffects = enabled;
  localStorage.setItem("pariksha_settings", JSON.stringify(parsed));
}
