import {
    Container
} from '../../registry.mjs';
export class Animal extends Container {
    /**
     * @param { AnimalCtorArgs } animalArgs
    */
    constructor(animalArgs) {
        super(animalArgs);
    }
    /**
     * @returns { String }
    */
    get type() {
        return super.get({ type: null }, String);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value }, String);
    }
    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return super.get({ vaccinationYears: null }, Number);
    }
    /**
     * @template T
     * @param { T } type
     * @returns { T }
    */
    animalType(type) {
    }
}
