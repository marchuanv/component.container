import { Container } from '../registry.mjs';
import {
    Dog,
    DogCtorArgs,
    Food,
    FoodCtorArgs
} from './index.mjs';
fdescribe('when container properties change', () => {
    it('should sync data', () => {

        try {
            Container.registerType(Food);

            const expectedName = 'Parody';
            const expectedAge = 5;

            const foodArgs = Container.create(FoodCtorArgs, FoodCtorArgs.prototype);
            foodArgs.isAdultFood = true;
            foodArgs.name = 'epol';

            const dogArgs = Container.create(DogCtorArgs, DogCtorArgs.prototype);
            dogArgs.age = expectedAge;
            dogArgs.name = expectedName;
            dogArgs.food = Container.create(Food, FoodCtorArgs.prototype, foodArgs);
            dogArgs.type = 'dog';
            dogArgs.weight = 24;
            dogArgs.vaccinationYears = ['2010', '2011', '2012'];

            const dog = Container.create(Dog, DogCtorArgs.prototype, dogArgs);
            expect(dog.name).toBe(expectedName);
            expect(dog.age).toBe(expectedAge);

            let fireCount = 0;
            dog.onSet({ name: null }, String, (value) => {
                fireCount = fireCount + 1;
                return expectedName;
            });
            dog.onSet({ age: null }, Number, (value) => {
                fireCount = fireCount + 1;
                return expectedAge;
            });
            dog.age = 25; //onChange
            dog.name = 'Lassy'; //onChange

            expect(fireCount).toBe(2);
            expect(dog.name).toBe(expectedName);
            expect(dog.age).toBe(expectedAge);
        } catch (error) {
            console.log(error);
            fail('did not expect errors.')
        }
    });
});
