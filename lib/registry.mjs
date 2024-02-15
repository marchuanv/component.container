import {
    GUID,
    Properties,
    Reference,
    TypeRegistry
} from '../registry.mjs';
const rootId = new GUID();
let locked = true;
export class Registry extends Properties {
    /**
     * @param { GUID } Id
    */
    constructor(Id = null) {
        if (new.target !== Registry.prototype && new.target !== Registry) {
            throw new Error(`${Registry.name} is a sealed class`);
        }
        if (locked) {
            throw new Error(`creating an instance of ${Registry.name} is not allowed.`);
        }
        const reference = new Reference([Id || rootId]);
        super(reference.Id);
        super.set({ children: [] }, Array);
        super.set({ children: [] }, Array);
    }
    /**
     * @returns { GUID }
    */
    get ref() {
        return super.get({ refId: null }, GUID);
    }
    /**
     * @returns { Array<Registry> }
    */
    get children() {
        return super.get({ children: null }, Array);
    }
    /**
     * @param { GUID } parentId
     * @returns { Registry }
    */
    static create(parentId = null) {
        let parent = null;
        if (!parentId) {
            locked = false;
            parent = new Registry();
            locked = true;
        } else {
            locked = false;
            parent = new Registry(parentId);
            locked = true;
        }
        locked = false;
        const child = new Registry(new GUID());
        locked = true;
        parent.children.push(child);
        return child;
    }
}
TypeRegistry.register([Registry]);