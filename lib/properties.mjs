import { GUID, Property } from "../registry.mjs";
const privateBag = new WeakMap();
export class Properties {
    /**
     * @param { GUID } Id
    */
    constructor(Id) {
        const targetClass = new.target;
        if (targetClass === Properties) {
            throw new Error(`${Properties.name} is an abstract class`);
        }
        if (privateBag.has(Id)) {
            privateBag.set(this, Id);
        } else {
            const properties = [];
            for (const Class of getPrototypes.call(this, targetClass)) {
                const classProperties = Reflect.ownKeys(Class.prototype).filter(key => key !== 'constructor');
                for (const propertyKey of classProperties) {
                    const { get, set } = Reflect.getOwnPropertyDescriptor(Class.prototype, propertyKey);
                    if (get) {
                        properties.push(new Property(get, null, propertyKey, targetClass));
                    }
                    if (set) {
                        properties.push(new Property(null, set, propertyKey, targetClass));
                    }
                }
            }
            privateBag.set(Id, properties);
            privateBag.set(this, Id);
        }
        Object.freeze(this);
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        return privateBag.get(this);
    }
    /**
     * @param { class } Class
     * @returns { Array<Property> }
    */
    properties(Class = null) {
        const properties = privateBag.get(this.Id);
        if (Class) {
            return properties.filter(p =>
                getPrototypes(p.type).find(t => t === Class)
            );
        }
        return properties;
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { Boolean }
    */
    has(property, type) {
        if (this.properties().find(p => property[p.key] !== undefined && p.type === type)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    get(property, type) {
        if (this.has(property, type)) {
            const prop = this.properties().find(p => property[p.key] !== undefined && p.type === type);
            return prop.value;
        } else {
            throw new Error(`${JSON.stringify(property)} property not found.`);
        }
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    set(property, type) {
        if (this.has(property, type)) {
            const prop = this.properties().find(p => property[p.key] !== undefined && p.type === type);
            prop.value = property[prop.key];
        } else {
            throw new Error(`${JSON.stringify(Object.keys(property)[0])} property not found.`);
        }
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @param { Function } callback
     * @returns { T }
    */
    onSet(property, type, callback) {
        if (this.has(property, type)) {
            const prop = this.properties().find(p => property[p.key] !== undefined && p.type === type);
            prop.callback = callback
        } else {
            throw new Error(`${JSON.stringify(Object.keys(property)[0])} property not found.`);
        }
    }
}
/**
 * @param { class } Class
 * @return { Array<class> }
*/
function getPrototypes(Class) {
    if (Class === Properties) {
        return [];
    }
    let prototypes = [Class];
    const proto = Object.getPrototypeOf(Class);
    if (!proto) {
        return [];
    }
    prototypes = getPrototypes.call(this, proto).concat(prototypes);
    return prototypes;
}
