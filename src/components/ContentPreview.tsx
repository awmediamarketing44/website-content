"use client";

import { useCallback } from "react";

interface ContentPreviewProps {
  content: string;
  businessName: string;
  onReset: () => void;
}

export function ContentPreview({ content, businessName, onReset }: ContentPreviewProps) {
  const downloadTxt = useCallback(() => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-website-content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, businessName]);

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-website-content.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, businessName]);

  const downloadSplitFiles = useCallback(async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Split content by page sections (separated by ---)
    const seoSplit = content.split("=== LOCAL SEO STRATEGY ===");
    const pageContent = seoSplit[0] || content;
    const seoContent = seoSplit[1] || "";

    const pages = pageContent
      .split(/^---+$/m)
      .map((s) => s.trim())
      .filter(Boolean);

    pages.forEach((page, i) => {
      const firstLine = page.split("\n")[0].replace(/^#+\s*/, "").trim();
      const fileName = firstLine
        ? firstLine.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()
        : `page-${i + 1}`;
      zip.file(`${fileName}.md`, page);
    });

    if (seoContent.trim()) {
      zip.file("local-seo-strategy.md", `# Local SEO Strategy\n\n${seoContent.trim()}`);
    }

    zip.file("full-content.md", content);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-website-content.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, businessName]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
  }, [content]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold">
          Your <span className="text-[#F92672]">Content</span> is Ready
        </h2>
        <button
          onClick={onReset}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          &larr; Start Over
        </button>
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <DownloadButton onClick={downloadSplitFiles} label="Download ZIP (Split Files)" primary />
        <DownloadButton onClick={downloadMarkdown} label="Download Markdown" />
        <DownloadButton onClick={downloadTxt} label="Download TXT" />
        <DownloadButton onClick={copyToClipboard} label="Copy to Clipboard" />
      </div>

      {/* Content preview */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 overflow-x-auto">
        <div className="prose prose-invert max-w-none prose-headings:text-[#F92672] prose-a:text-[#F92672] prose-strong:text-white">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}

function DownloadButton({
  onClick,
  label,
  primary,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        primary
          ? "bg-[#F92672] hover:bg-[#e01d63] text-white"
          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown to HTML conversion for display
  const html = content
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm"><code>$2</code></pre>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold mt-6 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr class="border-gray-700 my-8" />')
    .replace(/^===.*===$/gm, '<hr class="border-[#F92672] my-10 border-2" />')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Line breaks
    .replace(/\n/g, "<br />");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${html}</p>` }}
    />
  );
}
