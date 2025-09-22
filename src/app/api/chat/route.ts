import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText } from 'ai';
import { defeatVillainTool, getCurrentVillain } from '../../../../lib/VillainService';
import { VillainState } from '@/app/types/useChatTypes/useChat';
import { ChatMessage } from '@/app/types/chatTypes/chat';

export async function POST(req: Request) {
    const { messages , villainState}: { messages: ChatMessage[], villainState: VillainState } = await req.json();
    
    const currentVillain = getCurrentVillain(villainState);
    const initialVillainIndex = villainState.currentIndex;

    const lastVillainMessageIndex = messages.findLastIndex( m => m.role === "assistant" && m.indexVillainMessage === initialVillainIndex );
    const didCurrentVillainSpeak = lastVillainMessageIndex >= 0 && messages[lastVillainMessageIndex].parts.some( p => p.type === "text" && p.text.trim().length > 0 );

    const didUserReply = didCurrentVillainSpeak && messages.slice(lastVillainMessageIndex+1).some( m => m.role === "user");

    const shouldAllowDefeat = didCurrentVillainSpeak && didUserReply;
    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        system: currentVillain.toPromptString(),
        messages: convertToModelMessages(messages, {ignoreIncompleteToolCalls : true}),
        tools: shouldAllowDefeat? { defeatVillain: defeatVillainTool(villainState) }: {},
    });

    const modelMessage: ChatMessage | null = text.trim()? {
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
