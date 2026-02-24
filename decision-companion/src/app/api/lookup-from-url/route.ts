import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const EXTRACT_PROMPT = `You are a laptop spec extraction assistant. You will be given HTML content from a laptop product page (Amazon, Flipkart, official site, etc.).

VALIDATION RULES (CHECK FIRST):
1. If the content does NOT appear to be a laptop product page, return: {"error": "not_laptop_page", "message": "This page doesn't appear to be a laptop product listing. Please paste a link to a laptop product page."}
2. If you cannot find enough specs in the content, return: {"error": "insufficient_data", "message": "Could not extract enough specs from this page. Try a different product link with more detailed specs."}

If valid, extract the specs and return a JSON object with these exact keys:
{
  "price": <number, price in Indian Rupees (₹)>,
  "cpu": <number, CPU tier: 3=i3/R3, 5=i5/R5, 7=i7/R7, 9=i9/R9, 7=M3, 9=M3Pro, 10=M3Max>,
  "gpu": <number, GPU tier: 1=Intel UHD/Iris, 2=AMD Radeon Integrated, 3=MX550/570, 5=RTX3050, 6=RTX4050, 7=RTX4060, 8=RTX4070, 10=RTX4080/4090, 4=M3 Integrated, 7=M3Pro GPU, 9=M3Max GPU>,
  "ram": <number, RAM in GB: 4, 8, 16, 18, 24, 32, or 64>,
  "ssd": <number, SSD size in GB: 0, 128, 256, 512, 1000, or 2000>,
  "hdd": <number, HDD size in GB: 0, 500, 1000, or 2000>,
  "displaySize": <number, screen size in inches: 13.3, 14, 15.6, 16, or 17.3>,
  "refreshRate": <number, Hz: 60, 90, 120, 144, 165, or 240>,
  "resolution": <number, resolution tier: 2=HD, 5=FHD, 7=2K/QHD, 8=Retina/3K, 9=4K>,
  "battery": <number, approximate battery life in hours>,
  "weight": <number, weight in kg>,
  "build": <number, build quality tier: 3=Plastic, 5=Metal+Plastic, 7=Full Aluminum, 9=Premium CNC>,
  "laptopName": <string, the full name of the laptop as found on the page>
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no explanation
- Extract price in ₹ — if listed in another currency, convert approximately
- Use the closest matching tier value from the allowed options
- If a spec is not listed on the page, make a reasonable estimate based on the laptop tier
- For battery, estimate hours from Wh capacity if exact hours not listed (divide Wh by ~10)`;

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'Product URL is required' },
                { status: 400 }
            );
        }

        // Basic URL validation
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL. Please paste a valid product page link.' },
                { status: 400 }
            );
        }

        // Only allow HTTP/HTTPS
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return NextResponse.json(
                { error: 'Only HTTP/HTTPS URLs are supported.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured.' },
                { status: 500 }
            );
        }

        // Fetch the product page
        let pageContent: string;
        try {
            const pageResponse = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml',
                },
                signal: AbortSignal.timeout(10000),
            });

            if (!pageResponse.ok) {
                return NextResponse.json(
                    { error: `Could not access the page (HTTP ${pageResponse.status}). The site may be blocking automated access. Try copy-pasting the laptop name instead.` },
                    { status: 400 }
                );
            }

            const html = await pageResponse.text();

            // Strip scripts, styles, and extract text content (limit to ~15000 chars for AI)
            pageContent = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 15000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            return NextResponse.json(
                { error: `Could not fetch the page: ${msg}. Try copy-pasting the laptop name instead.` },
                { status: 400 }
            );
        }

        if (pageContent.length < 100) {
            return NextResponse.json(
                { error: 'The page content is too short to extract specs. Try a different link.' },
                { status: 400 }
            );
        }

        // Call Gemini to extract specs
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent([
            { text: EXTRACT_PROMPT },
            { text: `Extract laptop specs from this product page content:\n\nURL: ${url}\n\nPage content:\n${pageContent}` },
        ]);

        const responseText = result.response.text().trim();

        let jsonStr = responseText;
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        }

        const parsed = JSON.parse(jsonStr);

        // Check if AI returned a validation error
        if (parsed.error) {
            return NextResponse.json(
                { error: parsed.message || 'Could not extract specs from this page.' },
                { status: 400 }
            );
        }

        // Extract laptop name if found
        const laptopName = parsed.laptopName || '';
        delete parsed.laptopName;

        return NextResponse.json({ specs: parsed, laptopName, source: 'url' });
    } catch (error) {
        console.error('URL extraction error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';

        if (message.includes('JSON')) {
            return NextResponse.json(
                { error: 'Could not extract specs from this page. Try a more detailed product page.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: `Failed to extract specs: ${message}` },
            { status: 500 }
        );
    }
}
