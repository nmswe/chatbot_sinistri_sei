import { VillainState } from '@/app/types/useChatTypes/useChat';
import { Villain, VillainArray } from './Villain';

export function defeatVillain(villainState:VillainState): {villainState: VillainState, currentVillain: Villain} {
    //This tool is called by the model when it thinks the villain is defeated.
    //1. Increment the defeat counter
    villainState.defeatCounter++;
    //2. Set the current villain as defeated
    VillainArray[villainState.currentIndex].defeated = true;
    //3. Move to the next villain
    const nextVillain = getNextVillain(villainState);
    villainState.currentIndex = VillainArray.indexOf(nextVillain);
    return {villainState, currentVillain: nextVillain};
}

export function getCurrentVillain(villainState:VillainState): Villain {
    if(!villainState || typeof villainState.currentIndex !== "number"){
        return VillainArray[0];
    }
    return VillainArray[villainState.currentIndex];
}

function getNextVillain(villainState: VillainState): Villain {
    const villainCount = VillainArray.length;
    return VillainArray[villainState.defeatCounter%villainCount];
}