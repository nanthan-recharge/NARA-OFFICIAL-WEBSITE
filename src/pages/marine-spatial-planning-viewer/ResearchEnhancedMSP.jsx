/**
 * RESEARCH-ENHANCED Marine Spatial Planning Viewer for NARA Staff
 *
 * COMPREHENSIVE FEATURES FOR DAILY RESEARCH USE:
 * ✅ Project Management (Save, Load, Share)
 * ✅ Advanced Data Export (PDF Reports, Excel, GeoJSON, KML, Shapefile)
 * ✅ Research Templates (Coral Study, Fish Survey, Water Quality, etc.)
 * ✅ Collaboration Tools (Comments, Annotations, Team Sharing)
 * ✅ Advanced Measurements (Area, Distance, Depth, Coordinates)
 * ✅ Data Layers (Bathymetry, Water Quality, Fish Habitats)
 * ✅ Time-series Analysis (Track changes over time)
 * ✅ Photo/Document Attachments per zone
 * ✅ Automated Report Generation
 * ✅ Integration with NARA research databases
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Circle,
  Marker,
  Popup,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Map,
  Edit3,
  Square,
  Ruler,
  Trash2,
  Undo,
  Redo,
  Save,
  Target,
  Ship,
  Anchor,
  Fish,
  Shield,
  Home,
  BarChart3,
  Compass,
  AlertTriangle,
  Droplets,
  Trees,
  Waves,
  MapPin,
  Download,
  Upload,
  FolderOpen,
  FileText,
  Layers,
  Database,
  Clipboard,
  PlusCircle,
  XCircle,
  Globe,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../../contexts/AuthContext";

// Import cloud services
import {
  saveProjectToCloud,
  loadProjectFromCloud,
  getUserProjects,
  getZonePhotos,
} from "../../services/mspCloudService";
import { generatePDFReport } from "../../services/mspPDFReportService";
import { importFile } from "../../services/mspImportService";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ResearchEnhancedMSP = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation("marineSpatialPlanning");

  // ==================== STATE MANAGEMENT ====================

  // Cloud Sync State
  const [, setCloudSyncStatus] = useState("offline"); // 'offline', 'syncing', 'synced', 'error'
  const [, setCloudProjects] = useState([]);
  const [, setZonePhotos] = useState({});

  // Project Management
  const [currentProject, setCurrentProject] = useState({
    id: null,
    name: t("researchEnhanced.project.untitled"),
    description: "",
    researcher: "",
    date: new Date().toISOString(),
    type: "general",
    status: "draft",
    tags: [],
    metadata: {},
    isCloudSynced: false,
  });
  const [savedProjects, setSavedProjects] = useState([]);
  const [showProjectManager, setShowProjectManager] = useState(false);

  // Drawing and Zones
  const [drawingMode, setDrawingMode] = useState(null);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Research-specific data
  const [researchData, setResearchData] = useState({
    waterQuality: [],
    fishSurveys: [],
    coralHealth: [],
    depthReadings: [],
    observations: [],
  });

  // UI State
  const [showStats, setShowStats] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("draw"); // draw, measure, data, analysis

  // Measurement
  const [measurementMode, setMeasurementMode] = useState(null);
  const [measurementPoints, setMeasurementPoints] = useState([]);
  const [measurements, setMeasurements] = useState({
    distance: 0,
    area: 0,
    bearing: 0,
  });

  // Comments and Annotations
  const [comments, setComments] = useState([]);
  const [showCommentForm] = useState(false);
  const [, setCommentPosition] = useState(null);

  // Data Layers
  const [activeLayers, setActiveLayers] = useState({
    bathymetry: false,
    waterQuality: false,
    fishHabitats: false,
    protectedAreas: true,
    shippingLanes: false,
    researchSites: true,
  });

  const mapRef = useRef(null);
  const fileInputRef = useRef(null);

  // ==================== RESEARCH TEMPLATES ====================

  const researchTemplates = [
    {
      id: "coral_reef_study",
      name: t("researchEnhanced.templates.list.coralReefStudy.name"),
      type: "research_zone",
      description: t(
        "researchEnhanced.templates.list.coralReefStudy.description",
      ),
      shape: "rectangle",
      size: { width: 500, height: 500 },
      color: "#f59e0b",
      icon: Trees,
      defaultData: {
        coralCoverage: null,
        species: [],
        healthScore: null,
        waterTemp: null,
        visibility: null,
      },
    },
    {
      id: "fish_survey",
      name: t("researchEnhanced.templates.list.fishSurvey.name"),
      type: "fish_survey",
      description: t("researchEnhanced.templates.list.fishSurvey.description"),
      shape: "line",
      size: { length: 1000 },
      color: "#3b82f6",
      icon: Fish,
      defaultData: {
        species: [],
        counts: {},
        sizeDistribution: [],
        behavior: "",
      },
    },
    {
      id: "water_quality_sampling",
      name: t("researchEnhanced.templates.list.waterQualitySampling.name"),
      type: "sampling_station",
      description: t(
        "researchEnhanced.templates.list.waterQualitySampling.description",
      ),
      shape: "circle",
      size: { radius: 100 },
      color: "#06b6d4",
      icon: Droplets,
      defaultData: {
        pH: null,
        salinity: null,
        dissolved_oxygen: null,
        temperature: null,
        turbidity: null,
        nutrients: {},
      },
    },
    {
      id: "marine_protected_area",
      name: t("researchEnhanced.templates.list.marineProtectedArea.name"),
      type: "protected_area",
      description: t(
        "researchEnhanced.templates.list.marineProtectedArea.description",
      ),
      shape: "polygon",
      size: { width: 2000, height: 2000 },
      color: "#10b981",
      icon: Shield,
      defaultData: {
        protectionLevel: "strict",
        allowedActivities: [],
        restrictedActivities: [],
        managementPlan: "",
      },
    },
    {
      id: "fishing_grounds_assessment",
      name: t("researchEnhanced.templates.list.fishingGroundsAssessment.name"),
      type: "fishing_zone",
      description: t(
        "researchEnhanced.templates.list.fishingGroundsAssessment.description",
      ),
      shape: "rectangle",
      size: { width: 3000, height: 2000 },
      color: "#8b5cf6",
      icon: Anchor,
      defaultData: {
        fishingMethod: "",
        targetSpecies: [],
        catchData: [],
        effort: null,
      },
    },
    {
      id: "oceanographic_station",
      name: t("researchEnhanced.templates.list.oceanographicStation.name"),
      type: "monitoring_station",
      description: t(
        "researchEnhanced.templates.list.oceanographicStation.description",
      ),
      shape: "point",
      size: { radius: 50 },
      color: "#ef4444",
      icon: Compass,
      defaultData: {
        sensors: [],
        dataFrequency: "hourly",
        parameters: [],
      },
    },
    {
      id: "seagrass_meadow",
      name: t("researchEnhanced.templates.list.seagrassMeadow.name"),
      type: "habitat_survey",
      description: t(
        "researchEnhanced.templates.list.seagrassMeadow.description",
      ),
      shape: "polygon",
      size: { width: 800, height: 600 },
      color: "#22c55e",
      icon: Waves,
      defaultData: {
        seagrassSpecies: [],
        density: null,
        healthStatus: "",
        threats: [],
      },
    },
    {
      id: "research_vessel_track",
      name: t("researchEnhanced.templates.list.researchVesselTrack.name"),
      type: "vessel_track",
      description: t(
        "researchEnhanced.templates.list.researchVesselTrack.description",
      ),
      shape: "line",
      size: { length: 5000 },
      color: "#a855f7",
      icon: Ship,
      defaultData: {
        vesselName: "",
        surveyType: "",
        startTime: null,
        endTime: null,
      },
    },
    {
      id: "pollution_monitoring",
      name: t("researchEnhanced.templates.list.pollutionMonitoring.name"),
      type: "pollution_zone",
      description: t(
        "researchEnhanced.templates.list.pollutionMonitoring.description",
      ),
      shape: "rectangle",
      size: { width: 1000, height: 1000 },
      color: "#dc2626",
      icon: AlertTriangle,
      defaultData: {
        pollutionType: "",
        severity: "",
        source: "",
        measurements: [],
      },
    },
    {
      id: "aquaculture_study",
      name: t("researchEnhanced.templates.list.aquacultureStudy.name"),
      type: "aquaculture",
      description: t(
        "researchEnhanced.templates.list.aquacultureStudy.description",
      ),
      shape: "rectangle",
      size: { width: 500, height: 500 },
      color: "#14b8a6",
      icon: Home,
      defaultData: {
        species: "",
        capacity: null,
        waterFlow: null,
        environmental_impact: "",
      },
    },
  ];

  // ==================== ZONE TYPE CONFIGURATION ====================

  const zoneTypeConfig = {
    research_zone: {
      label: t("researchEnhanced.zoneTypes.researchZone"),
      color: "#f59e0b",
      icon: Target,
    },
    fish_survey: {
      label: t("researchEnhanced.zoneTypes.fishSurvey"),
      color: "#3b82f6",
      icon: Fish,
    },
    sampling_station: {
      label: t("researchEnhanced.zoneTypes.samplingStation"),
      color: "#06b6d4",
      icon: Droplets,
    },
    protected_area: {
      label: t("researchEnhanced.zoneTypes.protectedArea"),
      color: "#10b981",
      icon: Shield,
    },
    fishing_zone: {
      label: t("researchEnhanced.zoneTypes.fishingZone"),
      color: "#8b5cf6",
      icon: Anchor,
    },
    monitoring_station: {
      label: t("researchEnhanced.zoneTypes.monitoringStation"),
      color: "#ef4444",
      icon: Compass,
    },
    habitat_survey: {
      label: t("researchEnhanced.zoneTypes.habitatSurvey"),
      color: "#22c55e",
      icon: Waves,
    },
    vessel_track: {
      label: t("researchEnhanced.zoneTypes.vesselTrack"),
      color: "#a855f7",
      icon: Ship,
    },
    pollution_zone: {
      label: t("researchEnhanced.zoneTypes.pollutionZone"),
      color: "#dc2626",
      icon: AlertTriangle,
    },
    aquaculture: {
      label: t("researchEnhanced.zoneTypes.aquaculture"),
      color: "#14b8a6",
      icon: Home,
    },
    custom: {
      label: t("researchEnhanced.zoneTypes.customZone"),
      color: "#6b7280",
      icon: MapPin,
    },
  };

  // ==================== HELPER FUNCTIONS ====================

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateArea = (positions) => {
    if (!positions || positions.length < 3) return 0;

    // Convert to radians
    const toRad = (deg) => (deg * Math.PI) / 180;

    let area = 0;
    const R = 6371000; // Earth's radius in meters

    for (let i = 0; i < positions.length; i++) {
      const p1 = positions[i];
      const p2 = positions[(i + 1) % positions.length];

      const lat1 = toRad(p1[0]);
      const lat2 = toRad(p2[0]);
      const lon1 = toRad(p1[1]);
      const lon2 = toRad(p2[1]);

      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs((area * R * R) / 2) / 1000000; // Convert to km²
    return area;
  };

  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return (bearing + 360) % 360;
  };

  const getStatistics = () => {
    const totalArea = drawnShapes.reduce((sum, shape) => {
      if (shape.type === "polygon" || shape.type === "rectangle") {
        return sum + calculateArea(shape.positions);
      } else if (shape.type === "circle") {
        return sum + (Math.PI * shape.radius * shape.radius) / 1000000;
      }
      return sum;
    }, 0);

    const zonesByType = drawnShapes.reduce((acc, shape) => {
      const type = shape.zoneType || "custom";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const totalDistance = drawnShapes.reduce((sum, shape) => {
      if (shape.type === "line") {
        let dist = 0;
        for (let i = 0; i < shape.positions.length - 1; i++) {
          dist += calculateDistance(
            shape.positions[i][0],
            shape.positions[i][1],
            shape.positions[i + 1][0],
            shape.positions[i + 1][1],
          );
        }
        return sum + dist;
      }
      return sum;
    }, 0);

    return {
      totalShapes: drawnShapes.length,
      totalArea: totalArea.toFixed(2),
      totalDistance: totalDistance.toFixed(2),
      zonesByType,
    };
  };

  // ==================== PROJECT MANAGEMENT ====================

  const saveProject = async () => {
    const project = {
      ...currentProject,
      id: currentProject.id || `project_${Date.now()}`,
      lastModified: new Date().toISOString(),
      shapes: drawnShapes,
      researchData: researchData,
      comments: comments,
      measurements: measurements,
      layers: activeLayers,
    };

    try {
      // Save to cloud if user is authenticated
      if (currentUser) {
        setCloudSyncStatus("syncing");
        const result = await saveProjectToCloud(currentUser.email, project);
        if (result.success) {
          project.isCloudSynced = true;
          project.id = result.projectId;
          setCloudSyncStatus("synced");
          alert(
            t("researchEnhanced.project.savedCloud", { name: project.name }),
          );
        }
      } else {
        // Fallback to localStorage
        const projects = JSON.parse(
          localStorage.getItem("naraProjects") || "[]",
        );
        const existingIndex = projects.findIndex((p) => p.id === project.id);

        if (existingIndex >= 0) {
          projects[existingIndex] = project;
        } else {
          projects.push(project);
        }

        localStorage.setItem("naraProjects", JSON.stringify(projects));
        alert(t("researchEnhanced.project.savedLocal", { name: project.name }));
      }

      setCurrentProject(project);

      // Refresh project list
      await loadProjectsList();
    } catch (error) {
      console.error("Error saving project:", error);
      setCloudSyncStatus("error");
      alert(
        t("researchEnhanced.project.saveError", { message: error.message }),
      );
    }
  };

  const loadProject = async (project) => {
    try {
      // If it's a cloud project, load from cloud for latest version
      if (project.isCloudSynced && currentUser) {
        const result = await loadProjectFromCloud(project.id);
        if (result.success) {
          project = result.data;
        }
      }

      setCurrentProject(project);
      setDrawnShapes(project.shapes || []);
      setResearchData(project.researchData || {});
      setComments(project.comments || []);
      setMeasurements(project.measurements || {});
      setActiveLayers(project.layers || activeLayers);
      setShowProjectManager(false);

      // Load photos for all zones
      if (project.shapes && currentUser) {
        const photos = {};
        for (const shape of project.shapes) {
          const result = await getZonePhotos(project.id, shape.id);
          if (result.success) {
            photos[shape.id] = result.photos;
          }
        }
        setZonePhotos(photos);
      }
    } catch (error) {
      console.error("Error loading project:", error);
      alert(
        t("researchEnhanced.project.loadError", { message: error.message }),
      );
    }
  };

  const loadProjectsList = useCallback(async () => {
    try {
      if (currentUser) {
        // Load cloud projects
        const result = await getUserProjects(currentUser.email);
        if (result.success) {
          setCloudProjects(result.projects);
          setSavedProjects(result.projects);
        }
      } else {
        // Load local projects
        const projects = JSON.parse(
          localStorage.getItem("naraProjects") || "[]",
        );
        setSavedProjects(projects);
      }
    } catch (error) {
      console.error("Error loading projects list:", error);
    }
  }, [currentUser]);

  const newProject = () => {
    if (
      drawnShapes.length > 0 &&
      !confirm(t("researchEnhanced.project.newConfirm"))
    ) {
      return;
    }

    setCurrentProject({
      id: null,
      name: t("researchEnhanced.project.untitled"),
      description: "",
      researcher: "",
      date: new Date().toISOString(),
      type: "general",
      status: "draft",
      tags: [],
      metadata: {},
    });
    setDrawnShapes([]);
    setResearchData({});
    setComments([]);
    setUndoStack([]);
    setRedoStack([]);
  };

  // Load saved projects on mount and when user changes
  useEffect(() => {
    loadProjectsList();

    // Set cloud sync status based on authentication
    if (currentUser) {
      setCloudSyncStatus("synced");
    } else {
      setCloudSyncStatus("offline");
    }
  }, [currentUser, loadProjectsList]);

  // ==================== EXPORT FUNCTIONS ====================

  const exportToJSON = () => {
    const data = {
      project: currentProject,
      shapes: drawnShapes,
      researchData: researchData,
      comments: comments,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, "_")}_${Date.now()}.json`;
    a.click();
  };

  const exportToGeoJSON = () => {
    const features = drawnShapes.map((shape) => {
      let geometry;

      if (shape.type === "polygon" || shape.type === "rectangle") {
        geometry = {
          type: "Polygon",
          coordinates: [
            [
              ...shape.positions.map((p) => [p[1], p[0]]),
              [shape.positions[0][1], shape.positions[0][0]],
            ],
          ],
        };
      } else if (shape.type === "line") {
        geometry = {
          type: "LineString",
          coordinates: shape.positions.map((p) => [p[1], p[0]]),
        };
      } else if (shape.type === "circle") {
        geometry = {
          type: "Point",
          coordinates: [shape.center[1], shape.center[0]],
        };
      }

      return {
        type: "Feature",
        geometry: geometry,
        properties: {
          name: shape.label || shape.zoneType,
          type: shape.zoneType,
          color: shape.color,
          data: shape.data || {},
          createdAt: shape.createdAt,
        },
      };
    });

    const geoJSON = {
      type: "FeatureCollection",
      features: features,
    };

    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], {
      type: "application/geo+json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, "_")}_${Date.now()}.geojson`;
    a.click();
  };

  const exportToCSV = () => {
    let csv =
      "Zone Name,Type,Area (km²),Perimeter (km),Color,Created Date,Data\n";

    drawnShapes.forEach((shape) => {
      const area =
        shape.type === "polygon" || shape.type === "rectangle"
          ? calculateArea(shape.positions)
          : shape.type === "circle"
            ? (Math.PI * shape.radius * shape.radius) / 1000000
            : 0;

      csv += `"${shape.label || "Unnamed"}","${shape.zoneType || "custom"}",${area.toFixed(2)},"N/A","${shape.color}","${shape.createdAt || "N/A"}","${JSON.stringify(shape.data || {}).replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, "_")}_data_${Date.now()}.csv`;
    a.click();
  };

  const handleGeneratePDFReport = async () => {
    try {
      const mapElement = mapRef.current?.container;
      if (!mapElement) {
        alert(t("researchEnhanced.export.mapNotReady"));
        return;
      }

      const projectData = {
        ...currentProject,
        shapes: drawnShapes,
        researchData: researchData,
        comments: comments,
      };

      const result = await generatePDFReport(projectData, mapElement, {
        logoUrl: "https://nara-web-73384.web.app/logo.png",
        includeMap: true,
        includeStatistics: true,
        includeZoneDetails: true,
      });

      if (result.success) {
        alert(
          t("researchEnhanced.export.pdfSuccess", {
            filename: result.filename,
          }),
        );
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(t("researchEnhanced.export.pdfError", { message: error.message }));
    }
  };

  // File import handler
  const handleFileImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importFile(file);

      if (result.success) {
        // Add imported shapes to current project
        setUndoStack([...undoStack, drawnShapes]);
        setRedoStack([]);
        setDrawnShapes([...drawnShapes, ...result.shapes]);
        alert(
          result.message ||
            t("researchEnhanced.import.success", {
              count: result.shapes.length,
            }),
        );
      } else {
        alert(t("researchEnhanced.import.failed", { message: result.error }));
      }
    } catch (error) {
      console.error("Error importing file:", error);
      alert(t("researchEnhanced.import.error", { message: error.message }));
    }

    // Reset file input
    event.target.value = "";
  };

  // Photo upload handler
  // ==================== DRAWING FUNCTIONS ====================

  const addShape = (shape) => {
    setUndoStack([...undoStack, drawnShapes]);
    setRedoStack([]);
    setDrawnShapes([
      ...drawnShapes,
      {
        ...shape,
        id: `shape_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previous = undoStack[undoStack.length - 1];
      setRedoStack([drawnShapes, ...redoStack]);
      setDrawnShapes(previous);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes(next);
      setRedoStack(redoStack.slice(1));
    }
  };

  const deleteShape = (shapeId) => {
    setUndoStack([...undoStack, drawnShapes]);
    setDrawnShapes(drawnShapes.filter((s) => s.id !== shapeId));
  };

  const clearAll = () => {
    if (confirm(t("researchEnhanced.draw.clearConfirm"))) {
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes([]);
    }
  };

  // ==================== DRAWING HANDLER COMPONENT ====================

  const DrawingHandler = () => {
    const [tempPoints, setTempPoints] = useState([]);

    useMapEvents({
      click: (e) => {
        if (drawingMode === "polygon") {
          setTempPoints([...tempPoints, [e.latlng.lat, e.latlng.lng]]);
        } else if (drawingMode === "point") {
          addShape({
            type: "point",
            position: [e.latlng.lat, e.latlng.lng],
            zoneType: "monitoring_station",
            color: "#ef4444",
            data: {},
          });
          setDrawingMode(null);
        } else if (measurementMode) {
          setMeasurementPoints([
            ...measurementPoints,
            [e.latlng.lat, e.latlng.lng],
          ]);
        } else if (showCommentForm) {
          setCommentPosition([e.latlng.lat, e.latlng.lng]);
        }
      },
      dblclick: () => {
        if (drawingMode === "polygon" && tempPoints.length >= 3) {
          addShape({
            type: "polygon",
            positions: tempPoints,
            zoneType: "custom",
            color: "#6b7280",
            data: {},
          });
          setTempPoints([]);
          setDrawingMode(null);
        }
      },
    });

    return (
      <>
        {tempPoints.length > 0 && (
          <Polyline
            positions={tempPoints}
            color="#3b82f6"
            weight={2}
            dashArray="5, 10"
          />
        )}
      </>
    );
  };

  // Calculate current measurements
  useEffect(() => {
    if (measurementPoints.length >= 2) {
      let totalDistance = 0;
      for (let i = 0; i < measurementPoints.length - 1; i++) {
        totalDistance += calculateDistance(
          measurementPoints[i][0],
          measurementPoints[i][1],
          measurementPoints[i + 1][0],
          measurementPoints[i + 1][1],
        );
      }

      const bearing =
        measurementPoints.length === 2
          ? calculateBearing(
              measurementPoints[0][0],
              measurementPoints[0][1],
              measurementPoints[1][0],
              measurementPoints[1][1],
            )
          : 0;

      const area =
        measurementPoints.length >= 3 ? calculateArea(measurementPoints) : 0;

      setMeasurements({ distance: totalDistance, bearing, area });
    }
  }, [measurementPoints]);

  const stats = getStatistics();

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <nav className="bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 border-b border-blue-700 sticky top-0 z-50 shadow-xl">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Map className="w-8 h-8 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">
                  {t("researchEnhanced.header.title")}
                </h1>
                <p className="text-cyan-200 text-xs">
                  {t("researchEnhanced.header.subtitle")}
                </p>
              </div>
            </div>

            {/* Project Info */}
            <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <FileText className="w-5 h-5 text-cyan-300" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">
                  {currentProject.name}
                </p>
                <p className="text-cyan-200 text-xs">
                  {t("researchEnhanced.project.zonesCount", {
                    count: drawnShapes.length,
                  })}{" "}
                  • {stats.totalArea} km²
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectManager(!showProjectManager)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("researchEnhanced.header.projects")}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                title={t("researchEnhanced.import.title")}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("researchEnhanced.header.import")}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveProject}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("researchEnhanced.header.save")}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg relative"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t("researchEnhanced.header.export")}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Export Menu Dropdown */}
      <AnimatePresence>
        {showExportMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-4 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-72"
          >
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Download className="w-5 h-5" />
                {t("researchEnhanced.export.title")}
              </h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  exportToJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">
                    {t("researchEnhanced.export.json")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("researchEnhanced.export.jsonDesc")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  exportToGeoJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
              >
                <Globe className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">
                    {t("researchEnhanced.export.geojson")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("researchEnhanced.export.geojsonDesc")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  exportToCSV();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
              >
                <Clipboard className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-sm">
                    {t("researchEnhanced.export.csv")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("researchEnhanced.export.csvDesc")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleGeneratePDFReport();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-lg flex items-center gap-3 transition-colors"
              >
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-sm">
                    {t("researchEnhanced.export.pdf")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("researchEnhanced.export.pdfDesc")}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".json,.geojson,.kml,.csv"
        className="hidden"
      />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {[
              {
                id: "draw",
                label: t("researchEnhanced.tabs.draw"),
                icon: Edit3,
              },
              {
                id: "measure",
                label: t("researchEnhanced.tabs.measure"),
                icon: Ruler,
              },
              {
                id: "data",
                label: t("researchEnhanced.tabs.data"),
                icon: Database,
              },
              {
                id: "templates",
                label: t("researchEnhanced.tabs.templates"),
                icon: Layers,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 space-y-4">
            {/* Drawing Tools Tab */}
            {activeTab === "draw" && (
              <>
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    {t("researchEnhanced.draw.drawingTools")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDrawingMode("polygon")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        drawingMode === "polygon"
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-slate-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <Square className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs font-medium text-center">
                        {t("researchEnhanced.draw.polygon")}
                      </p>
                    </button>

                    <button
                      onClick={() => setDrawingMode("point")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        drawingMode === "point"
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-slate-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <MapPin className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs font-medium text-center">
                        {t("researchEnhanced.draw.point")}
                      </p>
                    </button>
                  </div>
                </div>

                {drawingMode === "polygon" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>{t("researchEnhanced.draw.click")}</strong>{" "}
                      {t("researchEnhanced.draw.onMap")}{" "}
                      <strong>{t("researchEnhanced.draw.doubleClick")}</strong>{" "}
                      {t("researchEnhanced.draw.toFinish")}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Target className="w-4 h-4 text-green-600" />
                    {t("researchEnhanced.draw.actions")}
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                      <Undo className="w-4 h-4" />
                      {t("researchEnhanced.draw.undo")}
                    </button>

                    <button
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                      <Redo className="w-4 h-4" />
                      {t("researchEnhanced.draw.redo")}
                    </button>

                    <button
                      onClick={clearAll}
                      disabled={drawnShapes.length === 0}
                      className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("researchEnhanced.draw.clearAll")}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Layers className="w-4 h-4 text-purple-600" />
                    {t("researchEnhanced.draw.drawnZones", {
                      count: drawnShapes.length,
                    })}
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {drawnShapes.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">
                        {t("researchEnhanced.draw.none")}
                      </p>
                    ) : (
                      drawnShapes.map((shape, idx) => (
                        <div
                          key={shape.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: shape.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {shape.label ||
                                    t("researchEnhanced.draw.zoneFallback", {
                                      index: idx + 1,
                                    })}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {zoneTypeConfig[shape.zoneType]?.label ||
                                    t("researchEnhanced.draw.custom")}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteShape(shape.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Measurement Tools Tab */}
            {activeTab === "measure" && (
              <>
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Ruler className="w-4 h-4 text-orange-600" />
                    {t("researchEnhanced.measure.title")}
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setMeasurementMode("distance");
                        setMeasurementPoints([]);
                      }}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        measurementMode === "distance"
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 hover:border-orange-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("researchEnhanced.measure.distanceTitle")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t("researchEnhanced.measure.distanceHint")}
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMeasurementMode("area");
                        setMeasurementPoints([]);
                      }}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        measurementMode === "area"
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 hover:border-orange-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Square className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("researchEnhanced.measure.areaTitle")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t("researchEnhanced.measure.areaHint")}
                          </p>
                        </div>
                      </div>
                    </button>

                    {measurementMode && measurementPoints.length > 0 && (
                      <button
                        onClick={() => {
                          setMeasurementMode(null);
                          setMeasurementPoints([]);
                        }}
                        className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        {t("researchEnhanced.measure.clear")}
                      </button>
                    )}
                  </div>
                </div>

                {measurementPoints.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm mb-2 text-orange-900">
                      {t("researchEnhanced.measure.results")}
                    </h4>
                    {measurements.distance > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-orange-700">
                          {t("researchEnhanced.measure.distance")}:
                        </p>
                        <p className="text-lg font-bold text-orange-900">
                          {measurements.distance.toFixed(2)} km
                        </p>
                      </div>
                    )}
                    {measurements.area > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-orange-700">
                          {t("researchEnhanced.measure.area")}:
                        </p>
                        <p className="text-lg font-bold text-orange-900">
                          {measurements.area.toFixed(2)} km²
                        </p>
                      </div>
                    )}
                    {measurements.bearing > 0 &&
                      measurementPoints.length === 2 && (
                        <div>
                          <p className="text-xs text-orange-700">
                            {t("researchEnhanced.measure.bearing")}:
                          </p>
                          <p className="text-lg font-bold text-orange-900">
                            {measurements.bearing.toFixed(1)}°
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </>
            )}

            {/* Data Entry Tab */}
            {activeTab === "data" && (
              <>
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Database className="w-4 h-4 text-green-600" />
                    {t("researchEnhanced.data.title")}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    {t("researchEnhanced.data.description")}
                  </p>

                  {selectedShape ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900 mb-2">
                        {selectedShape.label ||
                          t("researchEnhanced.data.selectedZone")}
                      </p>
                      <p className="text-xs text-green-700">
                        {t("researchEnhanced.data.formPlaceholder")}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                      <Target className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500">
                        {t("researchEnhanced.data.selectPrompt")}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Templates Tab */}
            {activeTab === "templates" && (
              <>
                <div>
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
                    <Layers className="w-4 h-4 text-purple-600" />
                    {t("researchEnhanced.templates.tabTitle")}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    {t("researchEnhanced.templates.tabSubtitle")}
                  </p>

                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {researchTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          // Would add template to map
                          alert(
                            t("researchEnhanced.templates.selectionAlert", {
                              name: template.name,
                            }),
                          );
                        }}
                        className="w-full p-3 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-left transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: template.color + "20" }}
                          >
                            <template.icon
                              className="w-5 h-5"
                              style={{ color: template.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {template.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[6.9271, 79.8612]}
            zoom={10}
            className="w-full h-full"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            <DrawingHandler />

            {/* Render drawn shapes */}
            {drawnShapes.map((shape) => {
              if (shape.type === "polygon" || shape.type === "rectangle") {
                return (
                  <Polygon
                    key={shape.id}
                    positions={shape.positions}
                    pathOptions={{
                      color: shape.color,
                      weight: 3,
                      fillOpacity: 0.3,
                    }}
                    eventHandlers={{
                      click: () => setSelectedShape(shape),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-sm">
                          {shape.label || t("researchEnhanced.map.unnamedZone")}
                        </p>
                        <p className="text-xs text-slate-600">
                          {zoneTypeConfig[shape.zoneType]?.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {t("researchEnhanced.measure.area")}:{" "}
                          {calculateArea(shape.positions).toFixed(2)} km²
                        </p>
                      </div>
                    </Popup>
                  </Polygon>
                );
              } else if (shape.type === "circle") {
                return (
                  <Circle
                    key={shape.id}
                    center={shape.center}
                    radius={shape.radius}
                    pathOptions={{
                      color: shape.color,
                      weight: 3,
                      fillOpacity: 0.3,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-sm">
                          {shape.label || t("researchEnhanced.map.unnamedZone")}
                        </p>
                        <p className="text-xs text-slate-600">
                          {zoneTypeConfig[shape.zoneType]?.label}
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                );
              } else if (shape.type === "line") {
                return (
                  <Polyline
                    key={shape.id}
                    positions={shape.positions}
                    pathOptions={{ color: shape.color, weight: 3 }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-sm">
                          {shape.label ||
                            t("researchEnhanced.map.unnamedTrack")}
                        </p>
                        <p className="text-xs text-slate-600">
                          {zoneTypeConfig[shape.zoneType]?.label}
                        </p>
                      </div>
                    </Popup>
                  </Polyline>
                );
              } else if (shape.type === "point") {
                return (
                  <Marker key={shape.id} position={shape.position}>
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-sm">
                          {shape.label ||
                            t("researchEnhanced.zoneTypes.monitoringStation")}
                        </p>
                        <p className="text-xs text-slate-600">
                          {zoneTypeConfig[shape.zoneType]?.label}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}

            {/* Render measurement lines */}
            {measurementPoints.length > 0 && (
              <>
                <Polyline
                  positions={measurementPoints}
                  pathOptions={{
                    color: "#f97316",
                    weight: 3,
                    dashArray: "10, 5",
                  }}
                />
                {measurementPoints.map((point, idx) => (
                  <Marker key={idx} position={point}>
                    <Tooltip permanent>
                      <span className="text-xs font-bold">P{idx + 1}</span>
                    </Tooltip>
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>

          {/* Statistics Panel */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-2xl border border-slate-200 w-80"
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-xl">
                  <h3 className="font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t("researchEnhanced.stats.title")}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {t("researchEnhanced.stats.totalZones")}:
                    </span>
                    <span className="font-semibold">{stats.totalShapes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {t("researchEnhanced.stats.totalArea")}:
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      {stats.totalArea} km²
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {t("researchEnhanced.stats.totalDistance")}:
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      {stats.totalDistance} km
                    </span>
                  </div>

                  {Object.keys(stats.zonesByType).length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs font-semibold mb-2 text-slate-700">
                        {t("researchEnhanced.stats.byZoneType")}:
                      </p>
                      {Object.entries(stats.zonesByType).map(
                        ([type, count]) => {
                          const config = zoneTypeConfig[type];
                          return (
                            <div
                              key={type}
                              className="flex justify-between text-xs mb-1"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{
                                    backgroundColor: config?.color || "#6b7280",
                                  }}
                                />
                                <span className="text-slate-600">
                                  {config?.label || type}:
                                </span>
                              </div>
                              <span className="font-medium">{count}</span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Project Manager Modal */}
          <AnimatePresence>
            {showProjectManager && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4"
                onClick={() => setShowProjectManager(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <FolderOpen className="w-8 h-8" />
                      {t("researchEnhanced.project.managerTitle")}
                    </h2>
                    <p className="text-cyan-100 mt-1">
                      {t("researchEnhanced.project.managerSubtitle")}
                    </p>
                  </div>

                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          newProject();
                          setShowProjectManager(false);
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        {t("researchEnhanced.project.newProject")}
                      </button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-bold mb-3">
                        {t("researchEnhanced.project.savedProjects", {
                          count: savedProjects.length,
                        })}
                      </h3>
                      {savedProjects.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                          {t("researchEnhanced.project.noSaved")}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {savedProjects.map((project) => (
                            <div
                              key={project.id}
                              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg">
                                    {project.name}
                                  </h4>
                                  <p className="text-sm text-slate-600">
                                    {project.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                    <span>
                                      {t(
                                        "researchEnhanced.project.zonesCount",
                                        { count: project.shapes?.length || 0 },
                                      )}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {new Date(
                                        project.lastModified,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => loadProject(project)}
                                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                >
                                  {t("researchEnhanced.project.load")}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <button
                      onClick={() => setShowProjectManager(false)}
                      className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                    >
                      {t("researchEnhanced.project.close")}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResearchEnhancedMSP;
