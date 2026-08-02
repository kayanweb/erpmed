/**
 * Audio Alerts and Speech Synthesis Utility for ProNurse HIS
 * Synthesizes high-fidelity medical chime sounds and text-to-speech warnings
 */

export function playMedicalBeep(type: "critical" | "warning" | "info" | "success" = "info") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === "critical") {
      // Urgent Code Blue: Staggered double-high tone warning loop
      const now = ctx.currentTime;
      [0, 0.15, 0.3, 0.45, 0.6].forEach((timeOffset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, now + timeOffset); // B5 note
        gain.gain.setValueAtTime(0.25, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.12);
      });
    } else if (type === "warning") {
      // Cautionary alert: Dual-frequency minor third alarm
      const now = ctx.currentTime;
      [0, 0.25].forEach((timeOffset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(idx === 0 ? 587.33 : 493.88, now + timeOffset); // D5 to B4
        gain.gain.setValueAtTime(0.2, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.2);
      });
    } else if (type === "success") {
      // Pleasant upward major arpeggio chime
      const now = ctx.currentTime;
      [0, 0.1, 0.2].forEach((timeOffset, idx) => {
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequencies[idx], now + timeOffset);
        gain.gain.setValueAtTime(0.15, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.25);
      });
    } else {
      // Gentle info/reminder double-chime
      const now = ctx.currentTime;
      [0, 0.12].forEach((timeOffset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(idx === 0 ? 523.25 : 659.25, now + timeOffset); // C5 to E5
        gain.gain.setValueAtTime(0.12, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.18);
      });
    }
  } catch (error) {
    console.warn("Medical chime audio synthesis failed (interaction required first):", error);
  }
}

export function speakAlert(textAr: string, textEn: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    // Cancel currently speaking lines
    window.speechSynthesis.cancel();
    
    const isArabic = /[\u0600-\u06FF]/.test(textAr);
    const utterance = new SpeechSynthesisUtterance(isArabic ? textAr : textEn);
    utterance.lang = isArabic ? "ar-EG" : "en-US";
    utterance.rate = 1.05;
    utterance.volume = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Text-to-speech engine warning:", e);
  }
}
