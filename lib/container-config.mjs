import {
    GUID,
    ReferenceId,
    Reflection,
    Store,
    Type
} from '../registry.mjs';
const secureContext = {};
class ContainerConfigId extends GUID { }
const configId = new ContainerConfigId();
export class ContainerConfig extends Store {
    constructor() {
        super({ configId }, secureContext);
        if (!super.get(secureContext)) {
            super.set([], secureContext);
        }
    }
    /**
     * @param { class } Class
     * @param { ReferenceId } refId
     * @returns {{ Class: class, ctorArgsClass: class, refId: ReferenceId }}
    */
    get(Class = null, refId = null) {
        const configurations = super.get(secureContext);
        const found = configurations.find(x => x.Class === Class || x.refId === refId);
        if (!found) {
            throw new Error(`configuration not found.`);
        }
        return found;
    }
    /**
     * @param { class } Class
     * @param { class } ctorArgsClass
    */
    set(Class, ctorArgsClass) {
        if (Reflection.isClass(Class) && Reflection.isClass(ctorArgsClass)) {
            const configurations = super.get(secureContext);
            const found = configurations.find(x => x.Class === Class);
            if (found) {
                throw new Error(`can't override configuration.`);
            } else {
                new Type(Class);
                new Type(ctorArgsClass);
                configurations.push({ Class, ctorArgsClass, refId: new ReferenceId() });
                configurations.push({ Class: ctorArgsClass, ctorArgsClass: null, refId: new ReferenceId() });
            }
        } else {
            throw new Error(`The Class or ctorArgsClass is not a class.`);
        }
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.get(secureContext).filer(x => x !== ContainerConfig);
    }
}