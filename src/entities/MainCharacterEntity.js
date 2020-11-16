import { Entity } from './Entity.js';

export class MainCharacterEntity extends Entity {
    constructor(element, otherEntities, defaultState) {
        super(element, otherEntities, defaultState);

        this.state = {
            ...this.state,
            isDopplegangerActive: false,
        };
    }

    toggleDoppleganger() {
        const isDopplegangerActive = !this.state.isDopplegangerActive;

        this.setState({ isDopplegangerActive });

        this.props.dopplegangerEntity.handleVisibility({ isAlive: isDopplegangerActive });
    }
}
