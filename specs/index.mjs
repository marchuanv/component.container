import { ContainerConfig, Specs } from "../registry.mjs";
import { AnimalCtorArgs } from "./classes/animal-ctor-args.mjs";
import { Animal } from "./classes/animal.mjs";
import { DogCtorArgs } from "./classes/dog-ctor-args.mjs";
import { Dog } from "./classes/dog.mjs";
import { FoodCtorArgs } from "./classes/food-ctor-args.mjs";
import { Food } from "./classes/food.mjs";

const config = new ContainerConfig();
config.set(Animal, AnimalCtorArgs);
config.set(Dog, DogCtorArgs);
config.set(Food, FoodCtorArgs);
const specs = new Specs(60000, './');
specs.run();
export { Animal, AnimalCtorArgs, Dog, DogCtorArgs, Food, FoodCtorArgs };

