import { VillainState } from '@/app/types/useChatTypes/useChat';
import { Villain, VillainArray } from './Villain';

export function defeatVillain(villainState:VillainState): {villainState: VillainState, currentVillain: Villain} {
    console.log(villainState, "log VillainService");
    villainState.defeatCounter++;

    VillainArray[villainState.currentIndex].defeated = true;

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
