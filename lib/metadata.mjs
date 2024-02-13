const privateBag = new WeakMap();
export class Metadata {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class} targetClass
     * @param { class} configClass
    */
    constructor(Id, ctorArgsClass, targetClass, configClass) {
        privateBag.set(this, {
            Id,
            ctorArgsClass,
            targetClass,
            configClass
        });
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const { Id } = privateBag.get(this);
        return Id;
    }
    /**
     * @returns { class }
    */
    get ctorArgsClass() {
        const { ctorArgsClass } = privateBag.get(this);
        return ctorArgsClass;
    }
    /**
     * @returns { class }
    */
    get targetClass() {
        const { targetClass } = privateBag.get(this);
        return targetClass;
    }
    /**
     * @returns { class }
    */
    get configClass() {
        const { configClass } = privateBag.get(this);
        return configClass;
    }
}