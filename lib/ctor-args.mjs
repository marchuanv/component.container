import {
    ContainerRegistry,
    GUID,
    Properties,
    Reflection,
    Registry,
    TypeRegistry
} from "../registry.mjs";
export class CtorArgs extends Properties {
    /**
     * @param { class } targetClass
    */
    constructor(targetClass) {
        const ctorArgsClass = new.target;
        if (ctorArgsClass === CtorArgs.prototype || ctorArgsClass === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        if (Reflection.hasExtendedClass(targetClass, ctorArgsClass)) {
            throw new Error(`${targetClass.name} extends ${ctorArgsClass.name}`);
        }
        const extendedClasses = Reflection.getExtendedClasses(ctorArgsClass).filter(c => c !== Properties);
        const ctorArgsIndex = extendedClasses.findIndex(c => c === CtorArgs);
        const directExtentionsOfCtorArgs = extendedClasses[ctorArgsIndex + 1];
        if (extendedClasses.length === 2) {
            super(new GUID());
            for (const property of super.properties(ctorArgsClass)) {
                if (property.isGetter) {
                    throw new Error(`${targetClass.name}: classes that extend ${CtorArgs.name} can only have setter properties`)
                }
            }
            const registry = ContainerRegistry.register(this, ctorArgsClass, targetClass);
            super.set({ registry }, Registry);
        } else {
            throw new Error(`further extension of the ${directExtentionsOfCtorArgs.name} class is not allowed.`);
        }
    }
    /**
     * @returns { Registry }
    */
    get registry() {
        return super.get({ registry: null }, Registry);
    }
}
TypeRegistry.register([CtorArgs]);