import {
    ContainerRef,
    ContainerRegistry,
    Properties
} from '../registry.mjs';
const privateBag = new WeakMap();
export class Container extends Properties {
    constructor() {
        const targetClass = new.target;
        if (targetClass === Container.prototype || targetClass === Container) {
            throw new Error(`${Container.name} is an abstract class`);
        }
        const metadata = ContainerRegistry.findOne({ targetClass });
        const { Id } = new ContainerRef(metadata)
        super(Id);
    }
    serialise() {
        const instance = {};
        let data = [instance];
        const { Id } = ContainerRegistry.findAll({ targetClass: this.constructor });
        instance.metadataId = Id.toString();
        instance.args = {};
        for (const property of super.properties().filter(p => p.isPrivate)) {

        }

        const { fields } = privateBag.get(this);
        const privateFields = fields.filter(field => field.isPrivate);
        for (const { Id } of ContainerRegistry.findAll({ targetClass: this.constructor })) {


            for (const field of privateFields) {
                let value = field.value;
                if (field.value instanceof Container) {
                    let _data = this.serialise.call(field.value);
                    _data = JSON.parse(_data);
                    data = data.concat(_data);
                    instance.args[field.name] = {
                        "$ref": _data[0].metadataId
                    };
                } else {
                    instance.args[field.name] = value;
                }
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
privateBag.set(Container, []);
function getRef() {

}
function setRef() {

}