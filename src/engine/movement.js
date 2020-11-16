export function getActiveMovements(movements) {
    const activeMovements = { ...movements };

    for (const move in activeMovements) {
        if (!activeMovements[move]) {
            delete activeMovements[move];
        }
    }

    return activeMovements;
}
