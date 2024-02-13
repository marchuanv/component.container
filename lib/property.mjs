const privateBag = new WeakMap();
export class Property {
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } isReadOnly
     */
    constructor(name, value, isPrivate = true) {
        privateBag.set(this, { name, value, isPrivate, callbacks: [] });
    }
    /**
     * @returns { String }
    */
    get name() {
        const { name } = privateBag.get(this);
        return name;
    }
    /**
     * @returns { Object }
    */
    get value() {
        const { value } = privateBag.get(this);
        return value;
    }
    /**
     * @returns { Object }
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
}