import {IAttribute} from "../src/attribute";
import {IBufferable} from "../src/ibufferable";

export class Offset implements IBufferable {
    offsetVector: [number, number, number]
    constructor(offsetX: number, offsetY: number, offsetZ: number) {
        this.offsetVector = [offsetX, offsetY, offsetZ];
    }
    
    toFloatArray(): Float32Array {
        return new Float32Array(this.offsetVector);
    }

    dataLength(): number {
        return 3;
    }

    static attributes(gl: WebGLRenderingContext): Array<IAttribute> {
        return [{
                    name: "instanceOffset",
                    valuesCount: 3,
                    glType: gl.FLOAT,
                    dataNormalized: false,
                    parentByteSize: 3 * Float32Array.BYTES_PER_ELEMENT,
                    offsetInParent: 0
        }];
    }
}

export function instanceAttributes(): Array<IBufferable> {
    return [new Offset(0,0,0), new Offset(3.0,0,0), new Offset(-3.0,0,0)];
}