export const getEvidenceChecklist = (category) => {
  const defaultEvidence = [
    'Screenshots of the incident (with timestamps visible).',
    'Any relevant URLs or links associated with the attacker.',
    'Chat logs or emails (preserved, not deleted).'
  ];

  const evidenceMap = {
    'Financial Fraud': [
      'Bank/Credit Card Statements showing the unauthorized debit.',
      'SMS or Email notifications of the transaction.',
      'Transaction IDs, UTR numbers, or Reference numbers.',
      'Screenshots of any fake portals or apps involved.'
    ],
    'UPI Fraud': [
      'UPI Transaction ID (often starts with 2 or 3).',
      'The exact UPI ID (VPA) or phone number of the fraudster.',
      'Screenshots of the payment confirmation screen.',
      'Bank SMS confirming the deduction.'
    ],
    'Phishing': [
      'The original phishing email with full headers intact (do not just forward it).',
      'The exact URL of the deceptive website.',
      'Screenshots of the fake login screen.',
      'Any files or attachments downloaded (do not open them).'
    ],
    'Smishing': [
      'Screenshot of the SMS with the sender ID/phone number visible.',
      'The exact time and date the SMS was received.',
      'The deceptive link included in the message.'
    ],
    'Vishing': [
      'Call logs showing the incoming caller ID, date, time, and duration.',
      'Call recordings (if available and legally obtained).',
      'Notes on what the caller claimed or requested.'
    ],
    'Social Media Account Compromise': [
      'Screenshots of the unauthorized posts or messages sent from your account.',
      'Security alert emails from the platform (e.g., "New login from Windows").',
      'The URL of your compromised profile.',
      'Screenshots of the hacker changing recovery details (if emailed to you).'
    ],
    'Cyber Bullying': [
      'Screenshots of the abusive messages, comments, or posts.',
      'The exact URL/username of the abuser\'s profile.',
      'Timestamps of when the harassment occurred.',
      'Do not delete the messages—leave them intact on the platform for investigation.'
    ],
    'Sextortion': [
      'Screenshots of the extortion demands and threats.',
      'The attacker\'s profile URL, phone number, or email address.',
      'Details of any bank accounts, crypto wallets, or UPI IDs where they demanded payment.',
      'Screenshots of the compromised media (if sent to you as a threat).'
    ],
    'Malware Infection': [
      'The malicious file itself (quarantined by antivirus, do not run).',
      'System logs showing when the abnormal behavior started.',
      'Screenshots of any error messages or ransom notes.'
    ],
    'Identity Theft': [
      'Copies of any fraudulent loans or credit cards opened in your name.',
      'Correspondence from debt collectors regarding accounts you did not open.',
      'Credit reports highlighting the fraudulent activity.'
    ],
    'Online Gaming Violation': [
      'Payment receipts or transaction logs indicating fees or deposits made to the gaming platform.',
      'Bank or credit card statements showing transfers or stakes placed on the online gaming portal.',
      'Screenshots of promotional advertisements, sponsorships, or influencer endorsements of the game.',
      'The exact URL, package name, or download link of the online money game app/website.'
    ],
    'Deepfake / SGI Abuse': [
      'The suspicious audio, visual, or audio-visual media file (preserved in its original format and quality).',
      'The URL of the social media page, news aggregator, or website hosting/transmitting the media.',
      'Metadata or digital watermark markers embedded in the synthetically generated media.',
      'Screenshots or records of the original, unaltered source media (for comparison, if available).'
    ],
    'SIM Hijacking / OTT Remote Hijack': [
      'Screenshots of unauthorized login notifications or active web session lists in the communication app.',
      'Call history logs from your mobile network carrier showing calls or disconnect events.',
      'Verification details of the physical location of the SIM card and host device.',
      'SMS alerts or carrier notifications indicating SIM card replacement, porting, or deactivation.'
    ]
  };

  if (['Investment Scam', 'Fake Job Scam', 'E-commerce Fraud'].includes(category)) {
    return evidenceMap['Financial Fraud'].concat(['Screenshots of communications with the scammer.']);
  }
  
  return evidenceMap[category] || defaultEvidence;
};
