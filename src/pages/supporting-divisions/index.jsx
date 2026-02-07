import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ICON_MAP = {
  'users': Icons.Users,
  'dollar-sign': Icons.DollarSign,
  'settings': Icons.Settings,
};

const SupportingDivisionsPage = () => {
  const { t, i18n } = useTranslation('supportingDivisions');
  const [activeTab, setActiveTab] = useState('administrative');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hero = t('supportingDivisions.hero', { returnObjects: true });
  const stats = t('supportingDivisions.stats', { returnObjects: true });
  const divisions = t('supportingDivisions.divisions', { returnObjects: true });
  const cta = t('supportingDivisions.cta', { returnObjects: true });

  const divisionKeys = ['administrative', 'finance', 'serviceOperation'];
  const statsArray = Object.entries(stats || {}).map(([key, value]) => ({
    ...value,
    key
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-500/10 to-pink-400/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Icons.Building2 className="w-4 h-4" />
              {hero?.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-600 font-semibold mb-6">
              {hero?.headline}
            </p>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {hero?.description}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Divisions Tabs Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {divisionKeys.map((key) => {
              const division = divisions[key];
              const IconComponent = ICON_MAP[division?.icon] || Icons.Building2;
              const isActive = activeTab === key;

              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-md'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{division?.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          {divisionKeys.map((key) => {
            const division = divisions[key];
            const IconComponent = ICON_MAP[division?.icon] || Icons.Building2;

            if (activeTab !== key) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Division Header */}
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 md:p-12 shadow-xl">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        {division?.name}
                      </h2>
                      <p className="text-xl text-indigo-600 font-semibold mb-4">
                        {division?.tagline}
                      </p>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        {division?.description}
                      </p>
                    </div>
                  </div>

                  {/* Vision & Mission */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {division?.vision && (
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Eye className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-bold text-slate-900">Vision</h3>
                        </div>
                        <p className="text-slate-600">{division.vision}</p>
                      </div>
                    )}
                    {division?.mission && (
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Target className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-bold text-slate-900">Mission</h3>
                        </div>
                        <p className="text-slate-600">{division.mission}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Functions */}
                {division?.keyFunctions && division.keyFunctions.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Icons.CheckCircle2 className="w-7 h-7 text-indigo-600" />
                      Key Functions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {division.keyFunctions.map((func, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-xl hover:bg-indigo-50 transition-colors"
                        >
                          <Icons.ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{func}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services (if available) */}
                {division?.services && division.services.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Icons.Briefcase className="w-7 h-7 text-purple-600" />
                      Services Offered
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {division.services.map((service, index) => (
                        <div
                          key={index}
                          className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100"
                        >
                          <h4 className="text-lg font-bold text-slate-900 mb-2">
                            {service.title}
                          </h4>
                          <p className="text-slate-600 mb-3">{service.description}</p>
                          {service.contact && (
                            <p className="text-sm text-indigo-600 font-medium">
                              <Icons.Phone className="w-4 h-4 inline mr-1" />
                              {service.contact}
                            </p>
                          )}
                          {service.email && (
                            <p className="text-sm text-indigo-600 font-medium">
                              <Icons.Mail className="w-4 h-4 inline mr-1" />
                              {service.email}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bank Details (for Finance Division) */}
                {division?.bankDetails && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl border border-emerald-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Icons.Building className="w-7 h-7 text-emerald-600" />
                      Bank Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Icons.Building2 className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Bank</div>
                          <div className="font-semibold text-slate-900">{division.bankDetails.bank}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icons.User className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Account Holder</div>
                          <div className="font-semibold text-slate-900">{division.bankDetails.accountHolder}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icons.CreditCard className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Account Number</div>
                          <div className="font-semibold text-slate-900">{division.bankDetails.accountNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icons.Printer className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Fax</div>
                          <div className="font-semibold text-slate-900">{division.bankDetails.fax}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leadership */}
                {division?.leadership && (
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Icons.UserCircle className="w-7 h-7 text-indigo-600" />
                      Leadership
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icons.User className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">
                          {division.leadership.director}
                        </h4>
                        {division.leadership.qualification && (
                          <p className="text-indigo-600 font-medium mb-4">
                            {division.leadership.qualification}
                          </p>
                        )}
                        <div className="space-y-2">
                          {division.leadership.email && (
                            <a
                              href={`mailto:${division.leadership.email}`}
                              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <Icons.Mail className="w-5 h-5" />
                              <span>{division.leadership.email}</span>
                            </a>
                          )}
                          {division.leadership.phone && (
                            <a
                              href={`tel:${division.leadership.phone}`}
                              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <Icons.Phone className="w-5 h-5" />
                              <span>{division.leadership.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {cta?.title}
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            {cta?.description}
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <Icons.Mail className="w-5 h-5" />
            {cta?.button}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default SupportingDivisionsPage;
