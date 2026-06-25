export function logSecurityEvent(type, req, details = {}) {
  const reqId = req?.id || 'unknown-req';
  const ip = req?.ip || req?.headers?.['x-forwarded-for'] || 'unknown-ip';
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'WARN',
    type,
    reqId,
    ip,
    ...details
  };

  // Structured JSON logging for easy ingestion
  console.warn(JSON.stringify(logEntry));
}
