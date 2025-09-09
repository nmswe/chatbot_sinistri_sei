import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { VillainArray } from "../../../../lib/Villain";
import { isVillainDefeated } from "../../../../lib/VillainService";


let currentVillainIndex = 0;
let correctAnswersCount = 0;

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[]} = await req.json();

    const lastModelMessageObj = [...messages].reverse().find(m => m.role === 'assistant');
    const lastModelMessage = lastModelMessageObj?.parts
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ') || '';

    if (isVillainDefeated(lastModelMessage)) {
        currentVillainIndex = (currentVillainIndex + 1) % VillainArray.length;
        correctAnswersCount = 0;
    }

    const currentVillain = VillainArray[currentVillainIndex];
    
    const result = streamText({
        model: google('gemini-2.5-flash'),
        system: currentVillain.toPromptString(),
        messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
