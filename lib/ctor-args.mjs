import {
    GUID,
    Properties,
    Reflection,
    Type
} from "../registry.mjs";
export class CtorArgs extends Properties {
    /**
     * @param { class } targetClass
    */
    constructor(targetClass) {
        const ctorArgsClass = new.target;
        let namespace = `component.${ctorArgsClass.name.toLowerCase()}`;
        new Type(namespace, ctorArgsClass);
        namespace = `component.${targetClass.name.toLowerCase()}`;
        new Type(namespace, targetClass);
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
            const Id = new GUID({
                targetClass: targetClass.toString(),
                ctorArgsClass: ctorArgsClass.toString(),
            });
            super(Id);
            for (const property of super.properties(ctorArgsClass)) {
                if (property.isGetter) {
                    throw new Error(`${targetClass.name}: classes that extend ${CtorArgs.name} can only have setter properties`)
                }
            }
        } else {
            throw new Error(`further extension of the ${directExtentionsOfCtorArgs.name} class is not allowed.`);
        }
    }
}