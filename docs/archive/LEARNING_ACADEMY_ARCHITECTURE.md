# Learning Development Academy - World-Class Intelligent Platform Architecture

## Executive Summary

This document outlines the comprehensive architecture for transforming the Learning Development Academy into a world-class intelligent platform with multi-user role capabilities, full trilingual support (English, Sinhala, Tamil), project submission system, and real-time Firebase integration.

---

## 1. System Overview

### 1.1 Core Features
- **Multi-Role User System**: Students, Researchers, Professors with different permissions
- **Content Management**: Courses, Training Materials, Research Papers
- **Project Submission System**: Research projects, papers, and materials upload
- **Trilingual Platform**: Every content piece in EN/SI/TA
- **Admin Control Panel**: Full CRUD operations for all content types
- **AI-Powered Features**: Smart search, recommendations, progress tracking
- **Real-time Synchronization**: Firebase Firestore integration

### 1.2 Technology Stack
- **Frontend**: React 18.2+ with Framer Motion animations
- **State Management**: React hooks + Context API
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage for files/media
- **Authentication**: Firebase Authentication
- **Search**: Client-side + Firestore queries with AI enhancement
- **Internationalization**: react-i18next

---

## 2. Firebase Collections Structure

### 2.1 Users Collection (`lda_users`)

```javascript
{
  id: "auto-generated-id",

  // Authentication
  email: "user@example.com",
  uid: "firebase-auth-uid",

  // Personal Information (Trilingual)
  firstName: {
    en: "John",
    si: "ජෝන්",
    ta: "ஜான்"
  },
  lastName: {
    en: "Doe",
    si: "ඩෝ",
    ta: "டோ"
  },

  // Profile
  role: "student", // "student" | "researcher" | "professor" | "admin"
  avatar: "https://storage.url/avatar.jpg",

  // Organization
  institution: {
    en: "NARA Sri Lanka",
    si: "නාරා ශ්‍රී ලංකා",
    ta: "நாரா இலங்கை"
  },
  department: {
    en: "Marine Biology",
    si: "සමුද්‍ර ජීව විද්‍යාව",
    ta: "கடல் உயிரியல்"
  },

  // Contact
  phone: "+94771234567",
  country: "Sri Lanka",

  // Academic
  qualification: "PhD", // "Bachelor" | "Master" | "PhD" | "Professor"
  specialization: {
    en: "Coral Reef Conservation",
    si: "කොරල් පර පැවැත්ම",
    ta: "பவளப்பாறை பாதுகாப்பு"
  },

  // Permissions
  permissions: {
    canSubmitProjects: true,
    canUploadPapers: false, // Only researchers/professors
    canCreateCourses: false, // Only professors/admin
    canModerate: false // Only admin
  },

  // Stats
  stats: {
    coursesCompleted: 0,
    coursesInProgress: 0,
    projectsSubmitted: 0,
    papersUploaded: 0,
    certificatesEarned: 0,
    totalLearningHours: 0
  },

  // Progress Tracking
  enrolledCourses: ["course-id-1", "course-id-2"],
  completedCourses: ["course-id-3"],
  bookmarkedCourses: ["course-id-4"],

  // Preferences
  preferredLanguage: "en", // "en" | "si" | "ta"
  emailNotifications: true,
  profilePublic: false,

  // Timestamps
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
  lastLoginAt: "2024-01-20T14:45:00Z"
}
```

### 2.2 Courses Collection (`lda_courses`)

```javascript
{
  id: "auto-generated-id",

  // Basic Information (Trilingual)
  title: {
    en: "Advanced Ocean Dynamics",
    si: "උසස් සාගර ගතිකත්වය",
    ta: "மேம்பட்ட கடல் இயக்கவியல்"
  },
  description: {
    en: "Master the complex physics of ocean currents...",
    si: "සාගර ධාරා වල සංකීර්ණ භෞතික විද්‍යාව...",
    ta: "கடல் நீரோட்டங்களின் சிக்கலான இயற்பியல்..."
  },

  // Category & Level
  category: "marine-science", // References lda_categories
  subCategory: "oceanography",
  level: "advanced", // "beginner" | "intermediate" | "advanced" | "expert"

  // Instructor (Trilingual)
  instructor: {
    id: "instructor-user-id",
    name: {
      en: "Dr. Sarah Chen",
      si: "ආචාර්ය සාරා චෙන්",
      ta: "டாக்டர். சாரா சென்"
    },
    title: {
      en: "Lead Ocean Physicist",
      si: "ප්‍රධාන සාගර භෞතික විද්‍යාඥ",
      ta: "முன்னணி கடல் இயற்பியலாளர்"
    },
    bio: {
      en: "15+ years in ocean dynamics research",
      si: "සාගර ගතිකත්ව පර්යේෂණයේ වසර 15+",
      ta: "கடல் இயக்கவியல் ஆராய்ச்சியில் 15+ ஆண்டுகள்"
    },
    avatar: "https://storage.url/instructor.jpg"
  },

  // Course Content
  modules: [
    {
      id: "module-1",
      title: {
        en: "Introduction to Ocean Physics",
        si: "සාගර භෞතික විද්‍යාවට හැඳින්වීම",
        ta: "கடல் இயற்பியல் அறிமுகம்"
      },
      description: {
        en: "Fundamental concepts...",
        si: "මූලික සංකල්ප...",
        ta: "அடிப்படை கருத்துக்கள்..."
      },
      duration: "2 hours",
      lessons: [
        {
          id: "lesson-1-1",
          title: {
            en: "Ocean Structure",
            si: "සාගර ව්‍යුහය",
            ta: "கடல் அமைப்பு"
          },
          type: "video", // "video" | "reading" | "quiz" | "assignment" | "lab"
          duration: "45 minutes",
          content: {
            videoUrl: "https://storage.url/video.mp4",
            transcript: {
              en: "Full transcript...",
              si: "සම්පූර්ණ පිටපත...",
              ta: "முழு பிரதி..."
            },
            resources: [
              {
                title: {en: "Reading Material", si: "කියවීමේ ද්‍රව්‍ය", ta: "வாசிப்புப் பொருள்"},
                url: "https://storage.url/doc.pdf"
              }
            ]
          },
          completed: false
        }
      ]
    }
  ],

  // Course Meta
  duration: "12 weeks",
  totalHours: 48,
  totalModules: 8,
  totalLessons: 64,

  // Requirements (Trilingual)
  prerequisites: {
    en: ["Basic physics", "Mathematics fundamentals"],
    si: ["මූලික භෞතික විද්‍යාව", "ගණිත මූලධර්ම"],
    ta: ["அடிப்படை இயற்பியல்", "கணித அடிப்படைகள்"]
  },

  // What You'll Learn (Trilingual)
  learningOutcomes: {
    en: [
      "Understand ocean current systems",
      "Analyze wave dynamics",
      "Model ocean circulation"
    ],
    si: [
      "සාගර ධාරා පද්ධති තේරුම් ගන්න",
      "තරංග ගතිකත්වය විශ්ලේෂණය කරන්න",
      "සාගර චක්‍රලේඛ ආකෘති කරන්න"
    ],
    ta: [
      "கடல் நீரோட்ட அமைப்புகளைப் புரிந்து கொள்ளுங்கள்",
      "அலை இயக்கவியலை பகுப்பாய்வு செய்யுங்கள்",
      "கடல் சுழற்சியை மாதிரியாக்குங்கள்"
    ]
  },

  // Certification
  certification: {
    enabled: true,
    name: {
      en: "Advanced Ocean Dynamics Certificate",
      si: "උසස් සාගර ගතිකත්ව සහතිකය",
      ta: "மேம்பட்ட கடல் இயக்கவியல் சான்றிதழ்"
    },
    requirements: {
      minimumScore: 75,
      completionRate: 100,
      assignmentsCompleted: true,
      finalExam: true
    }
  },

  // Enrollment
  price: 299, // USD (can be 0 for free courses)
  currency: "USD",
  enrolled: 2456,
  capacity: 5000, // Max students (null for unlimited)

  // Features & Resources
  features: {
    en: ["Live Labs", "Field Work", "Research Project", "Peer Review"],
    si: ["සජීවී විද්‍යාගාර", "ක්ෂේත්‍ර වැඩ", "පර්යේෂණ ව්‍යාපෘතිය", "සම-සමාලෝචනය"],
    ta: ["நேரடி ஆய்வகங்கள்", "கள பணி", "ஆராய்ச்சி திட்டம்", "சக மதிப்பாய்வு"]
  },

  // Media
  thumbnail: "https://storage.url/course-thumb.jpg",
  banner: "https://storage.url/course-banner.jpg",
  gallery: [
    "https://storage.url/img1.jpg",
    "https://storage.url/img2.jpg"
  ],

  // Ratings & Reviews
  rating: 4.9,
  totalReviews: 342,
  reviewsBreakdown: {
    5: 280,
    4: 45,
    3: 12,
    2: 3,
    1: 2
  },

  // Tags (for search)
  tags: {
    en: ["Physics", "Oceanography", "Climate", "Advanced"],
    si: ["භෞතික විද්‍යාව", "සාගර විද්‍යාව", "දේශගුණය", "උසස්"],
    ta: ["இயற்பியல்", "கடல்சார்", "காலநிலை", "மேம்பட்ட"]
  },

  // Status
  status: "published", // "draft" | "published" | "archived"
  featured: true,
  trending: false,

  // Timestamps
  publishedAt: "2024-01-10T08:00:00Z",
  createdAt: "2024-01-05T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z"
}
```

