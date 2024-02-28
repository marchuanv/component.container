import { CtorArgs, Property } from '../../registry.mjs';
import {
    Dog,
    Food
} from '../index.mjs';
export class DogCtorArgs extends CtorArgs {
    constructor() {
        super(Dog);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        Property.set({ age: value }, Number);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        Property.set({ weight: value }, Number);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        Property.set({ food: value }, Food);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        Property.set({ type: value }, String);
    }
    /**
     * @param { Array<String> } value
    */
    set vaccinationYears(value) {
        Property.set({ vaccinationYears: value }, Array);
    }
}