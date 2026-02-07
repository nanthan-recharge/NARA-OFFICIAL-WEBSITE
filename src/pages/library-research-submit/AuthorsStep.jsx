import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const AuthorsStep = ({ formData, onChange, onAuthorChange, addAuthor, removeAuthor, onBack, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-slate-700">
            Authors
          </label>
          <button
            type="button"
            onClick={addAuthor}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            <Icons.Plus className="w-4 h-4" />
            Add Author
          </button>
        </div>

        <div className="space-y-4">
          {formData.authors.map((author, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Author {index + 1}
                </span>
                {formData.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => onAuthorChange(index, 'name', e.target.value)}
                  placeholder="Full Name"
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
                <input
                  type="email"
                  value={author.email}
                  onChange={(e) => onAuthorChange(index, 'email', e.target.value)}
                  placeholder="Email"
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                />
              </div>

              <input
                type="text"
                value={author.affiliation}
                onChange={(e) => onAuthorChange(index, 'affiliation', e.target.value)}
                placeholder="Affiliation/Institution"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={author.isCorresponding}
                  onChange={(e) => onAuthorChange(index, 'isCorresponding', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700">Corresponding Author</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Publication Date
          </label>
          <input
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={onChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Journal/Conference
          </label>
          <input
            type="text"
            name="journal"
            value={formData.journal}
            onChange={onChange}
            placeholder="e.g., Marine Research Journal"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          DOI (Digital Object Identifier)
        </label>
        <input
          type="text"
          name="doi"
          value={formData.doi}
          onChange={onChange}
          placeholder="10.1234/example.2024.001"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Visibility
        </label>
        <select
          name="visibility"
          value={formData.visibility}
          onChange={onChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        >
          <option value="private">Private (Only you)</option>
          <option value="institutional">Institutional (NARA members)</option>
          <option value="public">Public (Everyone)</option>
        </select>
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
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          Review & Submit
          <Icons.ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default AuthorsStep;
