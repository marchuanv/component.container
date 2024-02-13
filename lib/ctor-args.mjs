import { CtorArgsRegistry } from "../registry.mjs";
const privateBag = new WeakMap();
export class CtorArgs {
    constructor() {
        const target = new.target;
        if (target === CtorArgs.prototype || target === CtorArgs) {
            throw new Error(`${CtorArgs.name} is an abstract class`);
        }
        const metadata = CtorArgsRegistry.find({ ctorArgsClass: target });
        const properties = JSON.parse(JSON.stringify(metadata.properties));
        privateBag.set(this, { properties });
    }
    /**
     * @param { Object } property
    */
    set(property) {
        const { properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        if (properties[key] === undefined) {
            throw new Error(`${key} property not found.`);
        }
        const value = property[key];
        properties[key] = value;
    }
    /**
     * @return { Object }
    */
    get(property) {
        const { properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        if (properties[key] === undefined) {
            throw new Error(`${key} property not found.`);
        }
        return properties[key];
    }
}