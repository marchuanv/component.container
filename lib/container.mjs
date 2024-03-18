import {
    CtorArgs,
    Reflection,
    TypeReference,
    TypeReferenceContext,
    TypeRegisterEntry
} from '../registry.mjs';
export class Container extends TypeReference {
    constructor() {
        const target = new.target;
        if (target === Container.prototype || target === Container) {
            throw new Error(`${Container.name} is an abstract class`);
        }
        super(new TypeReferenceContext(new TypeRegisterEntry(target)));
        const CtorArgsClass = super.associations.find(x =>  Reflection.hasExtendedClass(x, CtorArgs));
        const ctorArgs = getCtorArgs(CtorArgsClass);
        console.log();
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
/**
 * @param { class} CtorArgsClass
 * @returns { CtorArgs }
*/
function getCtorArgs(CtorArgsClass) {
    if (CtorArgsClass === null || CtorArgsClass === undefined || !Reflection.isClass(CtorArgsClass)) {
        throw new Error(`The CtorArgsClass argument is null, undefined or not a class.`);
    }
    return new CtorArgsClass();
}