import {
    Reflection, Type, TypeOptions
} from "../registry.mjs";
const typeOptions = new TypeOptions();
typeOptions.isSingleton = false;
export class CtorArgs extends Type {
    /**
     * @param { class } targetClass
    */
    constructor(targetClass) {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const extendedClasses = Reflection.getExtendedClasses(target);
        const ctorArgsIndex = extendedClasses.findIndex(c => c === CtorArgs);
        const ctorArgsClasses = extendedClasses.slice(ctorArgsIndex + 1, extendedClasses.length);
        if (ctorArgsClasses.length === 1) {
            super(typeOptions);
        } else {
            throw new Error(`further extension of the ${ctorArgsClass.name} class is not allowed.`);
        }
    }
}