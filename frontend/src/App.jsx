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
    // Functional update ensures state alignment during rapid mobile taps
    setSelectedLanguages((prev) => {
      const updated = { ...prev, [lang]: !prev[lang] };
      // Immediately fetch using the fresh state so user doesn't have to tap "Next Card"
      fetchNewQuestion(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-rose-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden selection:bg-rose-500/20">
      {/* Soft, Romantic Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-rose-900/10 rounded-full blur-[60px] md:blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-900/10 rounded-full blur-[60px] md:blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]"></div>

      {/* Main Container - Adjusted max widths for perfect scaling */}
      <div className="w-full max-w-[23rem] sm:max-w-md z-10 flex flex-col justify-between">
        {/* Header Block */}
        <div className="text-center mb-5 sm:mb-8 select-none">
          <h1 className="text-2xl sm:text-3xl font-serif italic font-semibold tracking-wide bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-1">
            Closer Than Before
          </h1>
          <p className="text-rose-300/40 font-serif text-[9px] tracking-widest uppercase">
            Deep Conversations
          </p>
        </div>

        {/* Configuration Panel - Touch Chip Buttons */}
        <div className="bg-stone-900/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-rose-900/10 shadow-2xl mb-4 sm:mb-6">
          <span className="block text-[9px] font-semibold tracking-widest text-rose-400/50 uppercase mb-2.5 text-center select-none">
            Choose Your Love Languages
          </span>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(selectedLanguages).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleCheckboxChange(lang)}
                className={`w-full py-2 sm:py-2.5 px-1 rounded-xl font-serif text-xs capitalize transition-all duration-300 border text-center select-none active:scale-[0.94] ${
                  selectedLanguages[lang]
                    ? "bg-rose-950/30 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(159,18,57,0.05)]"
                    : "bg-stone-950/20 border-stone-900/40 text-stone-600"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/20 text-rose-400 rounded-xl text-xs font-serif text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* WNRS-Inspired Challenge Card */}
        <div className="min-h-[280px] sm:min-h-[320px] w-full flex flex-col justify-center items-center p-5 sm:p-8 bg-gradient-to-b from-rose-950/20 to-stone-900/40 backdrop-blur-lg rounded-3xl shadow-[0_0_50px_-12px_rgba(159,18,57,0.15)] border border-rose-500/10 text-center mb-5 relative overflow-hidden">
          {loading ? (
            <div className="text-rose-400/40 font-serif italic text-sm animate-pulse tracking-wide">
              Shuffling cards in the dark...
            </div>
          ) : currentQuestion ? (
            <>
              {/* Language Stamp */}
              <span className="absolute top-3.5 right-3.5 text-[8px] font-semibold tracking-widest font-mono uppercase px-2 py-0.5 bg-rose-950/60 border border-rose-500/10 rounded text-rose-400/70 select-none">
                {currentQuestion.language}
              </span>

              {/* Card Question Text */}
              <p className="text-xl sm:text-2xl font-serif text-rose-50/90 font-medium leading-relaxed max-w-xs px-1 break-inside-avoid [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]">
                “{currentQuestion.question}”
              </p>

              {/* Mobile-Optimized Character Pinyin Rendering Block */}
              {currentQuestion.pinyin && (
                <div className="mt-4 max-w-full px-1">
                  <p className="text-[11px] sm:text-xs font-mono tracking-wide text-purple-300/80 bg-purple-950/20 px-3 py-1.5 rounded-xl border border-purple-500/10 inline-block balance-text break-words line-clamp-3 overflow-y-auto">
                    {currentQuestion.pinyin}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-stone-600 font-serif text-xs tracking-wide select-none">
              Silence. Pull a card to speak.
            </div>
          )}
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={() => fetchNewQuestion()}
          disabled={loading}
          className="w-full py-3.5 px-4 font-serif text-sm tracking-wide rounded-xl transition-all duration-300 bg-gradient-to-r from-rose-700 to-purple-800 hover:from-rose-600 hover:to-purple-700 text-white shadow-xl shadow-rose-950/20 active:scale-[0.96] disabled:opacity-30 disabled:pointer-events-none border border-rose-500/10 touch-manipulation"
        >
          Next Card
        </button>

        {/* Minimal Footer Context */}
        <p className="text-center mt-5 text-[10px] font-serif italic text-stone-700 tracking-wide pointer-events-none select-none">
          Made by FJRM with ❤️ for RYW.
        </p>
      </div>
    </div>
  );
}

export default App;
