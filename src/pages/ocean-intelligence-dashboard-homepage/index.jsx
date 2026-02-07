import React from 'react';
import NewHomePage from './NewHomePage';
import SEOHead from '../../components/shared/SEOHead';

const OceanIntelligenceDashboardHomepage = () => {
  return (
    <>
      <SEOHead
        title="Ocean Intelligence Dashboard"
        description="Sri Lanka's premier ocean research institute — real-time marine data, research, and blue economy development by NARA."
        path="/"
        keywords="NARA, ocean intelligence, marine research, Sri Lanka, blue economy"
      />
      <NewHomePage />
    </>
  );
};

export default OceanIntelligenceDashboardHomepage;
