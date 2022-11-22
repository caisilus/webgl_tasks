import {IBufferable} from "./ibufferable";
import {IAttribute} from "./attribute";

export class Vertex2DWithColor implements IBufferable {
    x: number;
    y: number;
    color: [number, number, number]
    
    constructor(x: number, y: number, color: [number, number, number] = [0, 255, 0]) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    toFloatArray(): Float32Array {
        let normalizedRed = this.color[0] / 255.0; 
        let normalizedGreen = this.color[1] / 255.0;
        let normalizedBlue = this.color[2] / 255.0;
        return new Float32Array([this.x, this.y, normalizedRed, normalizedGreen, normalizedBlue]);
    }

        dataLength(): number {
        return 5;
    }

    static attributes(gl: WebGLRenderingContext): Array<IAttribute> {
        let coodinate = {
                            name: "vertPosition",
                            valuesCount: 2,
                            glType: gl.FLOAT,
                            dataNormalized: false,
                            parentByteSize: 5 * Float32Array.BYTES_PER_ELEMENT,
                            offsetInParent: 0
                        };
    
        let color = {
                        name: "vertColor",
                        valuesCount: 3,
                        glType: gl.FLOAT,
                        dataNormalized: false,
                        parentByteSize: 5 * Float32Array.BYTES_PER_ELEMENT,
                        offsetInParent: 2 * Float32Array.BYTES_PER_ELEMENT
                    }

        return [coodinate, color];
    }
}