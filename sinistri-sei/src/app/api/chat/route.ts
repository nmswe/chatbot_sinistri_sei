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
    const initialVillainIndex = villainState.currentIndex;
    
    // check if the current villain spoke at least once, not counting empty messages
    const lastVillainMessageIndex = messages.findLastIndex( m => m.role === "assistant" && m.indexVillainMessage === initialVillainIndex );
    const didCurrentVillainSpeak = lastVillainMessageIndex >= 0 && messages[lastVillainMessageIndex].parts.some( p => p.type === "text" && p.text.trim().length > 0 );

    // Allow for tool calling only if the model and the user have started chatting
    const didUserReply = didCurrentVillainSpeak && messages.slice(lastVillainMessageIndex+1).some( m => m.role === "user");

    const shouldAllowDefeat = didCurrentVillainSpeak && didUserReply;
    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        // prompt
        system: currentVillain.toPromptString(),
        // convert the messages list to AI. give the model only the messages from the current villain
        messages: convertToModelMessages(messages.filter(m => m.indexVillainMessage === initialVillainIndex), {ignoreIncompleteToolCalls : true}),
        tools: shouldAllowDefeat? { defeatVillain: defeatVillainTool(villainState) }: {},
    });

    // if the message is empty (can happen if just calls tool), return null to avoid rendering an empty message
    const modelMessage: UIMessage | null = text.trim()? {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text }],
        indexVillainMessage: initialVillainIndex,
    }: null;

    const result = new Response(JSON.stringify({
        messages: modelMessage ? [modelMessage] : [],
        villainState,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
