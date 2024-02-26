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
        return Property.get({ name: null }, String, Animal);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String, Animal);
    }
    /**
     * @returns { Number }
    */
    get age() {
        return Property.get({ age: null }, Number, Animal);
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        Property.set({ age: value }, Number, Animal);
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return Property.get({ weight: null }, Number, Animal);
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        Property.set({ weight: value }, Number, Animal);
    }
    /**
     * @returns { Food }
    */
    get food() {
        return Property.get({ food: null }, Food, Animal);
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        Property.set({ food: value }, Food, Animal);
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