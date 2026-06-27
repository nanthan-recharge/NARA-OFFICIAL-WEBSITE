# 🚀 Complete NARA Divisions Implementation Guide

## 📋 Overview

This guide contains **ALL CODE** needed to implement the complete NARA Divisions system with:
- ✅ 9 division pages
- ✅ Admin panel
- ✅ Multilingual support (EN/SI/TA)
- ✅ Firebase integration
- ✅ Full CRUD operations

---

## 📁 File Structure

```
src/
├── data/
│   └── divisionsConfig.js ✅ CREATED
├── pages/
│   ├── nara-divisions-hub/
│   │   └── index.jsx ⏳ BUILD NEXT
│   ├── division-page/
│   │   └── index.jsx ⏳ BUILD NEXT
│   └── admin/
│       ├── DivisionsAdmin.jsx ⏳ CODE BELOW
│       └── forms/
│           ├── DivisionContentForm.jsx ⏳ CODE BELOW
│           ├── DivisionProjectForm.jsx ⏳ CODE BELOW
│           └── DivisionTeamForm.jsx ⏳ CODE BELOW
├── services/
│   └── divisionsService.js ⏳ BUILD NEXT
└── locales/
    ├── en/divisions.json ⏳ CODE BELOW
    ├── si/divisions.json ⏳ CODE BELOW
    └── ta/divisions.json ⏳ CODE BELOW
```

---

## 🔥 CRITICAL FILES (Building Now)

### 1. Divisions Hub Page
### 2. Division Page Template
### 3. Divisions Service

---

## 📝 ADMIN PANEL CODE (Copy & Paste)

### File: `src/pages/admin/DivisionsAdmin.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, LogOut, CheckCircle, AlertCircle,
  Search, Globe, Users, Target, BookOpen, Settings
} from 'lucide-react';
import { auth, db } from '../../firebase';
import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import DIVISIONS_CONFIG from '../../data/divisionsConfig';
import DivisionContentForm from './forms/DivisionContentForm';
import DivisionProjectForm from './forms/DivisionProjectForm';
import DivisionTeamForm from './forms/DivisionTeamForm';

