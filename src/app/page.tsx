"use client";

import { useState } from "react";
import { ContentForm, FormData } from "@/components/ContentForm";
import { ContentPreview } from "@/components/ContentPreview";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  async function handleGenerate(data: FormData) {
    setLoading(true);
    setError(null);
    setContent(null);
    setFormData(data);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      const result = await res.json();
      setContent(result.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setContent(null);
    setFormData(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {!content ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Generate Your <span className="text-[#F92672]">Website Content</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Fill in your business details below and we&apos;ll create professional,
                SEO-optimised website copy — ready to use. Plus local SEO tips
                tailored to your business.
              </p>
            </div>
            <ContentForm onSubmit={handleGenerate} loading={loading} />
            {error && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-center">
                {error}
              </div>
            )}
          </>
        ) : (
          <ContentPreview
            content={content}
            businessName={formData?.businessName || "website"}
            onReset={handleReset}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
