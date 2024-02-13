import {
    GUID,
    Properties
} from "../registry.mjs";
export class ContainerConfig extends Properties {
    /**
     * @param { GUID } Id
    */
    constructor(Id = null) {
        const targetClass = new.target;
        if (Id) {
            super(Id);
        } else {
            if (targetClass === ContainerConfig.prototype || targetClass === ContainerConfig) {
                throw new Error(`${ContainerConfig.name} is an abstract class`);
            }
            super(new GUID());
        }
        for (const property of super.properties()) {
            if (property.isGetter) {
                throw new Error(`classes that extend ${ContainerConfig.name} can only have setter properties`)
            }
        }
    }
}