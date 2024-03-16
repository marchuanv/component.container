import {
    Type
} from "../registry.mjs";
export class CtorArgs extends Type {
    /**
     * @param { class } targetClass
    */
    constructor(targetClass) {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        super();
        const extendedClasses = super.extended.filter(x => x !== CtorArgs);
        if (extendedClasses.length !== 1) {
            throw new Error(`further extension of the ${ctorArgsClass.name} class is not allowed.`);
        }
        super.associate(targetClass);
    }
}