### 2.3 Course Categories Collection (`lda_categories`)

```javascript
{
  id: "marine-science",

  name: {
    en: "Marine Science",
    si: "සාගර විද්‍යාව",
    ta: "கடல் அறிவியல்"
  },

  description: {
    en: "Comprehensive study of ocean systems and marine life",
    si: "සාගර පද්ධති සහ සමුද්‍ර ජීවීන් පිළිබඳ විස්තීර්ණ අධ්‍යයනය",
    ta: "கடல் அமைப்புகள் மற்றும் கடல் உயிரினங்கள் பற்றிய விரிவான ஆய்வு"
  },

  icon: "🌊", // Emoji or icon name
  color: "cyan", // For UI theming
  gradient: "from-cyan-400 to-blue-600",

  subCategories: [
    {
      id: "oceanography",
      name: {
        en: "Oceanography",
        si: "සාගර විද්‍යාව",
        ta: "கடலியல்"
      }
    },
    {
      id: "marine-biology",
      name: {
        en: "Marine Biology",
        si: "සමුද්‍ර ජීව විද්‍යාව",
        ta: "கடல் உயிரியல்"
      }
    },
    {
      id: "climate-science",
      name: {
        en: "Climate Science",
        si: "දේශගුණ විද්‍යාව",
        ta: "காலநிலை அறிவியல்"
      }
    }
  ],

  courseCount: 45,
  order: 1,
  active: true,

  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-20T00:00:00Z"
}
```

### 2.4 User Course Progress Collection (`lda_user_progress`)

```javascript
{
  id: "auto-generated-id",

  userId: "user-id",
  courseId: "course-id",

  // Enrollment
  enrolledAt: "2024-01-15T10:00:00Z",
  startedAt: "2024-01-15T11:30:00Z",

  // Progress
  status: "in-progress", // "enrolled" | "in-progress" | "completed" | "dropped"
  overallProgress: 45, // Percentage (0-100)

  // Module Progress
  moduleProgress: [
    {
      moduleId: "module-1",
      completed: true,
      progress: 100,
      completedAt: "2024-01-16T18:00:00Z"
    },
    {
      moduleId: "module-2",
      completed: false,
      progress: 60,
      completedAt: null
    }
  ],

  // Lesson Progress
  lessonProgress: [
    {
      lessonId: "lesson-1-1",
      completed: true,
      timeSpent: 2700, // seconds
      lastViewed: "2024-01-15T12:00:00Z",
      completedAt: "2024-01-15T12:45:00Z"
    }
  ],

  // Assessments
  quizScores: [
    {
      quizId: "quiz-1",
      score: 85,
      maxScore: 100,
      attempts: 1,
      passed: true,
      completedAt: "2024-01-16T15:00:00Z"
    }
  ],

  assignmentSubmissions: [
    {
      assignmentId: "assignment-1",
      submittedAt: "2024-01-17T20:00:00Z",
      fileUrl: "https://storage.url/submission.pdf",
      grade: 88,
      feedback: {
        en: "Excellent work on analysis",
        si: "විශ්ලේෂණය පිළිබඳ විශිෂ්ට කාර්යයක්",
        ta: "பகுப்பாய்வில் சிறந்த வேலை"
      },
      gradedAt: "2024-01-19T10:00:00Z"
    }
  ],

  // Certification
  certificateEarned: false,
  certificateIssuedAt: null,
  certificateId: null,
  finalScore: 0,

  // Time Tracking
  totalTimeSpent: 14400, // seconds (4 hours)
  lastAccessedAt: "2024-01-20T16:30:00Z",

  // Notes & Bookmarks
  notes: [
    {
      lessonId: "lesson-2-3",
      content: "Important formula for wave calculation",
      timestamp: "2024-01-18T14:20:00Z"
    }
  ],

  bookmarkedLessons: ["lesson-3-1", "lesson-5-2"],

  // Timestamps
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T16:30:00Z"
}
```

### 2.5 Research Projects Collection (`lda_projects`)

