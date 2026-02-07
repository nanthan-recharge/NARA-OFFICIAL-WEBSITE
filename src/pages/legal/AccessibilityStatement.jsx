import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Keyboard, Ear, MousePointer, Smartphone, CheckCircle, AlertCircle, Mail } from 'lucide-react';

const AccessibilityStatement = () => {
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
      title: 'Accessibility Statement',
      subtitle: 'Our Commitment to Digital Accessibility',
      effectiveDate: 'Last Updated: January 1, 2025',
      
      commitment: {
        title: 'Our Commitment',
        text: 'The National Aquatic Resources Research and Development Agency (NARA) is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.'
      },

      standards: {
        title: 'Accessibility Standards',
        text: 'We aim to conform to the following standards:',
        items: [
          {
            name: 'WCAG 2.1 Level AA',
            description: 'Web Content Accessibility Guidelines 2.1 at Level AA',
            status: 'Targeted'
          },
          {
            name: 'Sri Lanka Web Guidelines',
            description: 'ICTA Sri Lanka Web Accessibility Standards',
            status: 'Compliant'
          },
          {
            name: 'UN CRPD',
            description: 'UN Convention on the Rights of Persons with Disabilities',
            status: 'Aligned'
          }
        ]
      },

      features: {
        title: 'Accessibility Features',
        items: [
          {
            icon: Eye,
            name: 'Visual Accessibility',
            features: [
              'High contrast color schemes',
              'Resizable text without loss of content',
              'Clear visual focus indicators',
              'Alternative text for images',
              'Descriptive link text',
              'Consistent navigation structure'
            ]
          },
          {
            icon: Keyboard,
            name: 'Keyboard Navigation',
            features: [
              'Full keyboard accessibility',
              'Logical tab order',
              'Skip navigation links',
              'Keyboard shortcuts for common actions',
              'No keyboard traps',
              'Focus management in dynamic content'
            ]
          },
          {
            icon: Ear,
            name: 'Audio & Content',
            features: [
              'Captions for video content',
              'Transcripts for audio content',
              'Text alternatives for non-text content',
              'Multi-language support (EN/SI/TA)',
              'Plain language usage',
              'Structured heading hierarchy'
            ]
          },
          {
            icon: MousePointer,
            name: 'Screen Reader Support',
            features: [
              'ARIA landmarks and labels',
              'Descriptive page titles',
              'Meaningful link context',
              'Form label associations',
              'Error identification and suggestions',
              'Status messages and alerts'
            ]
          },
          {
            icon: Smartphone,
            name: 'Mobile Accessibility',
            features: [
              'Responsive design for all devices',
              'Touch-friendly interactive elements',
              'Orientation support (portrait/landscape)',
              'Zoom without horizontal scrolling',
              'Mobile screen reader compatibility',
              'Voice control compatibility'
            ]
          }
        ]
      },

      limitations: {
        title: 'Known Limitations',
        text: 'Despite our efforts, some areas may still have accessibility issues:',
        items: [
          'Some PDF documents may not be fully accessible (we are working to remediate these)',
          'Certain third-party embedded content may have limited accessibility',
          'Legacy documents and archives may not meet current standards',
          'Complex data visualizations may require alternative formats'
        ],
        action: 'If you encounter any accessibility barriers, please contact us using the information below.'
      },

      assistive: {
        title: 'Compatible Assistive Technologies',
        text: 'Our website is designed to work with the following assistive technologies:',
        technologies: [
          'JAWS (Job Access With Speech)',
          'NVDA (NonVisual Desktop Access)',
          'VoiceOver (macOS and iOS)',
          'TalkBack (Android)',
          'ZoomText',
          'Dragon NaturallySpeaking',
          'Browser built-in accessibility features'
        ]
      },

      testing: {
        title: 'Accessibility Testing',
        text: 'We regularly test our website using:',
        methods: [
          'Automated accessibility scanners (WAVE, axe, Lighthouse)',
          'Manual testing with screen readers',
          'Keyboard-only navigation testing',
          'Color contrast analysis',
          'Mobile accessibility testing',
          'User testing with people with disabilities'
        ]
      },

      feedback: {
        title: 'Accessibility Feedback',
        text: 'We welcome your feedback on the accessibility of our digital services. If you encounter accessibility barriers:',
        contact: {
          email: 'accessibility@nara.ac.lk',
          phone: '+94 11 2 521000',
          response: 'We aim to respond to accessibility feedback within 5 business days.'
        },
        info: 'Please provide:',
        required: [
          'The web page or content you were trying to access',
          'The problem you encountered',
          'Your contact information (if you would like a response)',
          'The assistive technology you were using (if applicable)'
        ]
      },

      enforcement: {
        title: 'Enforcement and Compliance',
        text: 'This accessibility statement is approved by:',
        approval: [
          'NARA Digital Services Team',
          'ICTA Sri Lanka (Information and Communication Technology Agency)',
          'Department of Government Information'
        ],
        process: 'We review this statement regularly and update it based on feedback and changing standards.'
      },

      assessment: {
        title: 'Assessment Approach',
        text: 'NARA assessed the accessibility of this website by:',
        methods: [
          'Self-evaluation using WCAG 2.1 success criteria',
          'External accessibility audit (Annual)',
          'Ongoing monitoring and testing',
          'User feedback and complaints review'
        ],
        date: 'Last formal assessment: December 2024',
        next: 'Next scheduled assessment: December 2025'
      }
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] border-b border-[#003366]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start sm:items-center gap-4 mb-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-white/20 p-2 shadow-lg ring-1 ring-white/30">
              <img
                src="/assets/nara-logo.png"
                alt="NARA logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{t.title}</h1>
              <p className="text-blue-100 text-base sm:text-lg">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-blue-100">{t.effectiveDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-8 md:p-12 space-y-10 sm:space-y-12">
          
          {/* Commitment */}
          <section className="bg-blue-50 border-2 border-[#0066CC]/20 rounded-xl p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.commitment.title}</h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{t.commitment.text}</p>
          </section>

          {/* Standards */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.standards.title}</h2>
            <p className="text-slate-600 mb-6">{t.standards.text}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {t.standards.items.map((item, idx) => (
                <div key={idx} className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                  <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">{t.features.title}</h2>
            <div className="grid gap-6">
              {t.features.items.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start sm:items-center gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066CC]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{item.name}</h3>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
                          <span className="text-[#0066CC] mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              {t.limitations.title}
            </h2>
            <p className="text-slate-600 mb-4">{t.limitations.text}</p>
            <ul className="space-y-2 mb-4">
              {t.limitations.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-amber-600 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-amber-600 italic">{t.limitations.action}</p>
          </section>

          {/* Compatible Technologies */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.assistive.title}</h2>
            <p className="text-slate-600 mb-4">{t.assistive.text}</p>
            <div className="grid md:grid-cols-3 gap-3">
              {t.assistive.technologies.map((tech, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">{tech}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback */}
          <section className="bg-blue-50 border-2 border-[#0066CC]/20 rounded-xl p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#0066CC]" />
              {t.feedback.title}
            </h2>
            <p className="text-slate-700 mb-6">{t.feedback.text}</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <p className="text-slate-600 mb-3">Email: <a href={`mailto:${t.feedback.contact.email}`} className="text-[#0066CC] hover:text-[#003366] font-semibold">{t.feedback.contact.email}</a></p>
              <p className="text-slate-600 mb-3">Phone: {t.feedback.contact.phone}</p>
              <p className="text-sm text-slate-700 italic">{t.feedback.contact.response}</p>
            </div>

            <p className="text-slate-600 mb-3 font-semibold">{t.feedback.info}</p>
            <ul className="space-y-2">
              {t.feedback.required.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-[#0066CC] mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Assessment */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.assessment.title}</h2>
            <p className="text-slate-600 mb-4">{t.assessment.text}</p>
            <ul className="space-y-2 mb-4">
              {t.assessment.methods.map((method, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  {method}
                </li>
              ))}
            </ul>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-700">{t.assessment.date}</p>
              <p className="text-sm text-slate-700">{t.assessment.next}</p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="w-full sm:w-auto text-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
