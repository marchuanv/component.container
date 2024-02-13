const privateBag = new WeakMap();
export class Property {
    /**
     * @param { String } key
     * @param { Object } value
     * @param { class } type
     * @param { class } Class
    */
    constructor(key, value, type, Class, isSetter, isGetter, isPrivate = true) {
        privateBag.set(this, {
            key,
            value,
            type,
            Class,
            isPrivate,
            isSetter,
            isGetter,
            callbacks: []
        });
    }
    /**
     * @returns { String }
    */
    get key() {
        const { key } = privateBag.get(this);
        return key;
    }
    /**
     * @returns { String }
    */
    get type() {
        const { type } = privateBag.get(this);
        return type;
    }
    /**
    * @returns { class }
    */
    get Class() {
        const { Class } = privateBag.get(this);
        return Class;
    }
    /**
     * @returns { Object }
    */
    get value() {
        const { value } = privateBag.get(this);
        return value;
    }
    /**
     * @param { Object } value
    */
    set value(value) {
        const bag = privateBag.get(this);
        const { callbacks } = bag;
        if (callbacks.length === 0) {
            bag.value = value;
        } else {
            for (const callback of callbacks) {
                bag.value = callback(value)
            }
        }
    }
    /**
     * @returns { Boolean }
    */
    get isPrivate() {
        const { isPrivate } = privateBag.get(this);
        return isPrivate;
    }
    /**
     * @param { Function } value
    */
    set callback(value) {
        const { callbacks } = privateBag.get(this);
        return callbacks.push(value);
    }
    /**
     * @returns { Boolean }
    */
    get isGetter() {
        const { isGetter } = privateBag.get(this);
        return isGetter;
    }
    /**
     * @returns { Boolean }
    */
    get isSetter() {
        const { isSetter } = privateBag.get(this);
        return isSetter;
    }
}