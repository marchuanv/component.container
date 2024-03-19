import { Container } from '../../registry.mjs';
export class FoodCtorArgs extends Container {
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
        return super.get({ name: value }, String);
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
        return super.get({ isAdultFood: value }, Boolean);
    }
}