import { useCallback, useEffect, useRef, useState } from 'react';

import ChatMessage from '../components/ChatMessage.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';
import InvestigationPanel from '../components/InvestigationPanel.jsx';
import { useChat } from '../hooks/useChat.js';

const SUGGESTIONS = [
  { icon: '🔗', text: 'I received a suspicious link on WhatsApp' },
  { icon: '🆔', text: 'Someone is using my Aadhaar number' },
  { icon: '🚨', text: 'How do I report cybercrime in India?' },
  { icon: '⚖️', text: 'What are my rights under IT Act 2000?' }
];

function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, incidentData, sendMessage, clearChat } = useChat();
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, incidentData]);

  /* Auto-resize textarea */
  const handleTextareaInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    /* Reset textarea height */
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(trimmed);
  };

  const handleSuggestion = (text) => {
    setInput(text);
    sendMessage(text);
  };

  return (
    <section className="page page-chat">
      {/* Chat header bar */}
      <div className="chat-header">
        <div className="chat-title-group">
          <h1 className="chat-title">Sudarshan AI</h1>
        </div>

        <button
          type="button"
          className="ghost-btn"
          onClick={clearChat}
          disabled={isLoading || messages.length === 0}
        >
          Clear Chat
        </button>
      </div>

      {/* Investigation Workspace */}
      <InvestigationPanel incidentData={incidentData} />

      {/* Chat messages */}
      <div className="chat-window" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon" aria-hidden="true">
              <img src="/src/assets/branding/apple-touch-icon.png" alt="" width="26" height="26" style={{ opacity: 0.9 }} />
            </div>
            <div className="chat-empty-text">
              <h2>How can I help you stay safe?</h2>
              <p>
                Describe your cybersecurity concern and I'll guide you
                through the next steps.
              </p>
            </div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  className="suggestion-card"
                  onClick={() => handleSuggestion(s.text)}
                >
                  <span className="suggestion-icon">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              text={message.text}
              timestamp={message.timestamp}
            />
          ))
        )}

        {isLoading && <TypingIndicator />}
      </div>

      {/* Error display */}
      {error && (
        <div className="chat-error">
          <p className="error-banner">{error}</p>
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            placeholder="Describe your concern..."
            rows={1}
            disabled={isLoading}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
          />

          <button
            type="submit"
            className="send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChatPage;