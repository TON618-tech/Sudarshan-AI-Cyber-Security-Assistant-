import createError from 'http-errors';
import { getChatResponse, generateRollingSummary } from '../services/chatService.js';
import { validateChatPayload, validateSummaryPayload } from '../utils/validation.js';
import { processIntelligence } from '../intelligence/intelligenceService.js';
import { getImmediateActions } from '../intelligence/actionEngine.js';
import { getRelevantLaws } from '../intelligence/lawMappingEngine.js';
import { getEvidenceChecklist } from '../intelligence/evidenceEngine.js';
import { getReportingGuidance } from '../intelligence/reportingEngine.js';

/**
 * Detailed list of English and Hinglish keywords for HIGH Severity cyber incidents.
 * Includes financial fraud, extortion, deepfakes, SIM hijacks, malware, data breaches,
 * identity theft, and online gaming violations.
 */
const HIGH_SEVERITY_KEYWORDS = [
  // --- FINANCIAL FRAUD & BANKING SCAMS (ENGLISH) ---
  'money stolen',
  'unauthorized transaction',
  'unauthorized debit',
  'credit card fraud',
  'debit card fraud',
  'credit card hacked',
  'debit card hacked',
  'bank account hacked',
  'bank account compromised',
  'netbanking hacked',
  'netbanking compromised',
  'transaction fraud',
  'financial fraud',
  'online banking fraud',
  'bank fraud',
  'fraudulent transaction',
  'unauthorized withdrawal',
  'atm skimming',
  'unauthorized card usage',
  'money lost to scam',
  'sent money to scammer',
  'funds transferred unauthorized',
  'bank account drained',
  'savings stolen',
  'fraudulent transfer',
  'money deducted without otp',
  'money debited without permission',
  'credit card charge unauthorized',
  'savings account hacked',
  'salary stolen online',
  'provident fund fraud',
  'pension fraud online',
  'demat account hacked',
  'shares sold unauthorized',
  'mutual fund fraud',
  'insurance scam money lost',

  // --- FINANCIAL FRAUD & BANKING SCAMS (HINGLISH/HINDI) ---
  'paisa chori',
  'paisa chori ho gaya',
  'paisa kat gaya',
  'paisa fas gaya',
  'bank se paisa nikal gaya',
  'account khali ho gaya',
  'account se paise nikal liye',
  'dhokhadhadi',
  'paisa chala gaya',
  'upi fraud',
  'gpay fraud',
  'phonepe fraud',
  'paytm fraud',
  'bhim upi fraud',
  'paisa dhokhe se le liya',
  'loot liya',
  'thag liya',
  'fraud transaction ho gaya',
  'bank balance khatam',
  'khata se paisa gaya',
  'paisa double karne ka fraud',
  'paisa phas gaya',
  'paise chale gaye',
  'paise nikal liye',
  'khate se paise chale gaye',
  'account se paisa kat gaya',
  'bank se message aaya paise katne ka',
  'balance zero ho gaya',
  'upi pin daal diya fraud',
  'paisa send ho gaya galti se',
  'payment link scam',
  'paisa dene ke naam par lia',
  'atm se paisa gayab',
  'paisa phas gaya app me',

  // --- UPI & E-COMMERCE SCAMS (ENGLISH) ---
  'upi pin fraud',
  'upi transaction fraud',
  'gpay scam',
  'phonepe scam',
  'paytm scam',
  'request money scam',
  'collect request scam',
  'upi id hack',
  'fake upi id',
  'upi fraud money lost',
  'qr code scan fraud',
  'scanned qr code lost money',
  'e-commerce fraud',
  'fake shopping website',
  'ordered product received stone',
  'fake website refund scam',
  'courier delivery scam',
  'customs clearance fraud',
  'fedex courier scam',
  'unauthorized upi payment',
  'upi auto debit fraud',
  'upi mandate fraud',
  'merchant account fraud',
  'cashback scam',
  'scratch card upi scam',
  'paytm wallet fraud',
  'gift card fraud',
  'voucher code scam',

  // --- UPI & E-COMMERCE SCAMS (HINGLISH/HINDI) ---
  'upi pin daal diya',
  'qr code scan kiya paisa gaya',
  'cashback ke chakkar me paisa gaya',
  'refund nahi mila aur paisa kat gaya',
  'sasta saman dekh kar paisa gaya',
  'fake shopping site se fraud',
  'order kiya par mobile ki jagah pathar mila',
  'courier wale ne fraud kiya',
  'fedex se police call aaya',
  'custom duty ke naam par paisa liya',
  'customs officer banke loot liya',
  'parcel me drugs bolkar daraya',
  'parcel phas gaya bolke paisa liya',
  'upi pin leak ho gaya',
  'paytm scan karke dhokha',
  'gpay par scratch card scam',
  'paisa receive karne ke liye pin dala',
  'money receive ke liye upi pin',

  // --- PHISHING, SMISHING & VISHING (ENGLISH) ---
  'phishing link',
  'clicked on link',
  'clicked suspicious link',
  'phishing email',
  'phishing website',
  'fake login page',
  'smishing message',
  'vishing call',
  'fake bank call',
  'impersonating bank manager',
  'otp fraud',
  'otp shared',
  'unauthorized otp request',
  'sim clone otp',
  'kyc update scam',
  'pan card kyc update',
  'aadhaar card kyc update',
  'sim block warning link',
  'electricity bill update scam',
  'lottery winning link',
  'kbc lottery scam',
  'clicked link lost money',
  'entered credentials on website',
  'entered password on fake page',
  'fake support number',
  'customer care scam',
  'google maps fake number',
  'bank helpline scam',

  // --- PHISHING, SMISHING & VISHING (HINGLISH/HINDI) ---
  'link par click kiya',
  'link click karte hi paisa gaya',
  'kyc update karne ko bola',
  'bank manager ka call aaya',
  'electricity bill pay karne ko bola link se',
  'bijli bill block hone ka message',
  'sim block hone ka message',
  'sim verification kyc',
  'otp mang raha tha',
  'otp de diya',
  'otp share kar diya',
  'fake customer care',
  'google par number nikala fraud',
  'kbc lottery lagne ka whatsapp',
  'lottery wala message link',
  'bank se kyc call aaya',
  'pan card block hone ka link',
  'aadhaar link karne ka call',
  'wrong link daba diya',
  'message me link aaya tha',
  'whatsapp par link click kiya',

  // --- DEEPFAKES & SYNTHETIC MEDIA / SGI (ENGLISH) ---
  'deepfake',
  'deep fake',
  'ai face swap',
  'face swapped video',
  'synthetic video',
  'synthetic audio',
  'synthetically generated',
  'voice cloning',
  'voice cloned scam',
  'voice morphed',
  'morphed photo',
  'morphed video',
  'fake video call',
  'ai fake video',
  'manipulated media',
  'providence metadata',
  'synthetic information',
  'deceptive sgi',
  'unlawful sgi',
  'pre-publication verification sgi',
  'watermarked deepfake',
  'image morphed without consent',
  'face attached to video',
  'fake voice call money',
  'son voice cloned fraud',
  'relative voice cloned scam',
  'impersonation deepfake',
  'video manipulated using ai',
  'ai generator fraud',

  // --- DEEPFAKES & SYNTHETIC MEDIA / SGI (HINGLISH/HINDI) ---
  'photo morph kar di',
  'morphed photo banayi',
  'gandi photo me chehra lagaya',
  'face swap kar diya',
  'deepfake video banayi',
  'fake video call kar rha hai',
  'awaz badal kar call kiya',
  'ai se awaz copy ki',
  'morphed video se blackmail',
  'gandi video me mera face lagaya',
  'chehra badal diya video me',
  'awaz copy karke paise mange',
  'awaaz badli call par',
  'fake video viral karne ki dhamki',
  'morphed picture se darana',
  'photo edit karke ganda banaya',
  'chehra edit karke lagaya',
  'ai voice clone se dhokha',
  'bete ki awaz me call aaya',
  'fake awaz call scam',
  'morphed image banaya',

  // --- SIM HIJACKING & OTT ACC COMPROMISE (ENGLISH) ---
  'sim hijack',
  'sim hijacking',
  'sim binding',
  'sim bind violation',
  'sim swap',
  'sim swapped',
  'sim card deactivated',
  'no network on sim card',
  'sim card cloned',
  'ott account hijacked',
  'whatsapp hijacked remote',
  'telegram hijacked remote',
  'whatsapp web remote log',
  'whatsapp linking fraud',
  'compromised indian number',
  'remote web instance takeover',
  'unauthorized whatsapp linking',
  'unauthorized telegram session',
  'carrier logs intercept',
  'sim card replacement fraud',
  'lost sim signal signal fraud',
  'no service on phone scam',
  'carrier security compromise',
  'ott app remote hijack',

  // --- SIM HIJACKING & OTT ACC COMPROMISE (HINGLISH/HINDI) ---
  'sim block ho gaya apne aap',
  'sim chori ho gaya',
  'sim band ho gaya network gaya',
  'sim swap kar liya kisi ne',
  'whatsapp dusri jagah chal raha hai',
  'whatsapp hacked',
  'telegram hacked remote',
  'whatsapp web se hack',
  'whatsapp linked devices show remote',
  'whatsapp dusre phone me chal raha',
  'sim binding fail ho gaya',
  'mobile network chala gaya fraud',
  'sim card block karke otp churaya',
  'sim block hone se otp nahi aa rha',
  'whatsapp qr code scan karwa ke hack',
  'whatsapp link device fraud',
  'sim card badal diya',

  // --- ONLINE GAMING VIOLATIONS / PROG ACT (ENGLISH) ---
  'online gaming scam',
  'online money game',
  'money gaming platform',
  'betting platform',
  'online betting loss',
  'online gambling scam',
  'prog act 2025',
  'prog act violation',
  'online money game illegal',
  'gaming portal fraud',
  'wager lost scam',
  'speculative online game',
  'gaming influencer scam',
  'betting ad scam',
  'money gaming promotion',
  'gaming app blocked money',
  'gaming wallet withdrawal block',
  'online money gaming penalty',
  'ogai complaint',
  'online gaming authority',
  'gaming transaction block',
  'esports betting fraud',

  // --- ONLINE GAMING VIOLATIONS / PROG ACT (HINGLISH/HINDI) ---
  'online game me paisa hara',
  'online game wallet me paisa block',
  'gaming app ne withdrawal roka',
  'online money game fraud',
  'betting site me paisa lagaya',
  'betting app me loss',
  'gaming wallet hack',
  'money game me thag liya',
  'gaming ad dekh kar invest kiya',
  'gaming platform ne cheating ki',
  'game khel kar paisa phas gaya',
  'betting app promotion fake',
  'online betting me fraud',
  'ludo betting scam',
  'rummy money game fraud',
  'gaming id block kar di paise ke sath',
  'online gaming thag',

  // --- SEXTORTION & BLACKMAIL (ENGLISH) ---
  'sextortion',
  'blackmail',
  'sextortion video',
  'sextortion call',
  'leaked video threat',
  'nude video blackmail',
  'facebook friend video call scam',
  'threat to send video to family',
  'threat to upload video on youtube',
  'extortion demand',
  'money demanded blackmail',
  'viral on social media threat',
  'non-consensual intimate imagery',
  'ncii removal request',
  'cyber blackmailing',
  'threatening messages',
  'reputational damage threat',
  'facebook friends list threat',
  'whatsapp contacts blackmail',
  'extortionist blocked me',
  'sextortion money paid',

  // --- SEXTORTION & BLACKMAIL (HINGLISH/HINDI) ---
  'sextortion call aaya',
  'video call record kar li',
  'nude video banayi dhokhe se',
  'whatsapp video call blackmail',
  'family ko photo bhejne ki dhamki',
  'youtube par video daalne ki dhamki',
  'blackmail kar rha hai paise ke liye',
  'ganda video leak karne ki dhamki',
  'gandi photo viral karne ki dhamki',
  'facebook friends ko video bhej dega',
  'cyber cell police banke dhamki',
  'video delete karne ke liye paise mang rha',
  'dhamki de kar paise liye',
  'blackmailer dhamki de raha',
  'screenshot bheja video ka dhamki',
  'police call karegi bola blackmail',

  // --- MALWARE, RANSOMWARE & CYBER ATTACKS (ENGLISH) ---
  'ransomware',
  'malware infection',
  'virus on laptop',
  'files encrypted',
  'ransom note',
  'files locked',
  'decrypt files',
  'adware popup',
  'spyware detected',
  'keylogger installed',
  'trojan horse file',
  'rat remote access trojan',
  'unauthorized remote access',
  'device controlled remotely',
  'screen mirroring spy app',
  'spy app installed phone',
  'cyber attack infrastructure',
  'ddos attack',
  'botnet infection',
  'malicious file downloaded',
  'antivirus disabled malware',
  'server database encrypted',
  'database ransom',

  // --- MALWARE, RANSOMWARE & CYBER ATTACKS (HINGLISH/HINDI) ---
  'laptop lock ho gaya files open nahi ho rahi',
  'files encrypt ho gayi ransom mang rha',
  'computer virus aa gaya',
  'spy app dal di phone me',
  'anydesk download karwaya fraud kiya',
  'rustdesk download kiya paisa gaya',
  'teamviewer control le liya hack',
  'phone hack ho gaya screen control',
  'ransomware attack server par',
  'server lock ho gaya data chori',
  'malicious software download ho gaya',
  'phone automatic chal raha hai',
  'antivirus band ho gaya malware se',
  'rat spy app phone link',

  // --- DATA BREACH & PRIVACY VIOLATIONS (ENGLISH) ---
  'data breach',
  'database leak',
  'leaked credentials data breach',
  'company database hacked',
  'user data leaked online',
  'dark web leak',
  'personal data sold online',
  'unauthorized data processing',
  'dpdp act data breach',
  'dpbi investigation data breach',
  'data fiduciary compliance failure',
  'unauthorized disclosure of contract',
  'sensitive personal data leaked',
  'aadhaar data leaked',
  'credit card database leaked',
  'breach of confidentiality',
  'data privacy violation',
  'unauthorized data harvesting',

  // --- DATA BREACH & PRIVACY VIOLATIONS (HINGLISH/HINDI) ---
  'company ka data leak ho gaya',
  'database chori ho gaya server se',
  'dark web par data mil raha hai',
  'user information leak',
  'meradata leak ho gaya',
  'personal details leak online',
  'company ne data leak kiya security fail',
  'data breach notification',
  'customer data public ho gaya',
  'credit card data leak website se',
  'aadhaar cards leak database hack',

  // --- CYBER BULLYING & HARASSMENT (ENGLISH) ---
  'cyber bullying',
  'online harassment',
  'stalking online',
  'cyberstalking',
  'instagram harassment',
  'defamatory posts online',
  'fake profile harassment',
  'threatening online comments',
  'abusive messages social media',
  'harassment via email',
  'threatened to ruin reputation',
  'doxxing private info shared',
  'leaked address phone number',
  'online hate campaign',

  // --- CYBER BULLYING & HARASSMENT (HINGLISH/HINDI) ---
  'online harass kar raha hai',
  'stalk kar raha hai instagram par',
  'fake account banakar paresan',
  'gande comments kar rha hai profile par',
  'abusive messages bhej raha hai',
  'badnam karne ki dhamki posts se',
  'doxxing kar di address share',
  'number public kar diya groups me',
  'fake profile banakar badnam',
  'online stalking police complaint',
  'gali de raha hai online comments me',

  // --- FAKE JOB & INVESTMENT SCAMS (ENGLISH) ---
  'fake job scam',
  'investment scam',
  'part time job telegram scam',
  'work from home scam youtube review',
  'crypto investment scam',
  'forex trading fraud platform',
  'double money scheme fraud',
  'processing fee scam job',
  'registration fee fake recruiter',
  'telegram task scam rating business',
  'stock trading scam group whatsapp',
  'fake job offer letter',
  'unauthorized recruitment fee',

  // --- FAKE JOB & INVESTMENT SCAMS (HINGLISH/HINDI) ---
  'part time job scam telegram task',
  'youtube video like karne ka scam',
  'investment double karne ka lalach',
  'crypto trading me paisa phas gaya',
  'job ke naam par processing fee mangi',
  'fake job offer letter diya',
  'telegram rating task se fraud',
  'trading group me paisa lagwaya fraud',
  'investment return nahi mila block kiya',
  'trading wallet se withdrawal nahi ho rha',
  'fake job recruiter loot liya',
  'ghar baithe kamane ka fraud link',

  // --- DIGITAL ARREST & POLICE IMPERSONATION (ENGLISH) ---
  'digital arrest',
  'cbi impersonation scam',
  'fake police call courier',
  'parcel containing drugs scam',
  'digital arrest illegal money laundering',
  'impersonating customs officer',
  'skype call police scam video',
  'threat of jail drug parcel',
  'unauthorized police inquiry online',
  'digital arrest money transfer threat',
  'fedex parcel police threat',

  // --- DIGITAL ARREST & POLICE IMPERSONATION (HINGLISH/HINDI) ---
  'digital arrest kar liya bolke daraya',
  'skype call par police banke daraya',
  'parcel me illegal drugs bolkar call kiya',
  'cbi call bolkar draya paise mange',
  'customs officer ka fake call phone pe',
  'police jail daalne ki dhamki de rahi online',
  'money laundering case bolkar daraya',
  'court order dikhakar digital arrest',
  'fedex parcel block bolke cbi call'
];

/**
 * Detailed list of English and Hinglish keywords for LOW Severity queries.
 * Includes password recovery, login issues, general settings, 2FA setup,
 * and security information requests.
 */
const LOW_SEVERITY_KEYWORDS = [
  // --- PASSWORD RECOVERY & MANAGEMENT (ENGLISH) ---
  'forgot password',
  'reset password',
  'change password',
  'password reset link',
  'recover password',
  'password recovery',
  'lost password access',
  'password manager guide',
  'how to store passwords',
  'change security questions',
  'master password reset',
  'password strength check',
  'generate strong password',
  'password expired reset',
  'update saved passwords',
  'keychain password access',
  'chrome saved passwords update',
  'safari password autofill setup',

  // --- PASSWORD RECOVERY & MANAGEMENT (HINGLISH/HINDI) ---
  'password bhul gaya',
  'password reset karna hai',
  'password change kaise kare',
  'reset password link nahi aa rha',
  'password recover kaise kare',
  'lost password help',
  'password change link facebook',
  'instagram password reset kaise kare',
  'gmail password bhul gaya recover',
  'password strength kaise badhaye',
  'saved password check karna hai',
  'password safe kaise rakhe',
  'naya password kaise banaye',
  'password reset problem',

  // --- LOGIN & ACCESS ISSUES (ENGLISH) ---
  'can\'t login',
  'cannot login',
  'login failed',
  'login error',
  'account locked out',
  'wrong credentials error',
  'trouble logging in',
  'sign in issue',
  'cannot sign in',
  'temporarily locked out login',
  'invalid password error login',
  'access denied on login page',
  'verification code not received login',
  'login captcha error',
  'cannot access account portal',
  'login screen loop',
  'locked out of portal',

  // --- LOGIN & ACCESS ISSUES (HINGLISH/HINDI) ---
  'login nahi ho raha',
  'sign in problem',
  'login failed ho gaya',
  'account lock ho gaya reset',
  'wrong password error dikha rha',
  'login nahi ho pa rha account me',
  'access nahi mil rha id ka',
  'sign in error help',
  'login portal open nahi ho rha',
  'captcha code error login',
  'wrong credentials error reset',
  'locked out account access help',
  'login code nahi aaya',

  // --- 2FA & MFA SETUP (ENGLISH) ---
  'enable 2fa',
  'disable 2fa',
  'setup two factor authentication',
  'setup multi factor authentication',
  'enable mfa',
  'authenticator app connection',
  'google authenticator setup',
  'microsoft authenticator link',
  'backup codes 2fa recover',
  'lost 2fa device code help',
  'sms 2fa setup guide',
  'turn on two step verification',
  '2fa authentication code query',
  'mfa compliance check portal',

  // --- 2FA & MFA SETUP (HINGLISH/HINDI) ---
  '2fa lagana hai',
  'two step verification kaise chalu kare',
  'two factor auth setup guide',
  'google authenticator kaise link kare',
  'mfa set karna hai account me',
  '2fa code nahi aa rha verification',
  'backup code kaise nikale 2fa ka',
  '2fa band kaise kare settings se',
  'authenticator app download query',
  'security key setup kaise kare',
  'two step code verification setup',

  // --- SYSTEM UPDATES & GENERAL SETTINGS (ENGLISH) ---
  'update software',
  'os update guide',
  'browser security update',
  'clear browser cookies',
  'clear cache settings browser',
  'enable pop-up blocker chrome',
  'disable notifications site settings',
  'change privacy settings browser',
  'update windows security patch',
  'mac security updates install',
  'android security patch check',
  'ios update security settings',
  'router dns settings change',
  'firmware update router guide',

  // --- SYSTEM UPDATES & GENERAL SETTINGS (HINGLISH/HINDI) ---
  'software update kaise kare',
  'browser update settings chrome',
  'cookies clear kaise kare history',
  'cache delete karna hai browser ka',
  'pop up block kaise kare sites ka',
  'notification band karna hai app ka',
  'privacy settings change kaise kare',
  'windows defender scan settings',
  'router setup reset password',
  'dns server set kaise kare router me',
  'phone update settings check',

  // --- SECURITY EDUCATION & AWARENESS (ENGLISH) ---
  'what is phishing definition',
  'how to identify spam email',
  'safe browsing tips internet',
  'best antivirus software free',
  'cybersecurity tips for kids',
  'how to secure home wifi router',
  'vpn benefits security',
  'what is social engineering attack',
  'dangers of public wifi connections',
  'data privacy tips corporate',
  'how to check if link is safe',
  'cybersecurity best practices 2026',

  // --- SECURITY EDUCATION & AWARENESS (HINGLISH/HINDI) ---
  'phishing kya hoti hai simple definition',
  'spam message kaise pehchane bank ka',
  'safe website kaise pehchane green lock',
  'best free antivirus computer ke liye',
  'wifi router ko secure kaise kare gharelu',
  'vpn kya hota hai usage guide',
  'public wifi me security risk',
  'phishing email pehchanne ke tareeqe',
  'data privacy kya hai dpadpa',
  'secure website check kaise kare url'
];

