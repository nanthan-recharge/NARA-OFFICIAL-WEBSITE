import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  CloudCog,
  Database,
  KeyRound,
  Lock,
  ServerCog,
  ShieldCheck
} from 'lucide-react';

const providerStatuses = [
  {
    name: 'OpenAI',
    purpose: 'Script generation and assistant workflows',
    status: 'Backend required',
    risk: 'API keys must not be stored in browser localStorage or Firestore documents readable by web clients.'
  },
  {
    name: 'AWS Polly',
    purpose: 'Text-to-speech podcast rendering',
    status: 'Backend required',
    risk: 'AWS access keys must run only from Cloud Functions or another trusted server runtime.'
  },
  {
    name: 'Google Cloud TTS',
    purpose: 'Multilingual Sinhala, Tamil, and English voice generation',
    status: 'Backend required',
    risk: 'Cloud project keys require Secret Manager and service-account IAM boundaries.'
  },
  {
    name: 'Azure Speech / ElevenLabs',
    purpose: 'Optional premium voice services',
    status: 'Backend required',
    risk: 'Provider credentials must be rotated and audited outside the public web bundle.'
  }
];

const controls = [
  'No API key input fields are rendered in the browser.',
  'No provider credentials are written to localStorage.',
  'No admin_config/ai_api_keys document is read or written by this page.',
  'Cloud provider calls must be proxied through a server-side function with IAM and audit logging.'
];

const AIAPIConfiguration = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#003366] p-3 text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0066CC]">Secure AI Operations</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">AI Provider Configuration</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Browser-side secret management has been disabled for production readiness. Provider keys must be configured through backend infrastructure before AI audio or script services are enabled.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Awaiting backend secret setup
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-[#0066CC]" />
              <h2 className="text-lg font-semibold text-slate-900">Provider Readiness</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {providerStatuses.map((provider) => (
                <div key={provider.name} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{provider.purpose}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{provider.risk}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Lock className="h-3.5 w-3.5" />
                    {provider.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-semibold text-emerald-950">Active Protections</h2>
              </div>
              <ul className="space-y-3">
                {controls.map((control) => (
                  <li key={control} className="flex gap-3 text-sm leading-5 text-emerald-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                    {control}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ServerCog className="h-5 w-5 text-[#003366]" />
                <h2 className="text-lg font-semibold text-slate-900">Production Setup Model</h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <CloudCog className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  Cloud Functions receive authenticated admin requests and call AI providers server-side.
                </div>
                <div className="flex gap-3">
                  <Database className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  Firestore stores only non-secret metadata such as provider status, model choice, and audit records.
                </div>
                <div className="flex gap-3">
                  <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  Secret values live in Google Secret Manager or the selected cloud provider vault with rotation policy.
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default AIAPIConfiguration;
