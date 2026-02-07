import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const DivisionContact = ({ division, currentLang }) => {
  const navigate = useNavigate();
  const email = division.contact?.email || division.contactEmail;
  const phone = division.contact?.phone || division.contactPhone;
  const location = division.contact?.location || division.location;
  const dc = getDivisionColors(division.color);

  return (
    <section id="section-contact" className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header — division gradient */}
        <div className={`bg-gradient-to-br ${division.gradient || 'from-blue-500 to-blue-600'} rounded-2xl p-8 sm:p-12 text-white text-center`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-3"
          >
            {getLabel('connectWithUs', currentLang)}
          </motion.h2>
          <p className="text-lg text-white/85 max-w-xl mx-auto">
            {currentLang === 'en' && `Get in touch with the ${division.name?.en} team`}
            {currentLang === 'si' && `${division.name?.si} කණ්ඩායම සමඟ සම්බන්ධ වන්න`}
            {currentLang === 'ta' && `${division.name?.ta} குழுவுடன் தொடர்பு கொள்ளுங்கள்`}
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md ${dc.hoverBg50} transition-all text-center`}
            >
              <p className="font-bold text-slate-900 text-base">{getLabel('emailUs', currentLang)}</p>
              <p className="text-xs text-slate-500 break-all mt-1">{email}</p>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md ${dc.hoverBg50} transition-all text-center`}
            >
              <p className="font-bold text-slate-900 text-base">{getLabel('callUs', currentLang)}</p>
              <p className="text-xs text-slate-500 mt-1">{phone}</p>
            </a>
          )}

          {phone && (
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md ${dc.hoverBg50} transition-all text-center`}
            >
              <p className="font-bold text-slate-900 text-base">WhatsApp</p>
              <p className="text-xs text-slate-500 mt-1">{getLabel('chatWithUs', currentLang)}</p>
            </a>
          )}

          {location && (
            <div className={`bg-white border border-slate-200 rounded-xl p-5 text-center`}>
              <p className="font-bold text-slate-900 text-base">{getLabel('visitUs', currentLang)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {typeof location === 'object' ? location?.[currentLang] || location?.en : location}
              </p>
            </div>
          )}
        </div>

        {/* Collaboration CTA — division gradient */}
        <div className={`bg-gradient-to-br ${division.gradient || 'from-blue-500 to-blue-600'} rounded-2xl p-8 sm:p-10 text-white`}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              {getLabel('partnerWithUs', currentLang)}
            </h3>
            <p className="text-white/90 text-base mb-7 leading-relaxed">
              {getLabel('collaborationDescription', currentLang)}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.location.href = `mailto:${email}?subject=Partnership Inquiry`}
                className={`bg-white ${dc.text700} px-6 py-3.5 rounded-xl font-bold hover:shadow-xl transition-all`}
              >
                {getLabel('sendInquiry', currentLang)}
              </button>
              <button
                onClick={() => navigate('/contact-us')}
                className="bg-white/20 border-2 border-white/40 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/30 transition-all"
              >
                {getLabel('contactForm', currentLang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DivisionContact;
