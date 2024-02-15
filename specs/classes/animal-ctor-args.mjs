import {
    CtorArgs
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
        super.set({ name: value }, String);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        super.set({ age: value }, Number);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        super.set({ weight: value }, Number);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        super.set({ food: value }, Food);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value }, String);
    }
    /**
     * @param { Array<String> } value
    */
    set vaccinationYears(value) {
        super.set({ vaccinationYears: value }, Array);
    }
    /**
     * @returns { Array<String> }
    */
    get vaccinationYears() {
        super.set({ vaccinationYears: null }, Array);
    }
}