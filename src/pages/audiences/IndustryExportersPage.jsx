import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Ship,
  FileCheck,
  FlaskConical,
  Globe,
  DollarSign,
  BarChart3,
  Award,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Database,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Scale,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IndustryExportersPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['industryExporters']);

  const [marketData, setMarketData] = useState({
    tunaPrice: 425.5,
    shrimpPrice: 1250.0,
    crabPrice: 850.0,
    lastUpdated: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        tunaPrice: 425.5 + (Math.random() * 20 - 10),
        shrimpPrice: 1250.0 + (Math.random() * 50 - 25),
        crabPrice: 850.0 + (Math.random() * 30 - 15),
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const hero = t('hero', { returnObjects: true });
  const quickServicesContent = t('quickServices', { returnObjects: true });
  const keyStatsContent = t('keyStats', { returnObjects: true });
  const marketPricesContent = t('marketPrices', { returnObjects: true });
  const marketRowsContent = marketPricesContent?.rows || {};
  const certificationServicesContent = t('certificationServices', { returnObjects: true });
  const exportSupportContent = t('exportSupport', { returnObjects: true });
  const industryNewsContent = t('industryNews.items', { returnObjects: true });
  const supportSectionContent = t('supportSection', { returnObjects: true });
  const buttons = t('buttons', { returnObjects: true });

  const quickServices = [
    {
      icon: TrendingUp,
      key: 'marketIntelligence',
      color: 'bg-blue-600',
      link: '/export-market-intelligence'
    },
    {
      icon: FlaskConical,
      key: 'qualityTesting',
      color: 'bg-purple-600',
      link: '/lab-results'
    },
    {
      icon: FileCheck,
      key: 'exportCompliance',
      color: 'bg-green-600',
      link: '/government-services-portal'
    },
    {
      icon: Ship,
      key: 'logisticsSupport',
      color: 'bg-cyan-600',
      link: '/maritime-services-hub'
    }
  ];

  const marketPriceRows = [
    { key: 'yellowfinTuna', price: marketData.tunaPrice, change: '+2.5%', trend: 'up' },
    { key: 'tigerPrawns', price: marketData.shrimpPrice, change: '+5.2%', trend: 'up' },
    { key: 'mudCrabs', price: marketData.crabPrice, change: '-1.2%', trend: 'down' },
    { key: 'seaCucumber', price: 2850.0, change: '+8.5%', trend: 'up' }
  ];

  const certificationServices = [
    { icon: Award, key: 'eu', link: '/government-services-portal' },
    { icon: FileText, key: 'usfda', link: '/government-services-portal' },
    { icon: CheckCircle, key: 'halal', link: '/government-services-portal' },
    { icon: Scale, key: 'organic', link: '/government-services-portal' }
  ];

  const exportSupport = [
    { icon: Database, key: 'marketResearch' },
    { icon: Briefcase, key: 'buyerMatching' },
    { icon: BookOpen, key: 'trainingPrograms' }
  ];

  const industryNews = [
    { key: 'regulation', priority: 'high' },
    { key: 'marketAlert', priority: 'medium' },
    { key: 'tradeFair', priority: 'medium' }
  ];

  const keyStats = [
    { key: 'exportValue', icon: DollarSign, color: 'text-green-600' },
    { key: 'exportMarkets', icon: Globe, color: 'text-blue-600' },
    { key: 'certifiedExporters', icon: Award, color: 'text-purple-600' },
    { key: 'monthlyShipments', icon: Ship, color: 'text-cyan-600' }
  ];

  const supportContacts = [
    { icon: Phone, key: 'helpline' },
    { icon: Mail, key: 'inquiries' },
    { icon: MapPin, key: 'office' }
  ];

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <section className="bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-800 text-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                {hero?.badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero?.title}</h1>
            <p className="text-xl text-blue-100 mb-6">{hero?.description}</p>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{hero?.live?.title}</h3>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{t('hero.live.updatedLabel', { time: marketData.lastUpdated })}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketPriceRows.slice(0, 3).map(item => {
                  const content = marketRowsContent[item.key] || {};
                  return (
                    <div key={item.key} className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-blue-100">{content.name}</div>
                      <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-green-300">
                        {t('hero.live.marketLabel', {
                          unit: content.unit,
                          market: content.primaryMarket
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickServices.map((service, index) => {
            const content = quickServicesContent?.[service.key] || {};
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(service.link)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                <div className={`${service.color} p-4 flex items-center justify-between`}>
                  <service.icon className="w-8 h-8 text-white" />
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                    {content.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-600">{content.stat}</span>
                    <div className="flex items-center text-blue-600 text-sm font-semibold">
                      <span>{buttons?.access}</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyStats.map(stat => {
            const content = keyStatsContent?.[stat.key] || {};
            return (
              <div key={stat.key} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <div className="text-3xl font-bold text-gray-900">{content.value}</div>
                <div className="text-sm text-gray-600 mt-1">{content.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              {marketPricesContent?.heading}
            </h2>
            <p className="text-blue-100 text-sm mt-1">{marketPricesContent?.description}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    {marketPricesContent?.columns?.product}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    {marketPricesContent?.columns?.grade}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">
                    {marketPricesContent?.columns?.price}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                    {marketPricesContent?.columns?.change}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    {marketPricesContent?.columns?.markets}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {marketPriceRows.map(item => {
                  const content = marketRowsContent[item.key] || {};
                  return (
                    <tr key={item.key} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{content.name}</div>
                        <div className="text-sm text-gray-500">{content.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {content.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
                            item.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                          }`}
                        >
                          {item.change}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {content.markets?.map((market, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {market}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/export-market-intelligence')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              {marketPricesContent?.cta}
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{certificationServicesContent?.heading}</h2>
            <p className="text-gray-600 text-lg">{certificationServicesContent?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificationServices.map(service => {
              const content = certificationServicesContent?.items?.[service.key] || {};
              return (
                <div
                  key={service.key}
                  onClick={() => navigate(service.link)}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{content.title}</h3>
                      <p className="text-sm text-gray-700 mb-3">{content.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-semibold text-gray-600 uppercase">
                          {certificationServicesContent?.labels?.requirements}
                        </div>
                        {content.requirements?.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{content.processingTime}</span>
                        </div>
                        <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">
                          {buttons?.applyNow}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{exportSupportContent?.heading}</h2>
          <p className="text-gray-600 text-lg">{exportSupportContent?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exportSupport.map((service, index) => {
            const content = exportSupportContent?.items?.[service.key] || {};
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-700 mb-4">{content.description}</p>
                <div className="space-y-2">
                  {content.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                {t('industryNews.heading')}
              </h2>
              <p className="text-gray-600 mt-1">{t('industryNews.description')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {industryNews.map(news => {
              const content = industryNewsContent?.[news.key] || {};
              return (
                <div key={news.key} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(news.priority)}`}>
                      {content.category}
                    </span>
                    <span className="text-xs text-gray-500">{content.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{content.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{content.summary}</p>
                  <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
                    {buttons?.readMore}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{supportSectionContent?.heading}</h2>
              <p className="text-blue-100 mb-6">{supportSectionContent?.description}</p>
              <div className="space-y-3">
                {supportContacts.map(contact => {
                  const content = supportSectionContent?.contacts?.[contact.key] || {};
                  return (
                    <div key={contact.key} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                      <contact.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-sm text-blue-100">{content.label}</div>
                        <div className="font-semibold">{content.value}</div>
                      </div>
                      <div className="text-xs text-blue-200">{content.available}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Package className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{supportSectionContent?.metrics?.mtExported?.value}</div>
                <div className="text-sm text-blue-100">{supportSectionContent?.metrics?.mtExported?.label}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Award className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{supportSectionContent?.metrics?.qualityPass?.value}</div>
                <div className="text-sm text-blue-100">{supportSectionContent?.metrics?.qualityPass?.label}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{supportSectionContent?.metrics?.activeExporters?.value}</div>
                <div className="text-sm text-blue-100">{supportSectionContent?.metrics?.activeExporters?.label}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Calendar className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">{supportSectionContent?.metrics?.processingDays?.value}</div>
                <div className="text-sm text-blue-100">{supportSectionContent?.metrics?.processingDays?.label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustryExportersPage;
