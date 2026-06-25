import createError from 'http-errors';

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

export function validateContactPayload(payload) {
  const { name, email, subject, feedbackType, message } = payload || {};
  
  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    throw createError(400, 'Invalid name. Must be between 1 and 100 characters.');
  }
  if (!isValidEmail(email) || email.length > 100) {
    throw createError(400, 'Invalid email address.');
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 150) {
    throw createError(400, 'Invalid subject. Must be between 1 and 150 characters.');
  }
  const validFeedbackTypes = ['General Inquiry', 'Security Concern', 'Bug Report', 'Feature Request'];
  if (!validFeedbackTypes.includes(feedbackType)) {
    throw createError(400, 'Invalid feedback type.');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 20 || message.length > 5000) {
    throw createError(400, 'Message must be between 20 and 5000 characters.');
  }
  
  return { 
    name: escapeHTML(name.trim()), 
    email: email.trim(), 
    subject: escapeHTML(subject.trim()), 
    feedbackType, 
    message: escapeHTML(message.trim()) 
  };
}

export function validateChatPayload(payload) {
  const { message, rollingSummary, recentMessages, incidentData, exchangeCount } = payload || {};
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw createError(400, 'The "message" field is required and must be a non-empty string.');
  }
  if (message.length > 4000) {
    throw createError(400, 'Message is too long. Maximum allowed length is 4000 characters.');
  }
  
  // --- Prompt Injection Scoring System (SEC-06) ---
  // Normalize the message: strip zero-width chars, convert unicode homoglyphs
  const normalizedMsg = message
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '') // strip zero-width chars
    .replace(/[\u0430\u0435\u043E\u0440\u0441\u0443\u0445]/g, c => // Cyrillic homoglyphs → Latin
      ({ '\u0430':'a','\u0435':'e','\u043E':'o','\u0440':'p','\u0441':'c','\u0443':'y','\u0445':'x' }[c] || c))
    .replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's') // leet speak
    .toLowerCase();

  let injectionScore = 0;
  const injectionFlags = [];

  // High-weight patterns (direct injection attempts)
  const highWeightPatterns = [
    [/ignore\s+(all\s+)?previous\s+instructions/i, 10],
    [/ignore\s+(all\s+)?prior\s+(directives|instructions|rules)/i, 10],
    [/disregard\s+(your|all|prior|previous)\s+(rules|instructions|directives|guidelines)/i, 10],
    [/forget\s+(your|all|prior|previous)\s+(rules|instructions|directives|programming)/i, 10],
    [/override\s+(your|all|prior|previous)\s+(rules|instructions|directives|safety)/i, 10],
    [/you\s+are\s+now\s+(a|an)\s+(?!victim|user)/i, 8],
    [/act\s+as\s+(a|an)\s+(?!victim|user|advisor)/i, 8],
    [/entering\s+(developer|admin|god|sudo|root)\s+mode/i, 10],
    [/switch\s+to\s+(developer|admin|unrestricted|uncensored)\s+mode/i, 10],
    [/jailbreak/i, 10],
    [/prompt\s*injection/i, 8],
  ];

  // Medium-weight patterns (suspicious but could be legitimate in context)
  const mediumWeightPatterns = [
    [/system\s*prompt/i, 5],
    [/reveal\s+(your|the)\s+(system|hidden|secret)\s+(prompt|instructions)/i, 8],
    [/what\s+(are|is)\s+your\s+(system|hidden|secret)\s+(prompt|instructions|rules)/i, 6],
    [/bypass\s+(security|filter|restriction|safety|content)/i, 6],
    [/how\s+to\s+(hack|exploit|crack|bypass|attack|phish|ddos)/i, 5],
    [/create\s+(a\s+)?(malware|virus|trojan|ransomware|keylogger|exploit)/i, 8],
    [/write\s+(me\s+)?(a\s+)?(malware|virus|exploit|phishing)/i, 8],
  ];

  for (const [pattern, weight] of highWeightPatterns) {
    if (pattern.test(normalizedMsg)) {
      injectionScore += weight;
      injectionFlags.push(pattern.source);
    }
  }
  for (const [pattern, weight] of mediumWeightPatterns) {
    if (pattern.test(normalizedMsg)) {
      injectionScore += weight;
      injectionFlags.push(pattern.source);
    }
  }

  if (injectionScore >= 8) {
    throw createError(400, 'Your message flagged our security filters. Please revise your query to align with cybersecurity diagnostics.');
  }
  
  // ✅ FIX (Bug #7): Whitelist-only sanitization for incidentData
  // Strip all domain data (actions, laws, evidence, reporting) — server regenerates these
  const sanitizedIncidentData = (() => {
    if (typeof incidentData !== 'object' || incidentData === null || Array.isArray(incidentData)) return null;
    
    const allowedCategories = [
      'Phishing', 'Smishing', 'Vishing', 'Financial Fraud', 'Identity Theft',
      'Social Media Account Compromise', 'Malware Infection', 'Ransomware',
      'Data Breach', 'Cyber Bullying', 'Online Harassment', 'Sextortion',
      'Fake Job Scam', 'Investment Scam', 'UPI Fraud', 'Online Gaming Violation', 
      'Deepfake / SGI Abuse', 'SIM Hijacking / OTT Remote Hijack', 'Unknown'
    ];
    const allowedSeverities = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];
    const allowedStatuses = ['Open', 'Monitoring', 'Contained', 'Escalated', 'Resolved'];

    // Only trust scalar classification metadata — everything else is regenerated server-side
    return {
      classified: incidentData.classified === true,
      category: allowedCategories.includes(incidentData.category) ? incidentData.category : null,
      severity: allowedSeverities.includes(incidentData.severity) ? incidentData.severity : null,
      risk: allowedSeverities.includes(incidentData.risk) ? incidentData.risk : null,
      status: allowedStatuses.includes(incidentData.status) ? incidentData.status : null,
      confidence: (typeof incidentData.confidence === 'number' && incidentData.confidence >= 0 && incidentData.confidence <= 100) 
        ? Math.floor(incidentData.confidence) : 0,
      timestamp: typeof incidentData.timestamp === 'string' ? incidentData.timestamp.substring(0, 30) : null
    };
  })();

  return { 
    message: message.trim(),
    rollingSummary: typeof rollingSummary === 'string' ? rollingSummary.substring(0, 5000) : '',
    recentMessages: Array.isArray(recentMessages)
      ? recentMessages.slice(0, 10).map(msg => {
          const text = typeof msg.text === 'string' ? msg.text.substring(0, 2000) : '';
          const role = msg.role === 'user' ? 'user' : 'assistant';
          return { role, text };
        })
      : [],
    incidentData: sanitizedIncidentData,
    // Per-user session limit: max 100 exchanges
    exchangeCount: (typeof exchangeCount === 'number' && Number.isInteger(exchangeCount) && exchangeCount >= 0 && exchangeCount <= 100)
      ? exchangeCount : 0
  };
}

export function validateSummaryPayload(payload) {
  const { currentSummary, recentMessages } = payload || {};
  
  if (!Array.isArray(recentMessages) || recentMessages.length === 0) {
    throw createError(400, 'Invalid or empty recentMessages array.');
  }

  const sanitizedMessages = recentMessages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    text: typeof msg.text === 'string' ? msg.text.substring(0, 4000) : ''
  }));

  return {
    currentSummary: typeof currentSummary === 'string' ? currentSummary.substring(0, 10000) : '',
    recentMessages: sanitizedMessages
  };
}
