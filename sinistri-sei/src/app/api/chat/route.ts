import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, UIMessage } from 'ai';
import { isVillainDefeated } from '../../../../lib/VillainService';
import { VillainArray } from '../../../../lib/Villain';

let currentVillainIndex = 0;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastModelMessageObj = [...messages].reverse().find(m => m.role === 'assistant');

    if(lastModelMessageObj && lastModelMessageObj?.index !== 0) {
        currentVillainIndex = lastModelMessageObj.index
    }

    const lastModelMessage = lastModelMessageObj?.parts
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join(' ') || '';

    if (isVillainDefeated(lastModelMessage)) {
        currentVillainIndex = (currentVillainIndex + 1) % VillainArray.length;
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
        index: currentVillainIndex
    };

    const result = new Response(JSON.stringify({
        messages: [modelMessage],
        index: currentVillainIndex,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
