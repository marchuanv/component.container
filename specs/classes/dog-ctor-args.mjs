import { Container } from '../../registry.mjs';
import {
    Food
} from '../index.mjs';
export class DogCtorArgs extends Container {
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value }, String);
    }
    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: null }, String);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        super.set({ age: value }, Number);
    }
    /**
     * @returns { Number }
    */
    get age() {
        return super.get({ age: null }, String);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        super.set({ weight: value }, Number);
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return super.get({ weight: null }, String);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        super.set({ food: value }, Food);
    }
    /**
     * @param { Food } value
    */
    get food() {
        return super.get({ food: null }, Food);
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value }, String);
    }
    /**
     * @returns { String }
    */
    get type() {
        return super.get({ type: null }, String);
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
        return super.get({ vaccinationYears: null }, Array);
    }
}