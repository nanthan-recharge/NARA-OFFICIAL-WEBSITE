import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  LogOut,
  BookOpen,
  FolderKanban,
  Users,
  FileText,
  Upload,
  FolderTree,
  BarChart3,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Settings,
  RefreshCw,
  Layers,
} from "lucide-react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import * as ldaService from "../../../services/ldaService";

const LDAAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  // Data states
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalProjects: 0,
    pendingReviews: 0,
    totalEnrollments: 0,
    totalPapers: 0,
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "cyan" },
    { id: "courses", label: "Courses", icon: BookOpen, color: "blue" },
    { id: "projects", label: "Projects", icon: FolderKanban, color: "purple" },
    { id: "users", label: "Users", icon: Users, color: "green" },
    { id: "papers", label: "Papers", icon: FileText, color: "orange" },
    { id: "materials", label: "Materials", icon: Upload, color: "pink" },
    {
      id: "categories",
      label: "Categories",
      icon: FolderTree,
      color: "indigo",
    },
    { id: "analytics", label: "Analytics", icon: TrendingUp, color: "red" },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [coursesData, projectsData, papersData] = await Promise.all([
        ldaService.getCourses({ limitTo: 1000 }),
        ldaService.getProjects({ limitTo: 1000 }),
        ldaService.getPapers({ limitTo: 1000 }),
      ]);

      const pendingProjects = projectsData.filter(
        (p) => p.status === "pending",
      ).length;

      setDashboardStats({
        totalCourses: coursesData.length,
        totalProjects: projectsData.length,
        totalPapers: papersData.length,
        pendingReviews: pendingProjects,
        totalEnrollments: coursesData.reduce(
          (sum, c) => sum + (c.enrolledCount || 0),
          0,
        ),
        totalUsers: 0, // Would need separate collection
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const loadData = async () => {
    setDataLoading(true);
    try {
      switch (activeTab) {
        case "courses": {
          const coursesData = await ldaService.getCourses({ limitTo: 1000 });
          setCourses(coursesData);
          break;
        }
        case "projects": {
          const projectsData = await ldaService.getProjects({ limitTo: 1000 });
          setProjects(projectsData);
          break;
        }
        case "papers": {
          const papersData = await ldaService.getPapers({ limitTo: 1000 });
          setPapers(papersData);
          break;
        }
        case "materials": {
          const materialsData = await ldaService.getTrainingMaterials({
            limitTo: 1000,
          });
          setMaterials(materialsData);
          break;
        }
        case "categories": {
          const categoriesData = await ldaService.getCategories();
          setCategories(categoriesData);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      showError("Failed to load data. Please try again.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/admin/lda-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 4000);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setEditingItem(null);
  };

  const confirmAction = (message, onConfirm) => {
    setConfirmDialog({ show: true, message, onConfirm });
  };

  // CRUD Operations for Courses
  const handleSaveCourse = async (courseData) => {
    setLoading(true);
    try {
      if (editingItem) {
        await ldaService.updateCourse(editingItem.id, courseData);
        showSuccess("Course updated successfully!");
      } else {
        await ldaService.createCourse(courseData);
        showSuccess("Course created successfully!");
      }
      closeModal();
      loadData();
      loadDashboardStats();
    } catch (error) {
      showError("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    confirmAction("Are you sure you want to delete this course?", async () => {
      setLoading(true);
      try {
        await ldaService.deleteCourse(courseId);
        showSuccess("Course deleted successfully!");
        loadData();
        loadDashboardStats();
      } catch (error) {
        showError("Failed to delete course.");
      } finally {
        setLoading(false);
      }
    });
  };

  // Project Review Operations
  const handleReviewProject = async (projectId, status, comments, grade) => {
    setLoading(true);
    try {
      await ldaService.reviewProject(projectId, {
        status,
        comments,
        grade,
        reviewerId: auth.currentUser?.uid,
      });
      showSuccess(`Project ${status} successfully!`);
      loadData();
      loadDashboardStats();
    } catch (error) {
      showError("Failed to review project.");
    } finally {
      setLoading(false);
    }
  };

  // Category Operations
  const handleSaveCategory = async (categoryData) => {
    setLoading(true);
    try {
      await ldaService.createCategory(categoryData);
      showSuccess("Category created successfully!");
      closeModal();
      loadData();
    } catch (error) {
      showError("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and Search
  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case "courses":
        data = courses;
        break;
      case "projects":
        data = projects;
        if (filterStatus !== "all") {
          data = data.filter((p) => p.status === filterStatus);
        }
        break;
      case "papers":
        data = papers;
        if (filterStatus !== "all") {
          data = data.filter((p) => p.status === filterStatus);
        }
        break;
      case "materials":
        data = materials;
        break;
      case "categories":
        data = categories;
        break;
      default:
        return [];
    }

    if (searchTerm) {
      data = data.filter((item) => {
        const searchStr = JSON.stringify(item).toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
      });
    }

    return data;
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      published: { color: "green", icon: CheckCircle, label: "Published" },
      pending: { color: "yellow", icon: Clock, label: "Pending" },
      approved: { color: "green", icon: CheckCircle, label: "Approved" },
      rejected: { color: "red", icon: XCircle, label: "Rejected" },
      active: { color: "blue", icon: CheckCircle, label: "Active" },
      pending_review: { color: "orange", icon: Clock, label: "Pending Review" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-500/20 text-${config.color}-300 border border-${config.color}-500/30`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Dashboard Component
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Courses"
          value={dashboardStats.totalCourses}
          icon={BookOpen}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Total Projects"
          value={dashboardStats.totalProjects}
          icon={FolderKanban}
          color="purple"
          trend="+8%"
        />
        <StatCard
          title="Pending Reviews"
          value={dashboardStats.pendingReviews}
          icon={Clock}
          color="orange"
          trend="0%"
        />
        <StatCard
          title="Total Enrollments"
          value={dashboardStats.totalEnrollments}
          icon={Users}
          color="green"
          trend="+15%"
        />
        <StatCard
          title="Research Papers"
          value={dashboardStats.totalPapers}
          icon={FileText}
          color="cyan"
          trend="+5%"
        />
        <StatCard
          title="Training Materials"
          value={materials.length}
          icon={Upload}
          color="pink"
          trend="+10%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Plus}
            label="New Course"
            onClick={() => {
              setActiveTab("courses");
              openModal("course");
            }}
            color="blue"
          />
          <QuickActionButton
            icon={Eye}
            label="Review Projects"
            onClick={() => setActiveTab("projects")}
            color="purple"
          />
          <QuickActionButton
            icon={Upload}
            label="Upload Material"
            onClick={() => {
              setActiveTab("materials");
              openModal("material");
            }}
            color="pink"
          />
          <QuickActionButton
            icon={Settings}
            label="Manage Categories"
            onClick={() => setActiveTab("categories")}
            color="indigo"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Recent Projects
        </h2>
        <div className="space-y-3">
          {projects.slice(0, 5).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
            >
              <div className="flex-1">
                <h3 className="text-slate-900 font-medium">
                  {project.title?.en || "Untitled"}
                </h3>
                <p className="text-sm text-slate-500">
                  Category: {project.category} | Submitted:{" "}
                  {new Date(
                    project.submittedAt?.seconds * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={project.status} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/10 backdrop-blur-xl border border-${color}-500/30 rounded-2xl p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-300`} />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}
          >
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </motion.div>
  );

  // Quick Action Button
  const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/30 hover:bg-${color}-500/20 text-${color}-300 transition-all group`}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Courses View
  const CoursesView = () => (
    <div className="space-y-4">
      {getFilteredData().map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {course.title?.[currentLanguage] ||
                      course.title?.en ||
                      "Untitled Course"}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {course.description?.[currentLanguage] ||
                      course.description?.en ||
                      "No description"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrolledCount || 0} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {course.averageRating?.toFixed(1) || "0.0"} (
                  {course.reviewCount || 0} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Level: {course.level || "Beginner"}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  Category: {course.category || "General"}
                </span>
              </div>

              {course.instructor && (
                <p className="text-sm text-slate-500 mt-2">
                  Instructor:{" "}
                  {course.instructor?.[currentLanguage] ||
                    course.instructor?.en}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <StatusBadge
                status={course.published ? "published" : "pending"}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openModal("course", course)}
                  className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Projects View
  const ProjectsView = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {getFilteredData().map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-purple-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <FolderKanban className="w-6 h-6 text-purple-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {project.title?.[currentLanguage] ||
                      project.title?.en ||
                      "Untitled Project"}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {project.description?.[currentLanguage] ||
                      project.description?.en ||
                      "No description"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
                <span>Category: {project.category || "General"}</span>
                <span>
                  Submitted:{" "}
                  {new Date(
                    project.submittedAt?.seconds * 1000,
                  ).toLocaleDateString()}
                </span>
                {project.files && (
                  <span className="flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    {project.files.length} files
                  </span>
                )}
              </div>

              {project.reviewComments && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Review: {project.reviewComments}
                  </p>
                  {project.grade && (
                    <p className="text-sm text-slate-500 mt-1">
                      Grade:{" "}
                      <span className="text-yellow-400 font-bold">
                        {project.grade}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <StatusBadge status={project.status} />
              {project.status === "pending" && (
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => openModal("reviewProject", project)}
                    className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-medium transition-all flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Papers View
  const PapersView = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {["all", "published", "pending_review"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {status === "pending_review"
              ? "Pending Review"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {getFilteredData().map((paper, index) => (
        <motion.div
          key={paper.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-6 h-6 text-orange-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {paper.title?.[currentLanguage] ||
                      paper.title?.en ||
                      "Untitled Paper"}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {paper.abstract?.[currentLanguage] ||
                      paper.abstract?.en ||
                      "No abstract"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
                <span>Authors: {paper.authors?.join(", ") || "Unknown"}</span>
                <span>Category: {paper.category || "General"}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {paper.viewCount || 0} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {paper.downloadCount || 0} downloads
                </span>
              </div>

              {paper.fileName && (
                <p className="text-sm text-slate-500 mt-2">
                  File: {paper.fileName} (
                  {(paper.fileSize / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <StatusBadge status={paper.status} />
              <div className="flex gap-2 mt-2">
                {paper.fileUrl && (
                  <a
                    href={paper.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                    title="View PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => openModal("paper", paper)}
                  className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-all"
                  title="Edit/Review"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Materials View
  const MaterialsView = () => (
    <div className="space-y-4">
      {getFilteredData().map((material, index) => (
        <motion.div
          key={material.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-pink-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <Upload className="w-6 h-6 text-pink-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {material.title?.[currentLanguage] ||
                      material.title?.en ||
                      "Untitled Material"}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {material.description?.[currentLanguage] ||
                      material.description?.en ||
                      "No description"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
                <span>Type: {material.type || "Document"}</span>
                <span>Category: {material.category || "General"}</span>
                {material.files && (
                  <span className="flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    {material.files.length} files
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {material.downloadCount || 0} downloads
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openModal("material", material)}
                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Categories View
  const CategoriesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {getFilteredData().map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gradient-to-br from-indigo-500/20 to-purple-600/10 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <FolderTree className="w-8 h-8 text-indigo-400" />
            <button
              onClick={() => openModal("category", category)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {category.name?.[currentLanguage] ||
              category.name?.en ||
              "Untitled"}
          </h3>
          <p className="text-sm text-slate-500 mb-3">
            {category.description?.[currentLanguage] ||
              category.description?.en ||
              ""}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen className="w-4 h-4" />
            {category.courseCount || 0} courses
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Users View
  const UsersView = () => (
    <div className="space-y-4">
      <div className="text-center py-12 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm">
        <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          User Management
        </h3>
        <p className="text-slate-500 mb-4">
          View and manage user profiles, roles, and permissions
        </p>
        <button
          onClick={() => openModal("userManagement")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
        >
          View All Users
        </button>
      </div>
    </div>
  );

  // Analytics View
  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Course Engagement
          </h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 truncate flex-1">
                  {course.title?.en || "Untitled"}
                </span>
                <span className="text-sm font-medium text-blue-400 ml-4">
                  {course.enrolledCount || 0} enrolled
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Popular Categories
          </h3>
          <div className="space-y-3">
            {categories.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 truncate flex-1">
                  {category.name?.en || "Untitled"}
                </span>
                <span className="text-sm font-medium text-purple-400 ml-4">
                  {category.courseCount || 0} courses
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          System Activity
        </h3>
        <div className="text-center py-8 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Detailed analytics coming soon</p>
        </div>
      </div>
    </div>
  );

  // Course Form Modal Content
  const CourseFormContent = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        title: { en: "", si: "", ta: "" },
        description: { en: "", si: "", ta: "" },
        category: "",
        level: "beginner",
        instructor: { en: "", si: "", ta: "" },
        duration: "",
        targetRoles: [],
        published: false,
      },
    );
    const [formLanguage, setFormLanguage] = useState("en");

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveCourse(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4">
          {["en", "si", "ta"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setFormLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formLanguage === lang
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Course Title ({formLanguage.toUpperCase()})
          </label>
          <input
            type="text"
            value={formData.title?.[formLanguage] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: { ...formData.title, [formLanguage]: e.target.value },
              })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Description ({formLanguage.toUpperCase()})
          </label>
          <textarea
            value={formData.description?.[formLanguage] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: {
                  ...formData.description,
                  [formLanguage]: e.target.value,
                },
              })
            }
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Instructor ({formLanguage.toUpperCase()})
          </label>
          <input
            type="text"
            value={formData.instructor?.[formLanguage] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                instructor: {
                  ...formData.instructor,
                  [formLanguage]: e.target.value,
                },
              })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Category
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name?.en}>
                  {cat.name?.en}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Level
            </label>
            <select
              value={formData.level || "beginner"}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Duration (hours)
          </label>
          <input
            type="text"
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 20 hours"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.published || false}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
            className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-slate-600"
          >
            Publish immediately
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold hover:shadow-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Course
              </>
            )}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Review Project Modal Content
  const ReviewProjectFormContent = () => {
    const [reviewData, setReviewData] = useState({
      status: "approved",
      comments: "",
      grade: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleReviewProject(
        editingItem.id,
        reviewData.status,
        reviewData.comments,
        reviewData.grade,
      );
      closeModal();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {editingItem?.title?.en || "Project Review"}
          </h3>
          <p className="text-sm text-slate-500">
            {editingItem?.description?.en || ""}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Decision
          </label>
          <select
            value={reviewData.status}
            onChange={(e) =>
              setReviewData({ ...reviewData, status: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
            <option value="pending">Keep Pending</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Grade (Optional)
          </label>
          <input
            type="text"
            value={reviewData.grade}
            onChange={(e) =>
              setReviewData({ ...reviewData, grade: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., A+, 95/100"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Review Comments
          </label>
          <textarea
            value={reviewData.comments}
            onChange={(e) =>
              setReviewData({ ...reviewData, comments: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Provide detailed feedback..."
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Category Form Modal Content
  const CategoryFormContent = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        name: { en: "", si: "", ta: "" },
        description: { en: "", si: "", ta: "" },
        order: 0,
      },
    );
    const [formLanguage, setFormLanguage] = useState("en");

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveCategory(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4">
          {["en", "si", "ta"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setFormLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formLanguage === lang
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Category Name ({formLanguage.toUpperCase()})
          </label>
          <input
            type="text"
            value={formData.name?.[formLanguage] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: { ...formData.name, [formLanguage]: e.target.value },
              })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Description ({formLanguage.toUpperCase()})
          </label>
          <textarea
            value={formData.description?.[formLanguage] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: {
                  ...formData.description,
                  [formLanguage]: e.target.value,
                },
              })
            }
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.order || 0}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) })
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Category
              </>
            )}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "courses":
        return <CoursesView />;
      case "projects":
        return <ProjectsView />;
      case "users":
        return <UsersView />;
      case "papers":
        return <PapersView />;
      case "materials":
        return <MaterialsView />;
      case "categories":
        return <CategoriesView />;
      case "analytics":
        return <AnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  // Render modal content
  const renderModalContent = () => {
    switch (modalType) {
      case "course":
        return <CourseFormContent />;
      case "reviewProject":
        return <ReviewProjectFormContent />;
      case "category":
        return <CategoryFormContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                LDA Admin Panel
              </h1>
              <p className="text-sm text-slate-500">
                Learning Development Academy Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              >
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toast Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-green-50 border border-green-500/50 text-green-700 flex items-center gap-3"
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
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-500/50 text-red-700 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-500/20 border-${tab.color}-500/50 text-${tab.color}-300 border`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Bar */}
        {activeTab !== "dashboard" &&
          activeTab !== "analytics" &&
          activeTab !== "users" && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() =>
                  openModal(activeTab === "projects" ? null : activeTab)
                }
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold hover:shadow-lg shadow-sm transition-all"
                disabled={activeTab === "projects"}
              >
                <Plus className="w-5 h-5" />
                Add New {activeTab.slice(0, -1)}
              </button>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <button
                onClick={loadData}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                disabled={dataLoading}
              >
                <RefreshCw
                  className={`w-5 h-5 ${dataLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {dataLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500">Loading data...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Data Message */}
        {!dataLoading &&
          getFilteredData().length === 0 &&
          activeTab !== "dashboard" &&
          activeTab !== "analytics" &&
          activeTab !== "users" && (
            <div className="text-center py-12 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-slate-500">
                No {activeTab} found.{" "}
                {activeTab !== "projects" && `Click "Add New" to create one.`}
              </p>
            </div>
          )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderModalContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-2xl"
            >
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Confirm Action
                </h3>
                <p className="text-slate-600">{confirmDialog.message}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog({
                      show: false,
                      message: "",
                      onConfirm: null,
                    });
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={() =>
                    setConfirmDialog({
                      show: false,
                      message: "",
                      onConfirm: null,
                    })
                  }
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LDAAdmin;
