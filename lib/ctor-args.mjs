import {
    GUID,
    Properties
} from "../registry.mjs";
export class CtorArgs extends Properties {
    /**
     * @param { GUID } Id
    */
    constructor(Id = null) {
        const targetClass = new.target;
        if (Id) {
            super(Id);
        } else {
            if (targetClass === CtorArgs.prototype || targetClass === CtorArgs) {
                throw new Error(`${CtorArgs.name} is an abstract class`);
            }
            super(new GUID());
        }
        for (const property of super.properties()) {
            if (property.isGetter) {
                throw new Error(`${targetClass.name}: classes that extend ${CtorArgs.name} can only have setter properties`)
            }
        }
    }
}