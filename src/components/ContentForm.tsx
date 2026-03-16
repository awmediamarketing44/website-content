"use client";

import { useState } from "react";

export interface FormData {
  businessName: string;
  industry: string;
  location: string;
  services: string;
  targetAudience: string;
  tone: string;
  uniqueSellingPoints: string;
  contentType: "landing" | "full";
}

interface ContentFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const toneOptions = [
  "Professional & Trustworthy",
  "Friendly & Approachable",
  "Bold & Confident",
  "Luxury & Premium",
  "Casual & Fun",
  "Technical & Expert",
];

export function ContentForm({ onSubmit, loading }: ContentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    industry: "",
    location: "",
    services: "",
    targetAudience: "",
    tone: toneOptions[0],
    uniqueSellingPoints: "",
    contentType: "full",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Content Type Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => setFormData((p) => ({ ...p, contentType: "landing" }))}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            formData.contentType === "landing"
              ? "bg-[#F92672] text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Landing Page
        </button>
        <button
          type="button"
          onClick={() => setFormData((p) => ({ ...p, contentType: "full" }))}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            formData.contentType === "full"
              ? "bg-[#F92672] text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Full Website (4 Pages)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Business Name"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="e.g. Smith's Plumbing"
          required
        />
        <InputField
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. Plumbing & Heating"
          required
        />
        <InputField
          label="Location (City / Region)"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Manchester, UK"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tone of Voice
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F92672] transition-colors"
          >
            {toneOptions.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TextAreaField
        label="Services / Products"
        name="services"
        value={formData.services}
        onChange={handleChange}
        placeholder="List your main services or products, separated by commas. e.g. Emergency plumbing, Boiler installation, Bathroom fitting, Central heating repairs"
        required
      />

      <TextAreaField
        label="Target Audience"
        name="targetAudience"
        value={formData.targetAudience}
        onChange={handleChange}
        placeholder="Who are your ideal customers? e.g. Homeowners in Manchester aged 30-60 who need reliable, same-day plumbing services"
      />

      <TextAreaField
        label="Unique Selling Points"
        name="uniqueSellingPoints"
        value={formData.uniqueSellingPoints}
        onChange={handleChange}
        placeholder="What makes you different? e.g. 24/7 emergency callouts, 15 years experience, No call-out fee, Gas Safe registered"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#F92672] hover:bg-[#e01d63] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating Your Content...
          </>
        ) : (
          "Generate My Website Content"
        )}
      </button>
    </form>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-[#F92672]">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F92672] transition-colors"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-[#F92672]">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F92672] transition-colors resize-none"
      />
    </div>
  );
}
