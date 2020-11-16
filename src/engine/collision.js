export function checkElementsCollision(firstEntity, secondEntity, nextPosition) {
    const firstEntityBoundaries = { ...firstEntity.getBoundaries(nextPosition) };
    const secondEntityBoundaries = { ...secondEntity.getBoundaries() };

    return (
        firstEntityBoundaries.x < secondEntityBoundaries.x + secondEntityBoundaries.width &&
        firstEntityBoundaries.x + firstEntityBoundaries.width > secondEntityBoundaries.x &&
        firstEntityBoundaries.y < secondEntityBoundaries.y + secondEntityBoundaries.height &&
        firstEntityBoundaries.height + firstEntityBoundaries.y > secondEntityBoundaries.y
    );
}
