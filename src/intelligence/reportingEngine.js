export const getReportingGuidance = (category) => {
  const defaultReporting = [
    {
      portal: 'National Cyber Crime Reporting Portal',
      action: 'Register a complaint at cybercrime.gov.in',
      urgency: 'Standard'
    },
    {
      portal: 'Local Police Station',
      action: 'File an FIR at your nearest cyber cell or police station.',
      urgency: 'Standard'
    }
  ];

  const reportingMap = {
    'Financial Fraud': [
      {
        portal: 'Cyber Crime Helpline (1930)',
        action: 'Call 1930 IMMEDIATELY. They can coordinate with your bank to freeze the transferred funds if reported quickly (golden hour).',
        urgency: 'Critical'
      },
      {
        portal: 'Your Bank / Payment App',
        action: 'Contact customer care to block your cards/accounts and log a fraud dispute.',
        urgency: 'Critical'
      },
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'File a formal financial fraud complaint at cybercrime.gov.in',
        urgency: 'High'
      }
    ],
    'Social Media Account Compromise': [
      {
        portal: 'Platform Support',
        action: 'Use the official compromised account recovery pages (e.g., facebook.com/hacked).',
        urgency: 'High'
      },
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'File a complaint under "Social Media" section at cybercrime.gov.in to create a legal record.',
        urgency: 'Standard'
      }
    ],
    'Sextortion': [
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'File an anonymous or named complaint under the "Women/Child Related Crime" section at cybercrime.gov.in.',
        urgency: 'Critical'
      },
      {
        portal: 'Local Cyber Cell',
        action: 'Visit the nearest cyber police station. Sextortion requires immediate police intervention.',
        urgency: 'Critical'
      }
    ],
    'Cyber Bullying': [
      {
        portal: 'Platform Reporting Tools',
        action: 'Report the abusive user/content directly on the social media platform.',
        urgency: 'High'
      },
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'Register a complaint if the bullying involves threats, stalking, or severe harassment.',
        urgency: 'Standard'
      }
    ],
    'Malware Infection': [
      {
        portal: 'CERT-In (Indian Computer Emergency Response Team)',
        action: 'Report the malware/ransomware incident to incident@cert-in.org.in (Mandatory for organizations).',
        urgency: 'High'
      }
    ],
    'Data Breach': [
      {
        portal: 'CERT-In',
        action: 'Report the breach to CERT-In (critical for organizations).',
        urgency: 'Critical'
      },
      {
        portal: 'Data Protection Board of India',
        action: 'If applicable under DPDP Act 2023, notify the board.',
        urgency: 'High'
      }
    ],
    'Online Gaming Violation': [
      {
        portal: 'Online Gaming Authority of India (OGAI)',
        action: 'Report the online money gaming platform or app for statutory violation of Section 5/7 of the PROG Act 2025.',
        urgency: 'High'
      },
      {
        portal: 'State Nodal Cyber Cell',
        action: 'Notify district cyber cell officers. They possess decentralized authority under the PROG Act to investigate, raid, and seize digital assets.',
        urgency: 'Standard'
      },
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'File a complaint under online betting/gambling violations at cybercrime.gov.in.',
        urgency: 'Standard'
      }
    ],
    'Deepfake / SGI Abuse': [
      {
        portal: 'Platform Grievance Officer',
        action: 'File a formal grievance with the platform. Under the February 2026 SGI Rules, the intermediary is legally mandated to remove NCII/impersonation deepfakes within 2 hours.',
        urgency: 'Critical'
      },
      {
        portal: 'Grievance Appellate Committee (GAC)',
        action: 'If the platform declines to take action, file an appeal at the GAC portal for government-binding oversight.',
        urgency: 'High'
      },
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'Register a complaint under the "Women/Child Related Crime" or "Impersonation" section at cybercrime.gov.in.',
        urgency: 'Critical'
      }
    ],
    'SIM Hijacking / OTT Remote Hijack': [
      {
        portal: 'Mobile Network Carrier',
        action: 'Immediately contact customer care to freeze/block the hijacked SIM card and prevent further SMS/call intercept.',
        urgency: 'Critical'
      },
      {
        portal: 'Department of Telecommunications (DoT) / FRI Platform',
        action: 'Notify your carrier/DoT. Under DoT rules, the SIM Binding status will be deactivated and flag the number on the Financial Fraud Risk Indicator (FRI) platform.',
        urgency: 'Critical'
      },
      {
        portal: 'OTT App Support (WhatsApp/Telegram/Signal)',
        action: 'Initiate account recovery and enforce remote web logouts to disconnect the attacker\'s remote web instance.',
        urgency: 'High'
      }
    ]
  };

  if (['UPI Fraud', 'E-commerce Fraud', 'Investment Scam', 'Fake Job Scam'].includes(category)) {
    return reportingMap['Financial Fraud'];
  }
  if (['Phishing', 'Smishing', 'Vishing'].includes(category)) {
    // If it led to financial loss, it should ideally be classified as Financial Fraud,
    // but if it's just phishing, report to cybercrime
    return [
      {
        portal: 'National Cyber Crime Reporting Portal',
        action: 'Report the phishing link at cybercrime.gov.in',
        urgency: 'High'
      },
      {
        portal: 'CERT-In',
        action: 'Forward phishing emails to incident@cert-in.org.in',
        urgency: 'Standard'
      }
    ];
  }

  return reportingMap[category] || defaultReporting;
};
