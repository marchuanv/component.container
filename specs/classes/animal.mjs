import {
    Container, Property
} from '../../registry.mjs';
export class Animal extends Container {
    /**
     * @returns { String }
    */
    get type() {
        return Property.get({ type: null }, String);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        Property.set({ type: value }, String);
    }
    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        return Property.set({ vaccinationYears: null }, Array);
    }
    /**
     * @template T
     * @param { T } type
     * @returns { T }
    */
    animalType(type) {
    }
}