```javascript
{
  id: "auto-generated-id",

  // Submission Information
  submittedBy: "user-id",
  submitterRole: "researcher", // "student" | "researcher" | "professor"

  // Project Details (Trilingual)
  title: {
    en: "Impact of Ocean Acidification on Coral Reefs",
    si: "කොරල් පර මත සාගර අම්ලකරණයේ බලපෑම",
    ta: "பவளப்பாறைகளில் கடல் அமிலமயமாக்கலின் தாக்கம்"
  },

  abstract: {
    en: "This research investigates...",
    si: "මෙම පර්යේෂණය විමර්ශනය කරයි...",
    ta: "இந்த ஆராய்ச்சி ஆராய்கிறது..."
  },

  fullDescription: {
    en: "Detailed description...",
    si: "විස්තරාත්මක විස්තරය...",
    ta: "விரிவான விவரம்..."
  },

  // Classification
  category: "marine-biology",
  subCategory: "coral-ecology",
  researchType: "experimental", // "theoretical" | "experimental" | "observational" | "review"

  // Academic Information
  keywords: {
    en: ["ocean acidification", "coral reefs", "climate change", "pH levels"],
    si: ["සාගර අම්ලකරණය", "කොරල් පර", "දේශගුණ වෙනස", "pH මට්ටම්"],
    ta: ["கடல் அமிலமயமாக்கல்", "பவளப்பாறைகள்", "காலநிலை மாற்றம்", "pH அளவுகள்"]
  },

  // Team & Collaboration
  authors: [
    {
      id: "user-id-1",
      name: {
        en: "Dr. Priya Fernando",
        si: "ආචාර්ය ප්‍රියා ප්‍රනාන්දු",
        ta: "டாக்டர். பிரியா பெர்னாண்டோ"
      },
      role: "Principal Investigator",
      affiliation: {
        en: "NARA Sri Lanka",
        si: "නාරා ශ්‍රී ලංකා",
        ta: "நாரா இலங்கை"
      }
    },
    {
      id: "user-id-2",
      name: {
        en: "Prof. Michael Chen",
        si: "මහාචාර්ය මයිකල් චෙන්",
        ta: "பேராசிரியர் மைக்கேல் சென்"
      },
      role: "Co-Investigator",
      affiliation: {
        en: "University of Tokyo",
        si: "ටෝකියෝ විශ්වවිද්‍යාලය",
        ta: "டோக்கியோ பல்கலைக்கழகம்"
      }
    }
  ],

  // Research Period
  startDate: "2023-01-01",
  endDate: "2024-12-31",
  duration: "24 months",
  status: "ongoing", // "planning" | "ongoing" | "completed" | "published"

  // Funding
  funding: {
    source: {
      en: "National Science Foundation",
      si: "ජාතික විද්‍යා පදනම",
      ta: "தேசிய அறிவியல் அறக்கட்டளை"
    },
    amount: "$250,000",
    grantNumber: "NSF-2024-1234"
  },

  // Research Outputs
  methodology: {
    en: "Detailed methodology...",
    si: "විස්තරාත්මක ක්‍රමවේදය...",
    ta: "விரிவான முறையியல்..."
  },

  objectives: {
    en: [
      "Measure pH changes in reef environments",
      "Assess coral bleaching patterns",
      "Develop predictive models"
    ],
    si: [
      "පර පරිසරයේ pH වෙනස්කම් මැනීම",
      "කොරල් විරංජනය රටා තක්සේරු කිරීම",
      "පුරෝකථන ආකෘති සංවර්ධනය කිරීම"
    ],
    ta: [
      "பாறை சூழல்களில் pH மாற்றங்களை அளவிடுதல்",
      "பவள வெளுப்பு வடிவங்களை மதிப்பிடுதல்",
      "முன்னறிவிப்பு மாதிரிகளை உருவாக்குதல்"
    ]
  },

  keyFindings: {
    en: [
      "30% increase in acidification over 5 years",
      "Correlation between pH and bleaching events",
      "Novel adaptation mechanisms discovered"
    ],
    si: [
      "වසර 5 ක් තුළ අම්ලකරණය 30% වැඩි වීම",
      "pH සහ විරංජන සිදුවීම් අතර සහසම්බන්ධය",
      "නව අනුවර්තන යාන්ත්‍රණ සොයා ගන්නා ලදී"
    ],
    ta: [
      "5 ஆண்டுகளில் அமிலமயமாக்கல் 30% அதிகரிப்பு",
      "pH மற்றும் வெளுத்தல் நிகழ்வுகளுக்கு இடையேயான தொடர்பு",
      "புதிய தழுவல் வழிமுறைகள் கண்டுபிடிக்கப்பட்டன"
    ]
  },

  // Files & Media
  documents: [
    {
      type: "research-paper",
      title: {
        en: "Main Research Paper",
        si: "ප්‍රධාන පර්යේෂණ පත්‍රය",
        ta: "முக்கிய ஆராய்ச்சி கட்டுரை"
      },
      fileUrl: "https://storage.url/paper.pdf",
      fileSize: 2456789, // bytes
      uploadedAt: "2024-01-15T10:00:00Z"
    },
    {
      type: "dataset",
      title: {
        en: "Raw Data Collection",
        si: "අමු දත්ත එකතුව",
        ta: "மூல தரவு சேகரிப்பு"
      },
      fileUrl: "https://storage.url/data.csv",
      fileSize: 5678901,
      uploadedAt: "2024-01-16T12:00:00Z"
    },
    {
      type: "presentation",
      title: {
        en: "Conference Presentation",
        si: "සම්මන්ත්‍රණ ඉදිරිපත් කිරීම",
        ta: "மாநாட்டு விளக்கக்காட்சி"
      },
      fileUrl: "https://storage.url/slides.pptx",
      fileSize: 12345678,
      uploadedAt: "2024-01-20T15:00:00Z"
    }
  ],

  images: [
    "https://storage.url/coral-img1.jpg",
    "https://storage.url/coral-img2.jpg"
  ],

  videos: [
    {
      title: "Field Research Video",
      url: "https://storage.url/research-video.mp4",
      duration: "12:34",
      thumbnail: "https://storage.url/video-thumb.jpg"
    }
  ],

  // Geographic Data
  location: {
    country: "Sri Lanka",
    region: {
      en: "Southern Coast",
      si: "දකුණු වෙරළ",
      ta: "தெற்கு கடற்கரை"
    },
    coordinates: {
      lat: 6.0329,
      lng: 80.2168
    },
    sites: [
      {
        name: "Hikkaduwa Reef",
        coordinates: { lat: 6.1317, lng: 80.1031 }
      }
    ]
  },

  // Collaboration & Partnerships
  collaboratingInstitutions: [
    {
      name: {
        en: "University of Tokyo",
        si: "ටෝකියෝ විශ්වවිද්‍යාලය",
        ta: "டோக்கியோ பல்கலைக்கழகம்"
      },
      country: "Japan",
      type: "academic"
    }
  ],

  // Impact & Citations
  publications: [
    {
      title: "Published Paper Title",
      journal: "Nature Climate Change",
      doi: "10.1038/s41558-024-01234",
      year: 2024,
      citations: 15
    }
  ],

  // Review & Moderation
  moderationStatus: "approved", // "pending" | "approved" | "rejected" | "needs-revision"
  moderatedBy: "admin-user-id",
  moderatedAt: "2024-01-16T10:00:00Z",
  moderationNotes: "Excellent research with comprehensive data",

  // Visibility
  visibility: "public", // "public" | "private" | "restricted"
  featured: true,

  // Engagement
  views: 1247,
  downloads: 342,
  bookmarks: 89,

  // Tags (for search)
  tags: {
    en: ["climate change", "coral reefs", "ocean acidification", "marine ecology"],
    si: ["දේශගුණ වෙනස", "කොරල් පර", "සාගර අම්ලකරණය", "සමුද්‍ර පරිසර විද්‍යාව"],
    ta: ["காலநிலை மாற்றம்", "பவளப்பாறைகள்", "கடல் அமிலமயமாக்கல்", "கடல் சூழலியல்"]
  },

  // Timestamps
  submittedAt: "2024-01-15T09:00:00Z",
  publishedAt: "2024-01-16T10:00:00Z",
  createdAt: "2024-01-15T09:00:00Z",
  updatedAt: "2024-01-20T15:00:00Z"
}
```

### 2.6 Research Papers Collection (`lda_papers`)

