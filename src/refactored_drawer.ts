import {ShaderProgram} from "./shader_program";
import {Shader} from "./shader";
import {FloatBuffer} from "./buffer";
import {Vertex2DWithColor} from "./vertex2d";

// shaders
import vertexShaderText from "./shaders/shader.vert";
import fragmentShaderText from "./shaders/shader.frag";

export class Drawer {
    private gl: WebGLRenderingContext;
    private program: ShaderProgram;
    private vertexShader: Shader;
    private fragmentShader: Shader;
    private buffer: FloatBuffer;
    private programBuilt: boolean = false;
    
    constructor(gl: WebGL2RenderingContext) {
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

    draw(vertices: Array<Vertex2DWithColor>) {
        if (!this.programBuilt) {
            throw new Error("Program not built");
        }

        this.clearBg();
        this.prepareData(vertices);
        this.gl.useProgram(this.program.program);
        this.gl.drawArrays(
                                this.gl.TRIANGLES, // draw method 
                                0,                 // how many to skip 
                                3                  // how many to take
                          );
    }

    private prepareData(vertices: Array<Vertex2DWithColor>) {
        this.buffer.putData(vertices);
        this.bindAttributesToBuffer();
    }

    private bindAttributesToBuffer() {
        let attributes = Vertex2DWithColor.attributes(this.gl);
        for (let i = 0; i < attributes.length; i++) {
            this.buffer.bindAttribute(attributes[i], this.program.program);
        }
    }

    clearBg() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}