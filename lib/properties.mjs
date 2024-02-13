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
            for (const Class of getPrototypes.call(this, targetClass)) {
                const classProperties = Reflect.ownKeys(Class.prototype).filter(key => key !== 'constructor');
                for (const propertyKey of classProperties) {
                    const descriptor = Reflect.getOwnPropertyDescriptor(Class.prototype, propertyKey);
                    const { get, set } = descriptor;
                    createProperty.call(this, Id, Class, propertyKey, get ? true : false, set ? true : false);
                }
            }
            privateBag.set(this, Id);
        }
        Object.freeze(this);
    }
    /**
     * @param { class } Class
     * @returns { Array<Property> }
    */
    properties(Class = null) {
        const Id = privateBag.get(this);
        const properties = ensureBag.call(this, Id);
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
        try {
            getProperty.call(this, property, type);
            return true;
        } catch (error) {
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
        let prop = getProperty.call(this, property, type);
        return prop.value;
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    set(property, type) {
        const prop = getProperty.call(this, property, type);
        prop.value = property;
    }
}
/**
 * @param { PropertiesId } propertiesId
 * @returns { Array<Property> }
*/
function ensureBag(propertiesId) {
    if (!propertiesId) {
        throw new Error('propertiesId argument is null or undefined');
    }
    if (!privateBag.has(propertiesId)) {
        const properties = Array();
        privateBag.set(propertiesId, properties);
    }
    privateBag.set(this, propertiesId);
    return privateBag.get(propertiesId);
}
/**
 * @param { Object } prop
 * @param { class } type
 * @returns { Property }
*/
function getProperty(prop, type) {
    const key = Object.keys(prop)[0];
    const Id = privateBag.get(this);
    const properties = ensureBag.call(this, Id);
    const found = properties.find(p =>
        p.key === key &&
        p.type === type.name
    );
    if (!found) {
        throw new Error(`property: ${key} of type: ${type.name} not found in class: ${this.constructor.name}`);
    }
    return found;
}
/**
 * @param { PropertiesId } Id
 * @param { String } script
 * @param { String } propertyName
 * @param { Boolean } isGetter
 * @param { Boolean } isSetter
*/
function createProperty(Id, Class, propertyName, isGetter, isSetter) {
    let _script = Class.toString().replace(/\s/g, '');
    const properties = ensureBag.call(this, Id);
    const gettersetterRegEx = [{
        name: 'getterA',
        getter: true,
        setter: false,
        expression: new RegExp(`returnsuper\\.get\\(\\{${propertyName}\\:null},[\\w]+\\)`)
    }, {
        name: 'setterA',
        getter: false,
        setter: true,
        expression: new RegExp(`super\\.set\\(\\{${propertyName}\\:[\\w\\$\\#\\@]+\\},[\\w]+\\)`)
    }, {
        name: 'setterB',
        getter: false,
        setter: true,
        expression: new RegExp(`super\\.set\\(\\{${propertyName}\},[\\w]+\\)`)
    }];
    const typeRegEx = /(?<=\}\,)[\w]+(?=\))/;

    let results = [];
    for (const { name, getter, setter, expression } of gettersetterRegEx) {
        const match = expression.exec(_script);
        results.push({
            name,
            expression,
            getter,
            setter,
            match: match ? match[0] : null
        });
    }
    for (const result of results.filter(r => r.match)) {
        const { match, setter, getter } = result;
        if (!match.startsWith('super.set') && setter) {
            result.match = null;
        } else if (!match.startsWith('returnsuper.get') && getter) {
            result.match = null;
        }
    }
    const getterResults = results.filter(r => r.getter && r.getter === isGetter);
    const setterResults = results.filter(r => r.setter && r.setter === isSetter);
    let getterSetterResults = getterResults.concat(setterResults);
    getterSetterResults = getterSetterResults.filter(r => r.match);
    if (getterSetterResults.length > 0) {
        let { match } = getterSetterResults[0];
        match = typeRegEx.exec(match);
        if (match) {
            results = match[0];
            const type = results;
            const prop = new Property(propertyName, null, type, Class, isSetter, isGetter);
            properties.push(prop);
            return;
        }
    }
    const message = `unable to create a ${isGetter ? 'get' : ''}${isSetter ? 'set' : ''} ${propertyName} property for the ${Class.name} class`;
    let info = '';
    let expression = '';
    if (isGetter) {
        if (getterResults.length === 0) {
            info = 'no getter results.';
        } else {
            info = 'no setter results due to regex match';
            ({ expression } = getterResults[0]);
        }
    } else if (isSetter) {
        if (setterResults.length === 0) {
            info = 'no setter results.';
        } else {
            info = 'no setter results due to regex match';
            ({ expression } = setterResults[0]);
        }
    } else {
        return;
    }
    throw new Error(`\r\n-> Message: ${message},\r\n${info ? `-> Info: ${info}` : ''}${expression ? `\r\n-> RegEx: ${expression}\r\n-> Script: ${_script}` : ''}`);
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