```javascript
{
  id: "auto-generated-id",

  // Submission
  uploadedBy: "user-id",
  uploaderRole: "researcher",

  // Paper Information (Trilingual)
  title: {
    en: "Novel Approaches to Sustainable Fishing",
    si: "තිරසාර මසුන් ඇල්ලීම සඳහා නව ප්‍රවේශයන්",
    ta: "நிலையான மீன்பிடித்தலுக்கான புதிய அணுகுமுறைகள்"
  },

  abstract: {
    en: "This paper presents...",
    si: "මෙම පත්‍රය ඉදිරිපත් කරයි...",
    ta: "இந்த ஆய்வுக்கட்டுரை முன்வைக்கிறது..."
  },

  // Authors
  authors: [
    {
      name: "Dr. Nimal Perera",
      affiliation: "NARA Sri Lanka",
      email: "nperera@nara.lk",
      orcid: "0000-0001-2345-6789"
    }
  ],

  // Publication Details
  publicationType: "journal-article", // "journal-article" | "conference-paper" | "technical-report" | "thesis" | "preprint"
  journal: "Marine Ecology Progress Series",
  volume: "642",
  issue: "3",
  pages: "123-145",
  publishedDate: "2024-01-15",
  doi: "10.3354/meps13456",
  issn: "0171-8630",

  // Classification
  category: "fisheries-management",
  researchArea: {
    en: "Sustainable Fisheries",
    si: "තිරසාර මසුන් සම්පත්",
    ta: "நிலையான மீன்வளம்"
  },

  // Keywords
  keywords: {
    en: ["sustainable fishing", "fisheries management", "marine conservation"],
    si: ["තිරසාර මසුන් ඇල්ලීම", "මසුන් සම්පත් කළමනාකරණය", "සමුද්‍ර සංරක්ෂණය"],
    ta: ["நிலையான மீன்பிடித்தல்", "மீன்வள மேலாண்மை", "கடல் பாதுகாப்பு"]
  },

  // File & Access
  fileUrl: "https://storage.url/paper-full.pdf",
  fileSize: 3456789,
  accessType: "open-access", // "open-access" | "subscription" | "restricted"
  license: "CC BY 4.0",

  // Supplementary Materials
  supplementaryFiles: [
    {
      title: "Dataset",
      url: "https://storage.url/data.xlsx",
      type: "dataset"
    },
    {
      title: "Additional Figures",
      url: "https://storage.url/figures.pdf",
      type: "figures"
    }
  ],

  // Citations & Impact
  citations: 218,
  altmetricScore: 45,
  impactFactor: 13.6,

  references: [
    {
      title: "Previous Research",
      authors: "Smith et al.",
      year: 2022,
      doi: "10.1234/example"
    }
  ],

  // Moderation
  moderationStatus: "approved",
  moderatedBy: "admin-user-id",
  moderatedAt: "2024-01-16T08:00:00Z",

  // Visibility & Features
  visibility: "public",
  featured: true,

  // Engagement
  views: 2134,
  downloads: 567,
  bookmarks: 123,

  // Timestamps
  uploadedAt: "2024-01-15T10:00:00Z",
  publishedAt: "2024-01-15T00:00:00Z",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T12:00:00Z"
}
```

### 2.7 Training Materials Collection (`lda_training_materials`)

```javascript
{
  id: "auto-generated-id",

  // Upload Information
  uploadedBy: "user-id",
  uploaderRole: "professor",

  // Material Information (Trilingual)
  title: {
    en: "Introduction to Marine Data Analysis",
    si: "සමුද්‍ර දත්ත විශ්ලේෂණයට හැඳින්වීම",
    ta: "கடல் தரவு பகுப்பாய்வு அறிமுகம்"
  },

  description: {
    en: "Comprehensive guide to analyzing marine datasets",
    si: "සමුද්‍ර දත්ත කට්ටල විශ්ලේෂණය කිරීම සඳහා විස්තීර්ණ මාර්ගෝපදේශය",
    ta: "கடல் தரவுத்தொகுப்புகளை பகுப்பாய்வு செய்வதற்கான விரிவான வழிகாட்டி"
  },

  // Type & Category
  materialType: "guide", // "guide" | "manual" | "tutorial" | "workbook" | "template" | "dataset"
  category: "data-science",
  targetAudience: ["students", "researchers"],
  level: "intermediate",

  // Content
  content: {
    en: "Full content in English...",
    si: "සිංහල භාෂාවෙන් සම්පූර්ණ අන්තර්ගතය...",
    ta: "முழு உள்ளடக்கம் தமிழில்..."
  },

  // Files
  files: [
    {
      language: "en",
      fileUrl: "https://storage.url/guide-en.pdf",
      fileSize: 1234567,
      format: "PDF"
    },
    {
      language: "si",
      fileUrl: "https://storage.url/guide-si.pdf",
      fileSize: 1345678,
      format: "PDF"
    },
    {
      language: "ta",
      fileUrl: "https://storage.url/guide-ta.pdf",
      fileSize: 1298765,
      format: "PDF"
    }
  ],

  // Additional Resources
  relatedResources: [
    {
      type: "video",
      title: "Tutorial Video",
      url: "https://youtube.com/watch?v=example"
    },
    {
      type: "dataset",
      title: "Sample Dataset",
      url: "https://storage.url/sample-data.csv"
    }
  ],

  // Keywords
  keywords: {
    en: ["data analysis", "marine science", "statistics", "R programming"],
    si: ["දත්ත විශ්ලේෂණය", "සමුද්‍ර විද්‍යාව", "සංඛ්‍යාන", "R ක්‍රමලේඛනය"],
    ta: ["தரவு பகுப்பாய்வு", "கடல் அறிவியல்", "புள்ளியியல்", "R நிரலாக்கம்"]
  },

  // Associated Course
  relatedCourseId: "course-id", // Optional

  // Moderation
  moderationStatus: "approved",
  moderatedBy: "admin-user-id",
  moderatedAt: "2024-01-12T10:00:00Z",

  // Visibility
  visibility: "public",
  downloadable: true,

  // Engagement
  views: 892,
  downloads: 345,

  // Timestamps
  uploadedAt: "2024-01-12T09:00:00Z",
  createdAt: "2024-01-12T09:00:00Z",
  updatedAt: "2024-01-15T14:00:00Z"
}
```

### 2.8 Certifications Collection (`lda_certifications`)

```javascript
{
  id: "auto-generated-id",

  // Certificate Information
  userId: "user-id",
  courseId: "course-id",

  // Certificate Details (Trilingual)
  certificateName: {
    en: "Advanced Ocean Dynamics Certificate",
    si: "උසස් සාගර ගතිකත්ව සහතිකය",
    ta: "மேம்பட்ட கடல் இயக்கவியல் சான்றிதழ்"
  },

  // Recipient
  recipientName: {
    en: "John Doe",
    si: "ජෝන් ඩෝ",
    ta: "ஜான் டோ"
  },

  // Issuer
  issuedBy: {
    en: "NARA Sri Lanka Learning Academy",
    si: "නාරා ශ්‍රී ලංකා ඉගෙනුම් ඇකඩමිය",
    ta: "நாரா இலங்கை கற்றல் அகாதமி"
  },

  // Achievement Details
  courseTitle: {
    en: "Advanced Ocean Dynamics",
    si: "උසස් සාගර ගතිකත්වය",
    ta: "மேம்பட்ட கடல் இயக்கவியல்"
  },

  finalScore: 88,
  grade: "A",
  completionDate: "2024-01-20",
  issuanceDate: "2024-01-21",

  // Certificate ID & Verification
  certificateNumber: "NARA-LDA-2024-001234",
  verificationCode: "ABC123XYZ789",
  verificationUrl: "https://lda.nara.gov.lk/verify/ABC123XYZ789",

  // Certificate Files
  certificatePdf: {
    en: "https://storage.url/cert-en-001234.pdf",
    si: "https://storage.url/cert-si-001234.pdf",
    ta: "https://storage.url/cert-ta-001234.pdf"
  },

  certificateImage: "https://storage.url/cert-001234.jpg",

  // Digital Credentials
  blockchain: {
    enabled: false, // Future feature
    blockchainId: null,
    transactionHash: null
  },

  // Metadata
  credentialType: "course-completion",
  level: "advanced",
  creditHours: 48,

  // Status
  status: "active", // "active" | "revoked" | "expired"
  expiryDate: null, // null for no expiry

  // Timestamps
  createdAt: "2024-01-21T10:00:00Z",
  updatedAt: "2024-01-21T10:00:00Z"
}
```

### 2.9 Learning Paths Collection (`lda_learning_paths`)

