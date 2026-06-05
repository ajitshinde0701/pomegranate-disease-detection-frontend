import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/voiceAssistant.css";

export default function VoiceAssistant() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const getVoiceLang = () => {
    if (i18n.language === "mr") return "mr-IN";
    if (i18n.language === "hi") return "hi-IN";
    return "en-IN";
  };

  const speakText = (content) => {
    if (!content || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = getVoiceLang();
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const readCurrentPage = () => {
    const selectors = [
      "h1",
      "h2",
      "h3",
      "p",
      "button",
      "a",
      "label",
      ".info-card",
      ".dashboard-card",
      ".stat-card"
    ];

    const elements = document.querySelectorAll(selectors.join(","));

    const pageText = Array.from(elements)
      .map((el) => el.innerText?.trim())
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(". ");

    speakText(pageText);
  };

  const speakTypedText = () => {
    speakText(text);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <>
      <button className="voice-float-btn" onClick={() => setOpen(!open)}>
        🎙
      </button>

      {open && (
        <div className="voice-panel">
          <div className="voice-header">
            <h3>Voice Assistant</h3>
            <button onClick={() => setOpen(false)}>×</button>
          </div>

          <p>
            Read the full page UI or type custom text to speak in selected language.
          </p>

          <button className="read-page-btn" onClick={readCurrentPage}>
            📖 Read Current Page
          </button>

          <textarea
            placeholder="Type text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="voice-actions">
            <button className="speak-btn" onClick={speakTypedText}>
              🔊 Speak Text
            </button>

            <button className="stop-btn" onClick={stop}>
              ⏹ Stop
            </button>
          </div>
        </div>
      )}
    </>
  );
}