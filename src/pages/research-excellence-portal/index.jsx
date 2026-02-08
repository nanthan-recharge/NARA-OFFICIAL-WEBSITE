import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResearchPortalMain from './ResearchPortalMain';
import ContentReader from './components/ContentReader';
import SEOHead from '../../components/shared/SEOHead';

const ResearchExcellencePortal = () => {
  return (
    <>
      <SEOHead
        title="Research Excellence Portal"
        description="NARA research excellence — publications, citations, collaborations, and academic achievements."
        path="/research-excellence-portal"
        keywords="research excellence, publications, marine science, NARA"
      />
      <Routes>
        <Route path="/" element={<ResearchPortalMain />} />
        <Route path="/read/:id" element={<ContentReader />} />
      </Routes>
    </>
  );
};

export default ResearchExcellencePortal;
