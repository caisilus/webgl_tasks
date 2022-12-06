import {ShaderProgram} from "./shader_program";
import {Shader} from "./shader";
import {DataChangeFrequency, FloatBuffer} from "./buffer";
import {IBufferable} from "./ibufferable"
import {IAttributeExtractor} from "./attribute_extractor";
import {DrawData, IndexDrawData} from "./draw_data";

export class Drawer {
    private gl: WebGL2RenderingContext;
    private program: ShaderProgram;
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private buffer: FloatBuffer;
    private programBuilt: boolean = false;
    private boxIndexBufferObject: WebGLBuffer | null;
    
    constructor(gl: WebGL2RenderingContext, vertexShaderText: string, fragmentShaderText: string) {
        this.gl = gl;
        this.program = new ShaderProgram(gl);
        this.vertexShader = new Shader(gl, vertexShaderText, gl.VERTEX_SHADER);
        this.fragmentShader = new Shader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
        this.buffer = new FloatBuffer(gl);
        
        this.boxIndexBufferObject = this.gl.createBuffer();
    }

    buildProgram(){
        this.compileShaders();
        this.program.attachShader(this.vertexShader);
        this.program.attachShader(this.fragmentShader);
        this.program.compileAndLink(true);
        this.programBuilt = true;
        this.gl.useProgram(this.program.program);
    }

    compileShaders() {
        this.vertexShader.compile();
        this.fragmentShader.compile();
    }

    draw(drawData: DrawData, dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        if (!this.programBuilt) {
            throw new Error("Program not built");
        }
        this.clearBg();
        this.prepareData(drawData.attributeExtractor, drawData.vertices);
        this.gl.drawArrays(
                                drawData.drawMethod, // draw method 
                                0,          // how many to skip 
                                drawData.pointsCount // how many to take
                          );
    }

    drawIndex(drawData: IndexDrawData, dataChangeFrequency: DataChangeFrequency = DataChangeFrequency.STATIC) {
        if (!this.programBuilt) {
            throw new Error("Program not built");
        }
        this.clearBg();
        this.prepareData(drawData.attributeExtractor, drawData.vertices);

        if (this.boxIndexBufferObject == null) {
            throw new Error("Index buffer not initialized");
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.boxIndexBufferObject);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(drawData.indices), this.gl.STATIC_DRAW);
        this.gl.drawElements(drawData.drawMethod, drawData.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    private prepareData(attributeExtractor: IAttributeExtractor, vertices: Array<IBufferable>) {
        this.buffer.putData(vertices);
        this.bindAttributesToBuffer(attributeExtractor);
    }

    private bindAttributesToBuffer(attributeExtractor: IAttributeExtractor) {
        let attributes = attributeExtractor.attributes(this.gl);
        for (let i = 0; i < attributes.length; i++) {
            this.buffer.bindAttribute(attributes[i], this.program.program);
        }
    }

    getGLProgram(): WebGLProgram {
        return this.program.program; 
    }

    clearBg(color: [number, number, number] = [0,0, 0]) {
        this.gl.clearColor(color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}