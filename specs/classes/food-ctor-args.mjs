import {
    CtorArgs
} from '../../registry.mjs';
import { FoodConfig } from '../index.mjs';
export class FoodCtorArgs extends CtorArgs {
    constructor() {
        super(FoodConfig);
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