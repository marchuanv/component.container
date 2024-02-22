import { Config, GUID, Properties, Reference, Type } from '../registry.mjs';
export class Register extends Properties {
    /**
     * @param { Reference } configRef
    */
    constructor(configRef) {
        const config = configRef.get();
        const IdStr = configRef.toString();
        const Id = new GUID({ Id: IdStr });
        super(Id);
        super.set({ config }, Config);
    }
    /**
     * @returns { Config }
     */
    get config() {
        return super.get({ config: null }, Config);
    }
    /**
     * @returns { Set<Reference> }
    */
    static get registers() {
        return registersRef.get();
    }
    static get namespace() {
        return 'component.container.registry';
    }
    /**
     * @param { class } configClass
    */
    static add(configClass) {
        const config = new configClass();
        const configRegistry = Array.from(config.registry);
        for (const ref of configRegistry) {
            const IdStr = ref.toString();
            const Id = new GUID({ Id: IdStr });
            const regRef = new Reference(Register.namespace, Register, Id);
            regRef.get([ref]);
            Register.registers.add(regRef);
        }
    }
}
const registerId = new GUID({ description: 'The guid that is used for getting the all the registers' });
const registersRef = new Reference(Type.namespace, Set, registerId);