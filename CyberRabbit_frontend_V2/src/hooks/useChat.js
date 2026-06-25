import { useCallback, useMemo, useState } from 'react';

import { sendChatMessage, generateSummary } from '../services/api.js';
import { clearSessionMessages, loadSessionMessages, saveSessionMessages } from '../utils/storage.js';

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function useChat() {
  const [messages, setMessages] = useState(() => loadSessionMessages());
  const [rollingSummary, setRollingSummary] = useState(() => sessionStorage.getItem('rollingSummary') || '');
  const [incidentData, setIncidentData] = useState(() => {
    try {
      const stored = sessionStorage.getItem('incidentData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [exchangeCount, setExchangeCount] = useState(() => {
    return Number(sessionStorage.getItem('exchangeCount') || '0');
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const persist = useCallback((nextMessages) => {
    setMessages(nextMessages);
    saveSessionMessages(nextMessages);
  }, []);

  const sendMessage = useCallback(async (input) => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setError('');
    const userMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed, timestamp: nowTime() };
    const optimistic = [...messages, userMessage];
    persist(optimistic);
    setIsLoading(true);

    try {
      const recentMessages = messages.slice(-4).map(m => ({ role: m.role, text: m.text }));
      const { reply, incidentData: newIncidentData } = await sendChatMessage(trimmed, rollingSummary, recentMessages, incidentData, exchangeCount);
      
      if (newIncidentData && newIncidentData.classified) {
        setIncidentData(newIncidentData);
        sessionStorage.setItem('incidentData', JSON.stringify(newIncidentData));
      }
      
      const newCount = exchangeCount + 1;
      setExchangeCount(newCount);
      sessionStorage.setItem('exchangeCount', newCount.toString());
      
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: reply,
        timestamp: nowTime(),
        meta: {
          memoryHook: true,
          citationsHook: true,
          toolsHook: true
        }
      };
      
      const finalMessages = [...optimistic, assistantMessage];
      persist(finalMessages);

      const messagesToSummarize = [
        { role: 'user', text: trimmed },
        { role: 'assistant', text: reply }
      ];
      
      generateSummary(rollingSummary, messagesToSummarize).then(newSummary => {
        setRollingSummary(newSummary);
        sessionStorage.setItem('rollingSummary', newSummary);
      });

    } catch (sendError) {
      setError(sendError.message || 'Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, persist, rollingSummary, incidentData, exchangeCount]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setRollingSummary('');
    setIncidentData(null);
    setExchangeCount(0);
    sessionStorage.removeItem('rollingSummary');
    sessionStorage.removeItem('incidentData');
    sessionStorage.removeItem('exchangeCount');
    clearSessionMessages();
    setError('');
  }, []);

  return useMemo(() => ({
    messages,
    isLoading,
    error,
    incidentData,
    sendMessage,
    clearChat
  }), [messages, isLoading, error, incidentData, sendMessage, clearChat]);
}
