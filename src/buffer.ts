import {IBufferable} from "./ibufferable";
import {IAttribute} from "./attribute";
import {ShaderProgram} from "./shader_program";

export class FloatBuffer {
    gl: WebGL2RenderingContext
    glBuffer: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext) {
        let glBuffer = gl.createBuffer();
        if (glBuffer == null) {
            throw new Error("Cannot create buffer");
        }

        this.gl = gl;
        this.glBuffer = glBuffer;
    }

    putData(data: Array<IBufferable>) {
        let plainData = this.getPlainData(data);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, plainData, this.gl.STATIC_DRAW);
    }

    private getPlainData(bufferableData: Array<IBufferable>) {
        let singleVertexLength = bufferableData[0].dataLength();
        let plainData = new Float32Array(bufferableData.length * singleVertexLength);
        for (let i = 0; i < bufferableData.length; i++) {
            let bufferableObj = bufferableData[i];
            let bufferedVertex = bufferableObj.toFloatArray();
            for (let j = 0; j < bufferedVertex.length; j++) {
                plainData[i * singleVertexLength + j] = bufferedVertex[j]
            }
        }

        return plainData
    }

    bindAttribute(attribute: IAttribute, program: WebGLProgram) {
        var positionAttributeLocation = this.gl.getAttribLocation(program, attribute.name);
         
        this.gl.vertexAttribPointer(positionAttributeLocation, // attr location
                                    attribute.valuesCount, // number of elements per attribute
                                    attribute.glType, // type of elements
                                    attribute.dataNormalized, // is data normalized
                                    attribute.parentByteSize, // size of a vertex
                                    attribute.offsetInParent  // offset from the begining of a single vertex 
                                                              //        to this attr
                                   );

        this.gl.enableVertexAttribArray(positionAttributeLocation);
    }
}