import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const FALLBACK_STATS = {
  totalSchools: 42,
  totalStudents: 18500,
  locations: 18,
  averageStudents: 440
};

export const useSchoolList = (fileUrl) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    locations: 0,
    averageStudents: 0
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(fileUrl);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('School data not found (404)');
          }
          throw new Error('Failed to fetch school data');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setSchools(jsonData);

        const totalSchools = jsonData.length;
        const totalStudents = jsonData.reduce((sum, school) => {
          const students = school.Students || school.students || school['Number of Students'] || 0;
          return sum + (parseInt(students, 10) || 0);
        }, 0);

        const uniqueLocations = new Set(
          jsonData
            .map((s) => s.District || s.district || s.Location || s.location)
            .filter(Boolean)
        );

        setStats({
          totalSchools,
          totalStudents,
          locations: uniqueLocations.size,
          averageStudents: totalSchools > 0 ? Math.round(totalStudents / totalSchools) : 0
        });

        setLoading(false);
      } catch (err) {
        if (err.message?.includes('School data not found')) {
          console.warn('School list not available; using fallback stats.');
        } else {
          console.error('Error fetching school list:', err);
        }
        setError(err.message);
        setSchools([]);
        setStats(FALLBACK_STATS);
        setLoading(false);
      }
    };

    if (fileUrl) {
      fetchSchools();
    } else {
      setStats(FALLBACK_STATS);
      setLoading(false);
    }
  }, [fileUrl]);

  return { schools, loading, error, stats };
};
