import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, AlertTriangle, Eye, Server, Key, FileWarning, Mail } from 'lucide-react';

const SecurityPolicy = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: 'Security Policy',
      subtitle: 'Information Security & Cyber Security Practices',
      effectiveDate: 'Last Updated: January 1, 2025',
      
      intro: {
        title: 'Our Security Commitment',
        text: 'NARA is committed to protecting the confidentiality, integrity, and availability of all information assets. This Security Policy outlines our technical and organizational measures to safeguard your data and our digital services in accordance with Sri Lankan cybersecurity standards and international best practices.'
      },

      framework: {
        title: 'Security Framework',
        text: 'Our security program is aligned with:',
        standards: [
          {
            name: 'ISO/IEC 27001',
            description: 'Information Security Management System',
            status: 'Aligned'
          },
          {
            name: 'Sri Lanka CERT|CC Guidelines',
            description: 'National Cybersecurity Standards',
            status: 'Compliant'
          },
          {
            name: 'PDPA Security Requirements',
            description: 'Personal Data Protection Act mandates',
            status: 'Compliant'
          },
          {
            name: 'ICTA Security Standards',
            description: 'Government IT Security Guidelines',
            status: 'Compliant'
          }
        ]
      },

      technical: {
        title: 'Technical Security Measures',
        categories: [
          {
            icon: Lock,
            name: 'Data Encryption',
            measures: [
              'TLS 1.2+ encryption for data in transit',
              'AES-256 encryption for sensitive data at rest',
              'End-to-end encryption for critical communications',
              'Encrypted backups with secure key management',
              'Database encryption for personal information'
            ]
          },
          {
            icon: Shield,
            name: 'Access Control',
            measures: [
              'Multi-factor authentication (MFA) for all accounts',
              'Role-based access control (RBAC)',
              'Principle of least privilege enforcement',
              'Regular access reviews and audits',
              'Strong password policies (min 12 characters)',
              'Automatic session timeout after inactivity'
            ]
          },
          {
            icon: Server,
            name: 'Infrastructure Security',
            measures: [
              'Firewall protection and intrusion detection',
              'Regular security patching and updates',
              'Network segmentation and isolation',
              'DDoS protection and rate limiting',
              'Secure cloud infrastructure (Firebase/GCP)',
              'Redundant systems and failover mechanisms'
            ]
          },
          {
            icon: Eye,
            name: 'Monitoring & Detection',
            measures: [
              '24/7 security monitoring and logging',
              'Real-time threat detection systems',
              'Automated vulnerability scanning',
              'Security Information and Event Management (SIEM)',
              'Regular penetration testing',
              'Incident detection and response procedures'
            ]
          }
        ]
      },

      organizational: {
        title: 'Organizational Security Measures',
        sections: [
          {
            name: 'Security Governance',
            items: [
              'Designated Information Security Officer',
              'Security policies and procedures',
              'Regular security risk assessments',
              'Third-party security audits',
              'Compliance monitoring program'
            ]
          },
          {
            name: 'Personnel Security',
            items: [
              'Background verification for staff',
              'Mandatory security awareness training',
              'Confidentiality and NDA agreements',
              'Clear roles and responsibilities',
              'Insider threat prevention measures'
            ]
          },
          {
            name: 'Physical Security',
            items: [
              'Secure data center facilities',
              'Access control to server rooms',
              'CCTV surveillance',
              'Environmental controls (fire, flood)',
              'Secure disposal of sensitive media'
            ]
          }
        ]
      },

      incident: {
        title: 'Security Incident Response',
        process: [
          {
            phase: 'Detection',
            description: 'Automated monitoring systems and user reports identify potential security incidents',
            icon: Eye
          },
          {
            phase: 'Assessment',
            description: 'Security team evaluates severity and impact of the incident',
            icon: AlertTriangle
          },
          {
            phase: 'Containment',
            description: 'Immediate action taken to isolate and prevent spread of the incident',
            icon: Shield
          },
          {
            phase: 'Notification',
            description: 'Affected users and authorities notified as required by PDPA and CERT|CC',
            icon: Mail
          }
        ],
        breach: {
          title: 'Data Breach Notification',
          text: 'In case of a data breach affecting personal information:',
          timeline: [
            'We notify the Data Protection Authority within 72 hours',
            'Affected individuals are notified without undue delay',
            'We provide details of the breach and mitigation steps',
            'We report to Sri Lanka CERT|CC as required'
          ]
        }
      },

      vulnerabilities: {
        title: 'Vulnerability Disclosure Program',
        text: 'We welcome responsible disclosure of security vulnerabilities. If you discover a security issue:',
        process: [
          'Email security@nara.ac.lk with details',
          'Provide sufficient information to reproduce the issue',
          'Allow us reasonable time to address the vulnerability',
          'Do not exploit the vulnerability or access user data',
          'Do not publicly disclose the vulnerability until we have addressed it'
        ],
        reward: 'We acknowledge security researchers who report vulnerabilities responsibly.',
        pgp: 'PGP Public Key available for encrypted communication'
      },

      user: {
        title: 'User Security Responsibilities',
        text: 'Help us keep your data secure by following these best practices:',
        practices: [
          {
            name: 'Strong Passwords',
            tip: 'Use unique, complex passwords of at least 12 characters. Enable MFA where available.'
          },
          {
            name: 'Suspicious Activity',
            tip: 'Report any unusual account activity or suspected phishing attempts immediately.'
          },
          {
            name: 'Secure Devices',
            tip: 'Keep your devices updated and use reputable antivirus software.'
          },
          {
            name: 'Public Networks',
            tip: 'Avoid accessing sensitive information on public Wi-Fi networks.'
          },
          {
            name: 'Phishing Awareness',
            tip: 'NARA will never ask for your password via email. Verify sender authenticity.'
          }
        ]
      },

      compliance: {
        title: 'Regulatory Compliance',
        laws: [
          {
            name: 'Personal Data Protection Act (PDPA)',
            year: '2022',
            requirement: 'Appropriate technical and organizational security measures'
          },
          {
            name: 'Computer Crimes Act',
            year: '2007',
            requirement: 'Protection against unauthorized access and cyber crimes'
          },
          {
            name: 'Electronic Transactions Act',
            year: '2006',
            requirement: 'Secure electronic communications and transactions'
          }
        ]
      },

      contact: {
        title: 'Security Contact',
        officers: [
          {
            role: 'Information Security Officer (ISO)',
            name: 'Mr. K.L. Perera',
            email: 'security@nara.ac.lk',
            phone: '+94 11 2 521000 Ext. 250',
            pgp: 'PGP Fingerprint: XXXX XXXX XXXX XXXX'
          },
          {
            role: 'CERT|CC Liaison',
            email: 'cert-liaison@nara.ac.lk',
            note: 'For coordinating with Sri Lanka CERT|CC on security incidents'
          }
        ]
      }
    },
    si: {
      title: 'ආරක්ෂක ප්‍රතිපත්තිය',
      subtitle: 'තොරතුරු ආරක්ෂාව සහ සයිබර් ආරක්ෂක ක්‍රියාමාර්ග',
      effectiveDate: 'අවසන් යාවත්කාලීනය: 2025 ජනවාරි 1',

      intro: {
        title: 'අපගේ ආරක්ෂක පොරොන්දුව',
        text: 'ජාතික ජල සම්පත් පර්යේෂණ හා සංවර්ධන ආයතනය (NARA) සියලු තොරතුරු වත්කම්වල රහස්‍යභාවය, අඛණ්ඩභාවය සහ පවතින බව ආරක්ෂා කිරීමට කැපවී ඇත. මෙම ආරක්ෂක ප්‍රතිපත්තිය ශ්‍රී ලංකා සයිබර් ආරක්ෂක මාර්ගෝපදේශ සහ ජාත්‍යන්තර හොඳම ප්‍රතිපත්ති වලට අනුකූලව ඔබගේ දත්ත සහ අපගේ ඩිජිටල් සේවාවන් ආරක්ෂා කිරීම සඳහා අපගේ තාක්ෂණික හා සංවිධාන ක්‍රියාමාර්ග විස්තර කරයි.'
      },

      framework: {
        title: 'ආරක්ෂක රාමුව',
        text: 'අපගේ ආරක්ෂක වැඩසටහන ඉදිරිපත් වන්නේ පහත ප්‍රමිති වලට අනුකූලවය:',
        standards: [
          {
            name: 'ISO/IEC 27001',
            description: 'තොරතුරු ආරක්ෂක කළමනාකරණ පද්ධතිය',
            status: 'අනුකූල'
          },
          {
            name: 'Sri Lanka CERT|CC මාර්ගෝපදේශ',
            description: 'ජාතික සයිබර් ආරක්ෂක ප්‍රමිති',
            status: 'අනුමත'
          },
          {
            name: 'PDPA ආරක්ෂක අවශ්‍යතා',
            description: 'පුද්ගල දත්ත ආරක්ෂණ පනතේ අත්‍යවශ්‍යතා',
            status: 'අනුමත'
          },
          {
            name: 'ICTA ආරක්ෂක ප්‍රමිති',
            description: 'රජයේ තොරතුරු තාක්ෂණ ආරක්ෂක මාර්ගෝපදේශ',
            status: 'අනුමත'
          }
        ]
      },

      technical: {
        title: 'තාක්ෂණික ආරක්ෂක පියවර',
        categories: [
          {
            icon: Lock,
            name: 'දත්ත සංකේතනය',
            measures: [
              'සංක්‍රමණයේ දීම දත්ත සඳහා TLS 1.2+ සංකේතනය',
              'විශේෂ සංවේදී දත්ත සඳහා AES-256 සංකේතනය',
              'විශේෂ සන්නිවේදන සඳහා අවසන්-දක්වා-අවසන් සංකේතනය',
              'ආරක්ෂිත යතුරු කළමනාකරණ සමඟ සංකේතිත ආපසුපත්',
              'පුද්ගලික තොරතුරු සඳහා දත්ත සමුදා සංකේතනය'
            ]
          },
          {
            icon: Shield,
            name: 'ප්‍රවේශ පාලනය',
            measures: [
              'සියලු ගිණුම් සඳහා බහු සාධක සත්‍යාපනය (MFA)',
              'කාර්ය මට්ටමේ ප්‍රවේශ පාලනය (RBAC)',
              'අවම අවශ්‍යතාවයේ ප්‍රතිපත්තිය ක්‍රියාත්මක කිරීම',
              'සම්මත ප්‍රවේශ විශ්ලේෂණ හා විගණන',
              'අවම වශයෙන් අක්ෂර 12ක් ඇති ශක්තිමත් මුරපද ප්‍රතිපත්තිය',
              'ක්‍රියාකාරී නැති කාලයකින් පසු ස්වයංක්‍රීය සැසි අවසන් කිරීම'
            ]
          },
          {
            icon: Server,
            name: 'ව්‍යුහ ආරක්ෂාව',
            measures: [
              'මලහිරු ආරක්ෂක බාධක සහ ඇතුල්වීම හඳුනා ගැනීම් පද්ධති',
              'සාමාන්‍ය ආරක්ෂක පැච් කිරීම සහ යාවත්කාලීන',
              'ජාල කොටස් කිරීම හා වෙනත් පද්ධතිවලින් වෙන් කිරීම',
              'DDoS ආරක්ෂණය හා වේග සීමා කිරීම',
              'ආරක්ෂිත වළඳුනු වායිරස් සේවා (Firebase/GCP)',
              'අතිරේක පද්ධති හා පසුබැසීමේ ක්‍රමවේද'
            ]
          },
          {
            icon: Eye,
            name: 'මොනිතර කිරීම හා හඳුනා ගැනීම',
            measures: [
              'පැය 24ක පරිධියේ ආරක්ෂක මොනිතර කිරීම හා ලොග් කිරීම',
              'ජීවමාන සැඟවුණු තර්ජන හඳුනා ගැනීමේ පද්ධති',
              'ස්වයංක්‍රීය දුර්වලතා සෝදිසි',
              'SIEM (ආරක්ෂක තොරතුරු හා සිදුවීම් කළමනාකරණය)',
              'නියමිත වරින්ට වර පැනිත්‍රේෂණ පරික්ෂණ',
              'සිදුවීම් හඳුනා ගැනීම සහ ප්‍රතිචාර ක්‍රියාවලි'
            ]
          }
        ]
      },

      organizational: {
        title: 'සංවිධාන ආරක්ෂක පියවර',
        sections: [
          {
            name: 'ආරක්ෂක පාලන කළමනාකරණය',
            items: [
              'පත් තොරතුරු ආරක්ෂක නිලධාරිය',
              'ආරක්ෂක ප්‍රතිපත්ති හා ක්‍රියාවලිය',
              'සංචිත ආරක්ෂක අවදානම් ඇගයීම්',
              'තෙවන පාර්ශව ආරක්ෂක විගණන',
              'අනුකූලතා නිරීක්ෂණ වැඩසටහන්'
            ]
          },
          {
            name: 'කාර්ය මණ්ඩල ආරක්ෂාව',
            items: [
              'සේවකයින් සඳහා පසුබැසීමේ සත්‍යාපනය',
              'අනිවාර්ය ආරක්ෂක දැනුවත් කිරීමේ පුහුණුව',
              'රහස්‍ය හා ගිවිසුම්',
              'සැකසූ භූමිකා සහ වගකීම්',
              'අභ්‍යන්තර තර්ජන වැලැක්වීමේ ක්‍රියාමාර්ග'
            ]
          },
          {
            name: 'භෞතික ආරක්ෂාව',
            items: [
              'ආරක්ෂිත දත්ත මධ්‍යස්ථාන',
              'සේවාදායක කාමර සඳහා ප්‍රවේශ පාලනය',
              'CCTV නිරීක්ෂණය',
              'පරිසර පාලන (ගින්න, ජල ගැලීම)',
              'සංවේදී මාධ්ය ආරක්ෂිත ලෙස ඉවත් කිරීම'
            ]
          }
        ]
      },

      incident: {
        title: 'ආරක්ෂක සිදුවිම් ප්‍රතිචාරය',
        process: [
          {
            phase: 'හඳුනා ගැනීම',
            description: 'ස්වයංක්‍රීය මොනිතර පද්ධති සහ පරිශීලක වාර්තා වලින් හැකි ආරක්ෂක සිදුවීම් හඳුනාගැනේ',
            icon: Eye
          },
          {
            phase: 'ඇගයීම',
            description: 'ආරක්ෂක කණ්ඩායම සිදුවීමේ බරපතලභාවය සහ බලපෑම් ඇගයීමට කටයුතු කරයි',
            icon: AlertTriangle
          },
          {
            phase: 'වෙන් කිරීම',
            description: 'සිදුවීම පැතිරීම වැලැක්වීමට වහාම වෙන් කිරීමේ පියවර ගනී',
            icon: Shield
          },
          {
            phase: 'දැනුම් දීම',
            description: 'PDPA හා CERT|CC අවශ්‍යතා අනුව බලපෑම් උසස් අයට හා අදාළ වාර්තාකරුවන් දැනුම් දෙයි',
            icon: Mail
          }
        ],
        breach: {
          title: 'දත්ත කඩඉම් දැනුම් දීම',
          text: 'පුද්ගලික තොරතුරුට බලපෑම් වන දත්ත කඩඉමක් ඇති වුවහොත්:',
          timeline: [
            'පොදු දත්ත ආරක්ෂණ අධිකාරියට පැය 72 ඇතුළත දැනුම් දෙමු',
            'බලපෑම් වූ පුද්ගලයින්ට කඩිනම්ව දැනුම් දෙමු',
            'සිදුවීමේ පරිදිය හා නිරාකරණ පියවර විස්තර කරමු',
            'අවශ්‍ය පරිදි Sri Lanka CERT|CC වෙත වාර්තා කරමු'
          ]
        }
      },

      vulnerabilities: {
        title: 'දුරුබලතා හෙළිදරව් වැඩසටහන',
        text: 'ආරක්ෂක දුරුබලතා වගකීම් සහිතව හෙළිදරව් කිරීම ගැන අපි පිළිගනිමු. ඔබට දුරුබලතාවයක් හඳුනාගත්නම්:',
        process: [
          'security@nara.ac.lk වෙත විස්තර සමඟ විද්‍යුත් තැපැලක් යවන්න',
          'ප්‍රශ්නය නැවත උපත් කරගත හැකි පරිදි තොරතුරු සපයන්න',
          'දුරුබලතාව විසඳීමට අපට වගකීම් සහිත කාලයක් ලබා දෙන්න',
          'දුරුබලතාවය දුවා ගන්න හෝ පාරිභෝගික දත්තට ප්‍රවේශ වීමෙන් වළකිනු',
          'අප විසඳා අවසන් කරන තෙක් දුරස්ථව දැනුම් දීමෙන් වළකිනු'
        ],
        reward: 'වගකීම් සහිතව වාර්තා කරන ආරක්ෂක පර්යේෂකයින්ට අපි සනාථ කිරීම සිදු කරමු.',
        pgp: 'PGP පොදු යතුර ආරක්ෂිත සන්නිවේදනය සඳහා ලබා ගත හැක'
      },

      user: {
        title: 'පරිශීලක ආරක්ෂක වගකීම්',
        text: 'ඔබගේ දත්ත ආරක්ෂා කර තබා ගැනීම සඳහා පහත හොඳ ක්‍රියාමාර්ග අනුගමනය කරන්න:',
        practices: [
          {
            name: 'ශක්තිමත් මුරපද',
            tip: 'අක්ෂර 12ට වඩා දිගු, අනන්‍ය මුරපද භාවිතා කරන්න. හැකි තරම් MFA සක්‍රීය කරන්න.'
          },
          {
            name: 'සැක සහිත ක්‍රියාකාරකම්',
            tip: 'අසාමාන්‍ය ගිණුම් ක්‍රියාකාරකම් හෝ මධ්‍යස්ථ ලෙස පෙනෙන විද්‍යුත් තැපැල් වාර්තා කරන්න.'
          },
          {
            name: 'ආරක්ෂිත උපාංග',
            tip: 'ඔබගේ උපාංග නිතර යාවත්කාලීන කර විශ්වාසදායක අන්ටිවයිරස් භාවිතා කරන්න.'
          },
          {
            name: 'පොදු ජාල',
            tip: 'සංවේදී තොරතුරුට ප්‍රවේශ වීමට මහජන Wi-Fi ජාල භාවිතයෙන් වළකිනු.'
          },
          {
            name: 'Phishing ජාගෘතිකරණය',
            tip: 'NARA විසින් විද්‍යුත් තැපෑලෙන් ඔබගේ මුරපදය ඉල්ලනු නොලැබේ. යවන්නාගේ ස්ථාවරතාව සත්‍යාපනය කරන්න.'
          }
        ]
      },

      compliance: {
        title: 'නියාමන අනුකූලතාව',
        laws: [
          {
            name: 'පුද්ගල දත්ත ආරක්ෂණ පනත (PDPA)',
            year: '2022',
            requirement: 'වගකීම් සහිත තාක්ෂණික හා සංවිධාන ආරක්ෂක පියවර'
          },
          {
            name: 'පරිගණක අපරාධ පනත',
            year: '2007',
            requirement: 'අනවසර ප්‍රවේශ හා සයිබර් අපරාධ වලින් ආරක්ෂා වීම'
          },
          {
            name: 'ඉලෙක්ට්‍රොනික ගනුදෙනු පනත',
            year: '2006',
            requirement: 'ආරක්ෂිත ඉලෙක්ට්‍රොනික සන්නිවේදන සහ ගනුදෙනු'
          }
        ]
      },

      contact: {
        title: 'ආරක්ෂක සම්බන්ධතා',
        officers: [
          {
            role: 'තොරතුරු ආරක්ෂක නිලධාරී (ISO)',
            name: 'Mr. K.L. Perera',
            email: 'security@nara.ac.lk',
            phone: '+94 11 2 521000 Ext. 250',
            pgp: 'PGP අත්වැසි: XXXX XXXX XXXX XXXX'
          },
          {
            role: 'CERT|CC සම්බන්ධතා නිලධාරී',
            email: 'cert-liaison@nara.ac.lk',
            note: 'Sri Lanka CERT|CC සමඟ ආරක්ෂක සිදුවීම් සම්බන්ධීකරණය සඳහා'
          }
        ]
      }
    },
    ta: {
      title: 'பாதுகாப்பு கொள்கை',
      subtitle: 'தகவல் பாதுகாப்பு மற்றும் இணைய பாதுகாப்பு நடைமுறைகள்',
      effectiveDate: 'கடைசியாக புதுப்பிக்கப்பட்ட தேதி: 1 ஜனவரி 2025',

      intro: {
        title: 'எங்களின் பாதுகாப்பு உறுதி',
        text: 'தேசிய நீர்வளம் ஆராய்ச்சி மற்றும் மேம்பாட்டு நிறுவனம் (NARA) அதன் அனைத்து தகவல் வளங்களின் ரகசியம், செம்மை மற்றும் கிடைப்புத் தன்மையைப் பாதுகாக்க உறுதிபூண்டுள்ளது. இந்த பாதுகாப்பு கொள்கை, இலங்கை இணைய பாதுகாப்பு தரநிலைகள் மற்றும் உலகளாவிய சிறந்த நடைமுறைகளுக்கு இணங்க, உங்கள் தரவை மற்றும் எங்கள் டிஜிட்டல் சேவைகளை பாதுகாக்கும் தொழில்நுட்ப மற்றும் நிறுவன நடவடிக்கைகளை விளக்குகிறது.'
      },

      framework: {
        title: 'பாதுகாப்பு கட்டமைப்பு',
        text: 'எங்கள் பாதுகாப்பு திட்டம் கீழ்க்கண்ட தரநிலைகளுக்கு ஏற்ப அமைக்கப்பட்டுள்ளது:',
        standards: [
          {
            name: 'ISO/IEC 27001',
            description: 'தகவல் பாதுகாப்பு மேலாண்மை அமைப்பு',
            status: 'இணக்கமானது'
          },
          {
            name: 'Sri Lanka CERT|CC வழிகாட்டுதல்கள்',
            description: 'தேசிய இணைய பாதுகாப்பு தரநிலைகள்',
            status: 'இணக்கமானது'
          },
          {
            name: 'PDPA பாதுகாப்பு தேவைகள்',
            description: 'தனிநபர் தரவு பாதுகாப்பு சட்டத்தின் அவசியங்கள்',
            status: 'இணக்கமானது'
          },
          {
            name: 'ICTA பாதுகாப்பு தரநிலைகள்',
            description: 'அரசாங்க தகவல் தொழில்நுட்ப பாதுகாப்பு வழிகாட்டுதல்கள்',
            status: 'இணக்கமானது'
          }
        ]
      },

      technical: {
        title: 'தொழில்நுட்ப பாதுகாப்பு நடவடிக்கைகள்',
        categories: [
          {
            icon: Lock,
            name: 'தரவு குறியாக்கம்',
            measures: [
              'பயணிக்கும் தரவுகளுக்கான TLS 1.2+ குறியாக்கம்',
              'சங்கோஜமான தரவுகளுக்கான AES-256 குறியாக்கம்',
              'முக்கிய தகவல்களுக்கு முடிவு-to-முடிவு குறியாக்கம்',
              'பாதுகாப்பான விசை மேலாண்மையுடன் குறியாக்கப்பட்ட காப்புப்பிரதி',
              'தனிப்பட்ட தகவல்களுக்கான தரவுத்தளம் குறியாக்கம்'
            ]
          },
          {
            icon: Shield,
            name: 'அணுகல் கட்டுப்பாடு',
            measures: [
              'அனைத்து கணக்குகளுக்கும் பல-காரணி உண்மைப்படுத்தல் (MFA)',
              'பங்கு அடிப்படையிலான அணுகல் கட்டுப்பாடு (RBAC)',
              'குறைந்த உரிமையின் கொள்கையை அமல்படுத்தல்',
              'வழக்கமான அணுகல் மதிப்பாய்வுகள் மற்றும் ஆய்வுகள்',
              'குறைந்தபட்சம் 12 எழுத்துகளைக் கொண்ட வலுவான கடவுச்சொல் கொள்கை',
              'செயலற்ற காலத்திற்கு பின் தானியங்கி அமர்வு நிறுத்தம்'
            ]
          },
          {
            icon: Server,
            name: 'அடித்தள பாதுகாப்பு',
            measures: [
              'ஃபைர்வால் பாதுகாப்பு மற்றும் ஊடுருவல் கண்டறிதல்',
              'சீரான பாதுகாப்பு புதுப்பிப்புகள் மற்றும் தாள்கள்',
              'வலைப்பின்னல் பிரிவு மற்றும் தனிமைப்படுத்தல்',
              'DDoS பாதுகாப்பு மற்றும் வீதக் கட்டுப்பாடு',
              'பாதுகாப்பான மேக அடைகலம் (Firebase/GCP)',
              'இரட்டைப் பாங்குகள் மற்றும் மாற்றுப்பாதை முறைமைகள்'
            ]
          },
          {
            icon: Eye,
            name: 'மேற்பார்வை மற்றும் கண்டறிதல்',
            measures: [
              '24/7 பாதுகாப்பு கண்காணிப்பு மற்றும் பதிவேடு',
              'உடனடி அச்சுறுத்தல் கண்டறிதல் முறைமைகள்',
              'தானியங்கி பலவீனம் ஸ்கேனிங்',
              'SIEM (Security Information and Event Management)',
              'வழக்கமான ஊடுருவல் சோதனைகள்',
              'நிகழ்வு கண்டறிதல் மற்றும் பதில் நடைமுறைகள்'
            ]
          }
        ]
      },

      organizational: {
        title: 'அமைப்பு பாதுகாப்பு நடவடிக்கைகள்',
        sections: [
          {
            name: 'பாதுகாப்பு நிர்வாகம்',
            items: [
              'நியமிக்கப்பட்ட தகவல் பாதுகாப்பு அலுவலர்',
              'பாதுகாப்பு கொள்கைகள் மற்றும் நடைமுறைகள்',
              'வழக்கமான பாதுகாப்பு ஆபத்து மதிப்பீடுகள்',
              'மூன்றாம் தரப்பு பாதுகாப்பு தணிக்கைகள்',
              'இணக்கம் கண்காணிப்பு திட்டம்'
            ]
          },
          {
            name: 'பணியாளர் பாதுகாப்பு',
            items: [
              'பணியாளர்களுக்கான பின்னணி சரிபார்ப்பு',
              'கட்டாய பாதுகாப்பு விழிப்புணர்வு பயிற்சி',
              'ரகசியத்தன்மை மற்றும் ஒப்பந்தங்கள்',
              'தெளிவான பங்கை மற்றும் பொறுப்புகள்',
              'உள்துறை அச்சுறுத்தல் தடுப்பு நடவடிக்கைகள்'
            ]
          },
          {
            name: 'உடல் பாதுகாப்பு',
            items: [
              'பாதுகாப்பான தரவு மைய வசதிகள்',
              'சேவையக அறைகளுக்கான அணுகல் கட்டுப்பாடு',
              'CCTV கண்காணிப்பு',
              'சூழல் கட்டுப்பாடுகள் (தீ, வெள்ளம்)',
              'முக்கிய ஊடகங்களை பாதுகாப்பாக அகற்றல்'
            ]
          }
        ]
      },

      incident: {
        title: 'பாதுகாப்பு சம்பவ பதில்',
        process: [
          {
            phase: 'கண்டறிதல்',
            description: 'தானியங்கி கண்காணிப்பு முறைமைகள் மற்றும் பயனர் அறிக்கைகள் மூலம் பாதுகாப்பு சம்பவங்கள் கண்டறியப்படுகின்றன',
            icon: Eye
          },
          {
            phase: 'மதிப்பீடு',
            description: 'பாதுகாப்பு குழு சம்பவத்தின் தீவிரத்தையும் தாக்கத்தையும் மதிப்பிடுகிறது',
            icon: AlertTriangle
          },
          {
            phase: 'தடுப்பு',
            description: 'சம்பவம் பரவாமல் தடுக்க உடனடி நடவடிக்கைகள் எடுக்கப்படுகின்றன',
            icon: Shield
          },
          {
            phase: 'அறிவிப்பு',
            description: 'PDPA மற்றும் CERT|CC தேவைகளின் அடிப்படையில் பாதிக்கப்பட்ட பயனர்களுக்கும் அதிகாரிகளுக்கும் அறிவிக்கப்படுகிறது',
            icon: Mail
          }
        ],
        breach: {
          title: 'தரவு கசிவு அறிவிப்பு',
          text: 'தனிப்பட்ட தரவுகளை பாதிக்கும் தரவு கசிவு ஏற்படில்:',
          timeline: [
            'நாங்கள் 72 மணிநேரங்களுக்குள் தரவு பாதுகாப்பு அதிகாரத்தை அறிவிப்போம்',
            'பாதிக்கப்பட்ட நபர்களுக்கு உடனடியாக அறிவிக்கப்படும்',
            'கசிவின் விவரங்களையும் தடுப்பு நடவடிக்கைகளையும் வழங்குவோம்',
            'தேவைப்பட்டால் Sri Lanka CERT|CC-க்கு அறிக்கை சமர்ப்பிக்கப்படும்'
          ]
        }
      },

      vulnerabilities: {
        title: 'பலவீனம் வெளியீட்டு திட்டம்',
        text: 'பாதுகாப்பு பலவீனங்களை பொறுப்புடன் அறிவிப்பதை நாங்கள் வரவேற்கிறோம். நீங்கள் ஒரு பலவீனத்தை கண்டறிந்தால்:',
        process: [
          'security@nara.ac.lk க்கு விரிவான தகவல்களுடன் மின்னஞ்சல் செய்யவும்',
          'சிக்கலை மீண்டும் உருவாக்க போதிய தகவலை வழங்கவும்',
          'பலவீனத்தை சரிசெய்ய சரியான நேரத்தை எங்களுக்கு வழங்கவும்',
          'பலவீனத்தை பயன்படுத்தவோ அல்லது பயனர் தரவுகளை அணுகவோ வேண்டாம்',
          'நாங்கள் சரிசெய்யும் வரை பலவீனத்தை பொதுவில் வெளியிட வேண்டாம்'
        ],
        reward: 'பொறுப்புடன் அறிவிக்கும் பாதுகாப்பு ஆராய்ச்சியாளர்களை நாங்கள் பாராட்டுகிறோம்.',
        pgp: 'PGP பொதுக் திறவுகோல் பாதுகாப்பான தொடர்புக்கு கிடைக்கிறது'
      },

      user: {
        title: 'பயனர் பாதுகாப்பு பொறுப்புகள்',
        text: 'உங்கள் தரவை பாதுகாப்பாக வைத்திருக்க கீழ்க்கண்ட சிறந்த நடைமுறைகளைப் பின்பற்றுங்கள்:',
        practices: [
          {
            name: 'வலுவான கடவுச்சொற்கள்',
            tip: 'குறைந்தபட்சம் 12 எழுத்துகள் கொண்ட தனித்துவமான கடவுச்சொற்களைப் பயன்படுத்தவும். சாத்தியமான இடங்களில் MFA ஐ செயல்படுத்தவும்.'
          },
          {
            name: 'சந்தேகமான செயல்பாடுகள்',
            tip: 'சந்தேகமான கணக்கு நடவடிக்கைகள் அல்லது பிஷிங் மின்னஞ்சல்களை உடனடியாக அறியத்தரவும்.'
          },
          {
            name: 'பாதுகாப்பான சாதனங்கள்',
            tip: 'சாதனங்களை புதுப்பித்து வைத்திருக்கவும் மற்றும் நம்பகமான வைரஸ் எதிர்ப்பு பயன்பாடுகளைப் பயன்படுத்தவும்.'
          },
          {
            name: 'பொது வலைப்பின்னல்கள்',
            tip: 'பொது Wi-Fi வலைப்பின்னல்களில் உணர்திறன் கொண்ட தகவல்களை அணுகுவதைத் தவிர்க்கவும்.'
          },
          {
            name: 'Phishing விழிப்புணர்வு',
            tip: 'NARA எப்போதும் மின்னஞ்சல் மூலம் உங்கள் கடவுச்சொல்லை கேட்காது. அனுப்புநரின் நம்பகத்தன்மையை சரிபார்க்கவும்.'
          }
        ]
      },

      compliance: {
        title: 'நியமன இணக்கம்',
        laws: [
          {
            name: 'தனிநபர் தரவு பாதுகாப்பு சட்டம் (PDPA)',
            year: '2022',
            requirement: 'சரியான தொழில்நுட்ப மற்றும் அமைப்பு பாதுகாப்பு நடவடிக்கைகள்'
          },
          {
            name: 'கணினி குற்றங்கள் சட்டம்',
            year: '2007',
            requirement: 'அனுமதியற்ற அணுகல் மற்றும் இணைய குற்றங்களிலிருந்து பாதுகாப்பு'
          },
          {
            name: 'மின்னணு பரிவர்த்தனை சட்டம்',
            year: '2006',
            requirement: 'பாதுகாப்பான மின்னணு தொடர்புகள் மற்றும் பரிவர்த்தனைகள்'
          }
        ]
      },

      contact: {
        title: 'பாதுகாப்பு தொடர்புக்கள்',
        officers: [
          {
            role: 'தகவல் பாதுகாப்பு அலுவலர் (ISO)',
            name: 'Mr. K.L. Perera',
            email: 'security@nara.ac.lk',
            phone: '+94 11 2 521000 Ext. 250',
            pgp: 'PGP கைரேகை: XXXX XXXX XXXX XXXX'
          },
          {
            role: 'CERT|CC இணைப்பாளர்',
            email: 'cert-liaison@nara.ac.lk',
            note: 'Sri Lanka CERT|CC உடன் பாதுகாப்பு சம்பவங்களை ஒருங்கிணைக்க'
          }
        ]
      }
    }
  };

  const contentData = content[currentLang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] border-b border-[#003366]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" lang={currentLang}>
                {contentData.title}
              </h1>
              <p className="text-blue-100 text-lg" lang={currentLang}>
                {contentData.subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-100">{contentData.effectiveDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              {contentData.intro.title}
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">{contentData.intro.text}</p>
          </section>

          {/* Security Framework */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{contentData.framework.title}</h2>
            <p className="text-slate-600 mb-6">{contentData.framework.text}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {contentData.framework.standards.map((standard, idx) => (
                <div key={idx} className="bg-slate-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{standard.name}</h3>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                      {standard.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{standard.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Security */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{contentData.technical.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {contentData.technical.categories.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {category.measures.map((measure, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="text-red-600 mt-1">✓</span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Organizational Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{contentData.organizational.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {contentData.organizational.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-600 mb-3">{section.name}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-orange-600 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Incident Response */}
          <section className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              {contentData.incident.title}
            </h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {contentData.incident.process.map((phase, idx) => {
                const IconComponent = phase.icon;
                return (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 text-center">
                    <IconComponent className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-2">{phase.phase}</h3>
                    <p className="text-xs text-slate-600">{phase.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-600 mb-3">{contentData.incident.breach.title}</h3>
              <p className="text-slate-600 mb-4">{contentData.incident.breach.text}</p>
              <ul className="space-y-3">
                {contentData.incident.breach.timeline.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-red-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Vulnerability Disclosure */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <FileWarning className="w-6 h-6 text-orange-600" />
              {contentData.vulnerabilities.title}
            </h2>
            <p className="text-slate-600 mb-4">{contentData.vulnerabilities.text}</p>
            <ol className="space-y-2 mb-4">
              {contentData.vulnerabilities.process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-green-600">{contentData.vulnerabilities.reward}</p>
              <p className="text-xs text-slate-700">{contentData.vulnerabilities.pgp}</p>
            </div>
          </section>

          {/* User Security */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Key className="w-6 h-6 text-[#0066CC]" />
              {contentData.user.title}
            </h2>
            <p className="text-slate-600 mb-6">{contentData.user.text}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {contentData.user.practices.map((practice, idx) => (
                <div key={idx} className="bg-blue-50 border border-[#0066CC]/20 rounded-lg p-4">
                  <h3 className="font-semibold text-[#003366] mb-2">{practice.name}</h3>
                  <p className="text-sm text-slate-600">{practice.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{contentData.contact.title}</h2>
            {contentData.contact.officers.map((officer, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-600 mb-3">{officer.role}</h3>
                <div className="space-y-1 text-sm text-slate-600">
                  {officer.name && <p>Name: {officer.name}</p>}
                  <p>Email: <a href={`mailto:${officer.email}`} className="text-[#0066CC] hover:text-[#003366]">{officer.email}</a></p>
                  {officer.phone && <p>Phone: {officer.phone}</p>}
                  {officer.pgp && <p className="text-xs text-slate-700">{officer.pgp}</p>}
                  {officer.note && <p className="text-xs text-slate-700 italic">{officer.note}</p>}
                </div>
              </div>
            ))}
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:security@nara.ac.lk"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Report Security Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;
