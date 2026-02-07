import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Info, DollarSign, Users, Building, Clock, Download, Send } from 'lucide-react';

const RTIDisclosure = () => {
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
      title: 'Right to Information (RTI) Disclosure',
      subtitle: 'Proactive Disclosure Under RTI Act No. 12 of 2016',
      effectiveDate: 'Last Updated: January 1, 2025',
      
      intro: {
        title: 'About RTI',
        text: 'Under the Right to Information Act, No. 12 of 2016, all public authorities in Sri Lanka must proactively disclose certain information to promote transparency and accountability. This page provides key information about NARA\'s operations, structure, and activities.'
      },

      organization: {
        title: 'Organization Structure',
        sections: [
          {
            name: 'Establishment',
            content: 'The National Aquatic Resources Research and Development Agency (NARA) was established under Act No. 54 of 1981 as the apex research organization for aquatic resources in Sri Lanka.'
          },
          {
            name: 'Parent Ministry',
            content: 'Ministry of Fisheries, Sri Lanka'
          },
          {
            name: 'Governing Body',
            content: 'NARA Board of Management (appointed by the Minister of Fisheries)'
          },
          {
            name: 'Legal Status',
            content: 'Statutory body under the Ministry of Fisheries'
          }
        ]
      },

      functions: {
        title: 'Functions & Responsibilities',
        items: [
          'Conduct research on aquatic resources and ecosystems',
          'Provide scientific advice on fisheries management',
          'Monitor and assess marine and inland water quality',
          'Develop sustainable aquaculture technologies',
          'Train personnel in aquatic sciences',
          'Disseminate research findings and technical information',
          'Collaborate with national and international research institutions',
          'Advise government on marine resource conservation'
        ]
      },

      officers: {
        title: 'Information Officers',
        rti: {
          title: 'Designated RTI Officer',
          name: 'Dr. A.H.M. Kumara',
          position: 'Director (Information)',
          contact: 'rti@nara.ac.lk',
          phone: '+94 11 2 521000 Ext. 235',
          hours: 'Monday - Friday: 8:30 AM - 4:15 PM'
        },
        appellate: {
          title: 'Designated Officer for Appeals',
          name: 'Dr. S.P. Jayasinghe',
          position: 'Director General',
          contact: 'appeals@nara.ac.lk',
          phone: '+94 11 2 521000 Ext. 201'
        }
      },

      process: {
        title: 'How to Request Information',
        steps: [
          {
            step: 'Submit Request',
            description: 'Fill out the RTI request form online or in person at our office.',
            icon: Send
          },
          {
            step: 'Processing',
            description: 'We will acknowledge receipt within 7 days and provide information within 14 days.',
            icon: Clock
          },
          {
            step: 'Fee Payment',
            description: 'Minimal fees may apply for photocopying or document preparation.',
            icon: DollarSign
          },
          {
            step: 'Appeal Process',
            description: 'If unsatisfied, you may appeal to our Designated Officer or the RTI Commission.',
            icon: Info
          }
        ]
      },

      fees: {
        title: 'Fee Structure',
        schedule: [
          { service: 'Application Fee', fee: 'Rs. 50' },
          { service: 'Photocopy (per A4 page)', fee: 'Rs. 2' },
          { service: 'Certified Copy (per page)', fee: 'Rs. 10' },
          { service: 'CD/DVD', fee: 'Rs. 100' },
          { service: 'Below Poverty Line (BPL)', fee: 'Free' }
        ],
        note: 'Fees are subject to revision. Personal information is provided free of charge to the concerned individual.'
      },

      documents: {
        title: 'Proactive Disclosures',
        categories: [
          {
            name: 'Annual Reports',
            description: 'Financial statements, research outputs, and organizational performance',
            icon: FileText,
            link: '/documents/annual-reports'
          },
          {
            name: 'Budget & Expenditure',
            description: 'Allocations, expenditures, and procurement information',
            icon: DollarSign,
            link: '/documents/budget'
          },
          {
            name: 'Research Publications',
            description: 'Scientific papers, technical reports, and data sets',
            icon: FileText,
            link: '/research-excellence-portal'
          },
          {
            name: 'Procurement Notices',
            description: 'Tender announcements, awards, and contract details',
            icon: Building,
            link: '/procurement-recruitment-portal'
          },
          {
            name: 'Staff Directory',
            description: 'Contact information for key personnel and departments',
            icon: Users,
            link: '/documents/staff-directory'
          }
        ]
      },

      exemptions: {
        title: 'Exempted Information',
        text: 'Certain information may be withheld under the RTI Act, including:',
        items: [
          'Information that could harm national security',
          'Cabinet papers and internal deliberations',
          'Personal information of third parties',
          'Information protected by intellectual property rights',
          'Trade secrets and commercial confidentiality',
          'Information that could prejudice law enforcement',
          'Privileged communications'
        ],
        note: 'Even if information falls under exemptions, it may be disclosed if public interest outweighs the harm.'
      },

      commission: {
        title: 'RTI Commission of Sri Lanka',
        text: 'If you are dissatisfied with our response or the appeal decision, you may approach:',
        contact: {
          name: 'Right to Information Commission of Sri Lanka',
          address: 'Old Parliament Building, Sri Jayawardenepura Kotte, Sri Lanka',
          email: 'rti@rticommission.lk',
          phone: '+94 11 2 786 630',
          website: 'www.rticommission.lk'
        },
        timeline: 'Appeals to the Commission must be made within 30 days of receiving our decision.'
      },

      statistics: {
        title: 'RTI Statistics (2024)',
        data: [
          { label: 'Requests Received', value: '287' },
          { label: 'Requests Approved', value: '263' },
          { label: 'Requests Partially Approved', value: '18' },
          { label: 'Requests Rejected', value: '6' },
          { label: 'Average Response Time', value: '11 days' },
          { label: 'Appeals Filed', value: '4' }
        ]
      }
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] border-b border-[#003366]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-blue-100 text-lg">{t.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-blue-100">{t.effectiveDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section className="bg-blue-50 border-2 border-[#0066CC]/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Info className="w-6 h-6 text-[#0066CC]" />
              {t.intro.title}
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed">{t.intro.text}</p>
          </section>

          {/* Organization Structure */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.organization.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {t.organization.sections.map((section, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-[#003366] mb-2">{section.name}</h3>
                  <p className="text-slate-600 text-sm">{section.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Functions */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.functions.title}</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {t.functions.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 bg-slate-50 rounded-lg p-3">
                  <span className="text-[#0066CC] mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Information Officers */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.officers.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-[#0066CC]/20 rounded-lg p-4">
                <h3 className="font-semibold text-[#003366] mb-4">{t.officers.rti.title}</h3>
                <div className="space-y-2 text-slate-600 text-sm">
                  <p className="font-semibold text-slate-900">{t.officers.rti.name}</p>
                  <p>{t.officers.rti.position}</p>
                  <p>Email: <a href={`mailto:${t.officers.rti.contact}`} className="text-[#0066CC] hover:text-[#003366]">{t.officers.rti.contact}</a></p>
                  <p>Phone: {t.officers.rti.phone}</p>
                  <p className="text-xs text-slate-700">{t.officers.rti.hours}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 mb-4">{t.officers.appellate.title}</h3>
                <div className="space-y-2 text-slate-600 text-sm">
                  <p className="font-semibold text-slate-900">{t.officers.appellate.name}</p>
                  <p>{t.officers.appellate.position}</p>
                  <p>Email: <a href={`mailto:${t.officers.appellate.contact}`} className="text-[#0066CC] hover:text-[#003366]">{t.officers.appellate.contact}</a></p>
                  <p>Phone: {t.officers.appellate.phone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.process.title}</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {t.process.steps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-6 h-6 text-[#0066CC]" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{step.step}</h3>
                      <p className="text-xs text-slate-600">{step.description}</p>
                    </div>
                    {idx < t.process.steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-[#0066CC]/30" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Fees */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.fees.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-[#0066CC]/30">
                    <th className="p-4 text-[#003366] font-semibold">Service</th>
                    <th className="p-4 text-[#003366] font-semibold">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {t.fees.schedule.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 text-slate-600">{item.service}</td>
                      <td className="p-4 text-slate-900 font-semibold">{item.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-700 mt-4 italic">{t.fees.note}</p>
          </section>

          {/* Proactive Disclosures */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.documents.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {t.documents.categories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={idx}
                    to={cat.link}
                    className="bg-slate-50 border border-slate-200 hover:border-[#0066CC]/30 rounded-lg p-4 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[#0066CC]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-[#0066CC] mb-1">{cat.name}</h3>
                        <p className="text-sm text-slate-700">{cat.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Statistics */}
          <section className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.statistics.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {t.statistics.data.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RTI Commission */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.commission.title}</h2>
            <p className="text-slate-600 mb-6">{t.commission.text}</p>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 mb-4">
              <p className="font-semibold text-slate-900">{t.commission.contact.name}</p>
              <p className="text-slate-600 text-sm">{t.commission.contact.address}</p>
              <p className="text-slate-600 text-sm">Email: <a href={`mailto:${t.commission.contact.email}`} className="text-[#0066CC] hover:text-[#003366]">{t.commission.contact.email}</a></p>
              <p className="text-slate-600 text-sm">Phone: {t.commission.contact.phone}</p>
              <p className="text-slate-600 text-sm">Website: <a href={`http://${t.commission.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-[#0066CC] hover:text-[#003366]">{t.commission.contact.website}</a></p>
            </div>
            <p className="text-sm text-amber-600 italic">{t.commission.timeline}</p>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
            <button
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download RTI Request Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTIDisclosure;
