import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const KnowledgeDiscoveryRedesign = () => {
  const [activeCategory, setActiveCategory] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Educational content data
  const courses = [
    {
      id: 1,
      title: "Ocean Data Science Fundamentals",
      instructor: "Dr. Marina Chen",
      duration: "12 weeks",
      level: "Beginner",
      enrolled: 2847,
      rating: 4.9,
      modules: 24,
      thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      tags: ["Data Science", "Python", "Ocean Analytics"],
      progress: 65,
      certificate: true,
      price: "Free"
    },
    {
      id: 2,
      title: "Marine Conservation Strategies",
      instructor: "Prof. David Kumar",
      duration: "8 weeks",
      level: "Intermediate",
      enrolled: 1563,
      rating: 4.8,
      modules: 16,
      thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
      tags: ["Conservation", "Policy", "Sustainability"],
      progress: 0,
      certificate: true,
      price: "$49"
    },
    {
      id: 3,
      title: "Advanced Oceanographic Research",
      instructor: "Dr. Sarah Williams",
      duration: "16 weeks",
      level: "Advanced",
      enrolled: 892,
      rating: 4.9,
      modules: 32,
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      tags: ["Research", "Methodology", "Publishing"],
      progress: 0,
      certificate: true,
      price: "$99"
    }
  ];

  const resources = [
    {
      id: 1,
      type: "Dataset",
      title: "Sri Lankan Ocean Temperature Database 2020-2024",
      downloads: 5847,
      size: "2.3 GB",
      format: "CSV, JSON",
      icon: Icons.Database,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      type: "Research Tool",
      title: "Ocean Current Prediction Model v2.0",
      downloads: 3256,
      size: "145 MB",
      format: "Python Package",
      icon: Icons.Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      type: "Publication",
      title: "Marine Biodiversity Atlas 2024",
      downloads: 4123,
      size: "89 MB",
      format: "PDF",
      icon: Icons.FileText,
      color: "from-green-500 to-teal-500"
    },
    {
      id: 4,
      type: "Software",
      title: "NARA Ocean Simulator",
      downloads: 2145,
      size: "512 MB",
      format: "Desktop App",
      icon: Icons.Monitor,
      color: "from-orange-500 to-red-500"
    }
  ];

  const learningPaths = [
    {
      title: "Ocean Researcher",
      duration: "6 months",
      courses: 8,
      learners: 1250,
      level: "Beginner to Advanced",
      icon: Icons.Microscope,
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Marine Conservationist",
      duration: "4 months",
      courses: 6,
      learners: 980,
      level: "Intermediate",
      icon: Icons.Shield,
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Data Scientist",
      duration: "5 months",
      courses: 7,
      learners: 1560,
      level: "Intermediate to Advanced",
      icon: Icons.BarChart3,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-black"></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(100,200,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            <motion.div
              animate={{ y: [0, -40] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-full h-[200%]"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(100,200,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
          </div>
          
          {/* Floating books animation */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              >
                <Icons.BookOpen className="w-8 h-8 text-cyan-400/20" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <span className="text-cyan-400 font-space text-sm tracking-widest uppercase">
                    Education Hub
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold font-space mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Knowledge Discovery
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Explore our comprehensive ocean science education platform with courses, resources, and research tools
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "50+", label: "Courses", icon: Icons.BookOpen },
              { value: "15K+", label: "Learners", icon: Icons.Users },
              { value: "500+", label: "Resources", icon: Icons.Database },
              { value: "98%", label: "Success Rate", icon: Icons.Award }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <stat.icon className="w-6 h-6 text-cyan-400 mb-2 mx-auto" />
                <div className="text-3xl font-bold text-white font-space">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'courses', label: 'Online Courses', icon: Icons.GraduationCap },
              { id: 'resources', label: 'Research Resources', icon: Icons.Database },
              { id: 'paths', label: 'Learning Paths', icon: Icons.Route },
              { id: 'library', label: 'Digital Library', icon: Icons.Library },
              { id: 'webinars', label: 'Webinars', icon: Icons.Video }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`py-4 px-2 flex items-center gap-2 font-medium transition-all duration-300 border-b-2 ${
                  activeCategory === tab.id
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Courses Section */}
        {activeCategory === 'courses' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-12 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                  <Icons.Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-400" />
                </div>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Course Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        {course.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.price === 'Free' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          }`}>
                            {course.price}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            course.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                            course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {course.level}
                          </span>
                          {course.certificate && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                              Certificate
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4">{course.instructor}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Icons.Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.BookOpen className="w-4 h-4" />
                            {course.modules} modules
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold">{course.rating}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{course.enrolled.toLocaleString()} enrolled</span>
                        </div>

                        <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                          {course.progress > 0 ? 'Continue Learning' : 'Enroll Now'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Resources Section */}
        {activeCategory === 'resources' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${resource.color}`}>
                        <resource.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{resource.type}</span>
                        <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Icons.Download className="w-4 h-4" />
                            {resource.downloads.toLocaleString()} downloads
                          </span>
                          <span>{resource.size}</span>
                          <span className="text-cyan-400">{resource.format}</span>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                          <Icons.Download className="inline w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Learning Paths Section */}
        {activeCategory === 'paths' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-space mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    Career Learning Paths
                  </span>
                </h2>
                <p className="text-xl text-gray-400">Structured programs to advance your ocean science career</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ y: -10 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${path.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`}></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-cyan-500 transition-all">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${path.color} mb-6`}>
                        <path.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{path.title}</h3>
                      <p className="text-gray-400 mb-6">{path.level}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration</span>
                          <span className="text-white font-semibold">{path.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Courses</span>
                          <span className="text-white font-semibold">{path.courses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active Learners</span>
                          <span className="text-cyan-400 font-semibold">{path.learners.toLocaleString()}</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all">
                        Start Learning Path
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Interactive Learning Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Interactive Learning Experience
              </span>
            </h2>
            <p className="text-xl text-gray-400">Advanced tools and features for effective learning</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Icons.Cpu, title: "AI Tutoring", description: "Personalized learning assistance", color: "from-purple-500 to-pink-500" },
              { icon: Icons.Video, title: "Live Sessions", description: "Expert-led webinars", color: "from-blue-500 to-cyan-500" },
              { icon: Icons.Award, title: "Certifications", description: "Industry-recognized credentials", color: "from-green-500 to-teal-500" },
              { icon: Icons.Users, title: "Community", description: "Connect with peers", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeDiscoveryRedesign;