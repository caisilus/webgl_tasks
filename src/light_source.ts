import { ShaderProgram } from "./shader_program";

export class LightSource{
    gl: WebGL2RenderingContext;
    index_in_shader:number;
    lightPostionLocation: WebGLUniformLocation | null;
    lAmbientLocation: WebGLUniformLocation | null;
    lDuffuseLocation: WebGLUniformLocation | null;
    lSpecularLocation: WebGLUniformLocation | null;

    constructor(
        gl: WebGL2RenderingContext,
        public lightPosition:number[],
        public lightAmbient: number[], 
        public lightDiffuse:number[],
        public lightSpecular:number[]){
            this.index_in_shader = -1;
            this.gl = gl;
            this.lightPostionLocation = null;
            this.lAmbientLocation = null;
            this.lDuffuseLocation = null;
            this.lSpecularLocation = null;
        }

    public bind_to_shader(shader_program:ShaderProgram, ind:number)
    {
        this.index_in_shader = ind;
        this.lightPostionLocation = shader_program.getUniformLocation('lPosition[' + ind + ']');
        this.lAmbientLocation = shader_program.getUniformLocation('lAmbient[' + ind + ']');
        this.lDuffuseLocation = shader_program.getUniformLocation('lDiffuse[' + ind + ']');
        this.lSpecularLocation = shader_program.getUniformLocation('lSpecular[' + ind + ']');
        this.update_uniforms();
    }

    public move_to(pos:[number, number, number])
    {
        this.lightPosition = pos;
        this.update_uniforms();
    }

    public update_uniforms()
    {
        if (this.index_in_shader == -1)
        {
            throw "LightSource not binded to shader";
        }
        this.gl.uniform3fv(this.lightPostionLocation, this.lightPosition);
        this.gl.uniform3fv(this.lAmbientLocation, this.lightAmbient);
        this.gl.uniform3fv(this.lDuffuseLocation, this.lightDiffuse);
        this.gl.uniform3fv(this.lSpecularLocation, this.lightSpecular);
    }
}
