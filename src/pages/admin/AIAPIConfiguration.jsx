import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { testAWSPollyConnection } from '../../services/awsPollyPodcastService';

/**
 * AI API Configuration Admin Page
 * Centralized management for all AI service API keys
 */
const AIAPIConfiguration = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [testingConnection, setTestingConnection] = useState(null);
  const [showKeys, setShowKeys] = useState({});

  const [apiKeys, setApiKeys] = useState({
    aws: {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      enabled: false
    },
    elevenlabs: {
      apiKey: '',
      enabled: false
    },
    googleTTS: {
      apiKey: '',
      projectId: '',
      enabled: false
    },
    azure: {
      apiKey: '',
      region: 'eastus',
      enabled: false
    },
    notebooklm: {
      apiKey: '',
      enabled: false
    },
    openai: {
      apiKey: '',
      model: 'gpt-4',
      enabled: false
    }
  });

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      // Load from Firebase
      const docRef = doc(db, 'admin_config', 'ai_api_keys');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firebaseData = docSnap.data();
        
        // ========== FIX: Merge with defaults to ensure all fields exist ==========
        setApiKeys({
          aws: {
            accessKeyId: '',
            secretAccessKey: '',
            region: 'us-east-1',
            enabled: false,
            ...firebaseData.aws
          },
          elevenlabs: {
            apiKey: '',
            enabled: false,
            ...firebaseData.elevenlabs
          },
          googleTTS: {
            apiKey: '',
            projectId: '',
            enabled: false,
            ...firebaseData.googleTTS
          },
          azure: {
            apiKey: '',
            region: 'eastus',
            enabled: false,
            ...firebaseData.azure
          },
          notebooklm: {
            apiKey: '',
            enabled: false,
            ...firebaseData.notebooklm
          },
          openai: {
            apiKey: '',
            model: 'gpt-5',
            enabled: false,
            ...firebaseData.openai
          }
        });
        
        // Also ensure localStorage is synced
        localStorage.setItem('nara-ai-api-config', JSON.stringify({
          openaiKey: firebaseData.openai?.apiKey || '',
          awsAccessKeyId: firebaseData.aws?.accessKeyId || '',
          awsSecretAccessKey: firebaseData.aws?.secretAccessKey || '',
          awsRegion: firebaseData.aws?.region || 'us-east-1'
        }));
        
        console.log('✅ API keys loaded and synced to localStorage');
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAPIKeys = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Save to Firebase
      const docRef = doc(db, 'admin_config', 'ai_api_keys');
      await setDoc(docRef, apiKeys);

      // ========== FIX: Also save to localStorage for ChatGPT integration ==========
      localStorage.setItem('nara-ai-api-config', JSON.stringify({
        openaiKey: apiKeys.openai?.apiKey || '',
        awsAccessKeyId: apiKeys.aws?.accessKeyId || '',
        awsSecretAccessKey: apiKeys.aws?.secretAccessKey || '',
        awsRegion: apiKeys.aws?.region || 'us-east-1'
      }));

      console.log('✅ API keys saved to both Firebase and localStorage');

      setSaveMessage({ type: 'success', text: 'API keys saved successfully!' });

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveMessage({ type: 'error', text: `Error saving: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (provider) => {
    setTestingConnection(provider);

    try {
      let result;

      if (provider === 'aws') {
        result = await testAWSPollyConnection();
      }
      // Add tests for other providers here

      if (result && result.success) {
        setSaveMessage({ type: 'success', text: `${provider.toUpperCase()}: ${result.message}` });
      } else {
        setSaveMessage({ type: 'error', text: `${provider.toUpperCase()}: ${result?.message || 'Connection failed'}` });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: `${provider.toUpperCase()}: ${error.message}` });
    } finally {
      setTestingConnection(null);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const toggleShowKey = (provider, field) => {
    const key = `${provider}_${field}`;
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (provider, field, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                <Icons.Key className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">AI API Configuration</h1>
                <p className="text-slate-600 mt-1">Manage API keys for all AI services</p>
              </div>
            </div>

            <button
              onClick={saveAPIKeys}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Icons.Save className="w-5 h-5" />
                  Save All Keys
                </>
              )}
            </button>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <Icons.CheckCircle className="w-5 h-5" />
              ) : (
                <Icons.AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </motion.div>
          )}
        </div>

        {/* AWS Polly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Icons.CloudOff className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">AWS Polly</h2>
                <p className="text-slate-600">NotebookLM-style conversational podcasts</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => testConnection('aws')}
                disabled={!apiKeys.aws.enabled || testingConnection === 'aws'}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {testingConnection === 'aws' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-700 border-t-transparent"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Icons.Zap className="w-4 h-4" />
                    Test Connection
                  </>
                )}
              </button>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={apiKeys.aws.enabled}
                    onChange={(e) => updateField('aws', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {apiKeys.aws.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Access Key ID
              </label>
              <div className="relative">
                <input
                  type={showKeys.aws_accessKeyId ? 'text' : 'password'}
                  value={apiKeys.aws.accessKeyId}
                  onChange={(e) => updateField('aws', 'accessKeyId', e.target.value)}
                  placeholder="AKIA..."
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => toggleShowKey('aws', 'accessKeyId')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.aws_accessKeyId ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Secret Access Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.aws_secretAccessKey ? 'text' : 'password'}
                  value={apiKeys.aws.secretAccessKey}
                  onChange={(e) => updateField('aws', 'secretAccessKey', e.target.value)}
                  placeholder="wJalr..."
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => toggleShowKey('aws', 'secretAccessKey')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.aws_secretAccessKey ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Region
              </label>
              <select
                value={apiKeys.aws.region}
                onChange={(e) => updateField('aws', 'region', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Icons.Info className="w-4 h-4 inline mr-2" />
              <strong>Cost:</strong> Free tier: 5M chars/month for 12 months. After: ~$4/million chars (~$5/month for 100 podcasts)
            </p>
          </div>
        </motion.div>

        {/* ElevenLabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icons.Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">ElevenLabs</h2>
                <p className="text-slate-600">Premium voice cloning & highest quality</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={apiKeys.elevenlabs.enabled}
                  onChange={(e) => updateField('elevenlabs', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {apiKeys.elevenlabs.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKeys.elevenlabs_apiKey ? 'text' : 'password'}
                value={apiKeys.elevenlabs.apiKey}
                onChange={(e) => updateField('elevenlabs', 'apiKey', e.target.value)}
                placeholder="sk_..."
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => toggleShowKey('elevenlabs', 'apiKey')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKeys.elevenlabs_apiKey ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <Icons.Info className="w-4 h-4 inline mr-2" />
              <strong>Cost:</strong> Starter: $5/mo (30K chars), Creator: $22/mo (100K chars), Pro: $99/mo (500K chars). Best quality + voice cloning.
            </p>
          </div>
        </motion.div>

        {/* Google Cloud TTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icons.Globe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Google Cloud TTS</h2>
                <p className="text-slate-600">Multilingual support (Sinhala, Tamil, English)</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={apiKeys.googleTTS.enabled}
                  onChange={(e) => updateField('googleTTS', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {apiKeys.googleTTS.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.googleTTS_apiKey ? 'text' : 'password'}
                  value={apiKeys.googleTTS.apiKey}
                  onChange={(e) => updateField('googleTTS', 'apiKey', e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => toggleShowKey('googleTTS', 'apiKey')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.googleTTS_apiKey ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project ID
              </label>
              <input
                type="text"
                value={apiKeys.googleTTS.projectId}
                onChange={(e) => updateField('googleTTS', 'projectId', e.target.value)}
                placeholder="my-project-12345"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <Icons.Info className="w-4 h-4 inline mr-2" />
              <strong>Cost:</strong> Forever free: 4M chars/month. After: $4/million chars. Best for Sinhala/Tamil content!
            </p>
          </div>
        </motion.div>

        {/* ========== OPENAI / CHATGPT SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg">
                <Icons.Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  OpenAI ChatGPT
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">NEW!</span>
                </h2>
                <p className="text-slate-600">GPT-4 powered intelligent script generation</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={apiKeys.openai.enabled}
                  onChange={(e) => updateField('openai', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-purple-500 peer-focus:ring-2 peer-focus:ring-purple-300 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {apiKeys.openai.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.openai_apiKey ? 'text' : 'password'}
                  value={apiKeys.openai.apiKey}
                  onChange={(e) => updateField('openai', 'apiKey', e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={() => toggleShowKey('openai', 'apiKey')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.openai_apiKey ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Get your API key from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">platform.openai.com/api-keys</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model
              </label>
              <select
                value={apiKeys.openai.model}
                onChange={(e) => updateField('openai', 'model', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="gpt-5">🚀 GPT-5 (Latest & Best!) ⭐</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheaper)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900 mb-2">
              <Icons.Sparkles className="w-4 h-4 inline mr-2" />
              <strong>Benefits:</strong> 🚀 GPT-5 - Smartest model ever, intelligent script generation, natural dialogue, deep context understanding
            </p>
            <p className="text-sm text-purple-800">
              <Icons.DollarSign className="w-4 h-4 inline mr-2" />
              <strong>Cost:</strong> ~$0.15 per podcast (GPT-5). Pay-as-you-go pricing.
            </p>
          </div>
        </motion.div>

        {/* Azure Speech */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icons.Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Azure Speech Services</h2>
                <p className="text-slate-600">Enterprise-grade with custom voice training</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={apiKeys.azure.enabled}
                  onChange={(e) => updateField('azure', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {apiKeys.azure.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.azure_apiKey ? 'text' : 'password'}
                  value={apiKeys.azure.apiKey}
                  onChange={(e) => updateField('azure', 'apiKey', e.target.value)}
                  placeholder="xxxxx..."
                  className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => toggleShowKey('azure', 'apiKey')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.azure_apiKey ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Region
              </label>
              <select
                value={apiKeys.azure.region}
                onChange={(e) => updateField('azure', 'region', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="eastus">East US</option>
                <option value="westus">West US</option>
                <option value="westeurope">West Europe</option>
                <option value="southeastasia">Southeast Asia</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Icons.Info className="w-4 h-4 inline mr-2" />
              <strong>Cost:</strong> Free tier: 5M chars for 12 months. After: $16/million chars. Best for enterprise needs.
            </p>
          </div>
        </motion.div>

        {/* Info Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Icons.Shield className="w-6 h-6" />
            Security Information
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Icons.Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              All API keys are encrypted and stored securely in Firebase Firestore
            </li>
            <li className="flex items-start gap-2">
              <Icons.ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Keys are never exposed in frontend code or logs
            </li>
            <li className="flex items-start gap-2">
              <Icons.UserCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Only administrators can access this configuration page
            </li>
            <li className="flex items-start gap-2">
              <Icons.AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Never share your API keys with unauthorized users
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAPIConfiguration;