```javascript
{
  id: "ocean-research-specialist",

  // Path Information (Trilingual)
  title: {
    en: "Ocean Research Specialist",
    si: "සාගර පර්යේෂණ විශේෂඥ",
    ta: "கடல் ஆராய்ச்சி நிபுணர்"
  },

  description: {
    en: "Complete pathway to becoming an ocean research expert",
    si: "සාගර පර්යේෂණ විශේෂඥයෙකු වීම සඳහා සම්පූර්ණ මාර්ගය",
    ta: "கடல் ஆராய்ச்சி நிபுணராக மாறுவதற்கான முழுமையான பாதை"
  },

  // Path Structure
  duration: "6 months",
  totalCourses: 5,
  level: "beginner-to-advanced",

  // Courses in Path (Ordered)
  courses: [
    {
      courseId: "course-1",
      order: 1,
      required: true,
      estimatedDuration: "6 weeks"
    },
    {
      courseId: "course-2",
      order: 2,
      required: true,
      estimatedDuration: "8 weeks"
    },
    {
      courseId: "course-3",
      order: 3,
      required: false,
      estimatedDuration: "4 weeks"
    }
  ],

  // Learning Modules (Trilingual)
  modules: {
    en: [
      "Foundation in Oceanography",
      "Research Methodologies",
      "Data Analysis & Visualization",
      "Field Research Techniques",
      "Publication & Presentation"
    ],
    si: [
      "සාගර විද්‍යාවේ පදනම",
      "පර්යේෂණ ක්‍රමවේද",
      "දත්ත විශ්ලේෂණය සහ දෘශ්‍යකරණය",
      "ක්ෂේත්‍ර පර්යේෂණ තාක්ෂණ",
      "ප්‍රකාශනය සහ ඉදිරිපත් කිරීම"
    ],
    ta: [
      "கடல்சார் அறிவியலில் அடித்தளம்",
      "ஆராய்ச்சி முறைகள்",
      "தரவு பகுப்பாய்வு மற்றும் காட்சிப்படுத்தல்",
      "களஆராய்ச்சி நுட்பங்கள்",
      "வெளியீடு மற்றும் விளக்கக்காட்சி"
    ]
  },

  // Career Outcomes (Trilingual)
  careerOutcomes: {
    en: [
      "Marine Research Scientist",
      "Oceanographic Data Analyst",
      "Research Lab Manager"
    ],
    si: [
      "සමුද්‍ර පර්යේෂණ විද්‍යාඥ",
      "සාගර දත්ත විශ්ලේෂක",
      "පර්යේෂණ විද්‍යාගාර කළමනාකරු"
    ],
    ta: [
      "கடல் ஆராய்ச்சி விஞ்ஞானி",
      "கடல்சார் தரவு பகுப்பாய்வாளர்",
      "ஆராய்ச்சி ஆய்வக மேலாளர்"
    ]
  },

  // Prerequisites
  prerequisites: {
    en: ["Basic science knowledge", "Computer literacy"],
    si: ["මූලික විද්‍යා දැනුම", "පරිගණක සාක්ෂරතාව"],
    ta: ["அடிப்படை அறிவியல் அறிவு", "கணினி கல்வியறிவு"]
  },

  // Visual & Branding
  icon: "🎓",
  gradient: "from-cyan-400 to-blue-600",
  color: "cyan",
  banner: "https://storage.url/path-banner.jpg",

  // Certification
  certification: {
    enabled: true,
    name: {
      en: "Ocean Research Specialist Certification",
      si: "සාගර පර්යේෂණ විශේෂඥ සහතිකය",
      ta: "கடல் ஆராய்ச்சி நிபுணர் சான்றிதழ்"
    }
  },

  // Enrollment
  enrolled: 342,
  completed: 89,

  // Status
  status: "active",
  featured: true,

  // Timestamps
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-20T00:00:00Z"
}
```

### 2.10 Reviews & Ratings Collection (`lda_reviews`)