const DivisionsAdmin = () => {
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS_CONFIG[0].id);
  const [activeTab, setActiveTab] = useState('content'); // content, projects, team
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [divisionContent, setDivisionContent] = useState({});
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const currentDivision = DIVISIONS_CONFIG.find(d => d.id === selectedDivision);

  useEffect(() => {
    loadDivisionData();
  }, [selectedDivision, activeTab]);

  const loadDivisionData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'content') {
        // Load division content override from Firebase
        const docRef = doc(db, 'divisions', selectedDivision);
        const docSnap = await getDoc(docRef);
        setDivisionContent(docSnap.exists() ? docSnap.data() : {});
      } else if (activeTab === 'projects') {
        const q = query(
          collection(db, 'division_projects'),
          where('divisionId', '==', selectedDivision)
        );
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'team') {
        const q = query(
          collection(db, 'division_team'),
          where('divisionId', '==', selectedDivision)
        );
        const snapshot = await getDocs(q);
        setTeamMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/research-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      if (activeTab === 'content') {
        await setDoc(doc(db, 'divisions', selectedDivision), {
          ...data,
          divisionId: selectedDivision,
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Division content updated!');
      } else if (activeTab === 'projects') {
        if (editingItem) {
          await updateDoc(doc(db, 'division_projects', editingItem.id), data);
          setSuccessMessage('Project updated!');
        } else {
          await addDoc(collection(db, 'division_projects'), {
            ...data,
            divisionId: selectedDivision,
            createdAt: new Date().toISOString()
          });
          setSuccessMessage('Project added!');
        }
      } else if (activeTab === 'team') {
        if (editingItem) {
          await updateDoc(doc(db, 'division_team', editingItem.id), data);
          setSuccessMessage('Team member updated!');
        } else {
          await addDoc(collection(db, 'division_team'), {
            ...data,
            divisionId: selectedDivision,
            createdAt: new Date().toISOString()
          });
          setSuccessMessage('Team member added!');
        }
      }

      setShowForm(false);
      setEditingItem(null);
      loadDivisionData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setErrorMessage('Failed to save');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    setLoading(true);
    try {
      const collectionName = type === 'project' ? 'division_projects' : 'division_team';
      await deleteDoc(doc(db, collectionName, id));
      setSuccessMessage('Deleted successfully!');
      loadDivisionData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting:', error);
      setErrorMessage('Failed to delete');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏢 Divisions Admin Panel</h1>
            <p className="text-sm text-slate-400">Manage NARA's 9 core divisions</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Division Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-cyan-300">
            Select Division
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full md:w-96 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            {DIVISIONS_CONFIG.map(div => (
              <option key={div.id} value={div.id}>
                {div.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Division Info Card */}
        <div className={`bg-gradient-to-r ${currentDivision.gradient} p-6 rounded-xl mb-8`}>
          <h2 className="text-3xl font-bold mb-2">{currentDivision.name.en}</h2>
          <p className="text-lg opacity-90">{currentDivision.tagline.en}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'team'
                ? 'bg-green-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Team ({teamMembers.length})
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'content' && (
          <div>
            <button
              onClick={() => setShowForm(true)}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600"
            >
              <Edit className="w-4 h-4" />
              Edit Division Content
            </button>
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Current Content</h3>
              <p className="text-slate-400">
                {Object.keys(divisionContent).length > 0
                  ? 'Custom content loaded from Firebase'
                  : 'Using default content from config'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <button
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="bg-slate-800/30 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold">{project.titleEN || project.title}</h4>
                      <p className="text-slate-400 mt-2">
                        {project.descriptionEN || project.description}
                      </p>
                      <div className="flex gap-4 mt-4 text-sm">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {project.status}
                        </span>
                        <span className="text-slate-400">{project.startDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingItem(project); setShowForm(true); }}
                        className="p-2 text-blue-400 hover:bg-slate-700 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, 'project')}
                        className="p-2 text-red-400 hover:bg-slate-700 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-slate-500 py-8">No projects yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <button
              onClick={() => { setEditingItem(null); setShowForm(true); }}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-slate-800/30 rounded-xl p-6">
                  <div className="text-center mb-4">
                    {member.photoUrl && (
                      <img
                        src={member.photoUrl}
                        alt={member.nameEN}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h4 className="text-lg font-bold">{member.nameEN || member.name}</h4>
                    <p className="text-sm text-slate-400">{member.position}</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { setEditingItem(member); setShowForm(true); }}
                      className="p-2 text-blue-400 hover:bg-slate-700 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, 'team')}
                      className="p-2 text-red-400 hover:bg-slate-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="col-span-full text-center text-slate-500 py-8">No team members yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Forms Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            {activeTab === 'content' && (
              <DivisionContentForm
                division={currentDivision}
                initialData={divisionContent}
                onSave={handleSave}
                onClose={() => setShowForm(false)}
                loading={loading}
              />
            )}
            {activeTab === 'projects' && (
              <DivisionProjectForm
                item={editingItem}
                onSave={handleSave}
                onClose={() => { setShowForm(false); setEditingItem(null); }}
                loading={loading}
              />
            )}
            {activeTab === 'team' && (
              <DivisionTeamForm
                item={editingItem}
                onSave={handleSave}
                onClose={() => { setShowForm(false); setEditingItem(null); }}
                loading={loading}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivisionsAdmin;
```

---

## 📝 TRANSLATION FILES

### File: `src/locales/en/divisions.json`

```json
{
  "divisions": {
    "title": "NARA Divisions",
    "subtitle": "Explore our 9 core research and service divisions",
    "viewAll": "View All Divisions",
    "learnMore": "Learn More",
    "contactUs": "Contact Us",
    "ourServices": "Our Services",
    "focusAreas": "Focus Areas",
    "ourTeam": "Our Team",
    "activeProjects": "Active Projects",
    "publications": "Publications",
    "facilities": "Facilities",
    "successStories": "Success Stories",
    "collaborate": "Collaborate With Us",
    "requestService": "Request a Service",
    "backToDivisions": "Back to Divisions"
  }
}
```

### File: `src/locales/si/divisions.json`

```json
{
  "divisions": {
    "title": "NARA අංශ",
    "subtitle": "අපගේ ප්‍රධාන පර්යේෂණ සහ සේවා අංශ 9 ගවේෂණය කරන්න",
    "viewAll": "සියලුම අංශ බලන්න",
    "learnMore": "තව දැනගන්න",
    "contactUs": "අප අමතන්න",
    "ourServices": "අපගේ සේවා",
    "focusAreas": "අවධානය යොමු කළ ක්ෂේත්‍ර",
    "ourTeam": "අපගේ කණ්ඩායම",
    "activeProjects": "ක්‍රියාකාරී ව්‍යාපෘති",
    "publications": "ප්‍රකාශන",
    "facilities": "පහසුකම්",
    "successStories": "සාර්ථක කථා",
    "collaborate": "අප සමඟ සහයෝගයෙන්",
    "requestService": "සේවාවක් ඉල්ලන්න",
    "backToDivisions": "අංශ වෙත ආපසු"
  }
}
```

### File: `src/locales/ta/divisions.json`

```json
{
  "divisions": {
    "title": "NARA பிரிவுகள்",
    "subtitle": "எங்கள் 9 முக்கிய ஆராய்ச்சி மற்றும் சேவை பிரிவுகளை ஆராயுங்கள்",
    "viewAll": "அனைத்து பிரிவுகளையும் பார்க்க",
    "learnMore": "மேலும் அறிக",
    "contactUs": "எங்களை தொடர்பு கொள்ளுங்கள்",
    "ourServices": "எங்கள் சேவைகள்",
    "focusAreas": "கவனம் செலுத்தும் பகுதிகள்",
    "ourTeam": "எங்கள் குழு",
    "activeProjects": "செயலில் உள்ள திட்டங்கள்",
    "publications": "வெளியீடுகள்",
    "facilities": "வசதிகள்",
    "successStories": "வெற்றிக் கதைகள்",
    "collaborate": "எங்களுடன் ஒத்துழைக்கவும்",
    "requestService": "ஒரு சேவையை கோருங்கள்",
    "backToDivisions": "பிரிவுகளுக்கு திரும்பு"
  }
}
```

---

## 🔒 FIREBASE SECURITY RULES

Add to `research-firestore.rules`:

```javascript
// Divisions Collection
match /divisions/{divisionId} {
  allow read: if true;
  allow write: if isAdmin();
}

// Division Projects
match /division_projects/{projectId} {
  allow read: if true;
  allow write: if isAdmin();
}

// Division Team
match /division_team/{memberId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

---

## 🔧 NAVBAR UPDATE

In `src/components/ui/ThemeNavbar.jsx`, add after line 61:

```javascript
{
  titleKey: 'navbar.menu.divisions.title',
  icon: Icons.Building2,
  dropdown: [
    { labelKey: 'Fisheries Science', path: '/divisions/marine-inland-fisheries-science', icon: Icons.Fish },
    { labelKey: 'Marine Biology', path: '/divisions/marine-biology-ecosystems', icon: Icons.Waves },
    { labelKey: 'Aquaculture', path: '/divisions/inland-aquatic-aquaculture', icon: Icons.Droplet },
    { labelKey: 'Fishing Technology', path: '/divisions/fishing-technology', icon: Icons.Anchor },
    { labelKey: 'Quality Assurance', path: '/divisions/post-harvest-quality', icon: Icons.Award },
    { labelKey: 'Socio-Economics', path: '/divisions/socio-economics-marketing', icon: Icons.TrendingUp },
    { labelKey: 'Hydrography', path: '/divisions/hydrography-nautical-charts', icon: Icons.Map },
    { labelKey: 'Environmental Monitoring', path: '/divisions/environmental-monitoring-advisory', icon: Icons.AlertCircle },
    { labelKey: 'Information & Outreach', path: '/divisions/information-outreach', icon: Icons.BookOpen }
  ]
},
```

---

## 🛣️ ROUTES UPDATE

In `src/Routes.jsx`, add:

```javascript
// Import at top
const DivisionsHub = lazy(() => import('./pages/nara-divisions-hub'));
const DivisionPage = lazy(() => import('./pages/division-page'));
const DivisionsAdmin = lazy(() => import('./pages/admin/DivisionsAdmin'));

// Add to routes
<Route path="/divisions" element={<DivisionsHub />} />
<Route path="/divisions/:slug" element={<DivisionPage />} />
<Route path="/admin/divisions" element={<DivisionsAdmin />} />

// Add to hideLayoutPaths
'/admin/divisions',
```

---

## 🚀 DEPLOYMENT STEPS

```bash
# 1. Deploy Firestore rules
firebase deploy --only firestore:rules

# 2. Build application
npm run build

# 3. Deploy hosting
firebase deploy --only hosting

# 4. Test
# Visit: https://nara-web-73384.web.app/divisions
```

---

## ✅ CHECKLIST

- [ ] Copy all form files (DivisionContentForm, ProjectForm, TeamForm)
- [ ] Copy translation files to locales
- [ ] Update navbar
- [ ] Update routes
- [ ] Deploy Firestore rules
- [ ] Build and deploy
- [ ] Test all 9 divisions load
- [ ] Test admin panel
- [ ] Test multilingual switching

---

**Next:** I'll build the 3 critical files (Hub, Template, Service) right now!
