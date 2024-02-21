import { Config } from '../../registry.mjs';
import {
    Animal,
    AnimalCtorArgs,
    Dog, DogCtorArgs
} from '../index.mjs';
export class DogConfig extends Config {
    constructor() {
        super();
        super.register(Dog, DogCtorArgs);
        super.register(Animal, AnimalCtorArgs);
    }
}