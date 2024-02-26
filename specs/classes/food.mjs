import {
    Container, Property
} from '../../registry.mjs';
export class Food extends Container {
    /**
     * @returns { String }
    */
    get name() {
        return Property.get({ name: null }, String, Food);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String, Food);
    }
    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return Property.get({ isAdultFood: null }, Boolean, Food);
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        Property.set({ isAdultFood: value }, Boolean, Food);
    }
}