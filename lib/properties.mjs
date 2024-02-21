import { GUID, Property, Reference, Reflection } from "../registry.mjs";
const privateBag = new WeakMap();
const namespace = 'component.properties';
export class Properties {
    /**
     * @param { GUID } Id
     * @returns { Properties }
    */
    constructor(Id) {
        const targetClass = new.target;
        if (targetClass === Properties) {
            throw new Error(`${Properties.name} is an abstract class`);
        }
        Object.freeze(this);
        const namespace = `component.${targetClass.name.toLowerCase()}.properties`;
        const ref = new Reference(namespace, Properties, new GUID({ Id: Id.toString() }));
        if (privateBag.has(ref)) {
            privateBag.set(this, ref);
        } else {
            const properties = [];
            const extendedClasses = Reflection.getExtendedClasses.call(this, targetClass)
                .filter(c => c !== Properties);
            for (const Class of extendedClasses) {
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
            privateBag.set(ref, properties);
            privateBag.set(this, ref);
        }
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        const ref = privateBag.get(this);
        return ref.Id;
    }
    /**
     * @param { class } Class
     * @returns { Array<Property> }
    */
    properties(Class = null) {
        const ref = privateBag.get(this);
        const properties = privateBag.get(ref);
        if (Class) {
            return properties.filter(p =>
                Reflection.getExtendedClasses(p.type)
                    .filter(c => c !== Properties)
                    .find(c => c === Class)
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