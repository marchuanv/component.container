import {
    Config
} from '../../registry.mjs';
import {
    Food,
    FoodCtorArgs
} from '../index.mjs';
export class FoodConfig extends Config {
    constructor() {
        super();
        super.register(Food, FoodCtorArgs);
    }
}