// Helper to escape special characters for regex safety
const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

// Helper to convert space-separated or asterisk keywords into wildcard regex patterns
const compileKeywordToPattern = (k) => {
  const parts = k.trim().split(/[\s*]+/);
  if (parts.length === 0 || parts[0] === '') return '';
  return `\\b${parts.map(p => escapeRegex(p)).join('.*')}\\b`;
};

// Pre-compiled RegExp for immediate execution and performance optimization with wildcard matching support
const HIGH_SEVERITY_REGEX = new RegExp(
  HIGH_SEVERITY_KEYWORDS
    .map(compileKeywordToPattern)
    .filter(p => p !== '')
    .join('|'),
  'i'
);

const LOW_SEVERITY_REGEX = new RegExp(
  LOW_SEVERITY_KEYWORDS
    .map(compileKeywordToPattern)
    .filter(p => p !== '')
    .join('|'),
  'i'
);

/**
 * Quick severity assessment based on message keywords.
 * Checks for HIGH severity patterns first to prevent LOW patterns from masking real crimes.
 * Returns HIGH | LOW | MEDIUM.
 */
function assessInitialSeverity(message) {
  if (!message || typeof message !== 'string') return 'MEDIUM';
  
  const lowerMsg = message.trim().toLowerCase();
  
  // 1. First-check: HIGH Severity Crimes (English + Hinglish detailed list)
  if (HIGH_SEVERITY_REGEX.test(lowerMsg)) {
    return 'HIGH';
  }
  
  // 2. Second-check: LOW Severity Issues (English + Hinglish detailed list)
  if (LOW_SEVERITY_REGEX.test(lowerMsg)) {
    return 'LOW';
  }
  
  // Default to MEDIUM for uncertain/mixed cases
  return 'MEDIUM';
}

