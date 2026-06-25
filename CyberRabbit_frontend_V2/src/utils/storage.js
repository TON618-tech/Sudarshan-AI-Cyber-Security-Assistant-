const CHAT_SESSION_KEY = 'sudarshan-ai-chat-v1';

export function loadSessionMessages() {
  try {
    const raw = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessionMessages(messages) {
  sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(messages));
}

export function clearSessionMessages() {
  sessionStorage.removeItem(CHAT_SESSION_KEY);
}
