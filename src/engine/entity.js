import {
    getElementDimensions,
    getElementPositionOnDom,
    moveElementOnDom,
} from '../utils/dom/index.js';
import { checkElementsCollision } from './collision.js';
import { MAX_SPEED, MOVE_CODES, ROOM_SIZE } from './constants.js';
import { getActiveMovements } from './movement.js';

export class Entity {
    constructor(element, { obstaclesEntities = [], goalEntity } = {}) {
        this.state = {
            position: getElementPositionOnDom(element),
            movements: {
                UP: false,
                LEFT: false,
                DOWN: false,
                RIGHT: false,
            },
        };

        this.props = {
            element,
            obstaclesEntities,
            goalEntity,
            dimensions: getElementDimensions(element),
        };
    }

    setState = newState => {
        Object.entries(newState).forEach(([key, value]) => {
            this.state[key] = value;
        });
    };

    animateEntity = ({ key, isActive }) => {
        this.setActiveMovements({ key, isActive });

        const {
            state: { movements, position },
            props: { dimensions, obstaclesEntities, goalEntity },
        } = this;

        const nextPosition = { ...position };

        const updatePositionByMove = {
            UP() {
                nextPosition.y = Math.max(nextPosition.y - 1, 0);
            },
            DOWN() {
                nextPosition.y = Math.min(nextPosition.y + 1, ROOM_SIZE - dimensions.height / 2);
            },
            LEFT() {
                nextPosition.x = Math.max(nextPosition.x - 1, 0);
            },
            RIGHT() {
                nextPosition.x = Math.min(nextPosition.x + 1, ROOM_SIZE - dimensions.width / 2);
            },
            REVERT(prevPosition) {
                nextPosition.x = prevPosition.x;
                nextPosition.y = prevPosition.y;
            },
        };

        const isBlocking = obstacleEntity => this.willCollideWith(obstacleEntity, nextPosition);

        for (let i = 0; i < MAX_SPEED; i++) {
            Object.keys(movements).forEach(move => {
                const previousPosition = { ...nextPosition };

                updatePositionByMove[move]();

                if (obstaclesEntities.some(isBlocking)) {
                    updatePositionByMove.REVERT(previousPosition);
                }
            });

            this.setPosition(nextPosition);

            if (goalEntity && this.willCollideWith(goalEntity)) {
                alert('You win!');
            }
        }
    };

    willCollideWith = (targetEntity, nextPosition) => {
        return checkElementsCollision(this, targetEntity, nextPosition);
    };

    getDimensions = () => {
        return this.props.dimensions;
    };

    getPosition = () => {
        return this.state.position;
    };

    getBoundaries = nextPosition => {
        const position = nextPosition || this.getPosition();

        return {
            ...this.getDimensions(),
            ...position,
        };
    };

    setPosition = position => {
        this.setState({ position });

        moveElementOnDom(this.props.element, position);
    };

    setActiveMovements = ({ key, isActive }) => {
        if (!Object.prototype.hasOwnProperty.call(MOVE_CODES, key)) {
            return;
        }

        const movements = {
            ...this.state.movements,
            [MOVE_CODES[key]]: isActive,
        };

        this.setState({ movements: getActiveMovements(movements) });
    };
}
