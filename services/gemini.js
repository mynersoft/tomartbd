import { GoogleGenAI } from '@google/genai';

export const generateComboMarketing = async (title, products) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const productList = products.map((p) => p.name).join(', ');

  const prompt = `Act as a creative e-commerce copywriter for TomartBD, a high-quality grocery delivery service in Bangladesh. 
  Create a compelling, SEO-friendly marketing description for a new Combo Bundle called "${title}".
  The bundle contains: ${productList}.
  
  Include:
  1. A catchy hook.
  2. Benefits of buying this bundle (saving money, convenience).
  3. A call to action.
  Keep it professional yet friendly. Max 3 paragraphs. Respond in plain text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Could not generate description at this time. Please write it manually.';
  }
};
