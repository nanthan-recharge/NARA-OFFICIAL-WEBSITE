import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Waves, Droplets, Wind, Thermometer, Ship, Fish, 
  TrendingUp, Globe, Zap, Activity, Award, Users,
  ArrowRight, Play, Pause, Eye, Brain, Satellite
} from 'lucide-react';

const OceanIntelligenceHub = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.8, 1]), {
    stiffness: 100,
    damping: 30
  });

  // Real-time Ocean Intelligence Metrics
  const metrics = [
    {
      id: 'ocean-health',
      title: 'Ocean Health Index',
      value: '87.5',
      unit: '%',
      trend: '+2.3%',
      icon: Waves,
      color: 'from-cyan-400 to-blue-600',
      description: 'Comprehensive marine ecosystem vitality score',
      subMetrics: [
        { label: 'Biodiversity', value: '92%' },
        { label: 'Water Quality', value: '88%' },
        { label: 'Coral Health', value: '83%' }
      ]
    },
    {
      id: 'climate-prediction',
      title: 'Climate Prediction Accuracy',
      value: '94.7',
      unit: '%',
      trend: '+5.2%',
      icon: Brain,
      color: 'from-purple-400 to-pink-600',
      description: 'AI-powered ocean-climate forecasting precision',
      subMetrics: [
        { label: 'Temperature', value: '96%' },
        { label: 'Sea Level', value: '94%' },
        { label: 'Currents', value: '93%' }
      ]
    },
    {
      id: 'research-impact',
      title: 'Global Research Impact',
      value: '12.8K',
      unit: 'Citations',
      trend: '+18%',
      icon: Award,
      color: 'from-amber-400 to-orange-600',
      description: 'Worldwide influence of NARA research',
      subMetrics: [
        { label: 'Publications', value: '450+' },
        { label: 'Countries', value: '85' },
        { label: 'Partners', value: '120' }
      ]
    },
    {
      id: 'real-time-monitoring',
      title: 'Active Monitoring Systems',
      value: '347',
      unit: 'Sensors',
      trend: '+24',
      icon: Satellite,
      color: 'from-green-400 to-emerald-600',
      description: 'Live ocean sensors & monitoring stations',
      subMetrics: [
        { label: 'Buoys', value: '156' },
        { label: 'Satellites', value: '12' },
        { label: 'Vessels', value: '179' }
      ]
    }
  ];

  // Auto-rotate metrics
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Particle animation
  const generateParticles = (count = 30) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
  };

  const particles = generateParticles();

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-24"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/30 blur-sm"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Live Ocean Intelligence
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Real-Time Ocean
              <br />
              Intelligence Hub
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Powered by AI and advanced sensor networks, tracking 347 monitoring stations 
              across Sri Lankan waters in real-time
            </p>
          </motion.div>

          {/* Playback Control */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isPlaying ? 'Pause Animation' : 'Resume Animation'}
            </span>
          </motion.button>
        </div>

        {/* Main Metrics Display */}
        <motion.div 
          style={{ scale }}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Active Metric Card */}
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 overflow-hidden group"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metrics[activeMetric].color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${metrics[activeMetric].color}`}>
                  {React.createElement(metrics[activeMetric].icon, { 
                    className: "w-8 h-8 text-white" 
                  })}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold text-green-300">
                    {metrics[activeMetric].trend}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {metrics[activeMetric].title}
              </h3>
              
              <div className="flex items-end gap-2 mb-4">
                <motion.span 
                  className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {metrics[activeMetric].value}
                </motion.span>
                <span className="text-2xl text-cyan-300 mb-2">
                  {metrics[activeMetric].unit}
                </span>
              </div>

              <p className="text-slate-300 mb-6">
                {metrics[activeMetric].description}
              </p>

              {/* Sub-metrics */}
              <div className="grid grid-cols-3 gap-4">
                {metrics[activeMetric].subMetrics.map((sub, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="text-xs text-slate-400 mb-1">{sub.label}</div>
                    <div className="text-lg font-bold text-white">{sub.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live Pulse Indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-xs text-green-400 font-semibold">LIVE</span>
            </div>
          </motion.div>

          {/* Metric Selector Grid */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, idx) => (
              <motion.button
                key={metric.id}
                onClick={() => {
                  setActiveMetric(idx);
                  setIsPlaying(false);
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-2xl border transition-all text-left ${
                  activeMetric === idx
                    ? 'bg-gradient-to-br from-white/20 to-white/10 border-white/30 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                  {React.createElement(metric.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                  {metric.title}
                </h4>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-sm text-slate-400 mb-1">{metric.unit}</span>
                </div>
                {activeMetric === idx && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-2 left-2 right-2 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Live Data Stream Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Live Data Stream</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Eye className="w-4 h-4" />
              <span>347 sensors reporting</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Thermometer, label: 'Temperature', value: '28.4°C', status: 'normal' },
              { icon: Waves, label: 'Wave Height', value: '1.2m', status: 'normal' },
              { icon: Wind, label: 'Wind Speed', value: '15 km/h', status: 'low' },
              { icon: Droplets, label: 'Salinity', value: '35.2 PSU', status: 'normal' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-slate-400">{item.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'normal' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.2,
                    }}
                  />
                  <span className="text-xs text-slate-500 capitalize">{item.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="/ocean-intelligence-dashboard-homepage"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-cyan-500/50 transition-all"
          >
            <span>Explore Full Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OceanIntelligenceHub;
