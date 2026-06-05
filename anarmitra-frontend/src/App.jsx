import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import VoiceAssistant from "./components/VoiceAssistant";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <VoiceAssistant />
    </BrowserRouter>
  );
}

export default App;