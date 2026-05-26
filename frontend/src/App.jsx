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
    <div className="min-h-screen bg-slate-950 text-rose-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Soft, Romantic Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-900/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]"></div>

      <div className="w-full max-w-lg z-10">
        {/* Header Block */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif italic font-semibold tracking-wide bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-2">
            Closer Than Before
          </h1>
          <p className="text-rose-300/60 font-serif text-xs tracking-widest uppercase">
            Deep Conversations
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-stone-900/40 backdrop-blur-md p-4 rounded-xl border border-rose-900/20 shadow-2xl mb-6">
          <span className="block text-[10px] font-semibold tracking-widest text-rose-400/50 uppercase mb-3 text-center">
            Choose Your Love Languages
          </span>
          <div className="flex justify-around items-center gap-2">
            {Object.keys(selectedLanguages).map((lang) => (
              <label
                key={lang}
                className={`flex items-center gap-2 cursor-pointer transition-colors font-serif text-sm select-none ${
                  selectedLanguages[lang]
                    ? "text-rose-300"
                    : "text-stone-500 hover:text-stone-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages[lang]}
                  onChange={() => handleCheckboxChange(lang)}
                  className="w-4 h-4 rounded text-rose-600 bg-stone-950 border-rose-900/40 focus:ring-rose-500 focus:ring-offset-stone-950"
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-xl text-xs font-serif text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* WNRS-Inspired Challenge Card */}
        <div className="min-h-[240px] flex flex-col justify-center items-center p-8 bg-gradient-to-b from-rose-950/40 to-stone-900/60 backdrop-blur-lg rounded-2xl shadow-[0_0_50px_-12px_rgba(159,18,57,0.3)] border border-rose-500/20 text-center mb-6 relative overflow-hidden transition-all duration-300">
          {loading ? (
            <div className="text-rose-400/40 font-serif italic text-sm animate-pulse tracking-wide">
              Shuffling cards in the dark...
            </div>
          ) : currentQuestion ? (
            <>
              {/* Language Stamp */}
              <span className="absolute top-4 right-4 text-[9px] font-semibold tracking-widest font-mono uppercase px-2 py-0.5 bg-rose-950/60 border border-rose-500/20 rounded-md text-rose-400">
                {currentQuestion.language}
              </span>

              {/* Card Question Text */}
              <p className="text-xl md:text-2xl font-serif text-rose-50/90 font-medium leading-relaxed max-w-sm drop-shadow-sm">
                "{currentQuestion.question}"
              </p>

              {/* Character Pinyin Rendering Block */}
              {currentQuestion.pinyin && (
                <p className="mt-4 text-xs font-mono tracking-wider text-purple-300/80 bg-purple-950/30 px-3 py-1 rounded-full border border-purple-500/10">
                  {currentQuestion.pinyin}
                </p>
              )}
            </>
          ) : (
            <div className="text-stone-500 font-serif text-sm">
              Silence. Pull a card to speak.
            </div>
          )}
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={() => fetchNewQuestion()}
          disabled={loading}
          className="w-full py-3.5 px-4 font-serif text-sm tracking-wide rounded-xl transition-all duration-300 bg-gradient-to-r from-rose-700 to-purple-800 hover:from-rose-600 hover:to-purple-700 text-white shadow-xl shadow-rose-950/50 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none border border-rose-500/20"
        >
          Next Card
        </button>
      </div>
    </div>
  );
}

export default App;
