# 📚 Research Excellence Portal - Documentation

## 📖 Available Documentation

### 1. **Complete User Guide** 📘
**File**: `RESEARCH_PORTAL_GUIDE.md`

Comprehensive documentation covering:
- User roles & permissions
- Registration & authentication
- Uploading research papers
- Search & discovery features
- Multilingual support
- Security & privacy
- Technical architecture
- Troubleshooting
- Best practices

**Perfect for**: New users, researchers, administrators

---

### 2. **Visual Workflow Guide** 🔄
**File**: `PORTAL_WORKFLOW.md`

Visual flowcharts and diagrams for:
- User registration flow
- Paper upload process
- Content discovery journey
- Authentication gates
- Search & filter logic
- Role-based access control
- Data flow architecture
- Error handling

**Perfect for**: Understanding system processes, training, development

---

### 3. **Sample Data** 📊
**Location**: `/scripts/`

Files:
- `sampleResearchData.json` - Sample research papers
- `README.md` - Import instructions
- `seedResearchContent.js` - Auto-seed script

**Perfect for**: Testing, demonstrations, initial content

---

## 🚀 Quick Start

### For Users

1. **Read the Guide**: Start with `RESEARCH_PORTAL_GUIDE.md`
2. **Register**: https://nara-web-73384.web.app/register
3. **Visit Portal**: https://nara-web-73384.web.app/research-excellence-portal
4. **Upload Content**: Use the admin panel (Researchers/Professors only)

### For Developers

1. **Review Architecture**: See Technical Architecture section in guide
2. **Check Workflows**: Review `PORTAL_WORKFLOW.md`
3. **Understand Data**: Check `/scripts/sampleResearchData.json`
4. **Review Code**: See `/src/pages/research-excellence-portal/`

---

## 📂 File Structure

```
docs/
├── README.md (this file)
├── RESEARCH_PORTAL_GUIDE.md (complete guide)
└── PORTAL_WORKFLOW.md (visual workflows)

scripts/
├── README.md (import instructions)
├── sampleResearchData.json (sample papers)
└── seedResearchContent.js (auto-seed script)

src/
├── pages/
│   └── research-excellence-portal/
│       ├── ResearchPortalMain.jsx
│       ├── components/
│       │   ├── AdminUpload.jsx
│       │   ├── ContentReader.jsx
│       │   └── SearchBar.jsx
│       └── index.jsx
├── services/
│   └── researchContentService.js
└── locales/
    ├── en/researchPortal.json
    ├── si/researchPortal.json
    └── ta/researchPortal.json
```

---

## 🎯 Key Features

### ✅ Implemented

- [x] Trilingual support (English/Sinhala/Tamil)
- [x] Role-based access control
- [x] Authentication-gated content
- [x] Advanced search & filters
- [x] PDF upload & download
- [x] Real-time view/download tracking
- [x] Responsive design
- [x] Admin upload panel
- [x] Content reader with tabs
- [x] Citation generator
- [x] Bookmark system
- [x] Category filtering
- [x] Language filtering
- [x] Sort options

### 🔜 Planned

- [ ] Author dashboards
- [ ] Advanced citation formats
- [ ] Peer review system
- [ ] Social sharing
- [ ] Email notifications
- [ ] Related papers suggestions
- [ ] Export to reference managers
- [ ] Paper versioning
- [ ] Collaborative annotations

---

## 🔗 Important Links

### Live Portal
- **Main Portal**: https://nara-web-73384.web.app/research-excellence-portal
- **Registration**: https://nara-web-73384.web.app/register
- **Login**: https://nara-web-73384.web.app/login

### Firebase Console
- **Project**: https://console.firebase.google.com/project/nara-web-73384
- **Firestore**: https://console.firebase.google.com/project/nara-web-73384/firestore
- **Storage**: https://console.firebase.google.com/project/nara-web-73384/storage
- **Authentication**: https://console.firebase.google.com/project/nara-web-73384/authentication

---

## 👥 User Roles

| Role | Browse | Read Full | Upload | Edit Own | Edit Any | Delete |
|------|--------|-----------|--------|----------|----------|--------|
| Public | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Student | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Researcher | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Professor | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📊 Research Categories

1. 🐠 Marine Ecology
2. 🌊 Oceanography
3. 🎣 Fisheries
4. 🌡️ Climate Change
5. 🏭 Marine Pollution
6. 🏖️ Coastal Management
7. 🤖 Marine Technology
8. ⚖️ Policy & Law

---

## 🛠️ Technology Stack

**Frontend:**
- React 18
- React Router DOM
- Framer Motion
- Lucide React
- TailwindCSS
- react-i18next

**Backend:**
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

**Build:**
- Vite
- npm

---

## 📞 Support

### Documentation Issues
- Check troubleshooting section in guide
- Review workflow diagrams
- Consult sample data

### Technical Issues
- Check browser console
- Review Firestore rules
- Verify authentication status

### Content Issues
- Contact system administrator
- Request role change
- Report bugs

---

## 📝 Version History

### Version 1.0.0 (October 17, 2025)
- ✅ Initial release
- ✅ Trilingual support
- ✅ Authentication system
- ✅ Upload functionality
- ✅ Search & filters
- ✅ Complete documentation

---

## 🎓 Learning Resources

### For Users
1. Read `RESEARCH_PORTAL_GUIDE.md` (start here)
2. Review `PORTAL_WORKFLOW.md` for visual guides
3. Check sample data in `/scripts/`
4. Try uploading a test paper

### For Developers
1. Review technical architecture section
2. Study component structure
3. Understand Firebase integration
4. Check Firestore security rules
5. Review translation files

---

## 📈 Success Metrics

Track these KPIs:
- Total papers published
- Registered users by role
- Papers per category
- Most viewed papers
- Most downloaded papers
- Search queries
- User engagement rate

---

## 🏆 Best Practices

### For Authors
- Write clear, descriptive titles
- Complete all language versions
- Add relevant keywords
- Include DOI when available
- Upload complete PDFs
- Proofread all content

### For Readers
- Use filters to narrow results
- Bookmark papers for later
- Download PDFs for offline access
- Cite properly using citation tool
- Share valuable research

### For Administrators
- Monitor content quality
- Update Firestore rules as needed
- Back up data regularly
- Review user feedback
- Plan feature enhancements

---

## 🎉 Getting Started Checklist

### New User Setup
- [ ] Read documentation
- [ ] Register account
- [ ] Verify email
- [ ] Complete profile
- [ ] Browse papers
- [ ] Try search features
- [ ] Bookmark favorites

### Researcher Setup
- [ ] Register as Researcher/Professor
- [ ] Prepare paper content
- [ ] Translate to 3 languages
- [ ] Gather metadata
- [ ] Prepare PDF
- [ ] Upload first paper
- [ ] Share with colleagues

---

## 📧 Contact

For questions, issues, or suggestions:
- Review documentation first
- Check troubleshooting guide
- Contact system administrator
- Submit feedback through portal

---

**Last Updated**: October 17, 2025  
**Version**: 1.0.0  
**Maintained by**: NARA Digital Ocean Team

---

## 🚀 Ready to Start?

1. **Read the Complete Guide**: Open `RESEARCH_PORTAL_GUIDE.md`
2. **Understand Workflows**: Check `PORTAL_WORKFLOW.md`
3. **Visit the Portal**: https://nara-web-73384.web.app/research-excellence-portal
4. **Start Publishing**: Upload your first research paper!

**Happy Researching! 📚🔬🌊**
