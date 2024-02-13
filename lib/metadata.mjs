const privateBag = new WeakMap();
export class Metadata {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class} targetClass
     * @param { Array<PropertyKey> } properties
    */
    constructor(Id, ctorArgsClass, targetClass, properties) {
        privateBag.set(this, { Id, ctorArgsClass, targetClass, properties });
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
     * @returns { Array<PropertyKey> }
    */
    get properties() {
        const { properties } = privateBag.get(this);
        return properties;
    }
}