import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Sanitizes href values to block dangerous URI schemes.
 * Only allows http:, https:, and mailto: protocols.
 */
function sanitizeHref(href) {
  if (!href || typeof href !== 'string') return undefined;
  const trimmed = href.trim().toLowerCase();
  if (trimmed.startsWith('http:') || trimmed.startsWith('https:') || trimmed.startsWith('mailto:')) {
    return href;
  }
  // Block javascript:, data:, vbscript:, and any other schemes
  return undefined;
}

/** Custom renderers to enforce link safety on LLM-generated markdown */
const secureComponents = {
  a: ({ href, children, ...props }) => {
    const safeHref = sanitizeHref(href);
    if (!safeHref) return <span>{children}</span>;
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }) => {
    const safeSrc = sanitizeHref(src);
    if (!safeSrc) return <span>[image blocked]</span>;
    return <img src={safeSrc} alt={alt || ''} loading="lazy" {...props} />;
  }
};

function ChatMessage({ role, text, timestamp }) {
  const isUser = role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'ai'}`}>
      {/* AI avatar indicator */}
      {!isUser && (
        <div className="message-avatar" aria-hidden="true">
          <img src="/src/assets/branding/favicon-32x32.png" alt="" width="16" height="16" />
        </div>
      )}

      <div className="bubble-wrapper">
        <div className={`bubble ${isUser ? 'user' : 'ai'}`}>
          {isUser ? (
            text
          ) : (
            <div className="md-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={secureComponents}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {timestamp && (
          <div className={`timestamp ${isUser ? 'user' : 'ai'}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;