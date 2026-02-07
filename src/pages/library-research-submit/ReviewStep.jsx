import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const ReviewStep = ({ formData, loading, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icons.Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Before you submit:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Review all information for accuracy</li>
              <li>Ensure your document is in final format</li>
              <li>Check that all authors are listed correctly</li>
              <li>Your submission will be reviewed by administrators</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Research Title</h4>
          <p className="text-slate-700">{formData.title}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Abstract</h4>
          <p className="text-slate-700 text-sm line-clamp-4">{formData.abstract}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Document Type</h4>
            <p className="text-slate-700 capitalize">{formData.documentType.replace(/_/g, ' ')}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Research Area</h4>
            <p className="text-slate-700">{formData.researchArea}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.split(',').map((keyword, idx) => (
              <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {keyword.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Main Document</h4>
          <div className="flex items-center gap-2">
            <Icons.FileText className="w-4 h-4 text-slate-600" />
            <p className="text-slate-700">{formData.mainDocument?.name}</p>
          </div>
        </div>

        {formData.supplementaryFiles.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Supplementary Files ({formData.supplementaryFiles.length})</h4>
            <div className="space-y-1">
              {formData.supplementaryFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Icons.File className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-700">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Authors ({formData.authors.length})</h4>
          <div className="space-y-2">
            {formData.authors.map((author, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Icons.User className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 font-medium">{author.name}</p>
                  <p className="text-slate-600 text-xs">{author.email} • {author.affiliation}</p>
                  {author.isCorresponding && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      Corresponding
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {(formData.journal || formData.doi || formData.publicationDate) && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Publication Details</h4>
            <div className="space-y-1 text-sm">
              {formData.journal && (
                <p className="text-slate-700"><span className="font-medium">Journal:</span> {formData.journal}</p>
              )}
              {formData.doi && (
                <p className="text-slate-700"><span className="font-medium">DOI:</span> {formData.doi}</p>
              )}
              {formData.publicationDate && (
                <p className="text-slate-700"><span className="font-medium">Date:</span> {formData.publicationDate}</p>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Visibility</h4>
          <p className="text-slate-700 capitalize">{formData.visibility}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Icons.Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Icons.Send className="w-5 h-5" />
              Submit Research
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;
