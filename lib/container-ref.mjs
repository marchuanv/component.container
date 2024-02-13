import {
    GUID,
    Metadata,
    Properties
} from "../registry.mjs";
export class ContainerRef extends Properties {
    /**
     * @param { Metadata } metadata
    */
    constructor(metadata) {
        const targetClass = new.target;
        if (targetClass !== ContainerRef.prototype && targetClass !== ContainerRef) {
            throw new Error(`${ContainerRef.name} is a a sealed class`);
        }
        super(metadata.Id);
        const Id = new GUID();
        if (super.has({ references: null }, Array)) {
            this.references.push(Id);
        } else {
            super.set({ references: [Id] }, Array);
        }
        super.set({ Id }, GUID);
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        return super.get({ Id: null }, GUID);
    }
    /**
     * @returns { Array<GUID> }
    */
    get references() {
        return super.get({ references: null }, Array);
    }
}