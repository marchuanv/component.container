import {
    ReferenceId,
    Reflection,
    Type,
    TypeReference,
    TypeReferenceContext,
    TypeRegisterEntry
} from '../registry.mjs';
let lock = true;
export class Container extends TypeReference {
    /**
     * @param { class } targetClass
     * @param { ReferenceId } refId
    */
    constructor(targetClass, refId) {
        if (lock) {
            throw new Error('not allowed, call Container.create()');
        }
        if (!Reflection.isClass(targetClass)) {
            throw new Error(`The targetClass argument is not a class.`);
        }
        if (refId === null || refId === undefined || !(refId instanceof ReferenceId)) {
            throw new Error(`The refId argument is null, undefined or not an instance of ${ReferenceId.name}`);
        }
        super(new TypeReferenceContext(new TypeRegisterEntry(targetClass), false, refId));
    }
    /**
     * @param { class } Class
    */
    static register(Class) {
        if (!Reflection.isClass(Class)){
            throw new Error(`The Class argument is not a class.`);
        }
        new Type(Class);
    }
    /**
     * @template T
     * @param { class } targetClass
     * @param { T } contract
     * @param { Object } dependecy
     * @returns { T }
    */
    static create(targetClass, contract, dependency = null) {
        if (!Reflection.isClass(targetClass) || !Reflection.isClass(contract)) {
            throw new Error(`The targetClass or contract argument(s) are not classes.`);
        }
        if (!Reflection.getExtendedClasses(targetClass).find(x => x === Container)) {
            throw new Error(`The ${targetClass.name} does not extend the ${Container.name} class.`)
        }
        if (!Reflection.getExtendedClasses(contract.constructor).find(x => x === Container)) {
            throw new Error(`The ${contract.constructor.name} does not extend the ${Container.name} class.`)
        }
        Container.register(targetClass);
        const targetClassRefId = new ReferenceId();
        const interfaceRefId = new ReferenceId();
        const intefaceClass = contract.constructor;
        Container.register(intefaceClass);
        lock = false;
        const container = new targetClass(targetClass, targetClassRefId);
        if (targetClass !== contract.constructor && targetClass !== contract) {
            if (dependency === null || dependency === undefined || !(dependency instanceof contract.constructor)) {
                throw new Error(`The dependency argument is null, undefined or not an instance of ${contract.constructor.name}`);
            }
            const _contract = new intefaceClass(contract.constructor, interfaceRefId);
            lock = true;
            if (_contract.properties.length === 0) {
                throw new Error(`${intefaceClass.name} does not have any properties.`);
            }
            for(const contractProperty of _contract.properties) {
                if (!contractProperty.isGetter) {
                    throw new Error(`${contractProperty.name}.${contractProperty.name} does not have a getter property.`);
                }
                if (!contractProperty.isSetter) {
                    throw new Error(`${contractProperty.name}.${contractProperty.name} does not have a setter property.`);
                }
            }
            for(const prop of container.properties){
                const found = _contract.properties.find(x => x.name === prop.name);
                if (!found) {
                    throw new Error(`failed to construct the ${targetClass.name} class, the ${intefaceClass.name} interface does not have the ${prop.name} property.`);
                }
                if (found.type !== prop.type) {
                    throw new Error(`${intefaceClass.name}.${found.name} ${targetClass.name}.${prop.name} type mismatch.`);
                }
                const value = dependency[prop.name];
                container[prop.name] = value;
            }
        }
        return container;
    }
    serialise() {
        const instance = {};
        let data = [instance];
        instance.Id = this.Id.toString();
        instance.args = {};
        for (const property of super.properties().filter(p => p.isPrivate)) {
            if (property.type === Container) {
                const container = property.value;
                let _data = container.serialise.call();
                _data = JSON.parse(_data);
                data = data.concat(_data);
                instance.args[property.key] = {
                    "$ref": _data[0].Id
                };
            } else {
                instance.args[property.key] = property.value;
            }
        }
        return JSON.stringify(data);
    }
    /**
     * @template T
     * @param { String } data
     * @returns { T }
    */
    static deserialise(data) {
        const _data = JSON.parse(data);
        let instance = _data.shift();
        const { metadataId, args } = instance;
        const { targetClass, ctorArgsClass, properties } = ContainerRegistry.findOne({ Id: metadataId });
        const refKeys = Object.keys(args).filter(key => args[key]['$ref']);
        for (const refKey of refKeys) {
            const { $ref } = args[refKey];
            const _data2 = _data.find(x => x.metadataId === $ref);
            args[refKey] = this.deserialise(JSON.stringify([_data2]));
        }
        const ctorArgs = new ctorArgsClass();
        for (const key of Object.keys(properties)) {
            ctorArgs[key] = args[key];
        }
        instance = Reflect.construct(targetClass, [ctorArgs]);
        Object.freeze(instance);
        return instance;
    }
}