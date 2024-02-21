import {
    GUID,
    Properties,
    Reference,
    Type
} from "../registry.mjs";
let runRules = true;
/**
 * @callback ConfigCallback
 * @param { Config } config
*/
export class Config extends Properties {
    /**
     * @param { String } namespace
    */
    constructor(namespace) {
        const target = new.target;
        if (runRules) {
            if (target === Config.prototype || target === Config) {
                throw new Error(`${Config.name} is an abstract class`);
            }
        }
        super(new GUID({ namespace }));
        super.set({ target }, Object);
        super.set({ namespaces: [] }, Array);
    }
    /**
     * @param { class } targetClass
     * @param { class } targetClass
     * @param { class } ctorArgsClass
    */
    register(targetClass, ctorArgsClass) {
        let namespace = `components.config.${this.target.name}.${targetClass.name}.${ctorArgsClass.name}`;
        namespace = namespace.toLowerCase();
        if (!Reference.has(namespace, Config, super.Id)) {
            const ref = new Reference(namespace, Config, super.Id);
            runRules = false;
            const childConfig = ref.get([namespace]);
            childConfig.set({ config: { targetClass, ctorArgsClass } }, Object);
            runRules = true;
            this.namespaces.push(namespace);
        }
    }
    /**
     * @returns { Object }
    */
    get target() {
        return super.get({ target: null }, Object);
    }
    /**
     * @returns { Array }
    */
    get namespaces() {
        return super.get({ namespaces: null }, Array);
    }
    /**
     * @returns { { targetClass: class, ctorArgsClass: class } }
    */
    get config() {
        return super.get({ config: null }, Object);
    }
}
new Type('component.config', Config);