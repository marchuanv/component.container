import {
    Config
} from '../../registry.mjs';
import {
    Animal, AnimalCtorArgs, Dog, DogCtorArgs
} from '../index.mjs';
export class AnimalConfig extends Config {
    constructor() {
        super();
        super.register(Animal, AnimalCtorArgs);
        super.register(Dog, DogCtorArgs);
    }
}