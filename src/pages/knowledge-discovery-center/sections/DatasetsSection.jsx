import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Database, Download, Eye, FileCode, Waves, Fish, Droplet, CloudRain, Map } from 'lucide-react';

const DatasetsSection = () => {
  const { t } = useTranslation('knowledge');

  const datasets = [
    { id: 1, title: 'Sri Lankan Ocean Temperature Database 2020-2024', category: t('datasets.categories.oceanography'), size: '2.3 GB', format: 'CSV, JSON', downloads: 5847, icon: Waves, color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'Marine Biodiversity Survey Data', category: t('datasets.categories.biodiversity'), size: '1.8 GB', format: 'CSV, GeoJSON', downloads: 4231, icon: Fish, color: 'from-green-500 to-teal-500' },
    { id: 3, title: 'Water Quality Monitoring Dataset', category: t('datasets.categories.water'), size: '890 MB', format: 'CSV, Excel', downloads: 3456, icon: Droplet, color: 'from-cyan-500 to-blue-500' },
    { id: 4, title: 'Climate Change Impact Data', category: t('datasets.categories.climate'), size: '3.1 GB', format: 'NetCDF, CSV', downloads: 2983, icon: CloudRain, color: 'from-purple-500 to-pink-500' },
    { id: 5, title: 'Coastal Mapping Survey 2024', category: t('datasets.categories.coastal'), size: '5.4 GB', format: 'GeoTIFF, Shapefile', downloads: 2145, icon: Map, color: 'from-amber-500 to-orange-500' },
    { id: 6, title: 'Fisheries Stock Assessment Data', category: t('datasets.categories.fisheries'), size: '1.2 GB', format: 'CSV, JSON', downloads: 3872, icon: Fish, color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{t('datasets.title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-200">{t('datasets.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {datasets.map((dataset, index) => (
            <motion.div key={dataset.id} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${dataset.color}`}>
                  <dataset.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-slate-200 uppercase tracking-wider">{dataset.category}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{dataset.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-200 mb-4">
                    <span className="flex items-center gap-1"><Database className="w-4 h-4" /> {dataset.size}</span>
                    <span className="text-cyan-400">{dataset.format}</span>
                    <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {dataset.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> {t('datasets.labels.download')}
                    </button>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                      <Eye className="w-4 h-4 text-slate-200" />
                    </button>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                      <FileCode className="w-4 h-4 text-slate-200" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default DatasetsSection;
