import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Copy, ExternalLink, Moon, Sun } from "lucide-react";
import "./index.css";

interface ReviewData {
  review: Record<string, {
    correctness: { groq: string; gemini: string };
    readability: { groq: string; gemini: string };
    docstring: { groq: string; gemini: string };
    security: { groq: string; gemini: string };
    performance: { groq: string; gemini: string };
    structure: { groq: string; gemini: string };
    error_handling: { groq: string; gemini: string };
    test_coverage: { groq: string; gemini: string };
  }>;
}

interface ParsedReview {
  filename: string;
  correctness: { groq: string[]; gemini: string[] };
  readability: { groq: string[]; gemini: string[] };
  docstring: { groq: string[]; gemini: string[] };
  security: { groq: string[]; gemini: string[] };
  performance: { groq: string[]; gemini: string[] };
  structure: { groq: string[]; gemini: string[] };
  error_handling: { groq: string[]; gemini: string[] };
  test_coverage: { groq: string[]; gemini: string[] };
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [parsedReviews, setParsedReviews] = useState<ParsedReview[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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
      setProgress(30); // Simulate progress
      try {
        const response = await fetch("http://localhost:8000/review/review_repo/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo_url: repoUrl }),
        });
        setProgress(60); // Simulate progress
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
        setProgress(100); // Complete progress
      }
    };

    if (repoUrl) {
      fetchData();
    }
  }, [repoUrl]);

  const parseReviewData = (data: ReviewData): ParsedReview[] => {
    const reviews: ParsedReview[] = [];

    Object.entries(data.review).forEach(([filename, content]) => {
      const review = {
        filename,
        correctness: {
          groq: content.correctness.groq.split("\n").filter(Boolean),
          gemini: content.correctness.gemini.split("\n").filter(Boolean),
        },
        readability: {
          groq: content.readability.groq.split("\n").filter(Boolean),
          gemini: content.readability.gemini.split("\n").filter(Boolean),
        },
        docstring: {
          groq: content.docstring.groq.split("\n").filter(Boolean),
          gemini: content.docstring.gemini.split("\n").filter(Boolean),
        },
        security: {
          groq: content.security.groq.split("\n").filter(Boolean),
          gemini: content.security.gemini.split("\n").filter(Boolean),
        },
        performance: {
          groq: content.performance.groq.split("\n").filter(Boolean),
          gemini: content.performance.gemini.split("\n").filter(Boolean),
        },
        structure: {
          groq: content.structure.groq.split("\n").filter(Boolean),
          gemini: content.structure.gemini.split("\n").filter(Boolean),
        },
        error_handling: {
          groq: content.error_handling.groq.split("\n").filter(Boolean),
          gemini: content.error_handling.gemini.split("\n").filter(Boolean),
        },
        test_coverage: {
          groq: content.test_coverage.groq.split("\n").filter(Boolean),
          gemini: content.test_coverage.gemini.split("\n").filter(Boolean),
        },
      };
      reviews.push(review);
    });

    return reviews;
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


  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setRepoUrl(event.currentTarget.value);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Code Review Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter repository URL"
                className="w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
            <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Analyzing code...</p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 text-xs text-white text-center"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        ) : (
          <>
            {parsedReviews.length > 0 && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex space-x-4">
                  {parsedReviews.map((review) => (
                    <button
                      key={review.filename}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === review.filename
                          ? "border-b-2 border-black text-black dark:text-white"
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
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Correctness Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="🔍"
                                content={review.correctness.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-correctness-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="🔍"
                                content={review.correctness.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-correctness-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Readability Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="📖"
                                content={review.readability.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-readability-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="📖"
                                content={review.readability.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-readability-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Docstring Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="📝"
                                content={review.docstring.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-docstring-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="📝"
                                content={review.docstring.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-docstring-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Security Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="🔐"
                                content={review.security.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-security-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="🔐"
                                content={review.security.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-security-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Performance Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="⚙️"
                                content={review.performance.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-performance-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="⚙️"
                                content={review.performance.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-performance-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Structure Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="📦"
                                content={review.structure.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-structure-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="📦"
                                content={review.structure.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-structure-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Error Handling Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="🧯"
                                content={review.error_handling.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-error-handling-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="🧯"
                                content={review.error_handling.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-error-handling-${review.filename}`}
                                formatContent={formatContent}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
                            <div className="bg-black text-white px-4 py-3">
                              <h3 className="font-bold text-lg">Test Coverage Review</h3>
                            </div>

                            <div className="p-4 space-y-4">
                              <Section
                                title="GROQ"
                                icon="✅"
                                content={review.test_coverage.groq}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`groq-test-coverage-${review.filename}`}
                                formatContent={formatContent}
                              />
                              <Section
                                title="GEMINI"
                                icon="✅"
                                content={review.test_coverage.gemini}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                                sectionId={`gemini-test-coverage-${review.filename}`}
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
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
        <div className="p-4 bg-white dark:bg-black">
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
