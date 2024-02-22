import { Register, Specs } from "../registry.mjs";
import { AnimalConfig } from "./classes/animal-config.mjs";
import { AnimalCtorArgs } from "./classes/animal-ctor-args.mjs";
import { Animal } from "./classes/animal.mjs";
import { DogConfig } from "./classes/dog-config.mjs";
import { DogCtorArgs } from "./classes/dog-ctor-args.mjs";
import { Dog } from "./classes/dog.mjs";
import { FoodConfig } from "./classes/food-config.mjs";
import { FoodCtorArgs } from "./classes/food-ctor-args.mjs";
import { Food } from "./classes/food.mjs";
Register.add(AnimalConfig);
Register.add(DogConfig);
Register.add(FoodConfig);
const specs = new Specs(60000, './');
specs.run();
export { Animal, AnimalConfig, AnimalCtorArgs, Dog, DogConfig, DogCtorArgs, Food, FoodConfig, FoodCtorArgs };

