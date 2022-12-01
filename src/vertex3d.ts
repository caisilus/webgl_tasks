import {IBufferable} from "./ibufferable";
import {IAttribute} from "./attribute";

export class Vertex3D implements IBufferable {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toFloatArray(): Float32Array {
        return new Float32Array([this.x, this.y, this.z]);
    }

    static attributes(gl: WebGLRenderingContext): Array<IAttribute> {
        const coodinate = {
                            name: "vertPosition",
                            valuesCount: 3,
                            glType: gl.FLOAT,
                            dataNormalized: false,
                            parentByteSize: 3 * Float32Array.BYTES_PER_ELEMENT,
                            offsetInParent: 0
                        };

        return [coodinate];
    }

    dataLength(): number {
        return 3;
    }
}

export class Vertex3DWithColor implements IBufferable {
    x: number;
    y: number;
    z: number;
    color: [number, number, number];
    texCord: [number, number];
    
    constructor(x: number, y: number, z: number = 0.0, color: [number, number, number] = [0, 255, 0], texcord: [number, number] = [0.0, 0.0]) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.color = color;
        this.texCord = texcord;
        
    }

    toFloatArray(): Float32Array {
        let normalizedRed = this.color[0] / 255.0; 
        let normalizedGreen = this.color[1] / 255.0;
        let normalizedBlue = this.color[2] / 255.0;
        return new Float32Array([this.x, this.y, this.z, normalizedRed, normalizedGreen, normalizedBlue, this.texCord[0], this.texCord[1]]);
    }

    dataLength(): number {
        return 8;
    }

    static attributes(gl: WebGLRenderingContext): Array<IAttribute> {
        let coodinate = {
                            name: "vertPosition",
                            valuesCount: 3,
                            glType: gl.FLOAT,
                            dataNormalized: false,
                            parentByteSize: 8 * Float32Array.BYTES_PER_ELEMENT,
                            offsetInParent: 0
                        };
    
        let color = {
                        name: "vertColor",
                        valuesCount: 3,
                        glType: gl.FLOAT,
                        dataNormalized: false,
                        parentByteSize: 8 * Float32Array.BYTES_PER_ELEMENT,
                        offsetInParent: 3 * Float32Array.BYTES_PER_ELEMENT
                    }
        let texcord = {
                        name: "vertTexCoord",
                        valuesCount: 2,
                        glType: gl.FLOAT,
                        dataNormalized: false,
                        parentByteSize: 8 * Float32Array.BYTES_PER_ELEMENT,
                        offsetInParent: 6 * Float32Array.BYTES_PER_ELEMENT
        }

        return [coodinate, color, texcord];
    }
}