import { GUID, Type } from "../registry.mjs";
const registry = new WeakMap();
export class TypeRegistry {
    /**
     * @param { Array<{ namespace: String, Class: class, isSingleton: Boolean }> } config
    */
    static register(config) {
        for (const { namespace, Class, isSingleton } of config) {
            const type = new Type(namespace, Class);
            if (!registry.has(type)) {
                registry.set(type, { isSingleton });
            }
        }
    }
    /**
     * @param { { namespace: String, Class: class } } criteria
     * @returns { Type }
    */
    static get(criteria) {
        const { namespace, Class } = criteria;
        const type = new Type(namespace, Class);
        if (registry.has(type)) {
            return registry.get(type);
        } else {
            throw new Error(`unregistered type: ${JSON.stringify({ namespace, Class: Class.name })}`);
        }
    }
}
TypeRegistry.register([
    { namespace: 'common', Class: String, isSingleton: false },
    { namespace: 'common', Class: Boolean, isSingleton: false },
    { namespace: 'common', Class: BigInt, isSingleton: false },
    { namespace: 'common', Class: Number, isSingleton: false },
    { namespace: 'common', Class: Object, isSingleton: false },
    { namespace: 'common', Class: Array, isSingleton: false },
    { namespace: 'common', Class: GUID, isSingleton: false }
]);