import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined in the environment variables.");
}

const client = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Parses natural language input into structured expense objects using Gemini.
 * Maps inputs to existing categories, suggests new ones if understandable, or falls back to "Other".
 * Uses client-side CORS-enabled models.generateContent from the new SDK.
 * 
 * @param {string} text - User's input sentence (e.g. "spent 350 on pizza yesterday")
 * @param {string[]} existingCategories - Array of current category names
 * @returns {Promise<{ amount: number|null, category: string, isNewCategory: boolean, description: string, date: string }>}
 */
export async function parseExpenseWithAI(text, existingCategories) {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const today = new Date().toISOString().split("T")[0];
  
  const prompt = `
  You are an expert personal finance parsing assistant.
  Your task is to parse the user's natural language input and map it to expense details.
  
  Input Text: "${text}"
  Existing Categories: [${existingCategories.map((c) => `"${c}"`).join(", ")}]
  Today's Date: "${today}"
  
  Instructions:
  1. Extract the "amount" (number). If not found, return null.
  2. Map the purchase to a category:
     - Try to match it to one of the "Existing Categories" first. Choose the most appropriate existing one.
     - If the expense doesn't fit any existing category well, but the input indicates a clear, understandable new category (e.g. "bought a book" -> "Education" or "Books", "got a haircut" -> "Personal Care"), suggest a suitable new category name (use Title Case like "Education", "Entertainment", "Utilities", "Health"). Set "isNewCategory" to true.
     - If the category is ambiguous, not understandable, or cannot be parsed, use "Other" as the category name. If "Other" is not in the existing categories list, set "isNewCategory" to true so it gets created, otherwise set it to false.
  3. Extract a short, clean "description" (string, e.g. "Lunch with friends", "Gas refuel").
  4. Parse the "date" (format YYYY-MM-DD). If the text mentions relative dates like "yesterday", "two days ago", or a weekday, calculate it relative to Today's Date. If no date is mentioned, default to Today's Date.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            amount: { type: "number" },
            category: { type: "string" },
            isNewCategory: { type: "boolean" },
            description: { type: "string" },
            date: { type: "string" }
          },
          required: ["amount", "category", "isNewCategory", "description", "date"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from the AI model.");
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("parseExpenseWithAI error:", error);
    throw new Error(error.message || "Failed to parse text. Please try again.");
  }
}

/**
 * Generates an insights summary of the user's spending habits for the current month.
 * Uses client-side CORS-enabled models.generateContent from the new SDK.
 * 
 * @param {Object} data - Aggregate financial details
 * @param {number} data.thisMonthTotal - Total spent in the current month
 * @param {number} data.lastMonthTotal - Total spent in the previous month
 * @param {string} data.momChangeText - Description of change (e.g. "18% more" or "5% less")
 * @param {Object} data.categorySpend - Key-value pair of category spending (e.g. { Food: 500 })
 * @param {Array} data.transactions - Array of transactions
 * @returns {Promise<string>} Natural language summary paragraph
 */
export async function generateMonthlySummaryWithAI(data) {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `
  You are an expert personal finance advisor. Analyze the user's spending data and write a concise, encouraging monthly spending summary (max 3 sentences).
  
  Data for analysis:
  - This Month's Total Spent: ₹${data.thisMonthTotal.toLocaleString("en-IN")}
  - Last Month's Total Spent: ₹${data.lastMonthTotal.toLocaleString("en-IN")}
  - Month-over-Month Change: ${data.momChangeText} (this month vs last month)
  - Spending by Category: ${JSON.stringify(data.categorySpend)}
  - Recent Transactions this month: ${JSON.stringify(data.transactions.slice(0, 10))}

  Write a short, insight-rich paragraph summarizing their spending patterns. 
  Highlight:
  1. The percentage/amount change compared to last month.
  2. The highest spending category.
  3. Any noticeable behavior (e.g., repeating descriptions, weekend orders, or single large transactions).
  
  Make it read like a human advisor talking to them. Do not use generic placeholders. Do not exceed 3 sentences. Do not use markdown headers or lists. Keep it simple and clean.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("generateMonthlySummaryWithAI error:", error);
    throw error;
  }
}
