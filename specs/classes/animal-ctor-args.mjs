import {
    CtorArgs, Property
} from '../../registry.mjs';
import {
    Animal,
    Food
} from '../index.mjs';
export class AnimalCtorArgs extends CtorArgs {
    constructor() {
        super(Animal);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String, AnimalCtorArgs);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        Property.set({ age: value }, Number, AnimalCtorArgs);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        Property.set({ weight: value }, Number, AnimalCtorArgs);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        Property.set({ food: value }, Food, AnimalCtorArgs);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        Property.set({ type: value }, String, AnimalCtorArgs);
    }
    /**
     * @param { Array<String> } value
    */
    set vaccinationYears(value) {
        Property.set({ vaccinationYears: value }, Array, AnimalCtorArgs);
    }
}