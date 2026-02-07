import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin, ExternalLink, Download } from 'lucide-react';

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    window.scrollTo(0, 0);
    const lang = localStorage.getItem('nara-lang') || 'en';
    setLanguage(lang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'Personal Data Protection Act (PDPA) Compliance',
      effectiveDate: 'Effective Date: January 1, 2025',
      lastUpdated: 'Last Updated: January 1, 2025',
      version: 'Version 1.0',
      
      intro: {
        title: 'Introduction',
        text: 'The National Aquatic Resources Research and Development Agency (NARA) is committed to protecting your privacy and personal data in accordance with the Personal Data Protection Act, No. 9 of 2022 (PDPA) and all applicable Sri Lankan data protection laws. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our digital services.'
      },
      
      controller: {
        title: 'Data Controller',
        name: 'National Aquatic Resources Research & Development Agency (NARA)',
        address: 'Crow Island, Colombo 15, Sri Lanka',
        phone: '+94 11 2 521000',
        email: 'dpo@nara.ac.lk',
        text: 'NARA acts as the Data Controller for all personal data processed through this website and associated digital services.'
      },
      
      collection: {
        title: 'What Information We Collect',
        categories: [
          {
            name: 'Personal Identification Data',
            items: ['Full name', 'National Identity Card (NIC) number (where required by law)', 'Date of birth', 'Contact information (email, phone, address)', 'Photographs (when provided)']
          },
          {
            name: 'Technical Data',
            items: ['IP address', 'Browser type and version', 'Device information', 'Operating system', 'Cookies and similar technologies', 'Usage data and analytics']
          },
          {
            name: 'Service-Specific Data',
            items: ['Research applications and submissions', 'Payment transaction details', 'Communication records', 'Feedback and survey responses', 'RTI (Right to Information) requests']
          }
        ]
      },
      
      lawfulBasis: {
        title: 'Lawful Basis for Processing',
        bases: [
          {
            name: 'Legal Obligation',
            text: 'Processing necessary to comply with legal obligations under Sri Lankan law, including fisheries regulations, environmental protection, and government reporting requirements.'
          },
          {
            name: 'Public Task',
            text: 'Processing necessary for the performance of our statutory functions as a government research agency under the NARA Act and related legislation.'
          },
          {
            name: 'Consent',
            text: 'Where you have freely given your specific, informed, and unambiguous consent for processing (e.g., newsletter subscriptions, optional surveys).'
          },
          {
            name: 'Contractual Necessity',
            text: 'Processing necessary to fulfill contractual obligations (e.g., research partnerships, procurement contracts).'
          }
        ]
      },
      
      use: {
        title: 'How We Use Your Information',
        purposes: [
          'To provide and improve our digital services',
          'To process applications, requests, and transactions',
          'To communicate with you about our services and updates',
          'To comply with legal and regulatory obligations',
          'To conduct research and statistical analysis',
          'To ensure website security and prevent fraud',
          'To respond to RTI requests under the Right to Information Act',
          'To manage stakeholder relationships and partnerships'
        ]
      },
      
      sharing: {
        title: 'Information Sharing',
        text: 'We do not sell, rent, or trade your personal data. We may share your information only in the following circumstances:',
        scenarios: [
          {
            name: 'Government Agencies',
            text: 'With other Sri Lankan government ministries and agencies when required by law or for legitimate public purposes.'
          },
          {
            name: 'Service Providers',
            text: 'With trusted third-party service providers who assist in operating our services (e.g., cloud hosting, payment processing), bound by strict data protection agreements.'
          },
          {
            name: 'Legal Requirements',
            text: 'When required by law, court order, or to protect our rights, property, or safety, or that of others.'
          },
          {
            name: 'Research Partners',
            text: 'With academic and research institutions under data sharing agreements, with appropriate anonymization where possible.'
          }
        ]
      },
      
      international: {
        title: 'International Transfers',
        text: 'Where we use service providers located outside Sri Lanka (e.g., cloud services), we ensure appropriate safeguards are in place as required by the PDPA, including:',
        safeguards: [
          'Adequacy decisions recognized by Sri Lankan authorities',
          'Standard contractual clauses',
          'Binding corporate rules',
          'Explicit consent where required'
        ]
      },
      
      retention: {
        title: 'Data Retention',
        text: 'We retain personal data only for as long as necessary to fulfill the purposes for which it was collected or as required by law. Retention periods vary based on:',
        factors: [
          'Legal and regulatory requirements (National Archives Law)',
          'The nature of the data and purpose of processing',
          'Ongoing business relationships',
          'Audit and compliance requirements'
        ],
        note: 'You may request deletion of your data subject to legal retention obligations.'
      },
      
      rights: {
        title: 'Your Data Subject Rights (PDPA)',
        intro: 'Under the PDPA, you have the following rights:',
        list: [
          {
            name: 'Right to Access',
            text: 'Request a copy of the personal data we hold about you.'
          },
          {
            name: 'Right to Rectification',
            text: 'Request correction of inaccurate or incomplete data.'
          },
          {
            name: 'Right to Erasure',
            text: 'Request deletion of your data (subject to legal obligations).'
          },
          {
            name: 'Right to Restriction',
            text: 'Request limitation of processing in certain circumstances.'
          },
          {
            name: 'Right to Object',
            text: 'Object to processing based on legitimate interests.'
          },
          {
            name: 'Right to Data Portability',
            text: 'Receive your data in a structured, machine-readable format.'
          },
          {
            name: 'Right to Withdraw Consent',
            text: 'Withdraw consent at any time (where processing is based on consent).'
          },
          {
            name: 'Right to Complain',
            text: 'Lodge a complaint with the Data Protection Authority of Sri Lanka.'
          }
        ],
        exercise: 'To exercise these rights, please visit our',
        portal: 'Data Subject Rights Portal',
        or: 'or contact our Data Protection Officer.'
      },
      
      security: {
        title: 'Security Measures',
        text: 'We implement robust technical and organizational measures to protect your personal data:',
        measures: [
          'TLS/SSL encryption for data in transit',
          'Encryption at rest for sensitive data',
          'Access controls and authentication mechanisms',
          'Regular security audits and penetration testing',
          'Employee training on data protection',
          'Incident response and breach notification procedures',
          'Compliance with Sri Lanka CERT|CC guidelines',
          'ISO 27001 aligned security controls'
        ]
      },
      
      cookies: {
        title: 'Cookies and Tracking',
        text: 'We use cookies and similar technologies to enhance your experience. For detailed information, please see our',
        link: 'Cookie Policy'
      },
      
      children: {
        title: 'Children\'s Privacy',
        text: 'Our services are not directed to children under 18 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, please contact us immediately.'
      },
      
      changes: {
        title: 'Changes to This Policy',
        text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting a notice on our website or by email. Your continued use of our services after such changes constitutes acceptance.'
      },
      
      contact: {
        title: 'Contact Us',
        text: 'For questions about this Privacy Policy or to exercise your data rights, please contact:',
        dpo: 'Data Protection Officer (DPO)',
        organization: 'National Aquatic Resources Research & Development Agency',
        address: 'Crow Island, Colombo 15, Sri Lanka',
        email: 'dpo@nara.ac.lk',
        phone: '+94 11 2 521000',
        alternative: 'You may also submit requests through our online',
        alternativeLink: 'Data Subject Rights Portal'
      },
      
      authority: {
        title: 'Data Protection Authority',
        text: 'You have the right to lodge a complaint with the Data Protection Authority of Sri Lanka:',
        name: 'Data Protection Authority of Sri Lanka',
        website: 'www.dpa.gov.lk',
        address: 'Level 25, West Tower, World Trade Center, Echelon Square, Colombo 01, Sri Lanka'
      },
      
      download: 'Download PDF Version',
      print: 'Print this Policy',
      backHome: 'Back to Home'
    },
    // Abbreviated Sinhala/Tamil for space - full versions would be much longer
    si: {
      title: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
      subtitle: 'පුද්ගලික දත්ත ආරක්ෂණ පනත (PDPA) අනුකූලතාවය',
      // ... (similar structure in Sinhala)
    },
    ta: {
      title: 'தனியுரிமைக் கொள்கை',
      subtitle: 'தனிப்பட்ட தரவு பாதுகாப்புச் சட்டம் (PDPA) இணக்கம்',
      // ... (similar structure in Tamil)
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] border-b border-[#003366]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-white/20 p-2 shadow-lg ring-1 ring-white/30">
              <img
                src="/assets/nara-logo.png"
                alt="NARA logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-blue-100 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t.effectiveDate}
            </span>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t.lastUpdated}
            </span>
            <span className="flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full">
              {t.version}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0066CC]" />
              </div>
              {t.intro.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">{t.intro.text}</p>
          </section>

          {/* Data Controller */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.controller.title}</h2>
            <div className="space-y-2 text-slate-600">
              <p className="font-semibold text-[#003366]">{t.controller.name}</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                {t.controller.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t.controller.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${t.controller.email}`} className="text-[#0066CC] hover:text-[#003366]">
                  {t.controller.email}
                </a>
              </p>
            </div>
          </section>

          {/* Collection */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#0066CC]" />
              </div>
              {t.collection.title}
            </h2>
            <div className="space-y-4">
              {t.collection.categories.map((cat, idx) => (
                <div key={idx} className="border-l-4 border-[#0066CC]/30 pl-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{cat.name}</h3>
                  <ul className="space-y-1 text-slate-600 text-sm">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0066CC] mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Lawful Basis */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#0066CC]" />
              </div>
              {t.lawfulBasis.title}
            </h2>
            <div className="grid gap-4">
              {t.lawfulBasis.bases.map((basis, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-[#003366] mb-2">{basis.name}</h3>
                  <p className="text-slate-600 text-sm">{basis.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How We Use */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.use.title}</h2>
            <ul className="space-y-2 text-slate-600">
              {t.use.purposes.map((purpose, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-[#0066CC] text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  {purpose}
                </li>
              ))}
            </ul>
          </section>

          {/* Your Rights (Highlighted) */}
          <section className="bg-blue-50 border-2 border-[#0066CC]/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#0066CC]" />
              {t.rights.title}
            </h2>
            <p className="text-slate-600 mb-6">{t.rights.intro}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {t.rights.list.map((right, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-[#003366] mb-2">{right.name}</h3>
                  <p className="text-slate-600 text-sm">{right.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                {t.rights.exercise}{' '}
                <Link to="/data-subject-rights" className="text-[#0066CC] hover:text-[#003366] font-semibold underline">
                  {t.rights.portal}
                </Link>
                {' '}{t.rights.or}
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.contact.title}</h2>
            <p className="text-slate-600 mb-4">{t.contact.text}</p>
            <div className="space-y-2 text-slate-600">
              <p className="font-semibold text-[#003366]">{t.contact.dpo}</p>
              <p>{t.contact.organization}</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                {t.contact.address}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${t.contact.email}`} className="text-[#0066CC] hover:text-[#003366]">
                  {t.contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t.contact.phone}
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-sm transition-all"
            >
              {t.backHome}
            </Link>
            <button className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
