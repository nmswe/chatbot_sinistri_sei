import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, UIMessage } from 'ai';
import { VillainArray } from '../../../../lib/Villain';
import { isVillainDefeated } from '../../../../lib/VillainService';

let currentVillainIndex = 0;
let rightAnswers = 0;

export async function POST(req: Request) {
    let { messages }: { messages: UIMessage[] } = await req.json();

    const lastModelMessageObj = [...messages].reverse().find(m => m.role === 'assistant');
    const lastModelMessage = lastModelMessageObj?.parts
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ') || '';

    if (isVillainDefeated(lastModelMessage)) {
        currentVillainIndex = (currentVillainIndex + 1) % VillainArray.length;
        rightAnswers = 0;
        messages = [];
    }

    const currentVillain = VillainArray[currentVillainIndex];

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        system: currentVillain.toPromptString(),
        messages: convertToModelMessages(messages),
    });

    const modelMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text }],
    };

    const result = new Response(JSON.stringify({
        messages: [modelMessage],
        index: currentVillainIndex,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
