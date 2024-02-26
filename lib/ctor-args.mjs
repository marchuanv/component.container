import {
    ContainerCtorArgsRef,
    Reflection
} from "../registry.mjs";
export class CtorArgs {
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
            const ctorArgsClass = ctorArgsClasses[0];
            new ContainerCtorArgsRef(targetClass, ctorArgsClass);
        } else {
            throw new Error(`further extension of the ${ctorArgsClass.name} class is not allowed.`);
        }
    }
}