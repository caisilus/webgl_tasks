import {ShaderProgram} from "./shader_program";
import {Shader} from "./shader";
import {DataChangeFrequency, FloatBuffer} from "./buffer";
import {IBufferable} from "./ibufferable"
import {IAttributeExtractor} from "./attribute_extractor";
import {DrawData, IndexDrawData} from "./draw_data";

export class Drawer {
    private gl: WebGL2RenderingContext;
    private buffer: FloatBuffer;
    private program: WebGLProgram;
    private boxIndexBufferObject: WebGLBuffer | null;
    
    constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.gl = gl;
        this.program = program;
        this.buffer = new FloatBuffer(gl);
        this.boxIndexBufferObject = this.gl.createBuffer();
    }

    draw(drawData: DrawData, dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.clearBg();
        this.prepareData(drawData.attributeExtractor, drawData.vertices);
        this.gl.drawArrays(
                                drawData.drawMethod, // draw method 
                                0,          // how many to skip 
                                drawData.pointsCount // how many to take
                          );
    }

    drawIndex(drawData: IndexDrawData, dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.clearBg();
        this.prepareData(drawData.attributeExtractor, drawData.vertices);

        if (this.boxIndexBufferObject == null) {
            throw new Error("Index buffer not initialized");
        }
        
        this.prepareIndices(drawData.indices);
        this.gl.drawElements(drawData.drawMethod, drawData.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    prepareData(attributeExtractor: IAttributeExtractor, vertices: Array<IBufferable>) {
        this.buffer.putData(vertices);
        this.bindAttributesToBuffer(attributeExtractor);
    }

    private bindAttributesToBuffer(attributeExtractor: IAttributeExtractor) {
        let attributes = attributeExtractor.attributes(this.gl);
        for (let i = 0; i < attributes.length; i++) {
            this.buffer.bindAttribute(attributes[i], this.program);
        }
    }

    prepareIndices(indices: Array<number>) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.boxIndexBufferObject);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }


    clearBg(color: [number, number, number] = [0,0, 0]) {
        this.gl.clearColor(color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}