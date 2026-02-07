import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const UploadStep = ({ formData, onFileChange, removeSuppFile, onBack, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Main Document * (PDF, Word)
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            name="mainDocument"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
            className="hidden"
            id="mainDocument"
          />
          <label htmlFor="mainDocument" className="cursor-pointer">
            {formData.mainDocument ? (
              <div className="flex items-center justify-center gap-3">
                <Icons.FileCheck className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-slate-900">{formData.mainDocument.name}</p>
                  <p className="text-sm text-slate-500">
                    {(formData.mainDocument.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Icons.Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Click to upload main document</p>
                <p className="text-sm text-slate-500 mt-1">PDF or Word (Max 50MB)</p>
              </>
            )}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Supplementary Files (Optional)
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            name="supplementaryFiles"
            multiple
            onChange={onFileChange}
            className="hidden"
            id="supplementaryFiles"
          />
          <label htmlFor="supplementaryFiles" className="cursor-pointer">
            <Icons.Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm">Add supplementary files</p>
          </label>
        </div>

        {formData.supplementaryFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.supplementaryFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icons.File className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSuppFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.mainDocument}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Authors
          <Icons.ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default UploadStep;
