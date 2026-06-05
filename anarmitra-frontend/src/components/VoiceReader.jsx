import { useTranslation } from "react-i18next";
import { speakText, stopSpeaking } from "../utils/speechHelper";

export default function VoiceReader({ children, text }) {
  const { i18n } = useTranslation();

  const handleMouseEnter = () => {
    speakText(text || children, i18n.language);
  };

  const handleMouseLeave = () => {
    stopSpeaking();
  };

  return (
    <span
      className="voice-reader"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
}