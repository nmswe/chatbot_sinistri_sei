export function isVillainDefeated(lastModelMessage: string): boolean {
    return lastModelMessage.toLowerCase().includes("passo al collega");
}
