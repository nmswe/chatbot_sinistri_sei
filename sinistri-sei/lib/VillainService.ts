import { Villain, VillainArray } from "./Villain";

export function isVillainDefeated(lastModelMessage: string): boolean {
    return lastModelMessage.toLowerCase().includes("ti passo al collega");
}

export function getNextVillain(defeatedCount: number): Villain {
    const villainCount = VillainArray.length;
    if (defeatedCount < villainCount) {
        return VillainArray[defeatedCount];
    }
    // If all the villains are defeated, return a random one
    const nextVillainIndex = Math.floor(Math.random() * villainCount);
    return VillainArray[nextVillainIndex];
}