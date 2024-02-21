import { Reference, Type } from "../registry.mjs";
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
        const namespace = `component.${Property.name.toLowerCase()}`;
        const ref = new Reference(namespace, Property, propertyKey);
        if (privateBag.has(ref)) {
            return privateBag.get(ref);
        }
        privateBag.set(ref, this);
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
                privateBag.set(this, {
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
    /**
     * @returns { String }
    */
    get key() {
        const { key } = privateBag.get(this);
        return key;
    }
    /**
     * @returns { class }
    */
    get type() {
        const { type } = privateBag.get(this);
        return type;
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
    get isReadOnly() {
        const { isReadOnly } = privateBag.get(this);
        return isReadOnly;
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