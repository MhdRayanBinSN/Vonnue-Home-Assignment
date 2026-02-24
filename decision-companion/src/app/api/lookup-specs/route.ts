import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a laptop spec lookup assistant. Given a laptop model name, return its approximate specifications in JSON format.

Return ONLY a valid JSON object with these exact keys:
{
  "price": <number, price in Indian Rupees (₹), approximate MRP>,
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
  "build": <number, build quality tier: 3=Plastic, 5=Metal+Plastic, 7=Full Aluminum, 9=Premium CNC>
}

IMPORTANT: 
- Return ONLY the JSON object, no markdown, no explanation
- Use the closest matching value from the allowed options for each field
- If the laptop has multiple configurations, use the most common/popular one
- Price should be the approximate Indian MRP in 2024-2025
- If you're not sure about a spec, use a reasonable estimate`;

export async function POST(request: NextRequest) {
    try {
        const { laptopName } = await request.json();

        if (!laptopName || typeof laptopName !== 'string') {
            return NextResponse.json(
                { error: 'Laptop name is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured. Add it to your .env.local file.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: `Look up specs for: "${laptopName}"` },
        ]);

        const responseText = result.response.text().trim();

        // Parse the JSON response (handle markdown code blocks if present)
        let jsonStr = responseText;
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        }

        const specs = JSON.parse(jsonStr);

        // Validate all required keys exist
        const requiredKeys = [
            'price', 'cpu', 'gpu', 'ram', 'ssd', 'hdd',
            'displaySize', 'refreshRate', 'resolution', 'battery', 'weight', 'build'
        ];

        for (const key of requiredKeys) {
            if (specs[key] === undefined) {
                return NextResponse.json(
                    { error: `AI response missing "${key}" field. Try again.` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ specs, source: 'gemini' });
    } catch (error) {
        console.error('Lookup error:', error);

        const message = error instanceof Error ? error.message : 'Unknown error';

        if (message.includes('JSON')) {
            return NextResponse.json(
                { error: 'AI returned invalid format. Try a more specific laptop name.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: `Failed to look up specs: ${message}` },
            { status: 500 }
        );
    }
}
