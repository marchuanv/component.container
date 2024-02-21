import { Specs, TypeRegistry } from "../registry.mjs";
import { AnimalCtorArgs } from "./classes/animal-ctor-args.mjs";
import { Animal } from "./classes/animal.mjs";
import { DogCtorArgs } from "./classes/dog-ctor-args.mjs";
import { Dog } from "./classes/dog.mjs";
import { FoodCtorArgs } from "./classes/food-ctor-args.mjs";
import { Food } from "./classes/food.mjs";
TypeRegistry.register([
    { namespace: 'common.container', Class: AnimalCtorArgs, isSingleton: false },
    { namespace: 'common.container', Class: Animal, isSingleton: false },
    { namespace: 'common.container', Class: DogCtorArgs, isSingleton: false },
    { namespace: 'common.container', Class: Dog, isSingleton: false },
    { namespace: 'common.container', Class: FoodCtorArgs, isSingleton: false },
    { namespace: 'common.container', Class: Food, isSingleton: false }
]);
const specs = new Specs(60000, './');
specs.run();
export { Animal, AnimalCtorArgs, Dog, DogCtorArgs, Food, FoodCtorArgs };

