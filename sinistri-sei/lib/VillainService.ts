import { Villain, VillainArray } from './Villain';
export interface VillainState {
   currentIndex: number;
   defeatCounter:number;
}

export function defeatVillain(state: VillainState): {state: VillainState, currentVillain: Villain} {
    //This tool is called by the model when it thinks the villain is defeated.
    //1. Increment the defeat counter
    state.defeatCounter++;
    //2. Set the current villain as defeated
    VillainArray[state.currentIndex].defeated = true;
    //3. Move to the next villain
    const nextVillain = getNextVillain(state);
    state.currentIndex = VillainArray.indexOf(nextVillain);
    return {state, currentVillain: nextVillain};
}

export function getCurrentVillain(state:VillainState): Villain {
    if(!state || typeof state.currentIndex !== "number"){
        return VillainArray[0];
    }
    return VillainArray[state.currentIndex];
}

function getNextVillain(state: VillainState): Villain {
    const villainCount = VillainArray.length;
    if (state.defeatCounter < villainCount) {
        return VillainArray[state.defeatCounter];
    }
    // If all the villains are defeated, return a random one
    const nextVillainIndex = Math.floor(Math.random() * villainCount);
    return VillainArray[nextVillainIndex];
}