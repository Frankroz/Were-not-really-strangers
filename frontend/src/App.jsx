import { useState, useEffect } from "react";
import { getQuestion } from "./api";

function App() {
  const [selectedLanguages, setSelectedLanguages] = useState({
    english: true,
    spanish: true,
    chinese: true,
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getActiveLangsArray = (langState) => {
    return Object.keys(langState).filter((key) => langState[key]);
  };

  const fetchNewQuestion = async (langsToUse = selectedLanguages) => {
    const activeLangs = getActiveLangsArray(langsToUse);

    if (activeLangs.length === 0) {
      setError("Please pick at least one language to share.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getQuestion(activeLangs);
      setCurrentQuestion(data);
    } catch (err) {
      setError("The connection flickered. Try lighting it again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleCheckboxChange = (lang) => {
    setSelectedLanguages({
      ...selectedLanguages,
      [lang]: !selectedLanguages[lang],
    });
  };

  return (
    // Fixed height using dynamic viewport units (dvh) to eliminate mobile address bar shifting
    <div className="min-h-[100dvh] w-full bg-slate-950 text-rose-100 flex flex-col items-center justify-center font-sans p-4 mobile-safe-bottom relative overflow-hidden">
      {/* Soft, Romantic Ambient Glows - Scale down slightly for smaller screens */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-rose-900/15 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-900/15 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]"></div>

      {/* Main Container - Scaled constraint down to max-w-sm for narrow devices */}
      <div className="w-full max-w-sm sm:max-w-md z-10 flex flex-col justify-between">
        {/* Header Block */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <h1 className="text-2xl sm:text-3xl font-serif italic font-semibold tracking-wide bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-1">
            Closer Than Before
          </h1>
          <p className="text-rose-300/50 font-serif text-[10px] tracking-widest uppercase">
            Deep Conversations
          </p>
        </div>

        {/* Configuration Panel - Transformed checkboxes to comfortable mobile touch chips */}
        <div className="bg-stone-900/30 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-rose-900/10 shadow-2xl mb-4 sm:mb-6">
          <span className="block text-[9px] font-semibold tracking-widest text-rose-400/50 uppercase mb-3 text-center select-none">
            Choose Your Love Languages
          </span>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(selectedLanguages).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleCheckboxChange(lang)}
                className={`w-full py-2.5 px-1 rounded-xl font-serif text-xs capitalize transition-all duration-300 border text-center select-none active:scale-[0.96] ${
                  selectedLanguages[lang]
                    ? "bg-rose-950/40 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(159,18,57,0.1)]"
                    : "bg-stone-950/40 border-stone-900/60 text-stone-500"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-serif text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* WNRS-Inspired Challenge Card - Dynamic heights & padding tailored to small widths */}
        <div className="min-h-[260px] sm:min-h-[300px] w-full flex flex-col justify-center items-center p-6 sm:p-8 bg-gradient-to-b from-rose-950/30 to-stone-900/50 backdrop-blur-lg rounded-2xl shadow-[0_0_50px_-12px_rgba(159,18,57,0.25)] border border-rose-500/10 text-center mb-5 relative overflow-hidden">
          {loading ? (
            <div className="text-rose-400/40 font-serif italic text-sm animate-pulse tracking-wide">
              Shuffling cards in the dark...
            </div>
          ) : currentQuestion ? (
            <>
              {/* Language Stamp */}
              <span className="absolute top-3.5 right-3.5 text-[8px] font-semibold tracking-widest font-mono uppercase px-2 py-0.5 bg-rose-950/80 border border-rose-500/10 rounded text-rose-400/80">
                {currentQuestion.language}
              </span>

              {/* Card Question Text - Auto-scales size dynamically depending on device width */}
              <p className="text-lg sm:text-2xl font-serif text-rose-50/90 font-medium leading-relaxed max-w-xs px-2 break-words">
                "{currentQuestion.question}"
              </p>

              {/* Character Pinyin Rendering Block */}
              {currentQuestion.pinyin && (
                <p className="mt-4 text-[11px] sm:text-xs font-mono tracking-wider text-purple-300/80 bg-purple-950/30 px-3 py-1 rounded-full border border-purple-500/10 max-w-[90%] truncate">
                  {currentQuestion.pinyin}
                </p>
              )}
            </>
          ) : (
            <div className="text-stone-600 font-serif text-xs tracking-wide">
              Silence. Pull a card to speak.
            </div>
          )}
        </div>

        {/* Action Trigger Button - Tap target optimized with minimum 44px layout spacing */}
        <button
          onClick={() => fetchNewQuestion()}
          disabled={loading}
          className="w-full py-3.5 px-4 font-serif text-sm tracking-wide rounded-xl transition-all duration-300 bg-gradient-to-r from-rose-700 to-purple-800 hover:from-rose-600 hover:to-purple-700 text-white shadow-xl shadow-rose-950/40 active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none border border-rose-500/10"
        >
          Next Card
        </button>

        {/* Minimal Footer Context */}
        <p className="text-center mt-6 text-[11px] font-serif italic text-stone-600 tracking-wide pointer-events-none">
          Made by FJRM with ❤️ for RYW.
        </p>
      </div>
    </div>
  );
}

export default App;
