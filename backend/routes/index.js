const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const router = Router();

// Helper function to safely read and parse the questions JSON file
const getQuestionsData = () => {
  try {
    const filePath = path.join(__dirname, "..", "data", "questions.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading questions.json:", error);
    return [];
  }
};

// Helper function to pick a random item from an array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// 1. Flexible Language and Question Route (Supports Query Parameters)
router.get("/question", (req, res) => {
  const questions = getQuestionsData();
  if (questions.length === 0) {
    return res.status(500).json({ error: "No questions available." });
  }

  const randomQuestion = getRandomItem(questions);
  const defaultLanguages = ["english", "spanish", "chinese"];

  // Read the lang query parameter (e.g., ?lang=chinese or ?lang=english,spanish)
  const langQuery = req.query.lang;
  let allowedLanguages = defaultLanguages;

  if (langQuery) {
    // Split comma-separated values, trim spaces, and lowercase them
    const requestedLangs = langQuery
      .split(",")
      .map((lang) => lang.trim().toLowerCase());

    // Filter to ensure we only use languages supported by our application
    const validLangs = requestedLangs.filter((lang) =>
      defaultLanguages.includes(lang),
    );

    if (validLangs.length > 0) {
      allowedLanguages = validLangs;
    }
  }

  // Pick a random language from the allowed/filtered choices
  const selectedLanguage = getRandomItem(allowedLanguages);

  const response = {
    language: selectedLanguage,
  };

  // Construct response dynamically based on selected language
  if (selectedLanguage === "chinese") {
    response.question = randomQuestion.chinese;
    response.pinyin = randomQuestion.pinyin || "";
  } else if (selectedLanguage === "spanish") {
    response.question =
      randomQuestion.spanish || "No Spanish translation available yet.";
  } else {
    response.question = randomQuestion.english;
  }

  res.json(response);
});

// 2. Explicit English Route
router.get("/question_english", (req, res) => {
  const questions = getQuestionsData();
  if (questions.length === 0)
    return res.status(500).json({ error: "No questions found." });

  const item = getRandomItem(questions);
  res.json({
    language: "english",
    question: item.english,
  });
});

// 3. Explicit Spanish Route
router.get("/question_spanish", (req, res) => {
  const questions = getQuestionsData();
  if (questions.length === 0)
    return res.status(500).json({ error: "No questions found." });

  const item = getRandomItem(questions);
  res.json({
    language: "spanish",
    question: item.spanish || "No Spanish translation available yet.",
  });
});

// 4. Explicit Chinese Route (Always returns Pinyin alongside the characters)
router.get("/question_chinese", (req, res) => {
  const questions = getQuestionsData();
  if (questions.length === 0)
    return res.status(500).json({ error: "No questions found." });

  const item = getRandomItem(questions);
  res.json({
    language: "chinese",
    question: item.chinese,
    pinyin: item.pinyin || "",
  });
});

module.exports = router;