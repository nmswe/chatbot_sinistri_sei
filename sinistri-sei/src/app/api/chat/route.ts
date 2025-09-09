import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { VillainArray } from "../../../../lib/Villain";


export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    const result = streamText({
        model: google('gemini-2.5-flash'),
        system: VillainArray[0].toString(),
        messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
