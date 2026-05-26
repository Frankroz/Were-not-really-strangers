/**
 * Core API Layer for communication with the backend stack.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetches a random question based on allowed languages.
 * @param {string[]} languages - Array of language strings (e.g., ['english', 'chinese'])
 */
export const getQuestion = async (languages = []) => {
  try {
    let url = `${API_URL}/question`;

    // Append query parameter if specific languages are selected
    if (languages.length > 0) {
      const langParam = languages.join(",");
      url += `?lang=${langParam}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch question:", error);
    throw error;
  }
};
