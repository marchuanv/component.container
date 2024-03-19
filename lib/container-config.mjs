import {
    GUID,
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
     * @param { class } ctorArgsClass
     * @returns {{ Class: class, ctorArgsClass: class }}
    */
    get(Class, ctorArgsClass) {
        const found = this.find(Class, ctorArgsClass);
        if (found.Class === null || found.ctorArgsClass === null) {
            throw new Error(`configuration not found.`);
        }
        return found;
    }
    /**
     * @param { class } Class
     * @param { class } ctorArgsClass
    */
    set(Class, ctorArgsClass) {
        const found = this.find(Class);
        if (found.Class === null && found.ctorArgsClass === null) {
            if (Reflection.isClass(Class) && Reflection.isClass(ctorArgsClass)) {
                new Type(Class);
                new Type(ctorArgsClass);
                const configurations = super.get(secureContext);
                configurations.push({ Class, ctorArgsClass });
            } else {
                throw new Error(`The Class or ctorArgsClass is not a class.`);
            }    
        }
        
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.get(secureContext).filer(x => x !== ContainerConfig);
    }
    /**
     * @param { class } Class
     * @param { class } ctorArgsClass
     * @returns {{ Class: class, ctorArgsClass: class }}
    */
    find(Class, ctorArgsClass) {
        const configurations = super.get(secureContext);
        const found = configurations.find(x => 
            (Class !== null && Class !== undefined && (x.Class === Class || x.Class === Class.prototype)) ||
            (ctorArgsClass !== null && ctorArgsClass !== undefined && (x.ctorArgsClass === ctorArgsClass || x.ctorArgsClass === ctorArgsClass.prototype))
        );
        if (found) {
            return found;
        } else {
            return {
                Class: undefined,
                ctorArgsClass: undefined
            };
        }
    }
}