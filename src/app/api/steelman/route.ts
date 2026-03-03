import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const { allowed } = checkRateLimit(request);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 10 requests per hour. Please try again later." },
        { status: 429 }
      );
    }

    const { argument } = await request.json();

    if (!argument || typeof argument !== "string") {
      return NextResponse.json(
        { error: "Please provide an argument to steelman." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are an expert at steelmanning arguments—presenting the strongest possible version of a position, even if you disagree with it.

IMPORTANT: Do not steelman content that promotes violence, hatred toward groups (e.g., based on race, religion, ethnicity, or other protected characteristics), or illegal activity. If the argument falls into any of these categories, refuse politely. Respond with exactly: REFUSAL: [your polite explanation of why you cannot steelman this content]. Do not include the three sections when refusing.`,
      messages: [
        {
          role: "user",
          content: `Analyze the following argument or opinion and respond with exactly three sections, each clearly labeled:

## The Steelman
Present the strongest, most charitable version of this argument. Assume the best intentions, fill in reasonable assumptions, and make the case as compelling as possible.

## The Counter-Steelman
Now present the strongest objections and counterarguments. Challenge the steelman fairly and rigorously.

## The Kernel
Identify the core insight or truth that remains after both the steelman and counter-steelman. What is worth keeping from this argument?

---
ARGUMENT TO ANALYZE:
${argument}
---
Respond with only the three sections above. Use markdown formatting for readability.`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    const rawText =
      textContent && "text" in textContent ? textContent.text : "";

    // Check for refusal
    const refusalMatch = rawText.match(/^REFUSAL:\s*(.+)/s);
    if (refusalMatch) {
      return NextResponse.json(
        { error: refusalMatch[1].trim() },
        { status: 400 }
      );
    }

    // Parse the three sections
    const sections = parseSections(rawText);

    return NextResponse.json({
      steelman: sections.steelman,
      counterSteelman: sections.counterSteelman,
      kernel: sections.kernel,
    });
  } catch (error) {
    console.error("Steelman API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to steelman argument",
      },
      { status: 500 }
    );
  }
}

function parseSections(text: string): {
  steelman: string;
  counterSteelman: string;
  kernel: string;
} {
  const sectionPatterns = [
    /##\s*The Steelman\s*\n([\s\S]*?)(?=##\s*The Counter-Steelman|$)/i,
    /##\s*The Counter-Steelman\s*\n([\s\S]*?)(?=##\s*The Kernel|$)/i,
    /##\s*The Kernel\s*\n([\s\S]*?)$/i,
  ];

  const steelmanMatch = text.match(sectionPatterns[0]);
  const counterMatch = text.match(sectionPatterns[1]);
  const kernelMatch = text.match(sectionPatterns[2]);

  return {
    steelman: steelmanMatch?.[1]?.trim() ?? "Could not parse section.",
    counterSteelman: counterMatch?.[1]?.trim() ?? "Could not parse section.",
    kernel: kernelMatch?.[1]?.trim() ?? "Could not parse section.",
  };
}
