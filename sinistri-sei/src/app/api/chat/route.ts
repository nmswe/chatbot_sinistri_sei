import { google } from '@ai-sdk/google';
import { convertToModelMessages, generateText, jsonSchema, tool, UIMessage } from 'ai';
import { defeatVillain, getCurrentVillain } from '../../../../lib/VillainService';
import { VillainState } from '@/app/types/useChatTypes/useChat';
import { VillainArray } from '../../../../lib/Villain';

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
    // TODO: KEEP FIXING THIS BUG
    /*
    // Allow for tool calling just after the model says "corretto!"
    //1. Pick the last model message
    const lastModelMessage = messages.filter(m => m.role === "assistant").pop();
    console.log("Last model message:", lastModelMessage);
    //3. Check if the villain in the last message is the same as the current villain (might be the previous one if we just defeated it)
    const isSameVillain = lastModelMessage?.indexVillainMessage !== undefined && lastModelMessage.indexVillainMessage !== initialVillainIndex;
    //4. If it's the same villain, or the first villain, allow tool calling
    const shouldAllowDefeat = VillainArray.indexOf(currentVillain) == 0 || isSameVillain;
    console.log("Should allow defeat:", shouldAllowDefeat, " (isSameVillain:", isSameVillain, ", initialVillainIndex:", initialVillainIndex, ", currentVillainIndex:", VillainArray.indexOf(currentVillain), ")");
    */
    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        // prompt
        system: currentVillain.toPromptString(),
        // convert the messages list to AI
        messages: convertToModelMessages(messages, {ignoreIncompleteToolCalls : true}),
        tools: { defeatVillain: defeatVillainTool(villainState) },
        //TODO: KEEP FIXING!
        //  tools: shouldAllowDefeat? { defeatVillain: defeatVillainTool(villainState) }: {},
    });

    const modelMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text }],
        indexVillainMessage: initialVillainIndex,
    };

    const result = new Response(JSON.stringify({
        messages: [modelMessage],
        villainState,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    return result
}
