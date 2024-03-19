import {
    Container
} from '../../registry.mjs';
export class Animal extends Container {
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
        return super.get({ vaccinationYears: null }, Array);
    }
    /**
     * @param { Array<String> } value
    */
    set vaccinationYears(value) {
        return super.set({ vaccinationYears: value }, Array);
    }
    /**
     * @template T
     * @param { T } type
     * @returns { T }
    */
    animalType(type) {
    }
}
