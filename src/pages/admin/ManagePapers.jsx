import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { translateWithGemini } from '../../services/translationService';

/**
 * 📚 MANAGE RESEARCH PAPERS
 * View all papers and manually translate them
 */
const ManagePapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(null);
  const [message, setMessage] = useState(null);

  // Load papers
  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'researchContent'));
      const papersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by newest first
      papersList.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      
      setPapers(papersList);
    } catch (error) {
      console.error('Error loading papers:', error);
      setMessage({ type: 'error', text: '❌ Failed to load papers' });
    } finally {
      setLoading(false);
    }
  };

  // Check if paper needs translation
  const needsTranslation = (paper) => {
    const titleSi = !paper.title?.si || paper.title.si.trim() === '' || paper.title.si === ' ';
    const titleTa = !paper.title?.ta || paper.title.ta.trim() === '' || paper.title.ta === ' ';
    const descSi = !paper.description?.si || paper.description.si.trim() === '';
    const descTa = !paper.description?.ta || paper.description.ta.trim() === '';
    const absSi = !paper.abstract?.si || paper.abstract.si.trim() === '';
    const absTa = !paper.abstract?.ta || paper.abstract.ta.trim() === '';
    
    return {
      si: titleSi || descSi || absSi,
      ta: titleTa || descTa || absTa,
      any: titleSi || titleTa || descSi || descTa || absSi || absTa
    };
  };

  // Translate single paper
  const translatePaper = async (paper, languages, forceRetranslate = false) => {
    try {
      setTranslating(paper.id);
      
      const updates = {};
      const translatedFields = [];

      // Check what's available in English
      const hasTitle = paper.title?.en && paper.title.en.trim() !== '';
      const hasDesc = paper.description?.en && paper.description.en.trim() !== '';
      const hasAbstract = paper.abstract?.en && paper.abstract.en.trim() !== '';

      console.log('📊 Source content check:', { hasTitle, hasDesc, hasAbstract });

      // Translate to Sinhala
      if (languages.includes('si')) {
        setMessage({ type: 'info', text: '🇱🇰 Translating to Sinhala...' });
        
        if (hasTitle && (forceRetranslate || !paper.title?.si || paper.title.si.trim() === '' || paper.title.si === ' ')) {
          setMessage({ type: 'info', text: '📝 Translating title to Sinhala...' });
          const titleSi = await translateWithGemini(paper.title.en, 'si');
          updates['title.si'] = titleSi;
          translatedFields.push('Title (SI)');
          console.log('✅ Title SI translated:', titleSi.substring(0, 50));
        }
        
        if (hasDesc && (forceRetranslate || !paper.description?.si || paper.description.si.trim() === '')) {
          setMessage({ type: 'info', text: '📝 Translating description to Sinhala...' });
          const descSi = await translateWithGemini(paper.description.en, 'si');
          updates['description.si'] = descSi;
          translatedFields.push('Description (SI)');
          console.log('✅ Description SI translated:', descSi.substring(0, 50));
        }
        
        if (hasAbstract && (forceRetranslate || !paper.abstract?.si || paper.abstract.si.trim() === '')) {
          setMessage({ type: 'info', text: '📝 Translating abstract to Sinhala...' });
          const absSi = await translateWithGemini(paper.abstract.en, 'si');
          updates['abstract.si'] = absSi;
          translatedFields.push('Abstract (SI)');
          console.log('✅ Abstract SI translated:', absSi.substring(0, 50));
        }
      }

      // Translate to Tamil
      if (languages.includes('ta')) {
        setMessage({ type: 'info', text: '🇱🇰 Translating to Tamil...' });
        
        if (hasTitle && (forceRetranslate || !paper.title?.ta || paper.title.ta.trim() === '' || paper.title.ta === ' ')) {
          setMessage({ type: 'info', text: '📝 Translating title to Tamil...' });
          const titleTa = await translateWithGemini(paper.title.en, 'ta');
          updates['title.ta'] = titleTa;
          translatedFields.push('Title (TA)');
          console.log('✅ Title TA translated:', titleTa.substring(0, 50));
        }
        
        if (hasDesc && (forceRetranslate || !paper.description?.ta || paper.description.ta.trim() === '')) {
          setMessage({ type: 'info', text: '📝 Translating description to Tamil...' });
          const descTa = await translateWithGemini(paper.description.en, 'ta');
          updates['description.ta'] = descTa;
          translatedFields.push('Description (TA)');
          console.log('✅ Description TA translated:', descTa.substring(0, 50));
        }
        
        if (hasAbstract && (forceRetranslate || !paper.abstract?.ta || paper.abstract.ta.trim() === '')) {
          setMessage({ type: 'info', text: '📝 Translating abstract to Tamil...' });
          const absTa = await translateWithGemini(paper.abstract.en, 'ta');
          updates['abstract.ta'] = absTa;
          translatedFields.push('Abstract (TA)');
          console.log('✅ Abstract TA translated:', absTa.substring(0, 50));
        }
      }

      // Update Firestore
      if (Object.keys(updates).length > 0) {
        setMessage({ type: 'info', text: '💾 Saving to database...' });
        await updateDoc(doc(db, 'researchContent', paper.id), updates);
        
        setMessage({ 
          type: 'success', 
          text: `✅ Success! Translated: ${translatedFields.join(', ')}` 
        });
        
        console.log('💾 Saved fields:', Object.keys(updates));
        
        // Reload papers
        await loadPapers();
      } else {
        const missing = [];
        if (!hasTitle) missing.push('Title');
        if (!hasDesc) missing.push('Description');
        if (!hasAbstract) missing.push('Abstract');
        
        if (missing.length > 0) {
          setMessage({ 
            type: 'warning', 
            text: `⚠️ Missing English content: ${missing.join(', ')}. Cannot translate empty fields.` 
          });
        } else {
          setMessage({ type: 'info', text: 'ℹ️ Already translated! Use "Force Re-translate" to overwrite.' });
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
      setMessage({ type: 'error', text: `❌ Translation failed: ${error.message}` });
    } finally {
      setTranslating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Icons.BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Manage Research Papers</h1>
              <p className="text-gray-600 mt-1">View and translate papers manually</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={loadPapers}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Icons.RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <div className="px-6 py-3 bg-white rounded-lg border-2 border-gray-200">
              <span className="font-bold text-gray-900">Total Papers: {papers.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="mb-4 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Icons.Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">Field Status Legend:</p>
              <div className="flex flex-wrap gap-4 text-sm text-blue-800">
                <span><strong>T✓</strong> = Title exists in English</span>
                <span><strong>D✓</strong> = Description exists</span>
                <span><strong>A✓</strong> = Abstract exists</span>
                <span className="text-red-600"><strong>T✗ D✗ A✗</strong> = Missing (cannot translate)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-6 py-4 rounded-xl border-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-800'
                : message.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-800'
                : message.type === 'warning'
                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                : 'bg-blue-50 border-blue-300 text-blue-800'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Papers Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <Icons.Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading papers...</p>
            </div>
          ) : papers.length === 0 ? (
            <div className="p-12 text-center">
              <Icons.BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No papers uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Title</th>
                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {papers.map((paper, index) => {
                    const translation = needsTranslation(paper);
                    
                    return (
                      <tr key={paper.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <Icons.FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                              <p className="font-semibold text-gray-900">{paper.title?.en || 'Untitled'}</p>
                              <p className="text-sm text-gray-500">{paper.authors?.join(', ') || 'No authors'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {paper.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">EN</span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                translation.si ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                SI {translation.si ? '❌' : '✅'}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                translation.ta ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                TA {translation.ta ? '❌' : '✅'}
                              </span>
                            </div>
                            {/* Show which English fields exist */}
                            <div className="flex gap-1 text-xs text-gray-600">
                              <span className={paper.title?.en ? 'text-green-600' : 'text-red-500'}>
                                T{paper.title?.en ? '✓' : '✗'}
                              </span>
                              <span className={paper.description?.en ? 'text-green-600' : 'text-red-500'}>
                                D{paper.description?.en ? '✓' : '✗'}
                              </span>
                              <span className={paper.abstract?.en ? 'text-green-600' : 'text-red-500'}>
                                A{paper.abstract?.en ? '✓' : '✗'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {translation.si && (
                              <button
                                onClick={() => translatePaper(paper, ['si'])}
                                disabled={translating === paper.id}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                              >
                                {translating === paper.id ? (
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Icons.Languages className="w-4 h-4" />
                                )}
                                සිංහල
                              </button>
                            )}
                            
                            {translation.ta && (
                              <button
                                onClick={() => translatePaper(paper, ['ta'])}
                                disabled={translating === paper.id}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                              >
                                {translating === paper.id ? (
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Icons.Languages className="w-4 h-4" />
                                )}
                                தமிழ்
                              </button>
                            )}
                            
                            {translation.any && (
                              <button
                                onClick={() => translatePaper(paper, ['si', 'ta'])}
                                disabled={translating === paper.id}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                              >
                                {translating === paper.id ? (
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Icons.Languages className="w-4 h-4" />
                                )}
                                Both
                              </button>
                            )}
                            
                            {!translation.any && (
                              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                                ✅ Complete
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManagePapers;
