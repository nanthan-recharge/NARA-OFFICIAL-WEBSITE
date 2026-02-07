import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook to fetch and manage research data from Firebase
 * Used by the Enhanced Research Portal to display real data
 */
export const useResearchAdminData = () => {
  const [publications, setPublications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribers = [];

    try {
      // Real-time listener for publications
      const pubsQuery = query(collection(db, 'publications'), orderBy('year', 'desc'));
      const unsubPubs = onSnapshot(pubsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPublications(data);
      }, (err) => {
        console.error('Error fetching publications:', err);
        setError(err.message);
      });
      unsubscribers.push(unsubPubs);

      // Real-time listener for projects
      const projQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const unsubProj = onSnapshot(projQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      }, (err) => {
        console.error('Error fetching projects:', err);
      });
      unsubscribers.push(unsubProj);

      // Real-time listener for partners
      const partQuery = query(collection(db, 'partners'), orderBy('name', 'asc'));
      const unsubPart = onSnapshot(partQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPartners(data);
      }, (err) => {
        console.error('Error fetching partners:', err);
      });
      unsubscribers.push(unsubPart);

      // Real-time listener for teams
      const teamsQuery = query(collection(db, 'teams'), orderBy('name', 'asc'));
      const unsubTeams = onSnapshot(teamsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeams(data);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      });
      unsubscribers.push(unsubTeams);

    } catch (err) {
      console.error('Error setting up listeners:', err);
      setError(err.message);
      setLoading(false);
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Calculate metrics from real data
  const metrics = {
    totalPublications: publications.length,
    totalCitations: publications.reduce((sum, pub) => sum + (pub.citations || 0), 0),
    totalDownloads: publications.reduce((sum, pub) => sum + (pub.downloads || 0), 0),
    activeProjects: projects.filter(p => p.status === 'Active').length,
    totalProjects: projects.length,
    partnerInstitutions: partners.length,
    researchTeams: teams.length,
    // Calculate h-index
    hIndex: calculateHIndex(publications)
  };

  return {
    publications,
    projects,
    partners,
    teams,
    metrics,
    loading,
    error
  };
};

/**
 * Calculate h-index from publications
 * h-index = h if h papers have at least h citations each
 */
function calculateHIndex(publications) {
  const citations = publications
    .map(p => p.citations || 0)
    .sort((a, b) => b - a);
  
  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  return hIndex;
}

export default useResearchAdminData;
