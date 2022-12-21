import {DataChangeFrequency, dataChangeFrequencyToGLconst, 
        FloatBuffer, InstanceAttributesBuffer} from "./buffer";
import {IBufferable} from "./ibufferable"
import {IAttributeExtractor} from "./attribute_extractor";
import {DrawData, IndexDrawData} from "./draw_data";
import { ShaderProgram } from "./shader_program";

export class Drawer {
    readonly gl: WebGL2RenderingContext;
    readonly program: ShaderProgram;
    private vertexBuffer: FloatBuffer | null;
    private instanceAttributesBuffer: InstanceAttributesBuffer | null;
    private indexBufferObject: WebGLBuffer | null;

    constructor(gl: WebGL2RenderingContext, program: ShaderProgram) {
        this.gl = gl;
        this.program = program;
        this.vertexBuffer = null;
        this.instanceAttributesBuffer = null;
        this.indexBufferObject = null;
    }

    enableVAO(vao: WebGLVertexArrayObject) {
        this.gl.bindVertexArray(vao);
    }

    disableVAO() {
        this.gl.bindVertexArray(null);
    }

    prepareVertices(attributeExtractor: IAttributeExtractor, vertices: Array<IBufferable>, 
                    dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.vertexBuffer = new FloatBuffer(this.gl);
        this.vertexBuffer.putData(vertices, dataChangeFrequency);
        this.bindAttributesToBuffer(this.vertexBuffer, attributeExtractor);
    }

    private bindAttributesToBuffer(buffer: FloatBuffer, attributeExtractor: IAttributeExtractor) {
        let attributes = attributeExtractor.attributes(this.gl);
        for (let i = 0; i < attributes.length; i++) {
            buffer.bindAttribute(attributes[i], this.program.program);
        }
    }
    
    prepareInstanceAttributes(attributeExtractor: IAttributeExtractor, attributeValues: Array<IBufferable>, 
                              dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.instanceAttributesBuffer = new InstanceAttributesBuffer(this.gl);
        this.instanceAttributesBuffer.putData(attributeValues, dataChangeFrequency);
        this.bindAttributesToBuffer(this.instanceAttributesBuffer, attributeExtractor);
    }

    prepareIndices(indices: Array<number>, 
                   dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        this.indexBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
        const drawFreq = dataChangeFrequencyToGLconst(this.gl, dataChangeFrequency);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), drawFreq);
    }

    draw(drawData: DrawData) {
        this.clearBg();
        this.gl.drawArrays(
                            drawData.drawMethod, // draw method 
                            0,          // how many to skip 
                            drawData.pointsCount // how many to take
                          );
    }

    drawIndex(drawData: IndexDrawData) {
        this.clearBg();

        if (this.indexBufferObject == null) {
            throw new Error("Index buffer not initialized");
        }
        this.gl.drawElements(drawData.drawMethod, drawData.indices.length, this.gl.UNSIGNED_INT, 0);
    
    }

    drawInstances(drawData: DrawData, numberOfInstances: number) {
        this.clearBg();
        
        if (this.vertexBuffer == null || this.instanceAttributesBuffer == null){
            throw new Error("Vertex or instance buffer is not initialized");
        }

        this.gl.drawArraysInstanced(
                                    drawData.drawMethod, 
                                    0, 
                                    drawData.pointsCount, 
                                    numberOfInstances
                                   );
    }

    drawIndexInstances(drawData: IndexDrawData, numberOfInstances: number) {
        if (this.vertexBuffer == null || this.instanceAttributesBuffer == null){
            throw new Error("Vertex or instance buffer is not initialized");
        }

        if (this.indexBufferObject == null) {
            throw new Error("Index buffer not initialized");
        }

        this.gl.drawElementsInstanced(drawData.drawMethod, drawData.indices.length, this.gl.UNSIGNED_INT, 0, 
                                      numberOfInstances);
    }

    clearBg(color: [number, number, number] = [0,0, 0]) {
        this.gl.clearColor(color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}