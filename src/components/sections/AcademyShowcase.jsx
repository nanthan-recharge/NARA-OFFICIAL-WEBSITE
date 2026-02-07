import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Target,
  ExternalLink,
  School,
  Globe2,
  Monitor,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchoolList } from '../../hooks/useSchoolList';

const AcademyShowcase = () => {
  const { t, i18n } = useTranslation('home');
  const [hoveredCard, setHoveredCard] = useState(null);
  const currentLanguage = i18n.language;
  
  // Fetch school list from Firebase Storage
  const SCHOOL_LIST_URL =
    'https://firebasestorage.googleapis.com/v0/b/nara-aquaschool.appspot.com/o/Tbl20200101.xlsx?alt=media&token=d211f254-5d39-415c-ade5-524031d9287a';
  const { schools, loading: schoolsLoading, stats: schoolStats } = useSchoolList(SCHOOL_LIST_URL);

  const programsData = [
    {
      id: 'aquaSchool',
      url: 'https://nara-aquaschool.web.app/',
      icon: School,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/10 to-blue-500/10'
    },
    {
      id: 'nexus',
      url: 'https://nexus-nara.web.app/',
      icon: GraduationCap,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-500/10 to-indigo-500/10'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 pt-2 pb-6">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold font-space mb-2">
            <span className="inline-block overflow-hidden border-r-4 border-white whitespace-nowrap animate-typewriter">
              <span className="text-[#003366]">NARA </span>
              <span className="text-white">ACADEMY</span>
            </span>
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space mb-2">
            <span className="text-white">Nurturing Future Ocean Leaders</span>
          </h3>
          
          <p className="text-base md:text-lg text-slate-300/90 max-w-3xl mx-auto">
            {t('academy.subtitle')}
          </p>
        </motion.div>

        {/* Full-Width Video Cards */}
        <div className="space-y-8 mb-12" key={currentLanguage}>
          {programsData.map((program, index) => {
            const Icon = program.icon;
            const isHovered = hoveredCard === program.id;
            const videoRef = useRef(null);
            
            // Get translated content with fallbacks
            const programContent = t(`academy.programs.${program.id}`, { 
              returnObjects: true,
              defaultValue: {
                title: program.id === 'aquaSchool' ? 'Aqua School' : 'Nexus Graduate Program',
                subtitle: program.id === 'aquaSchool' ? 'Marine Education for Young Minds' : 'Advanced Marine Research & Innovation',
                description: program.id === 'aquaSchool' ? 'Comprehensive marine education programs from school students to advanced researchers' : 'Advanced graduate program for marine research and innovation',
                features: [],
                stats: []
              }
            });
            
            // Use real data for Aqua School if available
            let displayStats = programContent.stats;
            if (program.id === 'aquaSchool' && schoolStats && schoolStats.totalSchools > 0) {
              displayStats = [
                { label: programContent.stats?.[0]?.label || 'Students', value: `${schoolStats.totalStudents.toLocaleString()}+` },
                { label: programContent.stats?.[1]?.label || 'Courses', value: programContent.stats?.[1]?.value || '25+' },
                { label: programContent.stats?.[2]?.label || 'Schools', value: `${schoolStats.totalSchools}+` }
              ];
            }
            
            // Video URLs - From Firebase Storage
            const videoUrl = program.id === 'aquaSchool' 
              ? 'https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/NARA%20%20ACADEMY%2FAQUA%20SCHOOL.mp4?alt=media&token=e62474f4-2f79-4958-ab75-ad1150f8744b'
              : 'https://firebasestorage.googleapis.com/v0/b/nara-web-73384.firebasestorage.app/o/NARA%20%20ACADEMY%2FNARA-NEXUS.mp4?alt=media&token=ae24c715-4776-4b7d-b967-76e2e75cd6c1';
            
            // Force video play on mount
            useEffect(() => {
              if (videoRef.current) {
                videoRef.current.play().catch(err => {
                  console.log('Video autoplay prevented:', err);
                });
              }
            }, [videoUrl]);
            
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(program.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Full-Width Video Card */}
                <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-slate-700/50 bg-slate-950 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20">
                  
                  {/* Background Video */}
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => console.error('Video error:', program.id, e)}
                    onLoadedData={() => console.log('Video loaded successfully:', program.id)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                  
                  {/* Fallback gradient if video fails */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-30`} />

                  {/* Overlay Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 transition-opacity duration-500 ${isHovered ? 'opacity-60' : 'opacity-90'}`} />
                  
                  {/* Content Overlay - Button at Bottom */}
                  <div className="absolute inset-0 flex items-end justify-center p-8 md:p-12">
                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <a
                        href={program.url}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = program.url;
                        }}
                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${program.gradient} text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300`}
                      >
                        <span>Visit {programContent.title}</span>
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Award className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.accredited')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.industryAligned')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.expertFaculty')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Globe2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-slate-300">{t('academy.badges.globalRecognition')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademyShowcase;
