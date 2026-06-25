const DEFAULT_TIMEOUT_MS = 20000;

class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generates HMAC-SHA256 request signature for API authentication.
 * Signs: timestamp:METHOD:path
 */
async function generateRequestSignature(method, url) {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) return {};

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const urlPath = new URL(url).pathname;
  const signaturePayload = `${timestamp}:${method.toUpperCase()}:${urlPath}`;

  // Use Web Crypto API for HMAC-SHA256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiKey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(signaturePayload));
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    'X-API-Key': apiKey,
    'X-Request-Timestamp': timestamp,
    'X-Request-Signature': signature
  };
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS, retries = 2) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const authHeaders = await generateRequestSignature(
        options.method || 'GET',
        url
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(options.headers || {})
        }
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const backendMessage = payload?.error || payload?.message;
        throw new ApiError(backendMessage || `Request failed with status ${response.status}`, response.status);
      }

      clearTimeout(timeoutId);
      return payload;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        lastError = new ApiError('Request timed out. Please try again in a moment.', 408);
      } else if (error instanceof ApiError) {
        lastError = error;
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }
      } else {
        lastError = new ApiError('Unable to reach backend. Ensure server is running on the configured URL.', 503);
      }
      
      if (i < retries) {
        const backoffMs = Math.pow(2, i) * 500;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }
  
  throw lastError;
}

export async function sendChatMessage(message, rollingSummary = '', recentMessages = [], incidentData = null, exchangeCount = 0) {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    throw new ApiError('Missing VITE_API_URL configuration.', 500);
  }

  const payload = await fetchWithTimeout(`${baseUrl}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, rollingSummary, recentMessages, incidentData, exchangeCount })
  });

  if (!payload?.success || typeof payload?.data?.reply !== 'string') {
    throw new ApiError('Malformed backend response.', 502);
  }

  return {
    reply: payload.data.reply,
    incidentData: payload.data.incidentData || null
  };
}

export async function generateSummary(currentSummary = '', recentMessages = []) {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) return currentSummary;

  try {
    const payload = await fetchWithTimeout(`${baseUrl}/chat/summary`, {
      method: 'POST',
      body: JSON.stringify({ currentSummary, recentMessages })
    }, 15000);
    
    if (payload?.success && typeof payload?.data?.summary === 'string') {
      return payload.data.summary;
    }
  } catch (err) {
    console.warn('Background summary generation failed, falling back to previous state.', err);
  }
  return currentSummary;
}

export { ApiError };
