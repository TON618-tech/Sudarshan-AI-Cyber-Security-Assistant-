export function redactSensitiveData(text) {
  if (!text || typeof text !== 'string') return text;

  let redacted = text;

  // 1. Credit Cards (13-19 digits, possibly with spaces/dashes)
  const ccRegex = /\b(?:(?:\d[ -]*?){13,19})\b/g;
  
  // 2. API Keys / Bearer Tokens (sk-..., Bearer ...)
  const apiRegex = /\b(?:sk-[a-zA-Z0-9]{20,}|Bearer\s+[A-Za-z0-9\-\._~+\/]+=*)\b/g;
  
  // 3. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  
  // 4. OTP / PINs
  const otpRegex = /(?:\b(?:otp|pin|password|pwd|code|cvv)\b[\s:=]+)[A-Za-z0-9@#\$%\^&\*\(\)\-_!\+]{4,}/gi;

  // 5. Aadhaar Numbers (12 digits, optional spaces/dashes)
  const aadhaarRegex = /\b(?:\d{4}[ -]?\d{4}[ -]?\d{4})\b/g;

  // 6. PAN Numbers (5 letters, 4 numbers, 1 letter)
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;

  // 7. Indian Mobile Numbers (+91 or 0 followed by 10 digits, or just 10 digits starting with 6-9)
  const mobileRegex = /\b(?:\+91[-.\s]?|0)?(?:[6-9]\d{9})\b/g;

  // 8. IPv4 and IPv6 Addresses
  const ipv4Regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const ipv6Regex = /\b(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\b/g;

  // 9. UPI IDs (e.g. name@bank)
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g;

  // 10. IFSC Codes (4 letters, 0, 6 characters)
  const ifscRegex = /\b[A-Z]{4}0[A-Z0-9]{6}\b/gi;

  // 11. Bank Account Numbers (9 to 18 digits)
  // To avoid catching simple numbers like dates, we prefix with context words
  const bankAccountRegex = /(?:\b(?:acct|account|a\/c|bank account)\b[\s:#]*)\b(\d{9,18})\b/gi;

  redacted = redacted.replace(ccRegex, '[REDACTED]');
  redacted = redacted.replace(apiRegex, '[REDACTED]');
  redacted = redacted.replace(emailRegex, '[REDACTED]');
  redacted = redacted.replace(aadhaarRegex, '[REDACTED]');
  redacted = redacted.replace(panRegex, '[REDACTED]');
  redacted = redacted.replace(mobileRegex, '[REDACTED]');
  redacted = redacted.replace(ipv4Regex, '[REDACTED]');
  redacted = redacted.replace(ipv6Regex, '[REDACTED]');
  redacted = redacted.replace(upiRegex, '[REDACTED]');
  redacted = redacted.replace(ifscRegex, '[REDACTED]');
  
  redacted = redacted.replace(otpRegex, (match) => {
    const prefix = match.split(/[\s:=]+/)[0];
    return `${prefix} [REDACTED]`;
  });
  
  redacted = redacted.replace(bankAccountRegex, (match, p1) => {
    return match.replace(p1, '[REDACTED]');
  });

  return redacted;
}
