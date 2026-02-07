import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRealOceanData } from '../features/marine-forecast/services/oceanDataAPI';

// Minimalist Live Ocean Data Ticker
// Displays real-time data in a sleek, text-only horizontal bar

const LiveOceanDataShowcase = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch live data (Colombo coordinates) — deferred to let hero LCP paint first
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchRealOceanData(6.9271, 79.8612, 'colombo');
        if (result) {
          setData(result);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Defer initial fetch by 3s so hero image paints first
    const initialDelay = setTimeout(fetchData, 3000);

    // Refresh every 5 min, but only when tab is visible
    const interval = setInterval(() => {
      if (!document.hidden) fetchData();
    }, 5 * 60 * 1000);

    return () => { clearTimeout(initialDelay); clearInterval(interval); };
  }, []);

  if (loading || !data) return null;

  // Format metrics for the ticker
  const metrics = [
    { label: 'SST', value: `${data.conditions?.sst?.toFixed(1) || '--'}°C` },
    { label: 'AIR', value: `${data.metadata?.airTemperature?.toFixed(1) || '--'}°C` },
    { label: 'WAVE', value: `${data.conditions?.waveHeight?.toFixed(2) || '--'}m` },
    { label: 'WIND', value: `${data.conditions?.windSpeed?.toFixed(1) || '--'}m/s` },
    { label: 'FISH', value: `${((data.abundance?.skipjack || 0) / 150 * 100).toFixed(0)}%` },
  ];

  return (
    <div className="absolute bottom-0 right-0 z-30 w-full md:w-auto md:max-w-4xl bg-nara-navy/90 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/10 overflow-hidden">
      {/* Mobile: Scrolling Ticker / Desktop: Static Bar */}
      <div className="flex items-center h-12 md:h-14 px-4 md:px-8">

        {/* Label */}
        <div className="flex items-center gap-2 mr-6 border-r border-white/20 pr-6 h-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase whitespace-nowrap">
            LIVE OCEAN DATA
          </span>
        </div>

        {/* Metrics Row */}
        <div className="flex-1 overflow-x-auto no-scrollbar mask-gradient-right max-w-full">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10 min-w-max">
            {metrics.map((item, idx) => (
              <div key={idx} className="flex items-baseline gap-2 group cursor-default">
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm md:text-base font-mono font-medium text-white group-hover:text-cyan-300 transition-colors">
                  {item.value}
                </span>
              </div>
            ))}

            {/* Timestamp */}
            <div className="pl-4 border-l border-white/10 md:hidden lg:block">
              <span className="text-[10px] text-slate-500 font-mono">
                UPDATED: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveOceanDataShowcase;
