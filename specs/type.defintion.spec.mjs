import { TypeDefinition } from "../registry.mjs";
import { Animal, Dog, Food } from "./index.mjs";
describe('when mapping types', () => {
    it('should register and find the Dog, Food and Animal classes', () => {
        for (const Class of [Animal, Dog, Food]) {
            const foundByClass = TypeDefinition.find({ type: Class });
            const foundByName = TypeDefinition.find({ typeName: Class.name });
            expect(foundByClass).toBeDefined();
            expect(foundByName).toBeDefined();
            expect(foundByClass).not.toBeNull();
            expect(foundByName).not.toBeNull();
            expect(foundByClass.isNative).toBeFalse();
            expect(foundByName.isReferenceType).toBeTrue();
        }
    });
    it('should register a class as an array', () => {
        const foundByClass = TypeDefinition.find({ type: Array });
        const foundByName = TypeDefinition.find({ typeName: Array.name });
        expect(foundByClass).toBeDefined();
        expect(foundByName).toBeDefined();
        expect(foundByClass).not.toBeNull();
        expect(foundByName).not.toBeNull();
        expect(foundByClass.isNative).toBeTrue();
        expect(foundByName.isReferenceType).toBeTrue();
    });
});