import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

const ResearchersStudentsHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const services = {
    research: [
      { id: 'papers', title: 'Research Portal', icon: Icons.FileText, link: '/research-excellence-portal', features: ['Submit Papers', 'Track Citations', 'Peer Review'] },
      { id: 'lab', title: 'Lab Booking', icon: Icons.FlaskConical, link: '/lab-results', features: ['Reserve Labs', 'Equipment', 'Analysis'] },
      { id: 'vessel', title: 'Vessel Booking', icon: Icons.Ship, link: '/admin/research-vessels', features: ['Book Vessels', 'Field Studies'] },
      { id: 'data', title: 'Data Portal', icon: Icons.Database, link: '/open-data-portal', features: ['Datasets', 'API Access'] },
      { id: 'library', title: 'Library', icon: Icons.BookOpen, link: '/library', features: ['E-Books', 'Journals', 'Thesis'] },
      { id: 'collab', title: 'Collaboration', icon: Icons.Users, link: '/knowledge-discovery-center', features: ['Projects', 'Experts'] }
    ],
    student: [
      { id: 'courses', title: 'LDA Courses', icon: Icons.GraduationCap, link: '/learning-development-academy', features: ['Online Courses', 'Certifications'] },
      { id: 'intern', title: 'Internships', icon: Icons.Briefcase, link: '/careers', features: ['Apply', 'Mentorship'] },
      { id: 'projects', title: 'Projects', icon: Icons.Award, link: '/research-excellence-portal', features: ['Showcase', 'Awards'] },
      { id: 'mentor', title: 'Mentorship', icon: Icons.UserCheck, link: '/knowledge-discovery-center', features: ['1-on-1', 'Guidance'] },
      { id: 'shop', title: 'Marketplace', icon: Icons.ShoppingBag, link: '/nara-digital-marketplace', features: ['Equipment', 'Discounts'] }
    ]
  };

  const grants = [
    { title: 'Early Career Grant', amount: 'LKR 2M', deadline: '2025-12-31', icon: Icons.DollarSign },
    { title: 'Student Grant', amount: 'LKR 500K', deadline: '2025-11-30', icon: Icons.GraduationCap },
    { title: 'Collaborative Fund', amount: 'LKR 5M', deadline: '2026-01-15', icon: Icons.Users }
  ];

  const facilities = [
    { name: 'Marine Biology Lab', location: 'Colombo', equipment: 'Microscopes, DNA Sequencing', icon: Icons.Microscope },
    { name: 'Oceanography Lab', location: 'Galle', equipment: 'CTD Sensors, Satellites', icon: Icons.Waves },
    { name: 'Fish Technology', location: 'Negombo', equipment: 'Processing, Testing', icon: Icons.Fish },
    { name: 'Research Vessels', location: 'Multiple Ports', equipment: 'Sonar, GPS', icon: Icons.Ship }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
      <section className="relative border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm mb-6">
              <Icons.Sparkles className="w-4 h-4" /> Academic Hub
            </span>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Researchers & Students Portal
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl">
              Access research facilities, collaborate with experts, and advance marine science.
            </p>
            <div className="flex gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <Icons.CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Logged in as {currentUser.email}</span>
                </div>
              ) : (
                <>
                  <button onClick={() => navigate('/unified-registration')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    <Icons.Microscope className="w-5 h-5" /> Researcher Login
                  </button>
                  <button onClick={() => navigate('/unified-registration')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    <Icons.GraduationCap className="w-5 h-5" /> Student Login
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 border-b border-slate-700 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Icons.LayoutGrid },
            { id: 'research', label: 'Research', icon: Icons.Microscope },
            { id: 'student', label: 'Students', icon: Icons.GraduationCap },
            { id: 'grants', label: 'Grants', icon: Icons.DollarSign },
            { id: 'facilities', label: 'Facilities', icon: Icons.Building2 }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-200'}`}>
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Icons.Microscope className="w-8 h-8" /> For Researchers</h2>
                <ul className="space-y-3 mb-6">
                  {['Submit research papers', 'Book lab facilities', 'Access datasets', 'Apply for grants up to LKR 5M', 'Collaborate globally'].map(item => (
                    <li key={item} className="flex gap-2"><Icons.CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" /> {item}</li>
                  ))}
                </ul>
                <button onClick={() => setActiveTab('research')} className="w-full px-6 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">Explore Services</button>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Icons.GraduationCap className="w-8 h-8" /> For Students</h2>
                <ul className="space-y-3 mb-6">
                  {['Enroll in courses', 'Apply for internships', 'Get mentorship', 'Showcase projects', 'Student grants up to LKR 500K'].map(item => (
                    <li key={item} className="flex gap-2"><Icons.CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" /> {item}</li>
                  ))}
                </ul>
                <button onClick={() => setActiveTab('student')} className="w-full px-6 py-3 bg-purple-500 rounded-lg font-semibold hover:bg-purple-600 transition-colors">Explore Services</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'research' && (
            <motion.div key="research" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
              {services.research.map(s => (
                <div key={s.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                  <s.icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <ul className="space-y-2 mb-4 text-sm text-slate-200">
                    {s.features.map(f => <li key={f}>• {f}</li>)}
                  </ul>
                  <button onClick={() => navigate(s.link)} className="w-full px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors">Access</button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'student' && (
            <motion.div key="student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
              {services.student.map(s => (
                <div key={s.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                  <s.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <ul className="space-y-2 mb-4 text-sm text-slate-200">
                    {s.features.map(f => <li key={f}>• {f}</li>)}
                  </ul>
                  <button onClick={() => navigate(s.link)} className="w-full px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors">Access</button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'grants' && (
            <motion.div key="grants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {grants.map(g => (
                <div key={g.title} className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <g.icon className="w-12 h-12 text-green-400" />
                    <div>
                      <h3 className="text-2xl font-bold">{g.title}</h3>
                      <p className="text-green-400 font-semibold">{g.amount}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-200 mb-2">Deadline</p>
                    <p className="text-orange-400 font-semibold mb-3">{g.deadline}</p>
                    <button className="px-6 py-2 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-colors">Apply Now</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'facilities' && (
            <motion.div key="facilities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
              {facilities.map(f => (
                <div key={f.name} className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
                  <f.icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{f.name}</h3>
                  <p className="text-sm text-slate-200 mb-2 flex items-center gap-2"><Icons.MapPin className="w-4 h-4" /> {f.location}</p>
                  <p className="text-sm text-slate-300 mb-4">{f.equipment}</p>
                  <button className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors w-full">Book Now</button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default ResearchersStudentsHub;
