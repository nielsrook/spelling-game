
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      incompleteSentence: {
        type: Type.STRING,
        description: "Een zin met een placeholder '[___]' waar het werkwoord ingevuld moet worden, gevolgd door het infinitief en de tijd tussen haakjes. Bijvoorbeeld: 'De monteur [___] de banden. (verwisselen, tegenwoordige tijd)'"
      },
      infinitive: {
        type: Type.STRING,
        description: "Het infinitief van het werkwoord. Bijvoorbeeld: 'verwisselen'"
      },
      correctForm: {
        type: Type.STRING,
        description: "De correcte vervoeging van het werkwoord. Bijvoorbeeld: 'verwisselt'"
      },
      tense: {
        type: Type.STRING,
        description: "De tijd waarin het werkwoord vervoegd moet worden (bijv. 'tegenwoordige tijd', 'verleden tijd', 'voltooid deelwoord')."
      },
      explanation: {
        type: Type.STRING,
        description: "Een korte, duidelijke uitleg van de spellingsregel die van toepassing is. Bijvoorbeeld: 'Stam + t, omdat \\'de monteur\\' de derde persoon enkelvoud is.'"
      }
    },
    required: ["incompleteSentence", "infinitive", "correctForm", "tense", "explanation"]
  }
};

export async function generateSpellingQuestions(count: number): Promise<Question[]> {
  try {
    const prompt = `Genereer een lijst van ${count} JSON-objecten voor een werkwoordspellingsoefening voor Nederlandse mbo-studenten (niveau 3/4). Elk object moet de opgegeven JSON-structuur hebben. Zorg voor een mix van verschillende werkwoordstijden (tegenwoordige tijd, verleden tijd, voltooid deelwoord) en moeilijkheidsgraden, inclusief sterke en zwakke werkwoorden en regels zoals 't kofschip. De zinnen moeten relevant zijn voor de belevingswereld van mbo-studenten, bijvoorbeeld over stage, werk, school of vrije tijd. Vermijd te kinderachtige of te academische taal.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsedResponse = JSON.parse(response.text);
    if (!Array.isArray(parsedResponse)) {
      throw new Error("API did not return an array.");
    }
    
    // Add a unique ID to each question
    return parsedResponse.map((q, index) => ({ ...q, id: index }));

  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Kon de vragen niet genereren. Probeer het later opnieuw.");
  }
}
