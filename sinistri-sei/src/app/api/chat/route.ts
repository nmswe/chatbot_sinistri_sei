import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { VillainArray } from "../../../../lib/Villain";
import { getNextVillain } from "../../../../lib/VillainService";


export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[]} = await req.json();
    const result = streamText({
        model: google('gemini-2.5-flash'),
        system: getNextVillain(0).toPromptString(),
        messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
