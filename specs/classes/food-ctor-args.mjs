import {
    CtorArgs
} from '../../registry.mjs';
import { Food } from './food.mjs';
export class FoodCtorArgs extends CtorArgs {
    constructor() {
        super(Food);
    }
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value }, String);
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        super.set({ isAdultFood: value }, Boolean);
    }
    /**
     * @returns { Boolean }
    */
    get isAdultFood() {
        return super.get({ isAdultFood: null }, Boolean);
    }
}