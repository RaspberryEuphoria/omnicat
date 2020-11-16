import { MOVE_CODES } from './engine/constants.js';
import { Entity } from './entities/Entity.js';
import { MainCharacterEntity } from './entities/MainCharacterEntity.js';
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
    const dopplegangerElement = createDoppleganger();
    const goalElement = createGoal();
    const wallsElements = createWalls();

    roomElement.appendChild(mainCharacterElement);
    roomElement.appendChild(dopplegangerElement);
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

    function createDoppleganger() {
        const mainCharacterEntity = createElementWithClass('div', [
            'entity',
            'main-character',
            'doppleganger',
        ]);

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
        const wallPerspective = [];

        for (let i = 0; i < 2; i++) {
            const wallElement = createElementWithClass('div', ['entity', 'wall']);

            wallsEntities.push(wallElement);
        }

        for (let i = 0; i < 2; i++) {
            const wallElement = createElementWithClass('div', ['entity', 'wall-perspective']);
            roomElement.appendChild(wallElement);
            wallPerspective.push(wallElement);

            console.log(wallElement);
        }

        wallsEntities[0].style.top = '325px';
        wallsEntities[0].style.left = '-15px';

        wallsEntities[1].style.top = '341px';
        wallsEntities[1].style.left = '87px';
        wallsEntities[1].classList.add('rotated');

        wallPerspective[0].style.top = '317px';
        wallPerspective[0].style.left = '-15px';

        wallPerspective[1].style.top = '332px';
        wallPerspective[1].style.left = '85px';
        wallPerspective[1].classList.add('rotated');

        return wallsEntities;
    }

    return {
        currentLevel,
        elements: {
            roomElement,
            goalElement,
            mainCharacterElement,
            wallsElements,
            dopplegangerElement,
        },
    };
}

function runGame(gameBoard) {
    const {
        elements: { goalElement, wallsElements, mainCharacterElement, dopplegangerElement },
    } = gameBoard;

    document.addEventListener('keydown', handleCharacterMovementState);
    document.addEventListener('keyup', handleCharacterMovementState);

    const goalEntity = new Entity(goalElement);
    const wallsEntities = wallsElements.map(wallElement => new Entity(wallElement));

    const roomEntities = {
        obstaclesEntities: [...wallsEntities],
        goalEntity,
    };

    const dopplegangerEntity = new Entity(dopplegangerElement, roomEntities, { isAlive: false });

    const mainCharacterEntity = new MainCharacterEntity(mainCharacterElement, {
        ...roomEntities,
        dopplegangerEntity,
    });

    // function gameLoop() {
    //     requestAnimationFrame(gameLoop);
    // }

    function handleCharacterMovementState({ key, type }) {
        const isActive = type === 'keydown';
        const lowerKey = key.toLowerCase();

        if (Object.prototype.hasOwnProperty.call(MOVE_CODES, lowerKey)) {
            mainCharacterEntity.handleMovement({ key, isActive });
            dopplegangerEntity.handleMovement({ key, isActive });

            return;
        }

        if (isActive && lowerKey === 'a') {
            mainCharacterEntity.toggleDoppleganger();
        }
    }

    // Start game
    // requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
