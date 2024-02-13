import { GUID, Metadata } from "../registry.mjs";
const privateBag = new WeakMap();
export class ContainerRegistry {
    /**
     * @param { GUID } Id
     * @param { class } ctorArgsClass
     * @param { class } targetClass
     * @param { class } configClass
    */
    static register(Id, ctorArgsClass, targetClass, configClass) {
        const metadata = new Metadata(Id, ctorArgsClass, targetClass, configClass);
        privateBag.get(Metadata).push(metadata);
    }
    /**
     * @returns { Array<Metadata> }
    */
    static get metadata() {
        return privateBag.get(Metadata);
    }
    /**
     * @param { { Id: GUID, ctorArgsClass: class, targetClass: class, configClass: class } } criteria
     * @returns { Metadata }
    */
    static findOne(criteria) {
        const results = ContainerRegistry.findAll(criteria);
        return results.length > 0 ? results[0] : {};
    }
    /**
     * @param { { Id: GUID, ctorArgsClass: class, targetClass: class, configClass: class } } criteria
     * @returns { Array<Metadata> }
    */
    static findAll(criteria) {
        const { Id, ctorArgsClass, targetClass, configClass } = criteria;
        return privateBag.get(Metadata).filter(meta =>
            (Id && (meta.Id === Id || meta.Id.toString() === Id)) ||
            (targetClass && meta.targetClass === targetClass) ||
            (ctorArgsClass && meta.ctorArgsClass === ctorArgsClass) ||
            (configClass && meta.configClass === ctorArgsClass)
        );
    }
}
privateBag.set(ContainerRegistry, []);
privateBag.set(Metadata, []);