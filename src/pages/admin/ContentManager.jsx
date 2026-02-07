import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as Icons from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../i18n';
import { generateDivisionImagesWithGemini } from '../../services/geminiNativeImageService';

const LANGUAGE_LABELS = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்'
};

const EMPTY_HERO_TRANSLATION = {
  badge: '',
  subheading: '',
  title: '',
  highlight: '',
  description: '',
  primaryCtaLabel: '',
  primaryCtaIcon: 'Map',
  secondaryCtaLabel: '',
  secondaryCtaIcon: 'Heart',
  leftStatLabel: '',
  leftStatValue: '',
  rightStatLabel: '',
  rightStatValue: '',
  image: ''
};

const normalizeContent = (rawContent = {}) => {
  const cloned = JSON.parse(JSON.stringify(rawContent));
  cloned.hero = cloned.hero ?? {};
  cloned.hero.translations = cloned.hero.translations ?? {};

  if (!Array.isArray(cloned.hero.images)) {
    cloned.hero.images = [];
  }

  AVAILABLE_LANGUAGES.forEach(({ code }) => {
    cloned.hero.translations[code] = {
      ...EMPTY_HERO_TRANSLATION,
      ...cloned.hero.translations[code]
    };
  });

  if (cloned.hero.title && !cloned.hero.translations.en.title) {
    cloned.hero.translations.en = {
      ...cloned.hero.translations.en,
      badge: cloned.hero.badge ?? '',
      subheading: cloned.hero.subtitle ?? cloned.hero.subheading ?? '',
      title: cloned.hero.title ?? '',
      highlight: cloned.hero.highlight ?? '',
      description: cloned.hero.description ?? '',
      primaryCtaLabel: cloned.hero.ctaText ?? cloned.hero.primaryCtaLabel ?? '',
      secondaryCtaLabel: cloned.hero.secondaryCtaLabel ?? '',
      leftStatLabel: cloned.hero.leftStatLabel ?? '',
      leftStatValue: cloned.hero.leftStatValue ?? '',
      rightStatLabel: cloned.hero.rightStatLabel ?? '',
      rightStatValue: cloned.hero.rightStatValue ?? '',
      image: cloned.hero.image ?? '',
      images: Array.isArray(cloned.hero.images) ? cloned.hero.images : []
    };
  }

  const english = cloned.hero.translations.en ?? EMPTY_HERO_TRANSLATION;
  cloned.hero = {
    ...cloned.hero,
    badge: english.badge,
    subheading: english.subheading,
    title: english.title,
    highlight: english.highlight,
    description: english.description,
    primaryCtaLabel: english.primaryCtaLabel,
    secondaryCtaLabel: english.secondaryCtaLabel,
    leftStatLabel: english.leftStatLabel,
    leftStatValue: english.leftStatValue,
    rightStatLabel: english.rightStatLabel,
    rightStatValue: english.rightStatValue,
    image: english.image,
    images: (cloned.hero.images && cloned.hero.images.length ? cloned.hero.images : english.images?.filter(Boolean)) ?? [],
    translations: cloned.hero.translations
  };

  cloned.metadata = cloned.metadata ?? {
    title: '',
    description: '',
    keywords: ''
  };

  return cloned;
};