export async function postChat(req, res, next) {
  try {
    const { message, rollingSummary, recentMessages, incidentData, exchangeCount } = validateChatPayload(req.body);

    // ✅ OPTIMIZATION: Assess severity to determine if intelligence is needed
    const severity = assessInitialSeverity(message);
    
    let intelligencePromise = Promise.resolve(null);
    
    // ✅ FIX (Bug #3): Dead Zone — retry classification every 3 exchanges after initial checkpoint
    // ✅ FIX (Bug #8): Deduplication — don't re-classify on every HIGH if already classified
    const shouldAttemptClassification = 
      // 1. HIGH severity + not yet classified (prevents rapid-fire token waste)
      ((severity === 'HIGH' || severity === 'CRITICAL') && !incidentData?.classified) ||
      // 2. Not yet classified + past initial checkpoint: retry every 3 exchanges
      (!incidentData?.classified && exchangeCount >= 5 && exchangeCount % 3 === 0) ||
      // 3. Already classified: update at every 5th exchange (incident may evolve)
      (incidentData?.classified && exchangeCount >= 10 && exchangeCount % 5 === 0);
    
    if (shouldAttemptClassification) {
      const messagesForIntelligence = [...recentMessages, { role: 'user', text: message }];
      const recentText = messagesForIntelligence.map(m => `[${m.role.toUpperCase()}]: ${m.text}`).join('\n\n');
      intelligencePromise = processIntelligence(rollingSummary, recentText);
    }

    // ✅ OPTIMIZED: Pass severity to chat service for adaptive response sizing
    const chatPromise = getChatResponse(message, severity, rollingSummary, recentMessages);

    const [reply, newIncidentData] = await Promise.all([chatPromise, intelligencePromise]);

    // ✅ FIX (Bug #7): Determine final incidentData with server-side domain data regeneration
    // Never trust domain data (actions, laws, evidence) from the client
    let finalIncidentData;
    if (newIncidentData && newIncidentData.classified) {
      // Fresh classification from server intelligence — fully trusted
      finalIncidentData = newIncidentData;
    } else if (incidentData && incidentData.classified && incidentData.category) {
      // Client-supplied fallback — regenerate all domain data server-side to prevent injection
      finalIncidentData = {
        classified: true,
        category: incidentData.category,
        severity: incidentData.severity || 'Unknown',
        risk: incidentData.risk || 'Unknown',
        status: incidentData.status || 'Open',
        confidence: incidentData.confidence || 0,
        immediateActions: getImmediateActions(incidentData.category),
        evidenceChecklist: getEvidenceChecklist(incidentData.category),
        reportingGuidance: getReportingGuidance(incidentData.category),
        relevantLaws: getRelevantLaws(incidentData.category),
        timestamp: incidentData.timestamp || new Date().toISOString()
      };
    } else {
      finalIncidentData = null;
    }

    return res.status(200).json({
      success: true,
      data: { 
        reply,
        incidentData: finalIncidentData,
        severity  // ✅ Return severity to frontend for UI hints
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function postSummary(req, res, next) {
  try {
    const { currentSummary, recentMessages } = validateSummaryPayload(req.body);

    const newSummary = await generateRollingSummary(currentSummary, recentMessages);

    return res.status(200).json({
      success: true,
      data: { summary: newSummary }
    });
  } catch (error) {
    return next(error);
  }
}
