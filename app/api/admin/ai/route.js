import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { title, description, features } = await req.json();

    const prompt = `
    Create SEO optimized content for an e-commerce product.
    Product Title: ${title}
    Description: ${description}
    Features: ${features.join(', ')}

    Generate:
    1. SEO-friendly Title
    2. Meta Description (max 160 chars)
    3. Tags / Keywords (comma separated)
    4. Short Description
    5. Long Description
    Return as JSON: { seoTitle, metaDescription, tags, shortDescription, longDescription }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert SEO content writer.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const resultText = response.choices[0].message.content;

    // Expecting JSON from GPT
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI', raw: resultText }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