const ContentManager = () => {
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeHeroLanguage, setActiveHeroLanguage] = useState('en');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingWithPollinations, setGeneratingWithPollinations] = useState(false);
  const [generatingWithGemini, setGeneratingWithGemini] = useState(false);

  const pages = [
    { id: 'homepage', name: 'Homepage', icon: Icons.Home },
    { id: 'research', name: 'Research Portal', icon: Icons.FlaskConical },
    { id: 'ocean-intelligence', name: 'Ocean Intelligence', icon: Icons.Waves },
    { id: 'emergency', name: 'Emergency Response', icon: Icons.AlertTriangle },
    { id: 'learning', name: 'Learning Academy', icon: Icons.GraduationCap },
    { id: 'regional-impact-network', name: 'Regional Impact Network', icon: Icons.Globe },
    { id: 'maritime', name: 'Maritime Services', icon: Icons.Ship },
    { id: 'knowledge', name: 'Knowledge Center', icon: Icons.BookOpen },
    { id: 'partnership', name: 'Partnership Gateway', icon: Icons.Handshake },
    { id: 'nara-news-updates-center', name: 'News & Updates Center', icon: Icons.Newspaper },
    { id: 'integration-systems-platform', name: 'Integration Systems Platform', icon: Icons.CircuitBoard }
  ];

  useEffect(() => {
    fetchPageContent(selectedPage);
    setActiveHeroLanguage('en');
  }, [selectedPage]);

  const fetchPageContent = async (pageId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pageContent', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(normalizeContent(docSnap.data()));
      } else {
        setContent(
          normalizeContent({
            hero: {},
            sections: [],
            metadata: {
              title: '',
              description: '',
              keywords: ''
            }
          })
        );
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('💾 Saving changes...');

    try {
      console.log('🔵 Starting save operation...');
      console.log('📄 Selected page:', selectedPage);

      const docRef = doc(db, 'pageContent', selectedPage);
      const heroTranslations = content.hero?.translations ?? {};
      const englishHero = heroTranslations.en ?? EMPTY_HERO_TRANSLATION;

      console.log('📝 Hero image URL:', englishHero.image);
      console.log('📝 Hero translations:', Object.keys(heroTranslations));

      const payload = {
        ...content,
        hero: {
          ...content.hero,
          badge: englishHero.badge,
          subheading: englishHero.subheading,
          title: englishHero.title,
          highlight: englishHero.highlight,
          description: englishHero.description,
          primaryCtaLabel: englishHero.primaryCtaLabel,
          secondaryCtaLabel: englishHero.secondaryCtaLabel,
          leftStatLabel: englishHero.leftStatLabel,
          leftStatValue: englishHero.leftStatValue,
          rightStatLabel: englishHero.rightStatLabel,
          rightStatValue: englishHero.rightStatValue,
          image: englishHero.image,
          translations: heroTranslations
        },
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      };

      console.log('💾 Attempting to save to Firestore...');

      try {
        await updateDoc(docRef, payload);
        console.log('✅ Document updated successfully');
      } catch (updateError) {
        console.log('⚠️ Update failed, attempting setDoc...', updateError.code);
        if (updateError.code === 'not-found') {
          await setDoc(docRef, payload, { merge: true });
          console.log('✅ Document created successfully');
        } else {
          throw updateError;
        }
      }

      setMessage('✅ Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      console.log('🎉 Save operation complete!');
    } catch (error) {
      console.error('❌ Error saving content:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      setMessage(`❌ Error: ${error.message}. Check console for details.`);
      setTimeout(() => setMessage(''), 5000);
    }
    setSaving(false);
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    const updated = { ...content };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setContent(updated);
  };

  const heroImages = content.hero?.images ?? [];

  const handleHeroImageChange = (index, value) => {
    const updated = [...heroImages];
    updated[index] = value;
    updateField('hero.images', updated);
  };

  const handleAddHeroImage = () => {
    updateField('hero.images', [...heroImages, '']);
  };

  const handleRemoveHeroImage = (index) => {
    const updated = heroImages.filter((_, idx) => idx !== index);
    updateField('hero.images', updated);
  };

  const handleHeroTranslationChange = (field, value) => {
    setContent((prev) => {
      const next = {
        ...prev,
        hero: {
          ...prev.hero,
          translations: {
            ...prev.hero?.translations,
            [activeHeroLanguage]: {
              ...prev.hero?.translations?.[activeHeroLanguage],
              [field]: value
            }
          }
        }
      };

      if (activeHeroLanguage === 'en') {
        const english = next.hero.translations.en ?? EMPTY_HERO_TRANSLATION;
        next.hero = {
          ...next.hero,
          badge: english.badge,
          subheading: english.subheading,
          title: english.title,
          highlight: english.highlight,
          description: english.description,
          primaryCtaLabel: english.primaryCtaLabel,
          secondaryCtaLabel: english.secondaryCtaLabel,
          leftStatLabel: english.leftStatLabel,
          leftStatValue: english.leftStatValue,
          rightStatLabel: english.rightStatLabel,
          rightStatValue: english.rightStatValue,
          image: english.image
        };
      }

      return next;
    });
  };

  const heroTranslations = content.hero?.translations ?? {};
  const currentHero = heroTranslations[activeHeroLanguage] ?? EMPTY_HERO_TRANSLATION;

  // AI Image Generation Functions
  const handleGenerateWithPollinations = async () => {
    if (!aiPrompt.trim()) {
      setMessage('Please enter a prompt first!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Set loading state IMMEDIATELY to prevent double-clicks
    setGeneratingWithPollinations(true);
    setGeneratingAI(true);
    setMessage('🎨 Generating image with Pollinations AI (Free)...');

    try {
      const enhancedPrompt = `${aiPrompt}. STYLE: Professional photography, coastal research, Sri Lankan marine environment, 8K quality, National Geographic style.`;
      const seed = Date.now();
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1920&height=1080&seed=${seed}&enhance=true&model=flux`;

      // Set the generated URL directly
      handleHeroTranslationChange('image', pollinationsUrl);
      setMessage('✅ Pollinations AI image generated! URL set in Hero Image field.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }

    setGeneratingWithPollinations(false);
    setGeneratingAI(false);
  };

  const handleGenerateWithGemini = async () => {
    if (!aiPrompt.trim()) {
      setMessage('⚠️ Please enter a prompt first!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Set loading state IMMEDIATELY to prevent double-clicks
    setGeneratingWithGemini(true);
    setGeneratingAI(true);
    setMessage('🎨 Generating image with Gemini 2.5 Flash... This may take 30-60 seconds.');

    try {
      console.log('🔵 Starting Gemini generation...');
      console.log('📝 Prompt:', aiPrompt);

      const enhancedPrompt = `${aiPrompt}. STYLE: Professional photography, coastal research, Sri Lankan marine environment, 8K quality, National Geographic style.`;
      console.log('📝 Enhanced prompt:', enhancedPrompt);

      // Generate with Gemini
      console.log('🎨 Calling Gemini API...');
      const results = await generateDivisionImagesWithGemini([enhancedPrompt], selectedPage);
      console.log('✅ Gemini API response:', results);

      if (results && results.length > 0 && results[0].success) {
        const result = results[0];
        console.log('✅ Image generated successfully');
        console.log('📊 Image size:', result.base64Data?.length, 'bytes');

        // Upload to Firebase Storage
        const timestamp = Date.now();
        const filename = `${selectedPage}_gemini_${timestamp}.png`;
        const storageRef = ref(storage, `pages/${selectedPage}/${filename}`);
        console.log('📤 Upload path:', storageRef.fullPath);

        // Clean base64 string
        let cleanBase64 = result.base64Data;
        if (cleanBase64.includes(',')) {
          cleanBase64 = cleanBase64.split(',')[1];
        }

        setMessage('📤 Uploading to Firebase Storage...');
        console.log('📤 Uploading to Firebase Storage...');

        const uploadResult = await uploadString(storageRef, cleanBase64, 'base64', {
          contentType: result.mimeType || 'image/png'
        });
        console.log('✅ Upload successful');

        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('✅ Download URL:', downloadURL);

        // Set the Firebase URL
        handleHeroTranslationChange('image', downloadURL);
        setMessage('✅ Gemini AI image generated and uploaded! Click "Save Changes" to save.');
        setTimeout(() => setMessage(''), 8000);
        console.log('🎉 Gemini generation complete!');
      } else {
        console.error('❌ Gemini generation failed:', results);
        throw new Error('Failed to generate image with Gemini. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Gemini Error:', error);
      console.error('❌ Error stack:', error.stack);
      setMessage(`❌ Gemini Error: ${error.message}. Check console for details.`);
      setTimeout(() => setMessage(''), 8000);
    }

    setGeneratingWithGemini(false);
    setGeneratingAI(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Manager</h1>
          <p className="text-slate-500 mt-1">Edit and manage all website content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#003366] to-[#0066CC] hover:from-[#002244] hover:to-[#003366] text-white rounded-lg transition-all shadow-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Icons.Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icons.Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-500/50 rounded-lg text-green-600">
          <Icons.CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-4">
            <h3 className="text-slate-900 font-semibold mb-4">Select Page</h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedPage === page.id
                      ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{page.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-[#0066CC]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <Icons.Layout className="w-5 h-5 text-[#0066CC]" />
                      Hero Section
                    </h3>
                    <div className="flex items-center gap-2">
                      {AVAILABLE_LANGUAGES.map(({ code }) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setActiveHeroLanguage(code)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            activeHeroLanguage === code
                              ? 'bg-[#0066CC] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                        >
                          {LANGUAGE_LABELS[code]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Badge / Eyebrow</label>
                      <input
                        type="text"
                        value={currentHero.badge}
                        onChange={(e) => handleHeroTranslationChange('badge', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Regional Network"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Supporting Title</label>
                      <input
                        type="text"
                        value={currentHero.subheading}
                        onChange={(e) => handleHeroTranslationChange('subheading', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Island-wide Impact"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-2">Headline</label>
                      <input
                        type="text"
                        value={currentHero.title}
                        onChange={(e) => handleHeroTranslationChange('title', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Connecting Communities Through"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-2">Highlight</label>
                      <input
                        type="text"
                        value={currentHero.highlight}
                        onChange={(e) => handleHeroTranslationChange('highlight', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Ocean Science"
                      />
                    </div>

                    <div className="lg:col-span-2 space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-700">Hero Image Gallery</h4>
                        <button
                          type="button"
                          onClick={handleAddHeroImage}
                          className="px-3 py-1.5 rounded bg-slate-100 text-xs font-cta text-slate-900 hover:bg-slate-200"
                        >
                          <Icons.Plus className="inline w-3.5 h-3.5 mr-1" /> Add image
                        </button>
                      </div>
                      {heroImages?.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No gallery images configured. Add one or more image URLs to enable the hero carousel.
                        </p>
                      ) : null}
                      <div className="space-y-2">
                        {heroImages?.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => handleHeroImageChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                              placeholder="https://example.com/hero-image.jpg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHeroImage(index)}
                              className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:text-slate-900"
                              aria-label="Remove image"
                            >
                              <Icons.Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                      <textarea
                        value={currentHero.description}
                        onChange={(e) => handleHeroTranslationChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="High-level description for this language"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Primary CTA Label</label>
                      <input
                        type="text"
                        value={currentHero.primaryCtaLabel}
                        onChange={(e) => handleHeroTranslationChange('primaryCtaLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Explore Centers"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Secondary CTA Label</label>
                      <input
                        type="text"
                        value={currentHero.secondaryCtaLabel}
                        onChange={(e) => handleHeroTranslationChange('secondaryCtaLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Impact Stories"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Left Stat Label</label>
                      <input
                        type="text"
                        value={currentHero.leftStatLabel}
                        onChange={(e) => handleHeroTranslationChange('leftStatLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Communities served"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Left Stat Value</label>
                      <input
                        type="text"
                        value={currentHero.leftStatValue}
                        onChange={(e) => handleHeroTranslationChange('leftStatValue', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="61"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Right Stat Label</label>
                      <input
                        type="text"
                        value={currentHero.rightStatLabel}
                        onChange={(e) => handleHeroTranslationChange('rightStatLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Safety record"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Right Stat Value</label>
                      <input
                        type="text"
                        value={currentHero.rightStatValue}
                        onChange={(e) => handleHeroTranslationChange('rightStatValue', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="100%"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-2">Hero Image URL</label>
                      <input
                        type="text"
                        value={currentHero.image}
                        onChange={(e) => handleHeroTranslationChange('image', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="https://..."
                      />

                      {/* AI Image Generation */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Icons.Sparkles className="w-5 h-5 text-purple-400" />
                          <h4 className="text-sm font-semibold text-purple-200">AI Image Generator</h4>
                          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">FREE</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                              Describe the image you want <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                              placeholder="e.g., Sri Lankan researchers conducting marine biodiversity survey in coastal waters"
                              rows={2}
                              disabled={generatingAI}
                            />
                            {!aiPrompt.trim() && (
                              <p className="text-xs text-yellow-400 mt-1.5 flex items-center gap-1">
                                <Icons.AlertCircle className="w-3 h-3" />
                                Please enter a prompt to enable AI generation
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleGenerateWithPollinations}
                              disabled={generatingAI || !aiPrompt.trim()}
                              className="flex-1 min-w-[200px] px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {generatingWithPollinations ? (
                                <>
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                  Generating with Pollinations...
                                </>
                              ) : generatingAI ? (
                                <>
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                  Please wait...
                                </>
                              ) : (
                                <>
                                  <Icons.Wand2 className="w-4 h-4" />
                                  Generate with Pollinations (FREE)
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleGenerateWithGemini}
                              disabled={generatingAI || !aiPrompt.trim()}
                              className="flex-1 min-w-[200px] px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {generatingWithGemini ? (
                                <>
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                  Generating with Gemini...
                                </>
                              ) : generatingAI ? (
                                <>
                                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                                  Please wait...
                                </>
                              ) : (
                                <>
                                  <Icons.Sparkles className="w-4 h-4" />
                                  Generate with Gemini AI
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-xs text-slate-400">
                              <Icons.Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <p>
                                <strong className="text-purple-300">Pollinations</strong> is instant & free (no API key).
                                <strong className="text-blue-300 ml-2">Gemini</strong> takes 30-60s but uploads to Firebase.
                              </p>
                            </div>

                            {!aiPrompt.trim() && (
                              <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                                <Icons.Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">💡 Example prompts to get started:</p>
                                  <ul className="mt-1 space-y-0.5 text-slate-400">
                                    <li>• Sri Lankan marine researchers working on coastal survey</li>
                                    <li>• Regional fishing community meeting at coastal village</li>
                                    <li>• Scientists analyzing ocean data in modern laboratory</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Test Links */}
                          <div className="pt-2 border-t border-slate-300">
                            <p className="text-xs font-medium text-slate-600 mb-2">Direct Test Links:</p>
                            <div className="flex flex-wrap gap-2">
                              <a
                                href="https://image.pollinations.ai/prompt/Sri%20Lankan%20marine%20researchers%20conducting%20coastal%20biodiversity%20survey?width=1920&height=1080&enhance=true&model=flux"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded border border-purple-500/30 transition-colors"
                              >
                                Test Pollinations AI
                              </a>
                              <a
                                href="https://ai.google.dev/gemini-api/docs/imagen"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded border border-blue-500/30 transition-colors"
                              >
                                Gemini API Docs
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">CTA Button Text</label>
                      <input
                        type="text"
                        value={content.hero?.ctaText || ''}
                        onChange={(e) => updateField('hero.ctaText', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">CTA Link</label>
                      <input
                        type="text"
                        value={content.hero?.ctaLink || ''}
                        onChange={(e) => updateField('hero.ctaLink', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* SEO Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Icons.Search className="w-5 h-5 text-[#0066CC]" />
                    SEO Metadata
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={content.metadata?.title || ''}
                      onChange={(e) => updateField('metadata.title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Meta Description</label>
                    <textarea
                      value={content.metadata?.description || ''}
                      onChange={(e) => updateField('metadata.description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                      placeholder="SEO description (150-160 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Keywords</label>
                    <input
                      type="text"
                      value={content.metadata?.keywords || ''}
                      onChange={(e) => updateField('metadata.keywords', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
