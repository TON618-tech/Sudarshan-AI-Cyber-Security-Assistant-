import { useEffect, useRef, useCallback } from 'react';
import welcomeAudioSrc from '../assets/audio/Welcomeflute.mp3';

const AUDIO_SESSION_KEY = 'sudarshan_audio_played';

export function useWelcomeAudio(volume = 0.4) {
  const audioRef = useRef(null);

  // Initialize audio lazily so it doesn't burden the initial page load
  useEffect(() => {
    // Check if we've already played it this session
    const hasPlayed = sessionStorage.getItem(AUDIO_SESSION_KEY);
    
    if (!hasPlayed && !audioRef.current) {
      const audio = new Audio(welcomeAudioSrc);
      audio.volume = volume;
      // Do not set loop, ensure it only plays once
      audioRef.current = audio;
    }

    return () => {
      // Cleanup if the component unmounts before playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [volume]);

  const playWelcomeAudio = useCallback(() => {
    const hasPlayed = sessionStorage.getItem(AUDIO_SESSION_KEY);
    
    if (!hasPlayed && audioRef.current) {
      try {
        // Triggering play() directly inside a user onClick event bypasses Autoplay restrictions
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Mark as played so it never repeats in this session
              sessionStorage.setItem(AUDIO_SESSION_KEY, 'true');
            })
            .catch(error => {
              console.warn('[WelcomeAudio] Autoplay was prevented or failed:', error);
            });
        }
      } catch (err) {
        console.warn('[WelcomeAudio] Synchronous play failed:', err);
      }
    }
  }, []);

  return { playWelcomeAudio };
}
