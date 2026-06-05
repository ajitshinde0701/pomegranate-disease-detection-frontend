export const speakText = (text, lang = "en") => {
  if (!text || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (lang === "mr") utterance.lang = "mr-IN";
  else if (lang === "hi") utterance.lang = "hi-IN";
  else utterance.lang = "en-IN";

  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};