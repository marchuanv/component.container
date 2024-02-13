import { CtorArgs, GUID, Metadata } from "../registry.mjs";
const privateBag = new WeakMap();
export class CtorArgsRegistry {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class } targetClass
    */
    static register(Id, ctorArgsClass, targetClass) {
        const prototypes = getExtendedCtorArgs(ctorArgsClass);
        const allProperties = {};
        for (const prototype of prototypes) {
            let properties = Object.getOwnPropertyDescriptors(prototype.prototype);
            properties = Object.keys(properties).filter(key => properties[key].get || properties[key].set);
            for (const propertyName of properties) {
                allProperties[propertyName] = null;
            }
        }
        const metadata = new Metadata(Id, ctorArgsClass, targetClass, allProperties);
        privateBag.get(Metadata).push(metadata);
    }
    /**
     * @returns { Array<Metadata> }
    */
    static get metadata() {
        return privateBag.get(Metadata);
    }
    /**
     * @param { { Id: GUID, ctorArgsClass: class, targetClass: class } } criteria
     * @returns { Metadata }
    */
    static find(criteria) {
        const { Id, ctorArgsClass, targetClass } = criteria;
        return privateBag.get(Metadata).find(reg =>
            (Id && reg.Id === Id) ||
            (targetClass && reg.targetClass === targetClass) ||
            (ctorArgsClass && reg.ctorArgsClass === ctorArgsClass)
        );
    }
}
privateBag.set(CtorArgsRegistry, []);
privateBag.set(Metadata, []);
/**
 * @param { class } Class
*/
function getExtendedCtorArgs(Class) {
    let extended = [Class];
    let prototype = Object.getPrototypeOf(Class);
    while (prototype) {
        extended.push(prototype);
        if (prototype === CtorArgs) {
            break;
        }
        prototype = Object.getPrototypeOf(prototype);
    }
    if (!extended.find(p => p === CtorArgs)) {
        throw new Error(`${Class.name} does not extend ${CtorArgs.name}`);
    }
    return extended;
}