```javascript
{
  id: "auto-generated-id",

  // Review Target
  targetType: "course", // "course" | "learning-path" | "instructor"
  targetId: "course-id",

  // Reviewer
  userId: "user-id",
  userName: {
    en: "John Doe",
    si: "ජෝන් ඩෝ",
    ta: "ஜான் டோ"
  },
  userAvatar: "https://storage.url/avatar.jpg",
  userRole: "student",

  // Rating
  rating: 5, // 1-5 stars

  // Review Content (Trilingual)
  title: {
    en: "Excellent Course!",
    si: "විශිෂ්ට පාඨමාලාවක්!",
    ta: "சிறந்த பாடநெறி!"
  },

  comment: {
    en: "This course exceeded my expectations...",
    si: "මෙම පාඨමාලාව මාගේ බලාපොරොත්තු ඉක්මවා ගියේය...",
    ta: "இந்த பாடநெறி எனது எதிர்பார்ப்புகளை மீறியது..."
  },

  // Review Breakdown (Optional)
  breakdown: {
    content: 5,
    instructor: 5,
    materials: 4,
    support: 5
  },

  // Engagement
  helpful: 45, // Count of users who found it helpful
  reported: 0,

  // Moderation
  moderationStatus: "approved", // "pending" | "approved" | "rejected"
  moderatedBy: "admin-user-id",
  moderatedAt: "2024-01-15T12:00:00Z",

  // Visibility
  verified: true, // User completed the course
  featured: false,

  // Timestamps
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

### 2.11 Notifications Collection (`lda_notifications`)

```javascript
{
  id: "auto-generated-id",

  // Recipient
  userId: "user-id",

  // Notification Type
  type: "course-completed", // "course-completed" | "certificate-issued" | "project-approved" | "new-course" | "deadline-reminder"

  // Content (Trilingual)
  title: {
    en: "Course Completed!",
    si: "පාඨමාලාව සම්පූර්ණයි!",
    ta: "பாடநெறி முடிந்தது!"
  },

  message: {
    en: "Congratulations! You've completed Advanced Ocean Dynamics",
    si: "සුභපැතුම්! ඔබ උසස් සාගර ගතිකත්වය සම්පූර්ණ කර ඇත",
    ta: "வாழ்த்துகள்! நீங்கள் மேம்பட்ட கடல் இயக்கவியலை முடித்துவிட்டீர்கள்"
  },

  // Action
  actionUrl: "/courses/advanced-ocean-dynamics",
  actionLabel: {
    en: "View Certificate",
    si: "සහතිකය බලන්න",
    ta: "சான்றிதழைக் காண்க"
  },

  // Metadata
  relatedId: "course-id", // Related entity
  relatedType: "course",

  // Status
  read: false,
  readAt: null,

  // Timestamps
  createdAt: "2024-01-20T10:00:00Z"
}
```

### 2.12 Analytics Collection (`lda_analytics`)

```javascript
{
  id: "date-userId", // Compound key

  date: "2024-01-20",
  userId: "user-id",

  // Session Data
  sessions: [
    {
      startTime: "2024-01-20T10:00:00Z",
      endTime: "2024-01-20T11:30:00Z",
      duration: 5400, // seconds
      courseId: "course-id",
      lessonsViewed: ["lesson-1", "lesson-2"],
      device: "desktop",
      browser: "Chrome"
    }
  ],

  // Daily Activity
  totalTimeSpent: 5400,
  coursesAccessed: ["course-id-1", "course-id-2"],
  lessonsCompleted: 3,
  quizzesAttempted: 1,

  // Engagement
  searchQueries: ["ocean dynamics", "coral reefs"],
  resourcesDownloaded: 2,
  forumPosts: 0,

  // Timestamps
  createdAt: "2024-01-20T23:59:59Z"
}
```

---

## 3. Service Layer Architecture

### 3.1 Core Services

#### File: `/src/services/ldaService.js`

```javascript
/**
 * Learning Development Academy Service
 * Complete service layer for LDA platform
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

// ==================== USER MANAGEMENT ====================

export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'lda_users', userId);
    await setDoc(userRef, {
      ...profileData,
      stats: {
        coursesCompleted: 0,
        coursesInProgress: 0,
        projectsSubmitted: 0,
        papersUploaded: 0,
        certificatesEarned: 0,
        totalLearningHours: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });
    return { success: true, id: userId };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'lda_users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'lda_users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ==================== COURSE MANAGEMENT ====================

export const getCourses = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_courses');

    // Apply filters
    const constraints = [where('status', '==', 'published')];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.level) {
      constraints.push(where('level', '==', filters.level));
    }

    // Add ordering
    constraints.push(orderBy('publishedAt', 'desc'));

    // Apply limit
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const getCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'lda_courses', courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const courseRef = doc(collection(db, 'lda_courses'));
    await setDoc(courseRef, {
      ...courseData,
      enrolled: 0,
      rating: 0,
      totalReviews: 0,
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: courseRef.id };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    const courseRef = doc(db, 'lda_courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'lda_courses', courseId);
    await deleteDoc(courseRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ==================== ENROLLMENT ====================

export const enrollInCourse = async (userId, courseId) => {
  try {
    // Create progress record
    const progressRef = doc(collection(db, 'lda_user_progress'));
    await setDoc(progressRef, {
      userId,
      courseId,
      status: 'enrolled',
      overallProgress: 0,
      moduleProgress: [],
      lessonProgress: [],
      enrolledAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update user stats
    const userRef = doc(db, 'lda_users', userId);
    await updateDoc(userRef, {
      'stats.coursesInProgress': increment(1),
      updatedAt: serverTimestamp()
    });

    // Update course enrollment count
    const courseRef = doc(db, 'lda_courses', courseId);
    await updateDoc(courseRef, {
      enrolled: increment(1),
      updatedAt: serverTimestamp()
    });

    return { success: true, progressId: progressRef.id };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const getUserProgress = async (userId, courseId) => {
  try {
    const q = query(
      collection(db, 'lda_user_progress'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const updateLessonProgress = async (progressId, lessonId, completed, timeSpent) => {
  try {
    const progressRef = doc(db, 'lda_user_progress', progressId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const data = progressSnap.data();
      const lessonProgress = data.lessonProgress || [];

      const existingIndex = lessonProgress.findIndex(lp => lp.lessonId === lessonId);

      if (existingIndex >= 0) {
        lessonProgress[existingIndex] = {
          ...lessonProgress[existingIndex],
          completed,
          timeSpent: (lessonProgress[existingIndex].timeSpent || 0) + timeSpent,
          lastViewed: serverTimestamp(),
          ...(completed && { completedAt: serverTimestamp() })
        };
      } else {
        lessonProgress.push({
          lessonId,
          completed,
          timeSpent,
          lastViewed: serverTimestamp(),
          ...(completed && { completedAt: serverTimestamp() })
        });
      }

      await updateDoc(progressRef, {
        lessonProgress,
        totalTimeSpent: increment(timeSpent),
        lastAccessedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true };
    }
    throw new Error('Progress record not found');
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    throw error;
  }
};

// ==================== PROJECT SUBMISSION ====================

export const submitProject = async (projectData) => {
  try {
    const projectRef = doc(collection(db, 'lda_projects'));
    await setDoc(projectRef, {
      ...projectData,
      moderationStatus: 'pending',
      views: 0,
      downloads: 0,
      bookmarks: 0,
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update user stats
    const userRef = doc(db, 'lda_users', projectData.submittedBy);
    await updateDoc(userRef, {
      'stats.projectsSubmitted': increment(1),
      updatedAt: serverTimestamp()
    });

    return { success: true, id: projectRef.id };
  } catch (error) {
    console.error('Error submitting project:', error);
    throw error;
  }
};

export const getProjects = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_projects');

    const constraints = [];

    if (filters.status) {
      constraints.push(where('moderationStatus', '==', filters.status));
    } else {
      constraints.push(where('moderationStatus', '==', 'approved'));
    }

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.submittedBy) {
      constraints.push(where('submittedBy', '==', filters.submittedBy));
    }

    constraints.push(orderBy('submittedAt', 'desc'));

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);

    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const updateProject = async (projectId, updates) => {
  try {
    const projectRef = doc(db, 'lda_projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// ==================== RESEARCH PAPERS ====================

export const uploadPaper = async (paperData) => {
  try {
    const paperRef = doc(collection(db, 'lda_papers'));
    await setDoc(paperRef, {
      ...paperData,
      moderationStatus: 'pending',
      views: 0,
      downloads: 0,
      bookmarks: 0,
      uploadedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update user stats
    const userRef = doc(db, 'lda_users', paperData.uploadedBy);
    await updateDoc(userRef, {
      'stats.papersUploaded': increment(1),
      updatedAt: serverTimestamp()
    });

    return { success: true, id: paperRef.id };
  } catch (error) {
    console.error('Error uploading paper:', error);
    throw error;
  }
};

export const getPapers = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_papers');

    const constraints = [];

    if (filters.status) {
      constraints.push(where('moderationStatus', '==', filters.status));
    } else {
      constraints.push(where('moderationStatus', '==', 'approved'));
    }

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('uploadedAt', 'desc'));

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);

    const querySnapshot = await getDocs(q);
    const papers = [];
    querySnapshot.forEach((doc) => {
      papers.push({ id: doc.id, ...doc.data() });
    });

    return papers;
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
};

// ==================== FILE UPLOAD ====================

export const uploadFile = async (file, path) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `lda/${path}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      url: downloadURL,
      path: `lda/${path}/${fileName}`,
      fileName
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// ==================== SEARCH & FILTER ====================

export const searchContent = async (searchTerm, contentType = 'all') => {
  // Client-side search implementation
  // For production, consider Algolia or Elasticsearch
  try {
    const results = {
      courses: [],
      projects: [],
      papers: [],
      materials: []
    };

    const searchLower = searchTerm.toLowerCase();

    // Search courses
    if (contentType === 'all' || contentType === 'courses') {
      const coursesSnapshot = await getDocs(collection(db, 'lda_courses'));
      coursesSnapshot.forEach((doc) => {
        const data = doc.data();
        const titleMatch =
          data.title?.en?.toLowerCase().includes(searchLower) ||
          data.title?.si?.toLowerCase().includes(searchLower) ||
          data.title?.ta?.toLowerCase().includes(searchLower);

        if (titleMatch) {
          results.courses.push({ id: doc.id, ...data });
        }
      });
    }

    // Similar for other content types...

    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return { courses: [], projects: [], papers: [], materials: [] };
  }
};

// ==================== ANALYTICS ====================

export const trackUserActivity = async (userId, activityData) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const analyticsRef = doc(db, 'lda_analytics', `${today}_${userId}`);

    const analyticsSnap = await getDoc(analyticsRef);

    if (analyticsSnap.exists()) {
      const data = analyticsSnap.data();
      await updateDoc(analyticsRef, {
        sessions: [...data.sessions, activityData.session],
        totalTimeSpent: increment(activityData.timeSpent || 0),
        coursesAccessed: [...new Set([...data.coursesAccessed, activityData.courseId])],
        lessonsCompleted: increment(activityData.lessonsCompleted || 0)
      });
    } else {
      await setDoc(analyticsRef, {
        date: today,
        userId,
        sessions: [activityData.session],
        totalTimeSpent: activityData.timeSpent || 0,
        coursesAccessed: [activityData.courseId],
        lessonsCompleted: activityData.lessonsCompleted || 0,
        createdAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
};

export default {
  // User Management
  createUserProfile,
  getUserProfile,
  updateUserProfile,

  // Course Management
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,

  // Enrollment
  enrollInCourse,
  getUserProgress,
  updateLessonProgress,

  // Projects
  submitProject,
  getProjects,
  updateProject,

  // Papers
  uploadPaper,
  getPapers,

  // Files
  uploadFile,
  deleteFile,

  // Search
  searchContent,

  // Analytics
  trackUserActivity
};
```

---

## 4. Admin Panel Forms

### 4.1 Course Creation Form

**File**: `/src/pages/admin/forms/CourseForm.jsx`

**Features**:
- Trilingual input fields (EN/SI/TA tabs)
- Module and lesson builder with drag-and-drop ordering
- File upload for course materials (videos, PDFs, images)
- Prerequisites selector
- Learning outcomes editor
- Instructor selection/creation
- Pricing and enrollment settings
- Certificate configuration
- Preview mode

**Fields**:
```javascript
// Basic Info
- title (EN/SI/TA)
- description (EN/SI/TA)
- category
- subCategory
- level

// Instructor
- instructor selection
- or create new instructor

// Content
- modules array
  - module title (EN/SI/TA)
  - module description (EN/SI/TA)
  - lessons array
    - lesson title (EN/SI/TA)
    - lesson type (video/reading/quiz/assignment/lab)
    - content (URL, text, etc.)
    - duration
    - resources

// Learning Outcomes
- prerequisites (EN/SI/TA)
- learningOutcomes (EN/SI/TA)
- features (EN/SI/TA)

// Certification
- certification enabled
- certificate name (EN/SI/TA)
- requirements (score, completion rate)

// Pricing & Enrollment
- price
- currency
- capacity

// Media
- thumbnail upload
- banner upload
- gallery images

// Tags
- tags (EN/SI/TA)

// Publishing
- status (draft/published)
- featured toggle
- publishedAt
```

### 4.2 Project Approval Form

**File**: `/src/pages/admin/forms/ProjectModerationForm.jsx`

**Features**:
- Side-by-side view of project details
- File preview (PDFs, images)
- Moderation actions (approve/reject/request-revision)
- Feedback editor (trilingual)
- Category/tag editing
- Featured project toggle
- Visibility settings

**Fields**:
```javascript
- moderationStatus
- moderatedBy (auto)
- moderatedAt (auto)
- moderationNotes
- featured
- visibility
- category (editable)
- tags (editable)
```

### 4.3 User Management Form

**File**: `/src/pages/admin/forms/UserManagementForm.jsx`

**Features**:
- User search and filter
- Role assignment/change
- Permission management
- Stats overview
- Activity log
- Account status (active/suspended)
- Password reset

**Fields**:
```javascript
- role
- permissions
  - canSubmitProjects
  - canUploadPapers
  - canCreateCourses
  - canModerate
- accountStatus
- notes
```

### 4.4 Training Material Upload Form

**File**: `/src/pages/admin/forms/TrainingMaterialForm.jsx`

**Features**:
- Material type selection
- Trilingual content editor
- File upload (multiple languages)
- Category and level selection
- Related course linking
- Keywords editor
- Preview mode

**Fields**:
```javascript
- title (EN/SI/TA)
- description (EN/SI/TA)
- content (EN/SI/TA)
- materialType
- category
- targetAudience
- level
- files (EN/SI/TA PDFs)
- relatedCourseId
- keywords (EN/SI/TA)
- visibility
- downloadable
```

### 4.5 Category Management Form

**File**: `/src/pages/admin/forms/CategoryForm.jsx`

**Features**:
- Category name (trilingual)
- Icon/emoji picker
- Color picker
- Gradient selector
- Subcategory builder
- Order/sorting
- Active status

---

## 5. Component Architecture

### 5.1 Main Page Components

```
src/pages/learning-development-academy/
├── index.jsx                       # Main container
├── components/
│   ├── HeroSection.jsx            # Banner with search
│   ├── StatsOverview.jsx          # Quick stats cards
│   ├── CourseGrid.jsx             # Course listing
│   ├── CourseCard.jsx             # Individual course card
│   ├── CourseFilters.jsx          # Filter sidebar
│   ├── CourseSearch.jsx           # Smart search component
│   ├── LearningPathsSection.jsx   # Learning paths showcase
│   ├── ProjectsGallery.jsx        # Research projects
│   ├── PapersLibrary.jsx          # Research papers
│   ├── TrainingMaterialsSection.jsx # Training materials
│   ├── InstructorsSection.jsx     # Instructor profiles
│   ├── CategoriesGrid.jsx         # Category navigation
│   └── LanguageSwitcher.jsx       # EN/SI/TA toggle
```

### 5.2 Course Detail Components

```
src/pages/learning-development-academy/course/
├── [courseId]/
│   ├── index.jsx                  # Course detail page
│   ├── components/
│   │   ├── CourseHeader.jsx       # Title, instructor, rating
│   │   ├── CourseOverview.jsx     # Description, outcomes
│   │   ├── CourseContent.jsx      # Modules and lessons
│   │   ├── ModuleAccordion.jsx    # Expandable module
│   │   ├── LessonList.jsx         # Lesson items
│   │   ├── EnrollmentCard.jsx     # Enrollment CTA
│   │   ├── InstructorCard.jsx     # Instructor info
│   │   ├── ReviewsSection.jsx     # Course reviews
│   │   ├── ReviewForm.jsx         # Submit review
│   │   └── RelatedCourses.jsx     # Similar courses
```

### 5.3 Learning Components

```
src/pages/learning-development-academy/learn/
├── [courseId]/
│   ├── index.jsx                  # Learning interface
│   ├── components/
│   │   ├── LearningLayout.jsx     # Main layout
│   │   ├── VideoPlayer.jsx        # Video lessons
│   │   ├── ReadingContent.jsx     # Text content
│   │   ├── QuizComponent.jsx      # Interactive quizzes
│   │   ├── AssignmentUpload.jsx   # Assignment submission
│   │   ├── ProgressSidebar.jsx    # Progress tracking
│   │   ├── NotesPanel.jsx         # Lesson notes
│   │   ├── ResourcesPanel.jsx     # Downloadable resources
│   │   └── NavigationControls.jsx # Next/Previous
```

### 5.4 User Dashboard Components

```
src/pages/learning-development-academy/dashboard/
├── index.jsx                      # User dashboard
├── components/
│   ├── DashboardOverview.jsx      # Stats and progress
│   ├── MyCoursesTab.jsx           # Enrolled courses
│   ├── MyProjectsTab.jsx          # Submitted projects
│   ├── MyPapersTab.jsx            # Uploaded papers
│   ├── CertificatesTab.jsx        # Earned certificates
│   ├── ProfileTab.jsx             # User profile
│   ├── SettingsTab.jsx            # Preferences
│   ├── ProgressCard.jsx           # Course progress card
│   └── CertificateCard.jsx        # Certificate display
```

### 5.5 Admin Components

```
src/pages/admin/lda/
├── index.jsx                      # Admin dashboard
├── components/
│   ├── CoursesManagement.jsx      # Course CRUD
│   ├── ProjectsModeration.jsx     # Approve/reject projects
│   ├── PapersModeration.jsx       # Approve/reject papers
│   ├── UsersManagement.jsx        # User management
│   ├── CategoriesManagement.jsx   # Category CRUD
│   ├── AnalyticsDashboard.jsx     # Platform analytics
│   ├── ReportsGenerator.jsx       # Generate reports
│   └── SettingsPanel.jsx          # Platform settings
```

---

## 6. Smart Features Implementation

### 6.1 AI-Powered Search

**Implementation**:
```javascript
// Enhanced search with NLP-like capabilities
const searchAlgorithm = {
  // Fuzzy matching for typos
  fuzzyMatch: (term, content) => {
    // Implement Levenshtein distance
  },

  // Multi-language support
  crossLanguageSearch: (term, content) => {
    // Search across all language fields
  },

  // Semantic search
  semanticMatch: (term, content) => {
    // Match related concepts
    // e.g., "ocean" matches "marine", "sea"
  },

  // Result ranking
  rankResults: (results, term) => {
    // Score based on:
    // - Exact match weight
    // - Field importance (title > description)
    // - Popularity (enrolled count)
    // - Rating
    // - Recency
  }
};
```

### 6.2 Smart Recommendations

**Algorithm**:
```javascript
const recommendCourses = (userId) => {
  // Factors:
  // 1. User's completed courses
  // 2. User's specialization
  // 3. Current course category
  // 4. Popular courses in same category
  // 5. What similar users enrolled in

  // Collaborative filtering
  const similarUsers = findSimilarUsers(userId);
  const theirCourses = getCoursesFromUsers(similarUsers);

  // Content-based filtering
  const userCategories = getUserCategories(userId);
  const categoryCourses = getCoursesByCategories(userCategories);

  // Combine and rank
  return rankRecommendations([...theirCourses, ...categoryCourses]);
};
```

### 6.3 Progress Tracking

**Features**:
- Real-time progress calculation
- Module completion tracking
- Time spent analytics
- Learning streak tracking
- Predictive completion date
- Personalized milestones

**Implementation**:
```javascript
const calculateProgress = (userProgress, course) => {
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const completedLessons = userProgress.lessonProgress.filter(
    lp => lp.completed
  ).length;

  return {
    overall: (completedLessons / totalLessons) * 100,
    modules: course.modules.map(module => ({
      moduleId: module.id,
      progress: calculateModuleProgress(module, userProgress)
    })),
    estimatedCompletion: predictCompletionDate(
      userProgress,
      course,
      completedLessons,
      totalLessons
    )
  };
};
```

### 6.4 Intelligent Notifications

**Features**:
- Course completion reminders
- New content alerts (personalized)
- Deadline notifications
- Achievement unlocks
- Peer activity (optional)
- Smart digest emails (daily/weekly)

**Types**:
- In-app notifications
- Email notifications
- Push notifications (future)

---

## 7. Feature Priority Matrix

### Phase 1: Core Platform (Weeks 1-4)

#### Priority 1 - MUST HAVE
- [ ] User authentication (email/password)
- [ ] User registration with role selection
- [ ] Basic user profile (trilingual)
- [ ] Course listing page with filters
- [ ] Course detail page
- [ ] Basic course enrollment
- [ ] Firebase Firestore integration
- [ ] Firebase Storage for files
- [ ] Admin login
- [ ] Admin course management (CRUD)

#### Priority 2 - SHOULD HAVE
- [ ] Course categories system
- [ ] Search functionality (basic)
- [ ] Course progress tracking
- [ ] User dashboard
- [ ] Course completion
- [ ] Trilingual content display
- [ ] Responsive design

### Phase 2: Content Management (Weeks 5-6)

#### Priority 1 - MUST HAVE
- [ ] Project submission form
- [ ] Project listing page
- [ ] Admin project moderation
- [ ] Research paper upload
- [ ] Paper listing page
- [ ] Admin paper moderation
- [ ] Training materials upload
- [ ] Materials listing page

#### Priority 2 - SHOULD HAVE
- [ ] File upload (multiple files)
- [ ] File preview
- [ ] Document categorization
- [ ] Rich text editor for descriptions
- [ ] Image gallery

### Phase 3: Learning Experience (Weeks 7-8)

#### Priority 1 - MUST HAVE
- [ ] Video player integration
- [ ] Lesson navigation
- [ ] Progress saving
- [ ] Module completion tracking
- [ ] Quiz functionality
- [ ] Assignment submission

#### Priority 2 - SHOULD HAVE
- [ ] Notes feature
- [ ] Bookmarks
- [ ] Resource downloads
- [ ] Lesson timer
- [ ] Certificate generation
- [ ] Certificate download

### Phase 4: Advanced Features (Weeks 9-10)

#### Priority 1 - MUST HAVE
- [ ] Smart search (cross-language)
- [ ] Course recommendations
- [ ] User statistics
- [ ] Admin analytics dashboard

#### Priority 2 - SHOULD HAVE
- [ ] Learning paths
- [ ] Achievement system
- [ ] Reviews and ratings
- [ ] Instructor profiles
- [ ] Email notifications

### Phase 5: Polish & Optimization (Weeks 11-12)

#### Priority 1 - MUST HAVE
- [ ] Performance optimization
- [ ] Security audit
- [ ] Mobile responsiveness
- [ ] Cross-browser testing
- [ ] User testing and feedback

#### Priority 2 - SHOULD HAVE
- [ ] Advanced analytics
- [ ] Export functionality
- [ ] Batch operations
- [ ] Advanced search filters
- [ ] Social features (future)

---

## 8. Implementation Checklist

### Backend Setup
- [ ] Firebase project configuration
- [ ] Firestore security rules
- [ ] Storage security rules
- [ ] Firebase Functions (if needed)
- [ ] Email service setup (for notifications)

### Frontend Setup
- [ ] React Router configuration
- [ ] i18next setup for trilingual support
- [ ] Context API for state management
- [ ] Protected routes for auth
- [ ] Admin routes protection
- [ ] Theme configuration

### Service Layer
- [ ] ldaService.js implementation
- [ ] File upload utilities
- [ ] Search utilities
- [ ] Analytics utilities

### Components
- [ ] Reusable form components
- [ ] Trilingual input components
- [ ] File upload components
- [ ] Rich text editor integration
- [ ] Video player component
- [ ] Progress bars and indicators

### Admin Panel
- [ ] Admin layout
- [ ] Dashboard overview
- [ ] All CRUD forms
- [ ] Moderation interfaces
- [ ] Analytics views
- [ ] Settings panels

### Testing
- [ ] Unit tests for services
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

### Documentation
- [ ] User guide
- [ ] Admin guide
- [ ] API documentation
- [ ] Deployment guide
- [ ] Maintenance guide

---

## 9. Key Technical Considerations

### 9.1 Trilingual Support Strategy

**Approach**: Field-level translation
- All content fields have `{en, si, ta}` structure
- Language switcher updates UI language
- Forms have tabs for each language
- Search works across all languages
- Admin can edit all languages simultaneously

### 9.2 File Storage Strategy

**Structure**:
```
/lda/
  /courses/
    /{courseId}/
      /videos/
      /documents/
      /images/
  /projects/
    /{projectId}/
      /documents/
      /images/
      /videos/
  /papers/
    /{paperId}/
      /paper.pdf
      /supplementary/
  /users/
    /{userId}/
      /avatar.jpg
      /uploads/
  /certificates/
    /{certificateId}.pdf
```

### 9.3 Performance Optimization

**Strategies**:
- Lazy loading for course content
- Pagination for listings
- Image optimization and CDN
- Video streaming (adaptive bitrate)
- Firestore query optimization
- Client-side caching
- Code splitting

### 9.4 Security

**Measures**:
- Firestore security rules by role
- Storage rules by ownership
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Rate limiting (Firebase Functions)
- Content moderation before publish

### 9.5 Scalability

**Considerations**:
- Firestore indexes for complex queries
- Pagination for large datasets
- Batch operations for bulk updates
- Cloud Functions for heavy processing
- CDN for static assets
- Caching strategy
- Database sharding (future)

---

## 10. Success Metrics

### User Engagement
- Daily active users (DAU)
- Monthly active users (MAU)
- Average session duration
- Course completion rate
- Return user rate

### Content Metrics
- Total courses published
- Total enrollments
- Average course rating
- Projects submitted per month
- Papers uploaded per month

### Platform Health
- Page load time
- Error rate
- Uptime percentage
- Search success rate
- Mobile usage percentage

---

## Conclusion

This architecture provides a comprehensive foundation for building a world-class Learning Development Academy platform. The system is designed to be scalable, maintainable, and user-friendly while supporting multiple user roles, full trilingual content, and advanced features like AI-powered search and progress tracking.

The Firebase-based backend ensures real-time capabilities, while the modular component architecture allows for iterative development and easy maintenance. The admin panel provides complete control over all aspects of the platform, from course creation to user management.

Start with Phase 1 priorities and progressively build out the system following the roadmap outlined in this document.
