import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateRequest {
  businessName: string;
  industry: string;
  location: string;
  services: string;
  targetAudience: string;
  tone: string;
  uniqueSellingPoints: string;
  contentType: "landing" | "full";
}

function buildPrompt(data: GenerateRequest): string {
  const pages =
    data.contentType === "landing"
      ? ["Landing Page"]
      : ["Home", "About", "Services", "Contact"];

  return `You are an expert website copywriter and local SEO specialist. Generate professional, conversion-focused website copy for the following business.

BUSINESS DETAILS:
- Business Name: ${data.businessName}
- Industry: ${data.industry}
- Location: ${data.location}
- Services/Products: ${data.services}
- Target Audience: ${data.targetAudience}
- Tone: ${data.tone}
- Unique Selling Points: ${data.uniqueSellingPoints}

GENERATE CONTENT FOR THESE PAGES: ${pages.join(", ")}

For each page, provide:
1. A suggested page title (SEO-optimised with local keywords)
2. Meta description (under 160 characters, includes location + primary keyword)
3. The full page copy with clear sections, headings (H1, H2, H3), and calls-to-action

COPY GUIDELINES:
- Write for humans first, search engines second
- Include natural local keyword placement (city/region + service)
- Use power words and emotional triggers
- Every section should guide the visitor toward taking action
- Include placeholder text like [PHONE NUMBER] or [EMAIL] where contact details would go
- For Services page: create a compelling description for each service mentioned
- For Contact page: include a compelling reason to get in touch

After ALL page content, provide a dedicated LOCAL SEO TIPS section with:
1. **Google Business Profile** — specific optimisation tips for their industry
2. **Local Keywords** — 15-20 keyword phrases they should target (location + service combinations)
3. **NAP Consistency** — explain what it is and why it matters
4. **Local Schema Markup** — provide a JSON-LD LocalBusiness schema template pre-filled with their details
5. **Review Strategy** — how to generate and respond to Google reviews
6. **Local Link Building** — 5 specific strategies for their industry/location
7. **On-Page SEO Checklist** — title tags, headers, image alt text, internal linking tips
8. **Content Marketing Ideas** — 5 blog post ideas targeting local search intent

Format the entire response in clean Markdown. Use --- to separate each page section. Mark the SEO section clearly with === LOCAL SEO STRATEGY ===.`;
}

export async function POST(request: NextRequest) {
  try {
    const data: GenerateRequest = await request.json();

    if (!data.businessName || !data.industry || !data.location) {
      return NextResponse.json(
        { error: "Business name, industry, and location are required." },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: buildPrompt(data),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: content.text });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
