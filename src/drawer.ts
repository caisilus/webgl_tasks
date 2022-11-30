import {ShaderProgram} from "./shader_program";
import {Shader} from "./shader";
import {FloatBuffer} from "./buffer";
import {IBufferable} from "./ibufferable"
import {IAttributeExtractor} from "./attribute_extractor";
import {DrawData} from "./draw_data";

export class Drawer {
    private gl: WebGL2RenderingContext;
    private program: ShaderProgram;
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private buffer: FloatBuffer;
    private programBuilt: boolean = false;
    
    constructor(gl: WebGL2RenderingContext, vertexShaderText: string, fragmentShaderText: string) {
        this.gl = gl;
        this.program = new ShaderProgram(gl);
        this.vertexShader = new Shader(gl, vertexShaderText, gl.VERTEX_SHADER);
        this.fragmentShader = new Shader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
        this.buffer = new FloatBuffer(gl);
    }

    buildProgram(){
        this.compileShaders();
        this.program.attachShader(this.vertexShader);
        this.program.attachShader(this.fragmentShader);
        this.program.compileAndLink(true);
        this.programBuilt = true;
    }

    compileShaders() {
        this.vertexShader.compile();
        this.fragmentShader.compile();
    }

    draw(drawData: DrawData, color: [number, number, number] | null = null) {
        if (!this.programBuilt) {
            throw new Error("Program not built");
        }

        this.clearBg();
        this.prepareData(drawData.attributeExtractor, drawData.vertices);
        this.gl.useProgram(this.program.program);
        if (color != null) {
            this.bindUniform("figureColor", color);
        }
        this.gl.drawArrays(
                                drawData.drawMethod, // draw method 
                                0,          // how many to skip 
                                drawData.pointsCount // how many to take
                          );
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

    private bindUniform(name: string, color: [number, number, number]) {
        let location = this.gl.getUniformLocation(this.program.program, name);
        let normalizedColor = [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0];
        this.gl.uniform3fv(location, new Float32Array(normalizedColor));
    }

    clearBg() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}