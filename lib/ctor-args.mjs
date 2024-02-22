import {
    Properties,
    Reflection,
    Register
} from "../registry.mjs";
export class CtorArgs extends Properties {
    /**
     * @param { class } configClass
    */
    constructor() {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const registerRefs = Array.from(Register.registers).map(ref => ref.get());
        const { Id } = config;
        super(Id);
        console.log(`${target.name} CTOR ID: ${Id}`);
        config.every(c => {
            const { ctorArgsClass, targetClass } = c;
            if (Reflection.hasExtendedClass(targetClass, ctorArgsClass)) {
                throw new Error(`${targetClass.name} extends ${ctorArgsClass.name}`);
            }
            const extendedClasses = Reflection.getExtendedClasses(ctorArgsClass).filter(c => c !== Properties);
            const ctorArgsIndex = extendedClasses.findIndex(c => c === CtorArgs);
            const directExtentionsOfCtorArgs = extendedClasses[ctorArgsIndex + 1];
            if (extendedClasses.length === 2) {
                for (const property of super.properties(ctorArgsClass)) {
                    if (property.isGetter) {
                        throw new Error(`${targetClass.name}: classes that extend ${CtorArgs.name} can only have setter properties`)
                    }
                }
            } else {
                throw new Error(`further extension of the ${directExtentionsOfCtorArgs.name} class is not allowed.`);
            }
        });
    }
}