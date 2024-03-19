import {
    ReferenceId,
    TypeReference,
    TypeReferenceContext,
    TypeRegisterEntry
} from '../registry.mjs';
export class ContainerConfig extends TypeReference {
    /**
     * @param { class } Class
     * @param { ReferenceId } refId
    */
    constructor(Class = null, refId = null) {
        super(new TypeReferenceContext(new TypeRegisterEntry(ContainerConfig), true));
        if (!this.configurations) {
            super.set({ configurations: [] }, Array);
        }
        if (Class !== null && Class !== undefined && refId !== null && refId !== undefined) {
            this.configurations.push({ Class, refId });
        }
    }
    /**
     * @param { class } Class
     * @param { ReferenceId } refId
     * @returns {{ Class: class, refId: ReferenceId }}
    */
    getConfig(Class = null, refId = null) {
        const { Class, refId } = criteria;
        const configurations = super.get({ configurations: null }, Array);
        const found = configurations.find(x => x.Class === Class || x.refId === refId);
        if (!found) {
            throw new Error(`configuration not found.`);
        }
        return found;
    }
}