import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, jsonSchema, tool, UIMessage } from 'ai';
import { defeatVillain, getCurrentVillain } from '../../../../lib/VillainService';
import { VillainState } from '@/app/types/useChatTypes/useChat';

export const defeatVillainTool = (villainState: VillainState) => tool({
    description: 'Marks the current villain as defeated and advances to the next one.',
    inputSchema: jsonSchema({}),
    execute: async () => {
        const { villainState: newState, currentVillain } = defeatVillain(villainState);
        return { state: newState, villain: currentVillain};
    },
});

export async function POST(req: Request) {
    const { messages , villainState}: { messages: UIMessage[], villainState: VillainState } = await req.json();
    const currentVillain = getCurrentVillain(villainState);

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        system: currentVillain.toPromptString(),
        messages: convertToModelMessages(messages),
        tools: { defeatVillain: defeatVillainTool(villainState) },
    });

    const modelMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text }],
        indexVillainMessage: villainState.currentIndex
    };

    const result = new Response(JSON.stringify({
        messages: [modelMessage],
        villainState,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
