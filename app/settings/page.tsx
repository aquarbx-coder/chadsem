"use client";

import { useState, useEffect } from "react";

interface KeyField {
  key: string;
  label: string;
  description: string;
}

const KEY_FIELDS: KeyField[] = [
  {
    key: "oai_openai_key",
    label: "OpenAI API Key",
    description:
      "Get your API key from platform.openai.com/api-keys. Required for all AI-powered analysis features.",
  },
  {
    key: "oai_reddit_client_id",
    label: "Reddit Client ID",
    description:
      "Create a Reddit app at reddit.com/prefs/apps. Choose 'script' type. The Client ID is shown below the app name.",
  },
  {
    key: "oai_reddit_client_secret",
    label: "Reddit Client Secret",
    description:
      "Found on the same Reddit app page, labeled 'secret'. Required for Reddit scanning features.",
  },
  {
    key: "oai_google_places_key",
    label: "Google Places API Key",
    description:
      "Enable the Places API in Google Cloud Console at console.cloud.google.com. Required for the Business Scanner.",
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded: Record<string, string> = {};
    KEY_FIELDS.forEach((field) => {
      loaded[field.key] = localStorage.getItem(field.key) || "";
    });
    setValues(loaded);
  }, []);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    KEY_FIELDS.forEach((field) => {
      const value = values[field.key];
      if (value) {
        localStorage.setItem(field.key, value);
      } else {
        localStorage.removeItem(field.key);
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 text-lg">
            Configure your API keys. Keys are stored locally in your browser and never sent to our servers.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {KEY_FIELDS.map((field) => (
            <div
              key={field.key}
              className="p-5 rounded-xl bg-gray-800/40 border border-gray-700/50"
            >
              <label className="block text-sm font-medium text-gray-200 mb-1">
                {field.label}
              </label>
              <p className="text-xs text-gray-500 mb-3">{field.description}</p>
              <div className="relative">
                <input
                  type={visibility[field.key] ? "text" : "password"}
                  value={values[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={`Enter your ${field.label}`}
                  className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-4 py-2.5 pr-12 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(field.key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {visibility[field.key] ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            Save Settings
          </button>

          {/* Success Toast */}
          {saved && (
            <span className="text-emerald-400 text-sm font-medium animate-pulse">
              Settings saved successfully!
            </span>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-10 p-4 rounded-lg bg-gray-800/30 border border-gray-700/40">
          <p className="text-xs text-gray-500">
            <span className="text-gray-400 font-medium">Security note:</span> All API keys
            are stored in your browser&apos;s localStorage. They are never transmitted to any
            third-party server. API calls are made directly from your browser or through
            Next.js API routes that run on your own deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
