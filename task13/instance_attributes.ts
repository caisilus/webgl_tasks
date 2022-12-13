import {IAttribute} from "../src/attribute";
import {IBufferable} from "../src/ibufferable";

export class PlanetAttribute implements IBufferable {
    constructor(private radius: number, private statringAngle: number, private angleSpeed: number) {
        this.radius = radius;
        this.statringAngle = statringAngle;
        this.angleSpeed = angleSpeed;
    }
    
    toFloatArray(): Float32Array {
        return new Float32Array([this.radius, this.statringAngle, this.angleSpeed]);
    }

    dataLength(): number {
        return 3;
    }

    static attributes(gl: WebGLRenderingContext): Array<IAttribute> {
        return [{
                    name: "radius",
                    valuesCount: 1,
                    glType: gl.FLOAT,
                    dataNormalized: false,
                    parentByteSize: 3 * Float32Array.BYTES_PER_ELEMENT,
                    offsetInParent: 0
                },
                {
                    name: "startingAngle",
                    valuesCount: 1,
                    glType: gl.FLOAT,
                    dataNormalized: false,
                    parentByteSize: 3 * Float32Array.BYTES_PER_ELEMENT,
                    offsetInParent: Float32Array.BYTES_PER_ELEMENT
                },
                {
                    name: "angularSpeed",
                    valuesCount: 1,
                    glType: gl.FLOAT,
                    dataNormalized: false,
                    parentByteSize: 3 * Float32Array.BYTES_PER_ELEMENT,
                    offsetInParent: 2 * Float32Array.BYTES_PER_ELEMENT
                }];
    }
}

export function instanceAttributes(): Array<IBufferable> {
    return [new PlanetAttribute(0.0, 0.0, 0.0), 
            new PlanetAttribute(1.4, 1.0, 1.5), 
            new PlanetAttribute(4.0, 2.0, 0.1)];
}