import {
    Container,
    CtorArgs,
    Properties,
    Reference,
    Reflection,
    Registry
} from '../registry.mjs';
let locked = true;
export class ContainerRegistry extends Properties {
    /**
     * @param { class } ctorArgsClass
     * @param { CtorArgs } ctorArgs
     * @param { class } targetClass
     * @param { Reference } reference
    */
    constructor(ctorArgsClass, ctorArgs, targetClass) {
        if (locked) {
            throw new Error(`creating an instance of ${ContainerRegistry.name} is not allowed.`);
        }
        if (reference) {
            super(reference);
        } else {
            _registry = Registry.create();
            super(_registry.Id);
            if (new.target !== ContainerRegistry.prototype && new.target !== ContainerRegistry) {
                throw new Error(`${ContainerRegistry.name} is a sealed class`);
            }
            if (!Reflection.hasExtendedClass.call(this, ctorArgsClass, CtorArgs)) {
                throw new Error(`ctorArgsClass does not extend ${CtorArgs.name}`);
            }
            if (!(ctorArgs instanceof CtorArgs)) {
                throw new Error(`ctorArgs argument is not an instance of ${CtorArgs.name}`);
            }
            if (!Reflection.hasExtendedClass.call(this, targetClass, Container)) {
                throw new Error(`targetClass does not extend ${Container.name}`);
            }
            super.set({ ctorArgsClass }, Object);
            super.set({ ctorArgs }, CtorArgs);
            super.set({ targetClass }, Object);
        }
    }
    /**
     * @returns { class }
    */
    get ctorArgsClass() {
        return super.get({ ctorArgsClass: null }, Object);
    }
    /**
     * @returns { CtorArgs }
    */
    get ctorArgs() {
        return super.get({ ctorArgs: null }, CtorArgs);
    }
    /**
     * @returns { class }
    */
    get targetClass() {
        return super.get({ targetClass: null }, Object);
    }
    /**
     * @param { class } ctorArgs
     * @param { class } ctorArgsClass
     * @param { class } targetClass
     * @returns { Registry }
    */
    static register(ctorArgs, ctorArgsClass, targetClass) {
        locked = false;
        new ContainerRegistry(ctorArgsClass, ctorArgs, targetClass);
        locked = true;
    }
    /**
     * @param { { targetClass: class, ctorArgs: CtorArgs, ctorArgsClass: class } } criteria
    */
    static find(criteria) {
        const { targetClass, ctorArgs, ctorArgsClass } = criteria;
        const registry = new Registry();
        const matchConRegistry = registry.children.find(child => {
            const conReg = new ContainerRegistry(null, null, null, child);
            return conReg.targetClass === targetClass || conReg.ctorArgs === ctorArgs || conReg.ctorArgsClass === ctorArgsClass
        });
        return new ContainerRegistry(null, null, null, matchConRegistry);
    }
}