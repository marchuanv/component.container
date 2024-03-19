import { GUID, ReferenceId, Reflection, Store } from "../registry.mjs";
class ContainerStackId extends GUID { }
const containerStackId = new ContainerStackId();
const secureContext = {};
export class ContainerStack extends Store {
    constructor() {
        if (new.target !== ContainerStack) {
            throw new Error(`${ContainerStack.name} is a sealed class.`);
        }
        super({ containerStackId }, secureContext);
        if (!super.get(secureContext)) {
            super.set([], secureContext);
        }
    }
    /**
     * @returns { Array<class> }
    */
    get extended() {
        return super.get(secureContext).filter(x => x !== ContainerStack);
    }
    /**
     * @param { class } type
     * @param { ReferenceId } refId
     * @returns { { type: class, refId: ReferenceId } } Cycle. i.e. remove from the top of the stack and add to the bottom
    */
    get(type = null, refId = null) {
        const stack = super.get(secureContext);
        let top = stack.shift();
        let started = top;
        while (top) {
            if (top.type === type || top.refId === refId) {
                return top;
            }
            stack.push(top);
            top = stack.shift();
            if (top === started) {
                break;
            }
        }
        throw new Error(`type or refId not found.`);
    }
    /**
     * @param { class } type
     * @param { class } refId
    */
    set(type, refId) {
        if ( !(Reflection.isClass(type) || Reflection.isPrimitiveType(type)) || !refId || !(refId instanceof ReferenceId)) {
            throw new Error(`The type argument is not a class or refId is null, undefined or not an instance of ${ReferenceId.name}`);
        }
        const stack = super.get(secureContext);
        stack.unshift({ type, refId });
    }
}