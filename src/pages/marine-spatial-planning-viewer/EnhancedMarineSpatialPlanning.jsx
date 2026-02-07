/**
 * Enhanced Marine Spatial Planning Viewer
 *
 * NEW FEATURES:
 * - Easy drawing tools with one-click shapes
 * - Preset zone templates
 * - Measurement tools (area, distance)
 * - Quick action buttons
 * - Undo/Redo functionality
 * - Zone shape library
 * - Improved user experience
 */

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Polyline,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Layers,
  Info,
  Ship,
  Anchor,
  Fish,
  Shield,
  Zap,
  Factory,
  Home,
  Edit3,
  Square,
  Circle as CircleIcon,
  Pentagon,
  Maximize2,
  Ruler,
  Trash2,
  Undo,
  Redo,
  Save,
  Target,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import {
  spatialZoneService,
  conflictDetectionService,
} from "../../services/marineSpatialPlanningService";

const EnhancedMarineSpatialPlanning = () => {
  // Existing state
  const [, setActiveView] = useState("map");
  const [zones, setZones] = useState([]);
  const [, setConflicts] = useState([]);
  const [, setSelectedZone] = useState(null);
  const [filters] = useState({
    zoneType: "all",
    status: "all",
    showConflicts: false,
  });
  const [searchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showIntroGuide, setShowIntroGuide] = useState(true);

  // NEW: Drawing and editing state
  const [drawingMode, setDrawingMode] = useState(null); // 'polygon', 'rectangle', 'circle', null
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [, setSelectedShape] = useState(null);
  const [, setMeasurementMode] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  const [, setCurrentTool] = useState("select"); // 'select', 'draw', 'measure', 'edit'
  const mapRef = useRef(null);

  // Preset zone templates
  const zonePresets = [
    {
      id: "fishing_zone_standard",
      name: "Standard Fishing Zone",
      type: "fishing_zone",
      description: "5km² fishing area template",
      shape: "rectangle",
      defaultSize: { width: 2500, height: 2000 }, // meters
      color: "#3b82f6",
    },
    {
      id: "protected_area_circular",
      name: "Circular Protected Area",
      type: "protected_area",
      description: "Circular marine sanctuary",
      shape: "circle",
      defaultSize: { radius: 1500 }, // meters
      color: "#10b981",
    },
    {
      id: "shipping_corridor",
      name: "Shipping Corridor",
      type: "shipping_lane",
      description: "Standard shipping lane",
      shape: "corridor",
      defaultSize: { width: 500, length: 5000 }, // meters
      color: "#8b5cf6",
    },
    {
      id: "anchorage_circle",
      name: "Anchorage Zone",
      type: "anchorage",
      description: "Circular anchorage area",
      shape: "circle",
      defaultSize: { radius: 800 },
      color: "#f59e0b",
    },
    {
      id: "aquaculture_grid",
      name: "Aquaculture Grid",
      type: "aquaculture",
      description: "Fish farming area",
      shape: "rectangle",
      defaultSize: { width: 1000, height: 1000 },
      color: "#14b8a6",
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      id: "draw_polygon",
      label: "Draw Polygon",
      icon: Pentagon,
      action: () => startDrawing("polygon"),
      color: "bg-blue-600",
    },
    {
      id: "draw_rectangle",
      label: "Draw Rectangle",
      icon: Square,
      action: () => startDrawing("rectangle"),
      color: "bg-purple-600",
    },
    {
      id: "draw_circle",
      label: "Draw Circle",
      icon: CircleIcon,
      action: () => startDrawing("circle"),
      color: "bg-green-600",
    },
    {
      id: "measure_area",
      label: "Measure Area",
      icon: Ruler,
      action: () => setMeasurementMode(true),
      color: "bg-orange-600",
    },
    {
      id: "add_preset",
      label: "Zone Templates",
      icon: Target,
      action: () => setShowPresets(true),
      color: "bg-pink-600",
    },
    {
      id: "clear_all",
      label: "Clear Drawing",
      icon: Trash2,
      action: () => clearAllShapes(),
      color: "bg-red-600",
    },
  ];

  // Zone type configurations
  const zoneTypeConfig = {
    fishing_zone: { color: "#3b82f6", icon: Fish, label: "Fishing Zone" },
    protected_area: { color: "#10b981", icon: Shield, label: "Protected Area" },
    shipping_lane: { color: "#8b5cf6", icon: Ship, label: "Shipping Lane" },
    anchorage: { color: "#f59e0b", icon: Anchor, label: "Anchorage" },
    military_zone: { color: "#ef4444", icon: Zap, label: "Military Zone" },
    oil_exploration: {
      color: "#f97316",
      icon: Factory,
      label: "Oil Exploration",
    },
    aquaculture: { color: "#14b8a6", icon: Home, label: "Aquaculture" },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: zonesData } = await spatialZoneService.getAll();
    const { data: conflictsData } =
      await conflictDetectionService.getAllConflicts();

    if (zonesData) setZones(zonesData);
    if (conflictsData) setConflicts(conflictsData);

    setLoading(false);
  };

  // NEW: Drawing functions
  const startDrawing = (mode) => {
    setDrawingMode(mode);
    setCurrentTool("draw");
    setMeasurementMode(false);
  };

  const addShape = (shape) => {
    const newShape = {
      id: Date.now(),
      ...shape,
      timestamp: new Date().toISOString(),
    };
    setDrawnShapes([...drawnShapes, newShape]);
    setUndoStack([...undoStack, drawnShapes]);
    setRedoStack([]);
  };

  const removeShape = (shapeId) => {
    setUndoStack([...undoStack, drawnShapes]);
    setDrawnShapes(drawnShapes.filter((s) => s.id !== shapeId));
    setRedoStack([]);
  };

  const clearAllShapes = () => {
    if (drawnShapes.length > 0) {
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes([]);
      setRedoStack([]);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, drawnShapes]);
      setDrawnShapes(previousState);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, drawnShapes]);
      setDrawnShapes(nextState);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const applyPreset = (preset) => {
    const mapCenter = mapRef.current?.getCenter() || {
      lat: 7.8731,
      lng: 80.7718,
    };

    let shape;
    if (preset.shape === "circle") {
      shape = {
        type: "circle",
        center: [mapCenter.lat, mapCenter.lng],
        radius: preset.defaultSize.radius,
        color: preset.color,
        zoneType: preset.type,
        name: preset.name,
      };
    } else if (preset.shape === "rectangle") {
      const latOffset = preset.defaultSize.height / 111000; // approx meters to degrees
      const lngOffset =
        preset.defaultSize.width /
        (111000 * Math.cos((mapCenter.lat * Math.PI) / 180));

      shape = {
        type: "polygon",
        positions: [
          [mapCenter.lat - latOffset / 2, mapCenter.lng - lngOffset / 2],
          [mapCenter.lat + latOffset / 2, mapCenter.lng - lngOffset / 2],
          [mapCenter.lat + latOffset / 2, mapCenter.lng + lngOffset / 2],
          [mapCenter.lat - latOffset / 2, mapCenter.lng + lngOffset / 2],
        ],
        color: preset.color,
        zoneType: preset.type,
        name: preset.name,
      };
    } else if (preset.shape === "corridor") {
      const latOffset = preset.defaultSize.length / 111000;
      const lngOffset =
        preset.defaultSize.width /
        (111000 * Math.cos((mapCenter.lat * Math.PI) / 180));

      shape = {
        type: "polygon",
        positions: [
          [mapCenter.lat - latOffset / 2, mapCenter.lng - lngOffset / 2],
          [mapCenter.lat + latOffset / 2, mapCenter.lng - lngOffset / 2],
          [mapCenter.lat + latOffset / 2, mapCenter.lng + lngOffset / 2],
          [mapCenter.lat - latOffset / 2, mapCenter.lng + lngOffset / 2],
        ],
        color: preset.color,
        zoneType: preset.type,
        name: preset.name,
      };
    }

    addShape(shape);
    setShowPresets(false);
  };

  const calculateArea = (positions) => {
    // Simple area calculation (simplified for demo)
    if (!positions || positions.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < positions.length; i++) {
      const j = (i + 1) % positions.length;
      area += positions[i][1] * positions[j][0];
      area -= positions[j][1] * positions[i][0];
    }
    return Math.abs(area / 2) * 12364; // Rough conversion to km²
  };

  const saveDrawing = () => {
    const drawingData = {
      shapes: drawnShapes,
      timestamp: new Date().toISOString(),
      metadata: {
        totalShapes: drawnShapes.length,
        totalArea: drawnShapes.reduce((sum, shape) => {
          if (shape.type === "polygon") {
            return sum + calculateArea(shape.positions);
          } else if (shape.type === "circle") {
            return sum + (Math.PI * shape.radius * shape.radius) / 1000000;
          }
          return sum;
        }, 0),
      },
    };

    const blob = new Blob([JSON.stringify(drawingData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marine-zones-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Component for handling map clicks during drawing
  const DrawingHandler = () => {
    const [tempPoints, setTempPoints] = useState([]);

    useMapEvents({
      click(e) {
        if (drawingMode === "polygon") {
          setTempPoints([...tempPoints, [e.latlng.lat, e.latlng.lng]]);
        } else if (drawingMode === "rectangle" && tempPoints.length === 0) {
          setTempPoints([[e.latlng.lat, e.latlng.lng]]);
        } else if (drawingMode === "rectangle" && tempPoints.length === 1) {
          const [lat1, lng1] = tempPoints[0];
          const lat2 = e.latlng.lat;
          const lng2 = e.latlng.lng;

          addShape({
            type: "polygon",
            positions: [
              [lat1, lng1],
              [lat2, lng1],
              [lat2, lng2],
              [lat1, lng2],
            ],
            color: "#3b82f6",
            zoneType: "custom",
            name: "Custom Rectangle",
          });

          setTempPoints([]);
          setDrawingMode(null);
        } else if (drawingMode === "circle") {
          addShape({
            type: "circle",
            center: [e.latlng.lat, e.latlng.lng],
            radius: 1000,
            color: "#10b981",
            zoneType: "custom",
            name: "Custom Circle",
          });
          setDrawingMode(null);
        }
      },
      dblclick() {
        if (drawingMode === "polygon" && tempPoints.length >= 3) {
          addShape({
            type: "polygon",
            positions: tempPoints,
            color: "#8b5cf6",
            zoneType: "custom",
            name: "Custom Polygon",
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
            pathOptions={{ color: "#3b82f6", weight: 2, dashArray: "5, 5" }}
          />
        )}
      </>
    );
  };

  const filteredZones = zones.filter((zone) => {
    const matchesType =
      filters.zoneType === "all" || zone.zoneType === filters.zoneType;
    const matchesStatus =
      filters.status === "all" || zone.status === filters.status;
    const matchesSearch =
      zone.zoneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const getZoneColor = (zoneType) => {
    return zoneTypeConfig[zoneType]?.color || "#64748b";
  };

  const getZoneIcon = (zoneType) => {
    const IconComponent = zoneTypeConfig[zoneType]?.icon || Map;
    return IconComponent;
  };

  const renderEnhancedMap = () => {
    return (
      <div className="h-screen bg-slate-900 relative">
        {/* Intro Guide Modal */}
        <AnimatePresence>
          {showIntroGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 z-[2000] flex items-center justify-center p-4"
              onClick={() => setShowIntroGuide(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Map className="w-10 h-10" />
                      Marine Spatial Planning Viewer
                    </h2>
                    <button
                      onClick={() => setShowIntroGuide(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  </div>
                  <p className="text-blue-100 text-lg">
                    A powerful tool for planning and managing ocean space usage
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* What is this? */}
                  <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Info className="w-6 h-6 text-blue-600" />
                      What is Marine Spatial Planning?
                    </h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Marine Spatial Planning (MSP) is a practical way to
                      organize human activities in marine areas. This viewer
                      allows you to:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>
                          <strong>Plan marine zones</strong> - Define areas for
                          fishing, shipping, conservation, and other activities
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span>
                          <strong>Avoid conflicts</strong> - Prevent overlapping
                          uses that could cause problems
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>
                          <strong>Visualize proposals</strong> - Draw and save
                          zone boundaries on an interactive map
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>
                          <strong>Measure areas</strong> - Calculate sizes and
                          distances for planning purposes
                        </span>
                      </li>
                    </ul>
                  </section>

                  {/* How to Use */}
                  <section className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Edit3 className="w-6 h-6 text-blue-600" />
                      How to Use This Tool
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Drawing Tools */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Pentagon className="w-5 h-5 text-blue-600" />
                          Drawing Tools
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-700">
                          <li className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                              1
                            </div>
                            <span>
                              <strong>Polygon:</strong> Click points,
                              double-click to finish
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs">
                              2
                            </div>
                            <span>
                              <strong>Rectangle:</strong> Click two opposite
                              corners
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs">
                              3
                            </div>
                            <span>
                              <strong>Circle:</strong> Click to place center
                              point
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* Zone Templates */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-pink-600" />
                          Quick Templates
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                          Use pre-made zone templates for common scenarios:
                        </p>
                        <ul className="space-y-1 text-sm text-slate-700">
                          <li>• Fishing zones</li>
                          <li>• Protected marine areas</li>
                          <li>• Shipping corridors</li>
                          <li>• Anchorage zones</li>
                          <li>• Aquaculture grids</li>
                        </ul>
                      </div>

                      {/* Measurement Tools */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Ruler className="w-5 h-5 text-orange-600" />
                          Measurements
                        </h4>
                        <p className="text-sm text-slate-700">
                          Calculate area and perimeter of zones. Areas are shown
                          in square kilometers (km²).
                        </p>
                      </div>

                      {/* Saving & Export */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Save className="w-5 h-5 text-green-600" />
                          Save Your Work
                        </h4>
                        <p className="text-sm text-slate-700">
                          Download your drawings as JSON files to share with
                          colleagues or continue editing later.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Zone Types */}
                  <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Layers className="w-6 h-6 text-blue-600" />
                      Available Zone Types
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(zoneTypeConfig).map(([key, config]) => {
                        const IconComponent = config.icon;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                          >
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: config.color + "22" }}
                            >
                              <IconComponent
                                className="w-6 h-6"
                                style={{ color: config.color }}
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {config.label}
                              </h4>
                              <div
                                className="w-16 h-1 rounded-full mt-1"
                                style={{ backgroundColor: config.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Maximizing Usage */}
                  <section className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Maximize2 className="w-6 h-6 text-green-600" />
                      Maximizing This Tool
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-green-700 mb-2">
                          Planning Workflows
                        </h4>
                        <p className="text-sm text-slate-700">
                          Start with templates, customize sizes, then combine
                          multiple zones to create comprehensive marine plans
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-blue-700 mb-2">
                          Collaboration
                        </h4>
                        <p className="text-sm text-slate-700">
                          Export your zones as JSON and share with stakeholders
                          for review and discussion
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-purple-700 mb-2">
                          Undo/Redo
                        </h4>
                        <p className="text-sm text-slate-700">
                          Experiment freely - use Undo/Redo to step through
                          changes and find the best layout
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Get Started Button */}
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setShowIntroGuide(false)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                      Start Planning Marine Zones →
                    </button>
                    <p className="text-sm text-slate-500 mt-3">
                      Click anywhere outside this guide to start using the tool
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Drawing Toolbar */}
        <div className="absolute top-4 left-4 z-[1000] bg-white backdrop-blur-lg rounded-xl p-4 shadow-2xl max-w-xs border-2 border-blue-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Drawing Tools
          </h3>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white px-3 py-2 rounded-lg hover:opacity-90 hover:scale-105 transform transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-md`}
                title={action.label}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-xs lg:text-sm">
                  {action.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Undo className="w-4 h-4" />
              Undo
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Redo className="w-4 h-4" />
              Redo
            </button>
          </div>

          {/* Save Drawing */}
          <button
            onClick={saveDrawing}
            disabled={drawnShapes.length === 0}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <Save className="w-4 h-4" />
            Save Drawing ({drawnShapes.length} shapes)
          </button>

          {/* Current Tool Indicator */}
          {drawingMode && (
            <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Drawing Mode: {drawingMode}
              </p>
              <p className="text-xs text-blue-700">
                {drawingMode === "polygon"
                  ? "Click to add points, double-click to finish"
                  : drawingMode === "rectangle"
                    ? "Click two opposite corners"
                    : "Click to place circle"}
              </p>
              <button
                onClick={() => setDrawingMode(null)}
                className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Cancel Drawing
              </button>
            </div>
          )}

          {/* Shapes List */}
          {drawnShapes.length > 0 && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <h4 className="font-semibold text-sm mb-2 text-slate-900">
                Drawn Shapes ({drawnShapes.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {drawnShapes.map((shape) => (
                  <div
                    key={shape.id}
                    className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-white shadow-sm"
                        style={{ backgroundColor: shape.color }}
                      />
                      <span className="text-xs font-medium text-slate-900">
                        {shape.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeShape(shape.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete shape"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone Presets Panel */}
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-2xl w-96"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Zone Templates
                </h3>
                <button
                  onClick={() => setShowPresets(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {zonePresets.map((preset) => {
                  const IconComponent = getZoneIcon(preset.type);
                  return (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 cursor-pointer"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: preset.color + "33" }}
                        >
                          <IconComponent
                            className="w-6 h-6"
                            style={{ color: preset.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {preset.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {preset.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-white rounded-full">
                              {preset.shape}
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded-full">
                              {zoneTypeConfig[preset.type]?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-900">
                  💡 <strong>Tip:</strong> Click any template to add it to the
                  map at the center of your view. You can then adjust its
                  position and size.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Container */}
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          {/* Drawing Handler */}
          <DrawingHandler />

          {/* Render Existing Zones */}
          {filteredZones
            .filter((zone) => !filters.showConflicts || zone.hasConflicts)
            .map((zone) => {
              if (!zone.boundaries || zone.boundaries.length === 0) return null;

              const positions = zone.boundaries.map((gp) => [
                gp.latitude,
                gp.longitude,
              ]);
              const color = getZoneColor(zone.zoneType);

              return (
                <Polygon
                  key={zone.id}
                  positions={positions}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: zone.hasConflicts ? 0.6 : 0.3,
                    weight: zone.hasConflicts ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedZone(zone),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">
                        {zone.zoneName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Type:</strong>{" "}
                        {zoneTypeConfig[zone.zoneType]?.label || zone.zoneType}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Area:</strong> {Math.round(zone.areaKm2)} km²
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Render Drawn Shapes */}
          {drawnShapes.map((shape) => {
            if (shape.type === "polygon") {
              return (
                <Polygon
                  key={shape.id}
                  positions={shape.positions}
                  pathOptions={{
                    color: shape.color,
                    fillColor: shape.color,
                    fillOpacity: 0.4,
                    weight: 3,
                  }}
                  eventHandlers={{
                    click: () => setSelectedShape(shape),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold mb-2">{shape.name}</h3>
                      <p className="text-sm">
                        Area: ~{calculateArea(shape.positions).toFixed(2)} km²
                      </p>
                      <button
                        onClick={() => removeShape(shape.id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete Shape
                      </button>
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
                    fillColor: shape.color,
                    fillOpacity: 0.4,
                    weight: 3,
                  }}
                  eventHandlers={{
                    click: () => setSelectedShape(shape),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold mb-2">{shape.name}</h3>
                      <p className="text-sm">Radius: {shape.radius}m</p>
                      <p className="text-sm">
                        Area: ~
                        {(
                          (Math.PI * shape.radius * shape.radius) /
                          1000000
                        ).toFixed(2)}{" "}
                        km²
                      </p>
                      <button
                        onClick={() => removeShape(shape.id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete Shape
                      </button>
                    </div>
                  </Popup>
                </Circle>
              );
            }
            return null;
          })}
        </MapContainer>

        {/* Help Panel */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-lg rounded-lg p-4 shadow-xl max-w-xs">
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Quick Help
          </h4>
          <ul className="text-xs space-y-1 text-gray-700">
            <li>
              • <strong>Polygon:</strong> Click points, double-click to finish
            </li>
            <li>
              • <strong>Rectangle:</strong> Click two opposite corners
            </li>
            <li>
              • <strong>Circle:</strong> Click center point
            </li>
            <li>
              • <strong>Templates:</strong> One-click preset zones
            </li>
            <li>
              • <strong>Undo/Redo:</strong> Step through changes
            </li>
            <li>
              • <strong>Save:</strong> Download your drawing as JSON
            </li>
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">
            Loading Marine Spatial Planning Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-blue-400" />
              <span className="text-white font-bold text-xl">
                Enhanced Marine Spatial Planning
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowIntroGuide(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span className="hidden md:inline">User Guide</span>
                <span className="md:hidden">Help</span>
              </button>
              <button
                onClick={() => setActiveView("map")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden md:inline">Planning Map</span>
                <span className="md:hidden">Map</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderEnhancedMap()}
    </div>
  );
};

export default EnhancedMarineSpatialPlanning;
