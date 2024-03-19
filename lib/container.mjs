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
     * @returns { T }
    */
    static create(targetClass, contract) {
        Container.register(targetClass);
        const targetClassRefId = new ReferenceId();
        const interfaceRefId = new ReferenceId();
        const intefaceClass = contract.constructor;
        Container.register(intefaceClass);
        lock = false;
        const container = new targetClass(targetClass, targetClassRefId);
        const _contract = new intefaceClass(contract.constructor, interfaceRefId);
        lock = true;
        for(const prop of container.properties){
            const found = _contract.properties.find(x => x.name === prop.name);
            if (!found) {
                throw new Error(`contract does not have the ${prop.name} property.`);
            }
            if (found.type !== prop.type) {
                throw new Error(`${targetClass.name}.${prop.name} property type is not the same as the contract.`);
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