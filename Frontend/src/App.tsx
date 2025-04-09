import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy, ExternalLink, Moon, Sun } from "lucide-react";
import "./index.css";

interface ReviewData {
  review: Record<string, string>;
}

interface ParsedReview {
  filename: string;
  groq: {
    bugs: string[];
    codeStyle: string[];
    security: string[];
    suggestions: string[];
  };
  gemini: {
    bugs: string[];
    codeStyle: string[];
    security: string[];
    suggestions: string[];
    codeBlocks: string[];
    explanation: string;
  };
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [parsedReviews, setParsedReviews] = useState<ParsedReview[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/review/review_repo/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo_url: repoUrl }),
        });
        const data: ReviewData = await response.json();
        const parsed = parseReviewData(data);
        setParsedReviews(parsed);

        if (parsed.length > 0) {
          setActiveTab(parsed[0].filename);
        }
      } catch (error) {
        console.error("Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (repoUrl) {
      fetchData();
    }
  }, [repoUrl]);

  const parseReviewData = (data: ReviewData): ParsedReview[] => {
    const reviews: ParsedReview[] = [];

    Object.entries(data.review).forEach(([filename, content]) => {
      const groqSection = content.split("==== GROQ REVIEW ====")[1]?.split("==== GEMINI REVIEW ====")[0] || "";
      const geminiSection = content.split("==== GEMINI REVIEW ====")[1] || "";

      const groqBugs = extractSection(groqSection, "Bugs or Errors");
      const groqCodeStyle = extractSection(groqSection, "Code Style");
      const groqSecurity = extractSection(groqSection, "Security Concerns");
      const groqSuggestions = extractSection(groqSection, "Suggestions for Improvement");

      const geminiCodeBlocks = extractCodeBlocks(geminiSection);
      const geminiExplanation = extractExplanation(geminiSection);

      let geminiBugs: string[] = [];
      let geminiCodeStyle: string[] = [];
      let geminiSecurity: string[] = [];
      let geminiSuggestions: string[] = [];

      if (geminiSection.includes("**Bugs") || geminiSection.includes("**Code Style") || geminiSection.includes("**Security") || geminiSection.includes("**Suggestions")) {
        geminiBugs = extractSection(geminiSection, "Bugs or Errors");
        geminiCodeStyle = extractSection(geminiSection, "Code Style");
        geminiSecurity = extractSection(geminiSection, "Security Concerns");
        geminiSuggestions = extractSection(geminiSection, "Suggestions for Improvement");
      } else {
        const securityKeywords = ["security", "vulnerability", "api key", "exposed", "credentials"];
        const bugsKeywords = ["bug", "error", "fix", "issue", "problem", "incorrect"];
        const styleKeywords = ["style", "formatting", "readability", "maintainability", "naming"];
        const suggestionsKeywords = ["suggestion", "improvement", "enhance", "better", "consider"];

        const explanationPoints = geminiExplanation.split(/\n\s*\*\s*|\n\s*\d+\.\s*/).filter(Boolean);

        explanationPoints.forEach((point) => {
          const pointLower = point.toLowerCase();

          if (securityKeywords.some((keyword) => pointLower.includes(keyword))) {
            geminiSecurity.push(point);
          } else if (bugsKeywords.some((keyword) => pointLower.includes(keyword))) {
            geminiBugs.push(point);
          } else if (styleKeywords.some((keyword) => pointLower.includes(keyword))) {
            geminiCodeStyle.push(point);
          } else if (suggestionsKeywords.some((keyword) => pointLower.includes(keyword))) {
            geminiSuggestions.push(point);
          } else {
            geminiSuggestions.push(point);
          }
        });
      }

      reviews.push({
        filename,
        groq: {
          bugs: groqBugs,
          codeStyle: groqCodeStyle,
          security: groqSecurity,
          suggestions: groqSuggestions,
        },
        gemini: {
          bugs: geminiBugs,
          codeStyle: geminiCodeStyle,
          security: geminiSecurity,
          suggestions: geminiSuggestions,
          codeBlocks: geminiCodeBlocks,
          explanation: geminiExplanation,
        },
      });
    });

    return reviews;
  };

  const extractSection = (content: string, sectionName: string): string[] => {
    const sectionRegex = new RegExp(`\\*\\*${sectionName}:\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`, "i");
    const match = content.match(sectionRegex);

    if (!match) return [];

    return match[1]
      .split(/\n\s*\d+\.\s*|\n\s*\*\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const extractCodeBlocks = (content: string): string[] => {
    const codeBlockRegex = /```(?:python)?([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push(match[1].trim());
    }

    return codeBlocks;
  };

  const extractExplanation = (content: string): string => {
    const parts = content.split(/```(?:python)?[\s\S]*?```/);
    return parts[parts.length - 1].trim();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatContent = (content: string) => {
    let formatted = content;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    );
    return formatted;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Code Review Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter repository URL"
                className="w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
                onClick={() => {
                  /* Trigger review */
                }}
              >
                <ExternalLink size={16} />
              </button>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Analyzing code...</p>
          </div>
        ) : (
          <>
            {parsedReviews.length > 0 && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex">
                  {parsedReviews.map((review) => (
                    <button
                      key={review.filename}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === review.filename
                          ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                      onClick={() => setActiveTab(review.filename)}
                    >
                      {review.filename}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab &&
              parsedReviews.map(
                (review) =>
                  review.filename === activeTab && (
                    <div key={review.filename} className="animate-fadeIn">
                      <h2 className="text-xl font-bold mb-6 flex items-center">
                        <span className="mr-2 text-gray-600 dark:text-gray-400">File:</span>
                        <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {review.filename}
                        </span>
                      </h2>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                              <h3 className="text-white font-bold text-lg">GROQ Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="Bugs or Errors"
                                icon="🐞"
                                content={review.groq.bugs}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-bugs-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="Code Style"
                                icon="🧼"
                                content={review.groq.codeStyle}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-style-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="Security Concerns"
                                icon="🔐"
                                content={review.groq.security}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-security-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="Suggestions for Improvement"
                                icon="✅"
                                content={review.groq.suggestions}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-suggestions-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                              <h3 className="text-white font-bold text-lg">GEMINI Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              {review.gemini.codeBlocks.length > 0 && (
                                <Section
                                  title="Improved Code"
                                  icon="📝"
                                  content={review.gemini.codeBlocks}
                                  expandedSections={expandedSections}
                                  toggleSection={toggleSection}
                                  sectionId={`gemini-code-${review.filename}`}
                                  formatContent={formatContent}
                                  isCodeBlock={true}
                                  copyToClipboard={copyToClipboard}
                                />
                              )}
                              <Section
                                title="Bugs or Errors"
                                icon="🐞"
                                content={review.gemini.bugs}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-bugs-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="Security Concerns"
                                icon="🔐"
                                content={review.gemini.security}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-security-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="Key Improvements & Explanations"
                                icon="📋"
                                content={[review.gemini.explanation]}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-explanation-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
              )}
          </>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Code Review Dashboard © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: string;
  content: string[];
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
  sectionId: string;
  formatContent: (content: string) => string;
  isCodeBlock?: boolean;
  copyToClipboard?: (text: string) => void;
}

const Section = ({
  title,
  icon,
  content,
  expandedSections,
  toggleSection,
  sectionId,
  formatContent,
  isCodeBlock = false,
  copyToClipboard,
}: SectionProps) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left"
        onClick={() => toggleSection(sectionId)}
      >
        <span className="font-medium flex items-center">
          <span className="mr-2">{icon}</span> {title}
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {content.length}
          </span>
        </span>
        {expandedSections[sectionId] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expandedSections[sectionId] && (
        <div className="p-4 bg-white dark:bg-gray-900">
          {isCodeBlock ? (
            <div className="relative">
              <button
                className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => copyToClipboard && copyToClipboard(content[0])}
                aria-label="Copy code"
              >
                <Copy size={16} />
              </button>
              <pre className="p-4 bg-gray-50 dark:bg-gray-800 overflow-x-auto text-sm font-mono">
                <code>{content[0]}</code>
              </pre>
            </div>
          ) : (
            <ul className="space-y-2 list-disc pl-5">
              {content.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: formatContent(item) }} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
