import { useState, useEffect } from "react";
import { getQuestion } from "./api";

function App() {
  // Keep track of which languages the user wants to pick from
  const [selectedLanguages, setSelectedLanguages] = useState({
    english: true,
    spanish: true,
    chinese: true,
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get an array of just the true active language strings
  const getActiveLangsArray = (langState) => {
    return Object.keys(langState).filter((key) => langState[key]);
  };

  // Fetch handler
  const fetchNewQuestion = async (langsToUse = selectedLanguages) => {
    const activeLangs = getActiveLangsArray(langsToUse);

    if (activeLangs.length === 0) {
      setError("Please select at least one language checkbox.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getQuestion(activeLangs);
      setCurrentQuestion(data);
    } catch (err) {
      setError("Failed to fetch a question from the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch an initial question on mount
  useEffect(() => {
    fetchNewQuestion();
  }, []);

  // Handle checkbox changes toggle
  const handleCheckboxChange = (lang) => {
    const updatedState = {
      ...selectedLanguages,
      [lang]: !selectedLanguages[lang],
    };

    setSelectedLanguages(updatedState);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-lg p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
        {/* Header */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 text-center">
          We're Not Really Strangers: Language Challenge Deck
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Configure your target language pool and pull a random challenge card.
        </p>

        {/* Configuration Panel */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Include in Pool:
          </span>
          <div className="flex justify-around items-center gap-2">
            {Object.keys(selectedLanguages).map((lang) => (
              <label
                key={lang}
                className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white capitalize text-sm select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages[lang]}
                  onChange={() => handleCheckboxChange(lang)}
                  className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950"
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* Error Flag Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Question Output Card */}
        <div className="min-h-[160px] flex flex-col justify-center items-center p-6 bg-slate-900/50 rounded-xl border border-slate-800 text-center mb-6 relative overflow-hidden">
          {loading ? (
            <div className="text-slate-400 font-mono text-sm animate-pulse">
              Shuffling questions...
            </div>
          ) : currentQuestion ? (
            <>
              {/* Language Tag badge indicator */}
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400">
                {currentQuestion.language}
              </span>

              {/* Main Text Content */}
              <p className="text-xl font-medium text-slate-100 leading-relaxed max-w-md">
                {currentQuestion.question}
              </p>

              {/* Conditionally Render Pinyin block for Chinese */}
              {currentQuestion.pinyin && (
                <p className="mt-2 text-sm font-mono text-emerald-400 tracking-wide">
                  {currentQuestion.pinyin}
                </p>
              )}
            </>
          ) : (
            <div className="text-slate-500 text-sm">No question loaded.</div>
          )}
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={() => fetchNewQuestion()}
          disabled={loading}
          className="w-full py-3 px-4 font-semibold text-sm rounded-xl transition-all duration-200 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          Next Random Question
        </button>
      </div>
    </div>
  );
}

export default App;
