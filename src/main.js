import { MOVE_CODES } from './engine/constants.js';
import { Entity } from './engine/entity.js';
import { createElementWithClass } from './utils/dom/index.js';

async function init() {
    const currentLevel = 1;

    const gameboard = createGameBoard(currentLevel);
    runGame(gameboard);
}

function createGameBoard(currentLevel) {
    const roomElement = document.querySelector('section.room');

    const ROWS_COUNT = 9;
    const CELLS_PER_ROW = 9;

    for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
        const roomRowElement = createRoomRow();

        for (let cellIndex = 0; cellIndex < CELLS_PER_ROW; cellIndex++) {
            roomRowElement.appendChild(createRowCell());
        }

        roomElement.appendChild(roomRowElement);
    }

    const mainCharacterElement = createMainCharacter();
    const goalElement = createGoal();
    const wallsElements = createWalls();

    roomElement.appendChild(mainCharacterElement);
    roomElement.appendChild(goalElement);

    wallsElements.forEach(wallElement => {
        roomElement.appendChild(wallElement);
    });

    function createRoomRow() {
        const rowElement = createElementWithClass('div', 'row');
        return rowElement;
    }

    function createRowCell() {
        const rowCellElement = createElementWithClass('div', 'cell');
        return rowCellElement;
    }

    function createMainCharacter() {
        const mainCharacterEntity = createElementWithClass('div', ['entity', 'main-character']);
        return mainCharacterEntity;
    }

    function createGoal() {
        const goalEntity = createElementWithClass('div', ['entity', 'goal']);

        const GOAL_POSITION_BY_LEVEL = {
            1: {
                top: 400,
                left: 35,
            },
        };

        const goalPosition = GOAL_POSITION_BY_LEVEL[currentLevel];

        goalEntity.style.top = `${goalPosition.top}px`;
        goalEntity.style.left = `${goalPosition.left}px`;

        return goalEntity;
    }

    function createWalls() {
        const wallsEntities = [];

        for (let i = 0; i < 2; i++) {
            const wallElement = createElementWithClass('div', ['entity', 'wall'], { wallId: i });
            roomElement.appendChild(wallElement);

            wallsEntities.push(wallElement);
        }

        wallsEntities[0].style.top = '322px';
        wallsEntities[0].style.left = 0;

        wallsEntities[1].style.top = '341px';
        wallsEntities[1].style.left = '80px';
        wallsEntities[1].classList.add('rotated');

        return wallsEntities;
    }

    return {
        currentLevel,
        elements: { roomElement, goalElement, mainCharacterElement, wallsElements },
    };
}

function runGame(gameBoard) {
    const {
        elements: { goalElement, wallsElements, mainCharacterElement },
    } = gameBoard;

    document.addEventListener('keydown', handleCharacterMovementState);
    document.addEventListener('keyup', handleCharacterMovementState);

    const goalEntity = new Entity(goalElement);
    const wallsEntities = wallsElements.map(wallElement => new Entity(wallElement));

    const mainCharacterEntity = new Entity(mainCharacterElement, {
        obstaclesEntities: [...wallsEntities],
        goalEntity,
    });

    // function gameLoop() {
    //     requestAnimationFrame(gameLoop);
    // }

    function handleCharacterMovementState({ key, type }) {
        const isActive = type === 'keydown';

        if (Object.prototype.hasOwnProperty.call(MOVE_CODES, key)) {
            mainCharacterEntity.animateEntity({ key, isActive });

            return;
        }
    }

    // Start game
    // requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
