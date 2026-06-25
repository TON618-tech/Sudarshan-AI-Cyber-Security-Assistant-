export const getImmediateActions = (category) => {
  const actionsMap = {
    'Financial Fraud': [
      'Contact your bank immediately to freeze affected accounts.',
      'Block all compromised credit/debit cards.',
      'Change your net banking and UPI PINs.',
      'Do not answer calls from unknown numbers claiming to be bank officials.',
    ],
    'Phishing': [
      'Change passwords for any accounts accessed via the phishing link.',
      'Enable Multi-Factor Authentication (MFA) immediately.',
      'Scan your device for malware if you downloaded any files.',
      'Review your account settings for any unauthorized recovery email additions.'
    ],
    'Smishing': [
      'Do not reply or click any further links in the SMS.',
      'Block the sender number.',
      'Alert your mobile carrier if the message claims to be from them.'
    ],
    'Vishing': [
      'Hang up immediately if you are still on the call.',
      'Do not verify any OTPs or PINs over the phone.',
      'Call your institution directly using an official number to verify claims.'
    ],
    'Social Media Account Compromise': [
      'Use the platform\'s account recovery tool immediately.',
      'Log out of all active sessions from the security settings.',
      'Alert your friends/contacts that your account is compromised to prevent secondary scams.',
      'Revoke access to third-party apps linked to your account.'
    ],
    'Malware Infection': [
      'Disconnect the infected device from the internet (Wi-Fi/Ethernet).',
      'Do not connect any USB drives to the infected device.',
      'Run a comprehensive offline antivirus scan.',
      'Consider booting in Safe Mode to isolate malicious processes.'
    ],
    'Ransomware': [
      'Do not pay the ransom. There is no guarantee data will be returned.',
      'Disconnect the device from all networks to prevent lateral movement.',
      'Take a photo of the ransom screen for evidence.',
      'Check if offline backups are available for restoration.'
    ],
    'Data Breach': [
      'Change passwords for the breached service and any other sites using the same password.',
      'Monitor your credit reports for identity theft.',
      'Be highly suspicious of targeted phishing emails using your breached data.'
    ],
    'Cyber Bullying': [
      'Do not respond or retaliate against the attacker.',
      'Block the abusive accounts immediately.',
      'Adjust your privacy settings to restrict messages from non-friends.'
    ],
    'Sextortion': [
      'Do not pay the extortion demands. Paying often leads to further demands.',
      'Deactivate (do not delete) your social media profiles temporarily.',
      'Cease all communication with the extortionist and block them.'
    ],
    'Identity Theft': [
      'Place a fraud alert on your credit reports.',
      'Review all recent financial statements for unauthorized activity.',
      'Notify government authorities if official IDs (Aadhaar, PAN) are compromised.'
    ],
    'Fake Job Scam': [
      'Cease all communication with the fake recruiter.',
      'Do not pay any "processing fees" or "security deposits".',
      'Alert the legitimate company if the scammer is impersonating them.'
    ],
    'Investment Scam': [
      'Stop all transfers to the fraudulent platform immediately.',
      'Do not trust "recovery agencies" that contact you promising to get your money back for a fee.'
    ],
    'UPI Fraud': [
      'Report the fraudulent UPI ID using your payment app (GPay, PhonePe, Paytm).',
      'Contact your bank to raise a chargeback or fraud dispute.',
      'Never enter your UPI PIN to *receive* money.'
    ]
  };

  return actionsMap[category] || [
    'Preserve all evidence (screenshots, URLs, emails, SMS).',
    'Do not engage further with the attacker.',
    'Update your critical passwords and enable Two-Factor Authentication.'
  ];
};
