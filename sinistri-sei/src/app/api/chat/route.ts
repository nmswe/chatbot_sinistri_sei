import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, jsonSchema, tool, UIMessage } from 'ai';
import { defeatVillain, getCurrentVillain, VillainState } from '../../../../lib/VillainService';

export const defeatVillainTool = (state: VillainState) => tool({
    description: 'Marks the current villain as defeated and advances to the next one.',
    inputSchema: jsonSchema({}),
    execute: async () => {
        const { state: newState, currentVillain } = defeatVillain(state);
        return { state: newState, villain: currentVillain};
    },
});

export async function POST(req: Request) {
    const { messages , state}: { messages: UIMessage[], state: VillainState } = await req.json();
    console.log("Received state:", state);
    const currentVillain = getCurrentVillain(state);
    console.log("Current Villain:", currentVillain.name);

    const { text, toolResults } = await generateText({
        model: google('gemini-2.5-flash'),
        system: currentVillain.toPromptString(),
        messages: convertToModelMessages(messages),
        tools: { defeatVillain: defeatVillainTool(state) },
    });

    const modelMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text }],
    };

    const result = new Response(JSON.stringify({
        messages: [modelMessage],
        state,
        toolResults,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
