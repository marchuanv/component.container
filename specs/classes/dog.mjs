import { Property } from 'component.property';
import {
    Animal,
    Food
} from '../index.mjs';
export class Dog extends Animal {
    /**
     * @returns { String }
    */
    get name() {
        return Property.get({ name: null }, String);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String);
    }
    /**
     * @returns { Number }
    */
    get age() {
        return Property.get({ age: null }, Number);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        Property.set({ age: value }, Number);
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return Property.get({ weight: null }, Number);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        Property.set({ weight: value }, Number);
    }
    /**
     * @returns { Food }
    */
    get food() {
        return Property.get({ food: null }, Food);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        Property.set({ food: value }, Food);
    }
    /**
     * @param { Number } meters
    */
    walk(meters) {

    }
    /**
     * @returns { Boolean }
    */
    isExhausted() {

    }
}