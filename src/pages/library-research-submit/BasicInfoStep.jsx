import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

const documentTypes = [
  { value: 'journal_article', label: 'Journal Article', icon: Icons.FileText },
  { value: 'thesis', label: 'Thesis/Dissertation', icon: Icons.GraduationCap },
  { value: 'report', label: 'Research Report', icon: Icons.FileBarChart },
  { value: 'conference_paper', label: 'Conference Paper', icon: Icons.Presentation },
  { value: 'book_chapter', label: 'Book Chapter', icon: Icons.BookOpen },
  { value: 'working_paper', label: 'Working Paper', icon: Icons.FileClock }
];

const BasicInfoStep = ({ formData, onChange, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Research Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          placeholder="Enter your research title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Abstract *
        </label>
        <textarea
          name="abstract"
          value={formData.abstract}
          onChange={onChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
          placeholder="Provide a brief summary of your research (200-500 words)"
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.abstract.length} characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Keywords *
        </label>
        <input
          type="text"
          name="keywords"
          value={formData.keywords}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          placeholder="climate change, marine biology, coral reefs (comma separated)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Research Area *
          </label>
          <input
            type="text"
            name="researchArea"
            value={formData.researchArea}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            placeholder="e.g., Marine Biology"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={onChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Document Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {documentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <label
                key={type.value}
                className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.documentType === type.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="documentType"
                  value={type.value}
                  checked={formData.documentType === type.value}
                  onChange={onChange}
                  className="sr-only"
                />
                <Icon className={`w-5 h-5 ${
                  formData.documentType === type.value ? 'text-purple-600' : 'text-slate-400'
                }`} />
                <span className={`text-sm font-medium ${
                  formData.documentType === type.value ? 'text-purple-900' : 'text-slate-700'
                }`}>
                  {type.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          Next: Upload Documents
          <Icons.ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default BasicInfoStep;
