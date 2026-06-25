import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import ChatPage from './pages/ChatPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import AwarenessGateway from './components/AwarenessGateway.jsx';
import { useWelcomeAudio } from './hooks/useWelcomeAudio.js';

function App() {
  const { playWelcomeAudio } = useWelcomeAudio(0.3); // Set volume to 30% for a subtle effect

  // Global fallback trigger: If the user has already acknowledged the gateway in a past session,
  // the gateway won't appear. We catch their first click anywhere in the app to play the audio.
  useEffect(() => {
    const handleFirstInteraction = () => {
      playWelcomeAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [playWelcomeAudio]);

  return (
    <>
      <AwarenessGateway />
      <div className="app-shell">
        <div className="cyber-environment" aria-hidden="true">
          <div className="cyber-mesh" />
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
          <div className="ambient-orb orb-3" />
          <div className="ambient-orb orb-4" />
          <img src="/src/assets/branding/android-chrome-512x512.png" className="ambient-logo" alt="" />
          <div className="energy-waves" />
          <div className="atmospheric-particles" />
        </div>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
