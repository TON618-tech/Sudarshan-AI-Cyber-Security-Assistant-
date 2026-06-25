export const getRelevantLaws = (category) => {
  const defaultLaws = [
    {
      law: 'Information Technology Act, 2000 (Amended)',
      description: 'The foundational Indian legislation governing electronic commerce, data protection, and cyber offences.'
    },
    {
      law: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      description: 'The modernized criminal code (effective July 1, 2024) defining cyber and digital offences (replacing the IPC).'
    }
  ];

  const lawsMap = {
    'Financial Fraud': [
      {
        law: 'Section 43 & 66, IT Act 2000',
        description: 'Imposes civil liabilities for unauthorized access, data theft, and criminal penalties for hacking or fraud.'
      },
      {
        law: 'Section 318(4), Bharatiya Nyaya Sanhita (BNS)',
        description: 'Criminalizes cheating and dishonestly inducing delivery of property (applicable to online/UPI scams).'
      },
      {
        law: 'Telecommunications Act, 2023 (FRI Platform)',
        description: 'Empowers the Financial Fraud Risk Indicator (FRI) platform to trigger delays or blocks at bank/UPI levels.'
      },
      {
        law: 'Section 70B(7), IT Act 2000 (Jan Vishwas Act 2023)',
        description: 'Mandates corporate bodies to report cyber security incidents to CERT-In (fine up to ₹1 Crore for failure).'
      }
    ],
    'Phishing': [
      {
        law: 'Section 66C, IT Act 2000',
        description: 'Punishes identity theft, including fraudulent use of digital signatures, passwords, or biometrics.'
      },
      {
        law: 'Section 66D, IT Act 2000',
        description: 'Criminalizes cheating by personation by utilizing a computer resource.'
      },
      {
        law: 'Section 319, Bharatiya Nyaya Sanhita (BNS)',
        description: 'Criminalizes cheating by personation (replacing IPC Section 419) in digital environments.'
      },
      {
        law: 'Telecommunications Act, 2023 (SIM Binding)',
        description: 'Mandates SIM Binding for OTT apps to prevent offshore authentication and remote account hijack.'
      }
    ],
    'Social Media Account Compromise': [
      {
        law: 'Section 66C, IT Act 2000',
        description: 'Applies to the unauthorized hijack and use of someone else\'s credentials or access features.'
      },
      {
        law: 'IT Intermediary Rules, 2021 (Feb 2026 Amendment)',
        description: 'Mandates platforms to restore compromised accounts and act on impersonation complaints within 2 hours.'
      }
    ],
    'Cyber Bullying': [
      {
        law: 'Section 67, IT Act 2000',
        description: 'Punishes publishing or transmitting obscene materials electronically.'
      },
      {
        law: 'Section 78 & 79, Bharatiya Nyaya Sanhita (BNS)',
        description: 'Criminalizes stalking and sexual harassment via electronic communications.'
      },
      {
        law: 'IT Intermediary Rules, 2021 (Rule 3(1)(b) Grievance)',
        description: 'Requires intermediaries to remove abusive content within 36 hours of receipt of a user grievance.'
      }
    ],
    'Sextortion': [
      {
        law: 'Section 67A, IT Act 2000',
        description: 'Imposes severe non-bailable penalties for transmitting sexually explicit content electronically.'
      },
      {
        law: 'Section 308(2), Bharatiya Nyaya Sanhita (BNS)',
        description: 'Criminalizes extortion by putting a person in fear of injury or reputational damage (replacing IPC 384).'
      },
      {
        law: 'IT Intermediary Rules, 2021 (NCII Mandate)',
        description: 'Enforces a strict 2-hour timeline for intermediaries to remove Non-Consensual Intimate Imagery (NCII).'
      }
    ],
    'Data Breach': [
      {
        law: 'Digital Personal Data Protection Act, 2023',
        description: 'Mandates Data Fiduciaries to implement security safeguards, report data breaches, and respect consent.'
      },
      {
        law: 'DPDP Rules, 2025 (Consent Managers)',
        description: 'Establishes registered Consent Managers to give citizens centralized dashboards to withdraw/manage consent.'
      },
      {
        law: 'Section 70B(7), IT Act 2000 (CERT-In Directives)',
        description: 'Enforces mandatory reporting of significant data breaches to CERT-In within 6 hours of discovery.'
      }
    ],
    'Malware Infection': [
      {
        law: 'Section 43(c) & 66, IT Act 2000',
        description: 'Penalizes the introduction of computer contaminants, viruses, malware, or ransomware.'
      },
      {
        law: 'Section 1(5)(c), BNS 2023 (Extraterritoriality)',
        description: 'Extends jurisdiction to prosecute offshore attackers targeting computer resources located in India.'
      }
    ],
    'Identity Theft': [
      {
        law: 'Section 66C, IT Act 2000',
        description: 'Criminalizes identity theft and unauthorized usage of unique identity features (passwords, biometrics).'
      },
      {
        law: 'Section 2, Bharatiya Sakshya Adhiniyam, 2023 (BSA)',
        description: 'Grants full legal parity to digital evidence, explicitly admitting smartphone data and server logs.'
      }
    ]
  };

  // Maps aliases (Smishing/Vishing -> Phishing rules apply broadly)
  if (['Smishing', 'Vishing'].includes(category)) {
    return lawsMap['Phishing'];
  }
  if (['UPI Fraud', 'E-commerce Fraud', 'Investment Scam', 'Fake Job Scam'].includes(category)) {
    return lawsMap['Financial Fraud'];
  }
  if (['Ransomware'].includes(category)) {
    return lawsMap['Malware Infection'];
  }

  return lawsMap[category] || defaultLaws;
};
