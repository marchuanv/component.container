import { GUID, Reference, Type } from "../registry.mjs";
const privateBag = new WeakMap();
export class Property {
    /**
     * @param { Object } get
     * @param { Object } set
     * @param { String } propertyKey
     * @param { class } targetClass
     * @param { Boolean } isReadOnly
    */
    constructor(get, set, propertyKey, targetClass, isReadOnly = true) {
        const namespace = `component.${targetClass.name.toLowerCase()}.property`;
        const ref = new Reference(namespace, Property, new GUID({ propertyKey }));
        if (privateBag.has(ref)) {
            privateBag.set(this, ref);
        } else {
            privateBag.set(this, ref);
            const isGetter = get ? true : false;
            const isSetter = set ? true : false;
            const _script = (get ? get.toString() : set ? set.toString() : '').replace(/\s/g, '');
            const gettersetterRegEx = [{
                name: 'getterA',
                getter: true,
                setter: false,
                expression: new RegExp(`returnsuper\\.get\\(\\{${propertyKey}\\:null},[\\w]+\\)`)
            }, {
                name: 'setterA',
                getter: false,
                setter: true,
                expression: new RegExp(`super\\.set\\(\\{${propertyKey}\\:[\\w\\$\\#\\@]+\\},[\\w]+\\)`)
            }, {
                name: 'setterB',
                getter: false,
                setter: true,
                expression: new RegExp(`super\\.set\\(\\{${propertyKey}\},[\\w]+\\)`)
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
                    const results = match[0];
                    let typeName = results;
                    const { type } = Type.get({ typeName });
                    privateBag.set(ref, {
                        key: propertyKey,
                        value: null,
                        type,
                        isReadOnly,
                        isSetter,
                        isGetter,
                        callbacks: []
                    });
                    return;
                }
            }
            const message = `unable to create a ${isGetter ? 'get' : ''}${isSetter ? 'set' : ''} ${propertyKey} property for the ${targetClass.name} class`;
            let info = '';
            let expression = '';
            if (isGetter) {
                if (getterResults.length === 0) {
                    info = 'no getter results.';
                } else {
                    info = 'no getter regex match';
                    ({ expression } = getterResults[0]);
                }
            } else if (isSetter) {
                if (setterResults.length === 0) {
                    info = 'no setter results.';
                } else {
                    info = 'no setter regex match';
                    ({ expression } = setterResults[0]);
                }
            }
            throw new Error(`\r\n-> Message: ${message},\r\n${info ? `-> Info: ${info}` : ''}${expression ? `\r\n-> RegEx: ${expression}\r\n-> Script: ${_script}` : ''}`);
        }
    }
    /**
     * @returns { String }
    */
    get key() {
        const ref = privateBag.get(this);
        const { key } = privateBag.get(ref);
        return key;
    }
    /**
     * @returns { class }
    */
    get type() {
        const ref = privateBag.get(this);
        const { type } = privateBag.get(ref);
        return type;
    }
    /**
     * @returns { Object }
    */
    get value() {
        const ref = privateBag.get(this);
        const { value } = privateBag.get(ref);
        return value;
    }
    /**
     * @param { Object } value
    */
    set value(value) {
        const ref = privateBag.get(this);
        const bag = privateBag.get(ref);
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
    get isReadOnly() {
        const ref = privateBag.get(this);
        const { isReadOnly } = privateBag.get(ref);
        return isReadOnly;
    }
    /**
     * @param { Function } value
    */
    set callback(value) {
        const ref = privateBag.get(this);
        const { callbacks } = privateBag.get(ref);
        return callbacks.push(value);
    }
    /**
     * @returns { Boolean }
    */
    get isGetter() {
        const ref = privateBag.get(this);
        const { isGetter } = privateBag.get(ref);
        return isGetter;
    }
    /**
     * @returns { Boolean }
    */
    get isSetter() {
        const ref = privateBag.get(this);
        const { isSetter } = privateBag.get(ref);
        return isSetter;
    }
}