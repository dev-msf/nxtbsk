import fetch from 'node-fetch';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'mistral';

export async function suggestTags({ name, description }: { name: string; description: string }): Promise<string[]> {
  try {
    const prompt = `Suggest 3 relevant tags (as a comma-separated list) for a product with the following details:\nName: ${name}\nDescription: ${description}\nTags:`;
    
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false }),
    });
    
    if (!res.ok) {
      console.error('Ollama API error:', res.status, res.statusText);
      // Fallback to basic tag extraction
      return extractBasicTags(name, description);
    }
    
    const data: any = await res.json();
    const text = (data.response || '').replace(/^\s*Tags?:?/i, '').trim();
    const tags = text
      .split(/,|\n/)
      .map((t: string) => t.trim().replace(/^["']|["']$/g, '')) // Remove quotes
      .filter(Boolean)
      .slice(0, 3);
    
    // If no tags were extracted, use fallback
    if (tags.length === 0) {
      return extractBasicTags(name, description);
    }
    
    return tags;
  } catch (error) {
    console.error('Tag suggestion error:', error);
    // Fallback to basic tag extraction
    return extractBasicTags(name, description);
  }
}
// if ollama fails, we fallback to basic tag extraction
function extractBasicTags(name: string, description: string): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const commonTags = [
    'electronics', 'clothing', 'books', 'home', 'kitchen', 'sports', 'beauty', 'health',
    'automotive', 'garden', 'office', 'baby', 'pet', 'outdoor', 'indoor', 'digital',
    'premium', 'budget', 'eco-friendly', 'organic', 'handmade', 'vintage', 'modern'
  ];
  
  const foundTags = commonTags.filter(tag => text.includes(tag));
  return foundTags.slice(0, 3);
} 