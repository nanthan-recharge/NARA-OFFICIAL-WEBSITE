import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Icons from "lucide-react";
import {
  chairmanService,
  executiveLeadershipService,
  divisionHeadsService,
  governingBoardService,
  administrationImageService,
} from "../../services/administrationService";

const AdministrationAdmin = () => {
  const { t } = useTranslation(["common", "administration"]);
  const [activeTab, setActiveTab] = useState("chairman");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Chairman State
  const [chairman, setChairman] = useState(null);
  const [chairmanModal, setChairmanModal] = useState(false);
  const [chairmanForm, setChairmanForm] = useState({
    name: { en: "", si: "", ta: "" },
    email: "",
    phone: "",
    description: { en: "", si: "", ta: "" },
    imageUrl: "",
    imagePath: "",
  });

  // Executive Leadership State
  const [executives, setExecutives] = useState([]);
  const [executiveModal, setExecutiveModal] = useState(false);
  const [executiveForm, setExecutiveForm] = useState({
    name: { en: "", si: "", ta: "" },
    position: { en: "", si: "", ta: "" },
    division: { en: "", si: "", ta: "" },
    email: "",
    phone: "",
    mobile: "",
    description: { en: "", si: "", ta: "" },
    order: 0,
    imageUrl: "",
    imagePath: "",
  });
  const [editingExecutive, setEditingExecutive] = useState(null);

  // Division Heads State
  const [divisionHeads, setDivisionHeads] = useState([]);
  const [divisionModal, setDivisionModal] = useState(false);
  const [divisionForm, setDivisionForm] = useState({
    name: { en: "", si: "", ta: "" },
    position: { en: "", si: "", ta: "" },
    division: { en: "", si: "", ta: "" },
    education: { en: "", si: "", ta: "" },
    expertise: { en: "", si: "", ta: "" },
    email: "",
    order: 0,
    imageUrl: "",
    imagePath: "",
  });
  const [editingDivision, setEditingDivision] = useState(null);

  // Governing Board State
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardModal, setBoardModal] = useState(false);
  const [boardForm, setBoardForm] = useState({
    name: { en: "", si: "", ta: "" },
    role: { en: "", si: "", ta: "" },
    order: 0,
  });
  const [editingBoard, setEditingBoard] = useState(null);

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Language Tab State
  const [langTab, setLangTab] = useState("en");

  // Statistics
  const [stats, setStats] = useState({
    chairman: 0,
    executives: 0,
    divisions: 0,
    board: 0,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [chairmanData, executiveData, divisionData, boardData] =
        await Promise.all([
          chairmanService.get(),
          executiveLeadershipService.getAll(),
          divisionHeadsService.getAll(),
          governingBoardService.getAll(),
        ]);

      if (chairmanData.data) setChairman(chairmanData.data);
      if (executiveData.data) setExecutives(executiveData.data);
      if (divisionData.data) setDivisionHeads(divisionData.data);
      if (boardData.data) setBoardMembers(boardData.data);

      setStats({
        chairman: chairmanData.data ? 1 : 0,
        executives: executiveData.data?.length || 0,
        divisions: divisionData.data?.length || 0,
        board: boardData.data?.length || 0,
      });
    } catch (error) {
      showMessage("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // ==================== IMAGE UPLOAD ====================

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage("error", "Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (category, personId) => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const { data, error } = await administrationImageService.uploadImage(
        imageFile,
        category,
        personId,
      );
      if (error) throw error;
      return data;
    } catch (error) {
      showMessage("error", "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imagePath) => {
    if (!imagePath) return;
    try {
      await administrationImageService.deleteImage(imagePath);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // ==================== CHAIRMAN FUNCTIONS ====================

  const openChairmanModal = () => {
    if (chairman) {
      setChairmanForm({
        name: chairman.name || { en: "", si: "", ta: "" },
        email: chairman.email || "",
        phone: chairman.phone || "",
        description: chairman.description || { en: "", si: "", ta: "" },
        imageUrl: chairman.imageUrl || "",
        imagePath: chairman.imagePath || "",
      });
      setImagePreview(chairman.imageUrl || "");
    }
    setChairmanModal(true);
  };

  const closeChairmanModal = () => {
    setChairmanModal(false);
    resetImageState();
  };

  const saveChairman = async () => {
    setLoading(true);
    try {
      let imageData = {
        imageUrl: chairmanForm.imageUrl,
        imagePath: chairmanForm.imagePath,
      };

      // Upload new image if selected
      if (imageFile) {
        const personId = chairman?.id || "chairman";
        const uploaded = await uploadImage("chairman", personId);
        if (uploaded) {
          // Delete old image if exists
          if (chairmanForm.imagePath) {
            await deleteImage(chairmanForm.imagePath);
          }
          imageData = uploaded;
        }
      }

      const dataToSave = {
        ...chairmanForm,
        ...imageData,
      };

      let result;
      if (chairman) {
        result = await chairmanService.update(chairman.id, dataToSave);
      } else {
        result = await chairmanService.create(dataToSave);
      }

      if (result.error) throw result.error;

      showMessage("success", "Chairman updated successfully");
      closeChairmanModal();
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to save chairman");
    } finally {
      setLoading(false);
    }
  };

  // ==================== EXECUTIVE FUNCTIONS ====================

  const openExecutiveModal = (executive = null) => {
    if (executive) {
      setEditingExecutive(executive);
      setExecutiveForm({
        name: executive.name || { en: "", si: "", ta: "" },
        position: executive.position || { en: "", si: "", ta: "" },
        division: executive.division || { en: "", si: "", ta: "" },
        email: executive.email || "",
        phone: executive.phone || "",
        mobile: executive.mobile || "",
        description: executive.description || { en: "", si: "", ta: "" },
        order: executive.order || 0,
        imageUrl: executive.imageUrl || "",
        imagePath: executive.imagePath || "",
      });
      setImagePreview(executive.imageUrl || "");
    } else {
      setEditingExecutive(null);
      setExecutiveForm({
        name: { en: "", si: "", ta: "" },
        position: { en: "", si: "", ta: "" },
        division: { en: "", si: "", ta: "" },
        email: "",
        phone: "",
        mobile: "",
        description: { en: "", si: "", ta: "" },
        order: executives.length,
        imageUrl: "",
        imagePath: "",
      });
    }
    setExecutiveModal(true);
  };

  const closeExecutiveModal = () => {
    setExecutiveModal(false);
    setEditingExecutive(null);
    resetImageState();
  };

  const saveExecutive = async () => {
    setLoading(true);
    try {
      let imageData = {
        imageUrl: executiveForm.imageUrl,
        imagePath: executiveForm.imagePath,
      };

      if (imageFile) {
        const personId = editingExecutive?.id || `executive_${Date.now()}`;
        const uploaded = await uploadImage("executive", personId);
        if (uploaded) {
          if (executiveForm.imagePath) {
            await deleteImage(executiveForm.imagePath);
          }
          imageData = uploaded;
        }
      }

      const dataToSave = {
        ...executiveForm,
        ...imageData,
      };

      let result;
      if (editingExecutive) {
        result = await executiveLeadershipService.update(
          editingExecutive.id,
          dataToSave,
        );
      } else {
        result = await executiveLeadershipService.create(dataToSave);
      }

      if (result.error) throw result.error;

      showMessage(
        "success",
        `Executive ${editingExecutive ? "updated" : "created"} successfully`,
      );
      closeExecutiveModal();
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to save executive");
    } finally {
      setLoading(false);
    }
  };

  const deleteExecutive = async (id, imagePath) => {
    if (!window.confirm("Are you sure you want to delete this executive?"))
      return;

    setLoading(true);
    try {
      if (imagePath) {
        await deleteImage(imagePath);
      }
      const result = await executiveLeadershipService.delete(id);
      if (result.error) throw result.error;

      showMessage("success", "Executive deleted successfully");
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to delete executive");
    } finally {
      setLoading(false);
    }
  };

  // ==================== DIVISION HEAD FUNCTIONS ====================

  const openDivisionModal = (division = null) => {
    if (division) {
      setEditingDivision(division);
      setDivisionForm({
        name: division.name || { en: "", si: "", ta: "" },
        position: division.position || { en: "", si: "", ta: "" },
        division: division.division || { en: "", si: "", ta: "" },
        education: division.education || { en: "", si: "", ta: "" },
        expertise: division.expertise || { en: "", si: "", ta: "" },
        email: division.email || "",
        order: division.order || 0,
        imageUrl: division.imageUrl || "",
        imagePath: division.imagePath || "",
      });
      setImagePreview(division.imageUrl || "");
    } else {
      setEditingDivision(null);
      setDivisionForm({
        name: { en: "", si: "", ta: "" },
        position: { en: "", si: "", ta: "" },
        division: { en: "", si: "", ta: "" },
        education: { en: "", si: "", ta: "" },
        expertise: { en: "", si: "", ta: "" },
        email: "",
        order: divisionHeads.length,
        imageUrl: "",
        imagePath: "",
      });
    }
    setDivisionModal(true);
  };

  const closeDivisionModal = () => {
    setDivisionModal(false);
    setEditingDivision(null);
    resetImageState();
  };

  const saveDivision = async () => {
    setLoading(true);
    try {
      let imageData = {
        imageUrl: divisionForm.imageUrl,
        imagePath: divisionForm.imagePath,
      };

      if (imageFile) {
        const personId = editingDivision?.id || `division_${Date.now()}`;
        const uploaded = await uploadImage("division", personId);
        if (uploaded) {
          if (divisionForm.imagePath) {
            await deleteImage(divisionForm.imagePath);
          }
          imageData = uploaded;
        }
      }

      const dataToSave = {
        ...divisionForm,
        ...imageData,
      };

      let result;
      if (editingDivision) {
        result = await divisionHeadsService.update(
          editingDivision.id,
          dataToSave,
        );
      } else {
        result = await divisionHeadsService.create(dataToSave);
      }

      if (result.error) throw result.error;

      showMessage(
        "success",
        `Division head ${editingDivision ? "updated" : "created"} successfully`,
      );
      closeDivisionModal();
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to save division head");
    } finally {
      setLoading(false);
    }
  };

  const deleteDivision = async (id, imagePath) => {
    if (!window.confirm("Are you sure you want to delete this division head?"))
      return;

    setLoading(true);
    try {
      if (imagePath) {
        await deleteImage(imagePath);
      }
      const result = await divisionHeadsService.delete(id);
      if (result.error) throw result.error;

      showMessage("success", "Division head deleted successfully");
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to delete division head");
    } finally {
      setLoading(false);
    }
  };

  // ==================== BOARD MEMBER FUNCTIONS ====================

  const openBoardModal = (member = null) => {
    if (member) {
      setEditingBoard(member);
      setBoardForm({
        name: member.name || { en: "", si: "", ta: "" },
        role: member.role || { en: "", si: "", ta: "" },
        order: member.order || 0,
      });
    } else {
      setEditingBoard(null);
      setBoardForm({
        name: { en: "", si: "", ta: "" },
        role: { en: "", si: "", ta: "" },
        order: boardMembers.length,
      });
    }
    setBoardModal(true);
  };

  const closeBoardModal = () => {
    setBoardModal(false);
    setEditingBoard(null);
  };

  const saveBoard = async () => {
    setLoading(true);
    try {
      let result;
      if (editingBoard) {
        result = await governingBoardService.update(editingBoard.id, boardForm);
      } else {
        result = await governingBoardService.create(boardForm);
      }

      if (result.error) throw result.error;

      showMessage(
        "success",
        `Board member ${editingBoard ? "updated" : "created"} successfully`,
      );
      closeBoardModal();
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to save board member");
    } finally {
      setLoading(false);
    }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board member?"))
      return;

    setLoading(true);
    try {
      const result = await governingBoardService.delete(id);
      if (result.error) throw result.error;

      showMessage("success", "Board member deleted successfully");
      loadAllData();
    } catch (error) {
      showMessage("error", "Failed to delete board member");
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Icons.Users className="w-8 h-8 text-blue-600" />
                Administration Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage leadership, divisions, and governing board
              </p>
            </div>
            <button
              onClick={() => loadAllData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Icons.RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <Icons.CheckCircle className="w-5 h-5" />
              ) : (
                <Icons.AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chairman</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.chairman}
                </p>
              </div>
              <Icons.Crown className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Executives</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.executives}
                </p>
              </div>
              <Icons.User className="w-12 h-12 text-cyan-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Division Heads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.divisions}
                </p>
              </div>
              <Icons.Briefcase className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Board Members</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.board}
                </p>
              </div>
              <Icons.Shield className="w-12 h-12 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "chairman", label: "Chairman", icon: Icons.Crown },
                {
                  id: "executives",
                  label: "Executive Leadership",
                  icon: Icons.User,
                },
                {
                  id: "divisions",
                  label: "Division Heads",
                  icon: Icons.Briefcase,
                },
                { id: "board", label: "Governing Board", icon: Icons.Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Icons.Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* Chairman Tab */}
            {activeTab === "chairman" && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Chairman Information
                  </h2>
                  <button
                    onClick={openChairmanModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Icons.Edit className="w-4 h-4" />
                    {chairman ? "Edit" : "Add"} Chairman
                  </button>
                </div>

                {chairman ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex gap-6">
                      {chairman.imageUrl && (
                        <img
                          src={chairman.imageUrl}
                          alt={chairman.name?.en}
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {chairman.name?.en}
                        </h3>
                        <p className="text-gray-600 mb-2">{chairman.email}</p>
                        <p className="text-gray-600 mb-4">{chairman.phone}</p>
                        <p className="text-gray-700">
                          {chairman.description?.en}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icons.UserX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      No chairman data available. Click &quot;Add Chairman&quot;
                      to create.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Executive Leadership Tab */}
            {activeTab === "executives" && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Executive Leadership
                  </h2>
                  <button
                    onClick={() => openExecutiveModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    Add Executive
                  </button>
                </div>

                {executives.length > 0 ? (
                  <div className="space-y-4">
                    {executives.map((exec) => (
                      <div
                        key={exec.id}
                        className="bg-gray-50 rounded-lg p-6 flex items-start justify-between"
                      >
                        <div className="flex gap-4">
                          {exec.imageUrl && (
                            <img
                              src={exec.imageUrl}
                              alt={exec.name?.en}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {exec.name?.en}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {exec.position?.en}
                            </p>
                            <p className="text-sm text-cyan-600">
                              {exec.division?.en}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {exec.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openExecutiveModal(exec)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Icons.Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              deleteExecutive(exec.id, exec.imagePath)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icons.Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      No executives added yet. Click &quot;Add Executive&quot;
                      to create.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Division Heads Tab */}
            {activeTab === "divisions" && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Division Heads
                  </h2>
                  <button
                    onClick={() => openDivisionModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    Add Division Head
                  </button>
                </div>

                {divisionHeads.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {divisionHeads.map((head) => (
                      <div key={head.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-3">
                            {head.imageUrl && (
                              <img
                                src={head.imageUrl}
                                alt={head.name?.en}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">
                                {head.name?.en}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {head.position?.en}
                              </p>
                              <p className="text-xs text-cyan-600">
                                {head.division?.en}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDivisionModal(head)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Icons.Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                deleteDivision(head.id, head.imagePath)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {head.expertise?.en && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {head.expertise.en}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icons.Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      No division heads added yet. Click &quot;Add Division
                      Head&quot; to create.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Governing Board Tab */}
            {activeTab === "board" && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Governing Board Members
                  </h2>
                  <button
                    onClick={() => openBoardModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    Add Board Member
                  </button>
                </div>

                {boardMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boardMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm">
                              {member.name?.en}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {member.role?.en}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openBoardModal(member)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Icons.Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteBoard(member.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icons.Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>
                      No board members added yet. Click &quot;Add Board
                      Member&quot; to create.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CHAIRMAN MODAL ==================== */}
      {chairmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Icons.Crown className="w-6 h-6 text-amber-500" />
                {chairman ? "Edit" : "Add"} Chairman
              </h2>
              <button
                onClick={closeChairmanModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-start gap-4">
                  {(imagePreview || chairmanForm.imageUrl) && (
                    <div className="relative">
                      <img
                        src={imagePreview || chairmanForm.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                      {imagePreview && (
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB. Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="mb-4">
                <div className="flex space-x-1 border-b border-gray-200">
                  {[
                    { id: "en", label: "English", flag: "🇬🇧" },
                    { id: "si", label: "Sinhala", flag: "🇱🇰" },
                    { id: "ta", label: "Tamil", flag: "🇮🇳" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLangTab(lang.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        langTab === lang.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trilingual Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={chairmanForm.name[langTab]}
                    onChange={(e) =>
                      setChairmanForm({
                        ...chairmanForm,
                        name: {
                          ...chairmanForm.name,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter name in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    value={chairmanForm.description[langTab]}
                    onChange={(e) =>
                      setChairmanForm({
                        ...chairmanForm,
                        description: {
                          ...chairmanForm.description,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter description in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Contact Information (Language Independent) */}
                {langTab === "en" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={chairmanForm.email}
                        onChange={(e) =>
                          setChairmanForm({
                            ...chairmanForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="chairman@nara.ac.lk"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={chairmanForm.phone}
                        onChange={(e) =>
                          setChairmanForm({
                            ...chairmanForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+94-11-2521881"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeChairmanModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChairman}
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {(loading || uploading) && (
                    <Icons.Loader className="w-4 h-4 animate-spin" />
                  )}
                  {uploading ? "Uploading..." : "Save Chairman"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EXECUTIVE MODAL ==================== */}
      {executiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Icons.User className="w-6 h-6 text-cyan-500" />
                {editingExecutive ? "Edit" : "Add"} Executive
              </h2>
              <button
                onClick={closeExecutiveModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-start gap-4">
                  {(imagePreview || executiveForm.imageUrl) && (
                    <div className="relative">
                      <img
                        src={imagePreview || executiveForm.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                      {imagePreview && (
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB. Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="mb-4">
                <div className="flex space-x-1 border-b border-gray-200">
                  {[
                    { id: "en", label: "English", flag: "🇬🇧" },
                    { id: "si", label: "Sinhala", flag: "🇱🇰" },
                    { id: "ta", label: "Tamil", flag: "🇮🇳" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLangTab(lang.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        langTab === lang.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trilingual Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={executiveForm.name[langTab]}
                    onChange={(e) =>
                      setExecutiveForm({
                        ...executiveForm,
                        name: {
                          ...executiveForm.name,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter name in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={executiveForm.position[langTab]}
                    onChange={(e) =>
                      setExecutiveForm({
                        ...executiveForm,
                        position: {
                          ...executiveForm.position,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter position in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={executiveForm.division[langTab]}
                    onChange={(e) =>
                      setExecutiveForm({
                        ...executiveForm,
                        division: {
                          ...executiveForm.division,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter division in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    value={executiveForm.description[langTab]}
                    onChange={(e) =>
                      setExecutiveForm({
                        ...executiveForm,
                        description: {
                          ...executiveForm.description,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter description in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Contact Information (Language Independent) */}
                {langTab === "en" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={executiveForm.email}
                          onChange={(e) =>
                            setExecutiveForm({
                              ...executiveForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@nara.ac.lk"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={executiveForm.order}
                          onChange={(e) =>
                            setExecutiveForm({
                              ...executiveForm,
                              order: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={executiveForm.phone}
                          onChange={(e) =>
                            setExecutiveForm({
                              ...executiveForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+94-11-XXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          value={executiveForm.mobile}
                          onChange={(e) =>
                            setExecutiveForm({
                              ...executiveForm,
                              mobile: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+94-7X-XXXXXXX"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeExecutiveModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveExecutive}
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {(loading || uploading) && (
                    <Icons.Loader className="w-4 h-4 animate-spin" />
                  )}
                  {uploading
                    ? "Uploading..."
                    : editingExecutive
                      ? "Update Executive"
                      : "Create Executive"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DIVISION HEAD MODAL ==================== */}
      {divisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Icons.Briefcase className="w-6 h-6 text-purple-500" />
                {editingDivision ? "Edit" : "Add"} Division Head
              </h2>
              <button
                onClick={closeDivisionModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-start gap-4">
                  {(imagePreview || divisionForm.imageUrl) && (
                    <div className="relative">
                      <img
                        src={imagePreview || divisionForm.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                      {imagePreview && (
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB. Supported formats: JPG, PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="mb-4">
                <div className="flex space-x-1 border-b border-gray-200">
                  {[
                    { id: "en", label: "English", flag: "🇬🇧" },
                    { id: "si", label: "Sinhala", flag: "🇱🇰" },
                    { id: "ta", label: "Tamil", flag: "🇮🇳" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLangTab(lang.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        langTab === lang.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trilingual Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={divisionForm.name[langTab]}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        name: {
                          ...divisionForm.name,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter name in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={divisionForm.position[langTab]}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        position: {
                          ...divisionForm.position,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter position in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={divisionForm.division[langTab]}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        division: {
                          ...divisionForm.division,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter division in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    value={divisionForm.education[langTab]}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        education: {
                          ...divisionForm.education,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter education background in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas of Expertise ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    value={divisionForm.expertise[langTab]}
                    onChange={(e) =>
                      setDivisionForm({
                        ...divisionForm,
                        expertise: {
                          ...divisionForm.expertise,
                          [langTab]: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter areas of expertise in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Contact Information (Language Independent) */}
                {langTab === "en" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={divisionForm.email}
                        onChange={(e) =>
                          setDivisionForm({
                            ...divisionForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@nara.ac.lk"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={divisionForm.order}
                        onChange={(e) =>
                          setDivisionForm({
                            ...divisionForm,
                            order: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeDivisionModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDivision}
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {(loading || uploading) && (
                    <Icons.Loader className="w-4 h-4 animate-spin" />
                  )}
                  {uploading
                    ? "Uploading..."
                    : editingDivision
                      ? "Update Division Head"
                      : "Create Division Head"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BOARD MEMBER MODAL ==================== */}
      {boardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Icons.Shield className="w-6 h-6 text-emerald-500" />
                {editingBoard ? "Edit" : "Add"} Board Member
              </h2>
              <button
                onClick={closeBoardModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Language Tabs */}
              <div className="mb-4">
                <div className="flex space-x-1 border-b border-gray-200">
                  {[
                    { id: "en", label: "English", flag: "🇬🇧" },
                    { id: "si", label: "Sinhala", flag: "🇱🇰" },
                    { id: "ta", label: "Tamil", flag: "🇮🇳" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLangTab(lang.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        langTab === lang.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trilingual Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={boardForm.name[langTab]}
                    onChange={(e) =>
                      setBoardForm({
                        ...boardForm,
                        name: { ...boardForm.name, [langTab]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter name in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={boardForm.role[langTab]}
                    onChange={(e) =>
                      setBoardForm({
                        ...boardForm,
                        role: { ...boardForm.role, [langTab]: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter role in ${langTab.toUpperCase()}`}
                  />
                </div>

                {/* Order (Language Independent) */}
                {langTab === "en" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={boardForm.order}
                      onChange={(e) =>
                        setBoardForm({
                          ...boardForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeBoardModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBoard}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Icons.Loader className="w-4 h-4 animate-spin" />}
                  {editingBoard ? "Update Board Member" : "Create Board Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrationAdmin;
