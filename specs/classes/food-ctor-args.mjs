import {
    CtorArgs, Property
} from '../../registry.mjs';
import { Food } from '../index.mjs';
export class FoodCtorArgs extends CtorArgs {
    constructor() {
        super(Food);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        Property.set({ name: value }, String);
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        Property.set({ isAdultFood: value }, Boolean);
    }
}