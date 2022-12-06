import {ShaderProgram} from "./shader_program";
import {Shader} from "./shader";
import {DataChangeFrequency, dataChangeFrequencyToGLconst, FloatBuffer} from "./buffer";
import {IBufferable} from "./ibufferable"
import {IAttributeExtractor} from "./attribute_extractor";
import {DrawData, IndexDrawData} from "./draw_data";

export class Drawer {
    private gl: WebGL2RenderingContext;
    private buffer: FloatBuffer | null;
    private program: WebGLProgram;
    private indexBufferObject: WebGLBuffer | null;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.gl = gl;
        this.program = program;
        this.buffer = null;
        this.indexBufferObject = null;
    }

    prepareVertices(attributeExtractor: IAttributeExtractor, vertices: Array<IBufferable>, 
                    dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        if (this.buffer == null) {
            this.buffer = new FloatBuffer(this.gl);
        }
        this.buffer.putData(vertices, dataChangeFrequency);
        this.bindAttributesToBuffer(attributeExtractor);
    }

    private bindAttributesToBuffer(attributeExtractor: IAttributeExtractor) {
        if (this.buffer == null) {
            throw new Error("Cannot bind attributes before creating bufer");
        }

        let attributes = attributeExtractor.attributes(this.gl);
        for (let i = 0; i < attributes.length; i++) {
            this.buffer.bindAttribute(attributes[i], this.program);
        }
    }

    prepareIndices(indices: Array<number>, 
                   dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        if (this.indexBufferObject == null){
            this.indexBufferObject = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
        const drawFreq = dataChangeFrequencyToGLconst(this.gl, dataChangeFrequency);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), drawFreq);
    }

    draw(drawData: DrawData) {
        this.clearBg();
        this.gl.drawArrays(
                            drawData.drawMethod, // draw method 
                            0,          // how many to skip 
                            drawData.pointsCount // how many to take
                          );
    }

    drawIndex(drawData: IndexDrawData, dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.clearBg();

        if (this.indexBufferObject == null) {
            throw new Error("Index buffer not initialized");
        }
        
        this.gl.drawElements(drawData.drawMethod, drawData.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    clearBg(color: [number, number, number] = [0,0, 0]) {
        this.gl.clearColor(color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}