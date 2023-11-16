import { EventEmitter, Relation } from './registry.mjs';
const privateBag = new WeakMap();
export class Bag extends Relation {
    /**
     * @param { Object } owner
    */
    constructor(owner) {
        super();
        if (!owner) {
            throw new Error('owner argument(Object) not provided.');
        }
        if (!privateBag.has(owner)) {
            const event = new EventEmitter();
            privateBag.set(this, { owner, event });
        }

    }
    get event() {
        const { event } = privateBag.get(this);
        return event;
    }
    /**
     * @param { Object } owner
     * @returns { Boolean }
    */
    isOwner(owner) {
        if (!owner) {
            throw new Error('owner argument(Object) not provided.');
        }
        const thisOwner = privateBag.get(this);
        if (!thisOwner.owner) {
            throw new Error(`owner of ${Bag.name} is undefined or null`);
        }
        if (thisOwner.owner === owner) {
            return true;
        }
        return false;
    }
}