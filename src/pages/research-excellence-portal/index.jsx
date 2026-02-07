import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResearchPortalMain from './ResearchPortalMain';
import ContentReader from './components/ContentReader';

const ResearchExcellencePortal = () => {
  return (
    <Routes>
      <Route path="/" element={<ResearchPortalMain />} />
      <Route path="/read/:id" element={<ContentReader />} />
    </Routes>
  );
};

export default ResearchExcellencePortal;
