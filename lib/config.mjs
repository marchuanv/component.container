import {
    GUID,
    Properties,
    Reference,
    Type
} from "../registry.mjs";
const privateBag = new WeakMap();
const unlockId = new GUID({ description: 'this guid is to indicate if a constructor should check the target type' });
const registryKey = {};
privateBag.set(unlockId);
privateBag.set(registryKey, new Set());
export class Config extends Properties {
    /**
     * @param { GUID } Id
    */
    constructor(Id = null) {
        const Class = new.target;
        if (privateBag.has(unlockId)) {
            if (Class === Config.prototype || Class === Config) {
                throw new Error(`${Config.name} is an abstract class`);
            }
        }
        if (Id) {
            super(Id);
        } else {
            const { Id } = createId(Class);
            super(Id);
        }
        super.set({ Class }, Object);
        super.set({ registry: new Set() }, Set);
    }
    /**
     * @returns { class }
    */
    get Class() {
        return super.get({ Class: null }, Object);
    }
    /**
     * @returns { class }
    */
    get targetClass() {
        return super.get({ targetClass: null }, Object);
    }
    /**
     * @returns { class }
    */
    get ctorArgsClass() {
        return super.get({ ctorArgsClass: null }, Object);
    }
    /**
     * @returns { Set<Reference> }
    */
    get registry() {
        return super.get({ registry: null }, Set);
    }
    /**
     * @param { class } targetClass
     * @param { class } targetClass
     * @param { class } ctorArgsClass
    */
    register(targetClass, ctorArgsClass) {
        const { Id, namespace } = createId(this.Class, targetClass, ctorArgsClass);
        privateBag.delete(unlockId);
        const config = new Config(Id);
        privateBag.set(unlockId);
        if (!Reference.has(namespace, config, Id)) {
            const ref = new Reference(namespace, config, Id);
            const _config = ref.get();
            _config.set({ targetClass }, Object);
            _config.set({ ctorArgsClass }, Object);
            _config.set({ Class: this.Class }, Object);
            this.registry.add(ref);
        }
    }
}
new Type('component.config', Config);
/**
 * @param { class } Class
 * @param { class } targetClass
 * @param { class } ctorArgsClass
 * @returns { { Id: GUID, namespace: String } }
*/
function createId(Class, targetClass = null, ctorArgsClass = null) {
    let namespace = 'component.config';
    if (Class) {
        namespace = `${namespace}.${Class.name}`;
    }
    if (targetClass) {
        namespace = `${namespace}.${targetClass.name}`;
    }
    if (targetClass && ctorArgsClass) {
        namespace = `${namespace}.${ctorArgsClass.name}`;
    }
    namespace = namespace.toLowerCase();
    return {
        Id: new GUID({ namespace }),
        namespace
    }
}