import { GUID } from "utils";
const privateBag = new WeakMap();
export class TypeRegistry {
    /**
     * @param { Array } classes
    */
    static register(classes) {
        const types = privateBag.get(TypeRegistry);
        for (const Class of classes) {
            types.push({
                Id: new GUID(),
                name: Class.name,
                type: Class
            });
        }
    }
    /**
     * @param { { Id: GUID, className: String, Class: class } } criteria
     * @returns { class }
    */
    static get(criteria) {
        const { Id, className, Class } = criteria;
        const types = privateBag.get(TypeRegistry);
        const results = types.filter(type =>
            (Id && (type.Id === Id)) ||
            (className && (type.name === className)) ||
            (Class && type.Class === Class)
        );
        if (results[0]) {
            return results[0];
        }
        throw new Error(`could not resolve type for criteria: ${JSON.stringify(criteria)}`);
    }
}
privateBag.set(TypeRegistry, []);
TypeRegistry.register([
    String,
    Boolean,
    BigInt,
    Number,
    Object,
    Array
]);