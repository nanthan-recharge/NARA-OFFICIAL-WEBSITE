import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Bulk Actions Floating Toolbar
 * Appears when results are selected
 */
const BulkActionsToolbar = ({ 
  selectedCount, 
  onExportExcel, 
  onDownloadAll,
  onClearSelection 
}) => {
  const { t } = useTranslation('labResults');

  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 text-white px-6 py-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            {/* Selection Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
              <Icons.CheckSquare size={18} />
              <span className="font-bold">{selectedCount}</span>
              <span className="text-sm opacity-90">selected</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Export to Excel */}
              <button
                onClick={onExportExcel}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                title="Export to Excel"
              >
                <Icons.FileSpreadsheet size={18} />
                <span className="hidden sm:inline">Export Excel</span>
              </button>

              {/* Download All as PDF */}
              <button
                onClick={onDownloadAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                title="Download as PDF"
              >
                <Icons.FileText size={18} />
                <span className="hidden sm:inline">Download PDF</span>
              </button>

              {/* Clear Selection */}
              <button
                onClick={onClearSelection}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                title="Clear Selection"
              >
                <Icons.X size={18} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkActionsToolbar;
