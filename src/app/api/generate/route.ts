import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

// Define the expected request schema
const requestSchema = z.object({
    emojis: z.string(),
    emojiRequestId: z.string().uuid(),
});

export async function POST(request: Request) {
    const body = await request.json();
    // Validate the request body
    const { emojis, emojiRequestId } = requestSchema.parse(body);

    const response = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Generate a tasteful text prompt based on the following emojis to make some insturmental music. Do not include any emojis in the response: ${emojis}`,
    });

    return Response.json({
        response: response.text,
        emojiRequestId
    });
}
