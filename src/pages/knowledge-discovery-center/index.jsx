import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useResearchAdminData } from '../../hooks/useResearchAdminData';
import HeroSection from './sections/HeroSection';
import SearchSection from './sections/SearchSection';
import PublicationsSection from './sections/PublicationsSection';
import DatasetsSection from './sections/DatasetsSection';
import TrainingSection from './sections/TrainingSection';
import ExpertsSection from './sections/ExpertsSection';
import CollaborationSection from './sections/CollaborationSection';
import AnalyticsSection from './sections/AnalyticsSection';
import StitchWrapper from '../../components/shared/StitchWrapper';
import SEOHead from '../../components/shared/SEOHead';

const KnowledgeDiscoveryCenter = () => {
  const { t } = useTranslation('knowledge');
  const [activeSection, setActiveSection] = useState('publications');
  const [searchQuery, setSearchQuery] = useState('');
  const { publications, projects, teams, metrics, loading } = useResearchAdminData();

  const sections = useMemo(() => [
    { id: 'publications', label: t('search.filters.publications'), icon: Icons.FileText },
    { id: 'datasets', label: t('search.filters.datasets'), icon: Icons.Database },
    { id: 'training', label: t('search.filters.training'), icon: Icons.GraduationCap },
    { id: 'experts', label: t('search.filters.experts'), icon: Icons.Users },
    { id: 'tools', label: t('search.filters.tools'), icon: Icons.Wrench },
    { id: 'analytics', label: t('analytics.title'), icon: Icons.BarChart3 }
  ], [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <SEOHead
        title="Knowledge Discovery Center"
        description="Discover marine knowledge resources, educational content, and research tools from NARA."
        path="/knowledge-discovery-center"
        keywords="knowledge center, marine education, research tools, NARA"
      />
      <HeroSection />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
      />

      <AnimatePresence mode="wait">
        {activeSection === 'publications' && (
          <PublicationsSection publications={publications} loading={loading} searchQuery={searchQuery} />
        )}
        {activeSection === 'datasets' && (
          <DatasetsSection />
        )}
        {activeSection === 'training' && (
          <TrainingSection />
        )}
        {activeSection === 'experts' && (
          <ExpertsSection teams={teams} />
        )}
        {activeSection === 'analytics' && (
          <AnalyticsSection metrics={metrics} publications={publications} />
        )}
      </AnimatePresence>

      <CollaborationSection />
    </div>
  );
};

export default KnowledgeDiscoveryCenter;
