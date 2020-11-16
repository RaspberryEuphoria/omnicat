import { Entity } from './engine/entity.js';
import { createElementWithClass } from './utils/dom/index.js';

async function init() {
    const currentLevel = 1;

    createGameBoard(currentLevel);
    runGame(currentLevel);
}

function createGameBoard(currentLevel) {
    const rooms = document.querySelectorAll('section.room');
    const mainRoomElement = rooms[0];

    const ROWS_COUNT = 9;
    const CELLS_PER_ROW = 9;

    rooms.forEach(() => {
        for (let rowIndex = 0; rowIndex < ROWS_COUNT; rowIndex++) {
            const roomRowElement = createRoomRow();

            for (let cellIndex = 0; cellIndex < CELLS_PER_ROW; cellIndex++) {
                roomRowElement.appendChild(createRowCell());
            }
        }
    });

    createMainCharacter();
    createGoal();
    createWalls();

    function createRoomRow() {
        const rowElement = createElementWithClass('div', 'row');
        mainRoomElement.appendChild(rowElement);

        return rowElement;
    }

    function createRowCell() {
        const rowCellElement = createElementWithClass('div', 'cell');
        mainRoomElement.appendChild(rowCellElement);

        return rowCellElement;
    }

    function createMainCharacter() {
        const mainCharacterEntity = createElementWithClass('div', ['entity', 'main-character']);
        mainRoomElement.appendChild(mainCharacterEntity);

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

        mainRoomElement.appendChild(goalEntity);

        return goalEntity;
    }

    function createWalls() {
        const wallsEntities = [];

        for (let i = 0; i < 2; i++) {
            const wallElement = createElementWithClass('div', ['entity', 'wall'], { wallId: i });
            mainRoomElement.appendChild(wallElement);

            wallsEntities.push(wallElement);
        }

        wallsEntities[0].style.top = '322px';
        wallsEntities[0].style.left = 0;

        wallsEntities[1].style.top = '341px';
        wallsEntities[1].style.left = '80px';
        wallsEntities[1].classList.add('rotated');

        return wallsEntities;
    }
}

function runGame() {
    document.addEventListener('keydown', e => handleCharacterMovementState(e, true));
    document.addEventListener('keyup', e => handleCharacterMovementState(e, false));

    const goalEntity = new Entity(document.querySelector('div.goal'));

    const wallsEntities = Array.from(document.querySelectorAll('div.wall')).map(
        el => new Entity(el),
    );

    const mainCharacterEntity = new Entity(document.querySelector('div.main-character'), {
        obstaclesEntities: [...wallsEntities],
        goalEntity,
    });

    // function gameLoop() {
    //     requestAnimationFrame(gameLoop);
    // }

    function handleCharacterMovementState({ key }, isMoving) {
        mainCharacterEntity.animateEntity({ key, isMoving });
    }

    // Start game
    // requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
