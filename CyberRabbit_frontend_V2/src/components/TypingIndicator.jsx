function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-live="polite">
      <div className="message-avatar" aria-hidden="true">
        <img src="/src/assets/branding/favicon-32x32.png" alt="" width="16" height="16" />
      </div>
      <div className="typing-bubble">
        <span className="typing-text">Analyzing your concern</span>
        <div className="typing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
