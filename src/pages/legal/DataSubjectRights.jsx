import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Eye, Edit, Trash2, Lock, Download, AlertCircle, Send, CheckCircle } from 'lucide-react';

const DataSubjectRights = () => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    requestType: '',
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    details: '',
    verification: ''
  });
  const [submitted, setSubmitted] = useState(false);

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
      title: 'Data Subject Rights Portal',
      subtitle: 'Exercise Your Rights Under the PDPA',
      intro: 'Under the Personal Data Protection Act, No. 9 of 2022 (PDPA), you have the following rights regarding your personal data held by NARA. Use this secure portal to submit your request.',
      
      rights: [
        {
          icon: Eye,
          type: 'access',
          name: 'Right to Access',
          description: 'Request a copy of the personal data we hold about you.',
          timeline: 'Response within 30 days'
        },
        {
          icon: Edit,
          type: 'rectification',
          name: 'Right to Rectification',
          description: 'Request correction of inaccurate or incomplete data.',
          timeline: 'Correction within 14 days'
        },
        {
          icon: Trash2,
          type: 'erasure',
          name: 'Right to Erasure',
          description: 'Request deletion of your personal data (subject to legal obligations).',
          timeline: 'Review within 30 days'
        },
        {
          icon: Lock,
          type: 'restriction',
          name: 'Right to Restriction',
          description: 'Request limitation of processing in certain circumstances.',
          timeline: 'Review within 21 days'
        },
        {
          icon: Download,
          type: 'portability',
          name: 'Right to Data Portability',
          description: 'Receive your data in a structured, machine-readable format.',
          timeline: 'Delivery within 30 days'
        },
        {
          icon: AlertCircle,
          type: 'object',
          name: 'Right to Object',
          description: 'Object to processing based on legitimate interests.',
          timeline: 'Review within 21 days'
        }
      ],

      form: {
        title: 'Submit Your Request',
        selectType: 'Select Request Type',
        selectPlaceholder: 'Choose the type of request...',
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        nic: 'NIC Number (for verification)',
        details: 'Request Details',
        detailsPlaceholder: 'Please provide specific details about your request...',
        verification: 'Identity Verification',
        verificationPlaceholder: 'How would you like to verify your identity? (e.g., NIC copy, passport)',
        submit: 'Submit Request',
        submitting: 'Submitting...',
        important: 'Important Information',
        importantText: 'We take your privacy seriously. All requests are processed securely and confidentially. You will receive an acknowledgment within 72 hours and a full response within the timeline specified for your request type.',
        required: 'All fields are required for security and verification purposes.',
        trackingId: 'Request Tracking ID'
      },

      success: {
        title: 'Request Submitted Successfully!',
        message: 'Your data subject rights request has been received and is being processed.',
        tracking: 'Your tracking number',
        next: 'What happens next?',
        steps: [
          'You will receive an email confirmation within 72 hours.',
          'Our Data Protection Officer will review your request.',
          'We may contact you for identity verification.',
          'You will receive a response within the specified timeline.'
        ],
        contact: 'For urgent queries, contact our Data Protection Officer at dpo@nara.ac.lk',
        backButton: 'Submit Another Request',
        homeButton: 'Back to Home'
      },

      security: {
        title: 'Security & Privacy',
        items: [
          'All submissions are encrypted using TLS/SSL',
          'Requests are handled by authorized personnel only',
          'Your data is processed in accordance with PDPA',
          'Identity verification is required for all requests'
        ]
      }
    },
    si: {
      title: 'දත්ත විෂය අයිතිවාසිකම් ද්වාරය',
      subtitle: 'PDPA යටතේ ඔබේ අයිතිවාසිකම් භාවිතා කරන්න',
      // ... (abbreviated for space)
    },
    ta: {
      title: 'தரவு பாதுகாப்பு உரிமைகள் நுழைவாயில்',
      subtitle: 'PDPA இன் கீழ் உங்கள் உரிமைகளைப் பயன்படுத்தவும்',
      // ... (abbreviated for space)
    }
  };

  const t = content[language] || content.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate tracking ID
    const trackingId = `DSR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setFormData({ ...formData, trackingId });
    setSubmitted(true);
    
    // In production, this would send to backend/email
    console.log('DSR Request:', formData, trackingId);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{t.success.title}</h1>
            <p className="text-slate-600 text-lg mb-8">{t.success.message}</p>
            
            <div className="bg-slate-50 border border-green-200 rounded-xl p-6 mb-8">
              <p className="text-sm text-slate-700 mb-2">{t.success.tracking}</p>
              <p className="text-2xl font-mono font-bold text-green-600">{formData.trackingId}</p>
            </div>

            <div className="text-left bg-slate-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.success.next}</h3>
              <ol className="space-y-3">
                {t.success.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-[#0066CC] text-sm font-bold">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-sm text-slate-700 mb-6">{t.success.contact}</p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    requestType: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    nic: '',
                    details: '',
                    verification: ''
                  });
                }}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                {t.success.backButton}
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                {t.success.homeButton}
              </Link>
            </div>
          </div>
        </div>

        <GovFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] border-b border-[#003366]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-blue-100 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-blue-100 max-w-3xl">{t.intro}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Rights Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {t.rights.map((right, idx) => {
            const IconComponent = right.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:border-[#0066CC]/30 transition-all cursor-pointer"
                onClick={() => setFormData({ ...formData, requestType: right.type })}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#0066CC]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">{right.name}</h3>
                    <p className="text-sm text-slate-600">{right.description}</p>
                  </div>
                </div>
                <div className="text-xs text-[#0066CC] bg-blue-50 border border-[#003366]/20 rounded px-3 py-1.5 inline-block">
                  {right.timeline}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.form.title}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    {t.form.selectType} *
                  </label>
                  <select
                    required
                    value={formData.requestType}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  >
                    <option value="">{t.form.selectPlaceholder}</option>
                    {t.rights.map((right, idx) => (
                      <option key={idx} value={right.type}>{right.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {t.form.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {t.form.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {t.form.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {t.form.nic} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nic}
                      onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    {t.form.details} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={t.form.detailsPlaceholder}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    {t.form.verification} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.verification}
                    onChange={(e) => setFormData({ ...formData, verification: e.target.value })}
                    placeholder={t.form.verificationPlaceholder}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {t.form.submit}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-[#0066CC]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-[#0066CC]" />
                <h3 className="font-bold text-slate-900">{t.form.important}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">{t.form.importantText}</p>
              <p className="text-xs text-slate-700">{t.form.required}</p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-slate-900">{t.security.title}</h3>
              </div>
              <ul className="space-y-2">
                {t.security.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-600 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSubjectRights;
