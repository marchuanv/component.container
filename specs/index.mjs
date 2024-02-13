import { Specs, TypeRegistry } from "../registry.mjs";
import { Animal, AnimalCtorArgs } from "./classes/animal.mjs";
import { Dog, DogCtorArgs } from "./classes/dog.mjs";
import { Food, FoodCtorArgs } from "./classes/food.mjs";

TypeRegistry.register([
    AnimalCtorArgs,
    Animal,
    DogCtorArgs,
    Dog,
    FoodCtorArgs,
    Food
]);

const specs = new Specs(60000, './');
specs.run();
export { Animal, AnimalCtorArgs, Dog, DogCtorArgs, Food, FoodCtorArgs };

