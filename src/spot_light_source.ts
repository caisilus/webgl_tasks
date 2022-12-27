import { ShaderProgram } from "./shader_program";
import {glMatrix, vec3} from "gl-matrix";

export class SpotLightSource{
    gl: WebGL2RenderingContext;
    index_in_shader:number;
    spotlightPositionLocation: WebGLUniformLocation | null;
    spotlightDirectionLocation: WebGLUniformLocation | null;

    spotlightLimitLocation: WebGLUniformLocation | null;
    spotlightAmbientLocation: WebGLUniformLocation | null;
    spotlightDiffuseLocation: WebGLUniformLocation | null;
    spotlightSpecularLocation: WebGLUniformLocation | null;
    constructor(
        gl: WebGL2RenderingContext,
        public lightPosition:number[],
        public lightTarget:number[],
        public lightlimit:number,
        public lightAmbient: number[], 
        public lightDiffuse:number[],
        public lightSpecular:number[]){
            this.index_in_shader = -1;
            this.gl = gl;

            this.spotlightPositionLocation = null;
            this.spotlightDirectionLocation = null;
            this.spotlightLimitLocation = null;
            this.spotlightAmbientLocation = null;
            this.spotlightDiffuseLocation = null;
            this.spotlightSpecularLocation = null;
        }

    public bind_to_shader(shader_program:ShaderProgram, ind:number)
    {
        this.index_in_shader = ind;
        this.spotlightPositionLocation = shader_program.getUniformLocation('slPosition[' + ind + ']');
        this.spotlightDirectionLocation = shader_program.getUniformLocation('slDirection[' + ind + ']');
        this.spotlightLimitLocation = shader_program.getUniformLocation('slLimit[' + ind + ']');
        this.spotlightAmbientLocation = shader_program.getUniformLocation('slAmbient[' + ind + ']');
        this.spotlightDiffuseLocation = shader_program.getUniformLocation('slDiffuse[' + ind + ']');
        this.spotlightSpecularLocation = shader_program.getUniformLocation('slSpecular[' + ind + ']');
        this.update_uniforms();
    }

    public move_to(pos:[number, number, number])
    {
        this.lightPosition = pos;
        this.update_uniforms();
    }

    public moveToPoint(newPosition: vec3) {
        const currentPosition = vec3.fromValues(this.lightPosition[0], 
                                                this.lightPosition[1], 
                                                this.lightPosition[2]);
        const delta = vec3.create();
        vec3.sub(delta, newPosition, currentPosition);

        const target = vec3.fromValues(this.lightTarget[0], 
                                       this.lightTarget[1], 
                                       this.lightTarget[2]);
        vec3.add(target, target, delta);

        this.lightPosition = [newPosition[0], newPosition[1], newPosition[2]];
        this.lightTarget = [target[0], target[1], target[2]];
        this.update_uniforms();
    }

    public rotate(angle: number) {
        const radAngle = glMatrix.toRadian(angle);
        let target = vec3.fromValues(this.lightTarget[0], this.lightTarget[1], this.lightTarget[2]);
        const lightPosition = vec3.fromValues(this.lightPosition[0], 
                                              this.lightPosition[1], 
                                              this.lightPosition[2]);
        vec3.rotateY(target, target, lightPosition, radAngle);
        this.lightTarget = [target[0], target[1], target[2]];
        this.update_uniforms();
    }

    public update_uniforms()
    {
        if (this.index_in_shader == -1)
        {
            throw "SpotLightSource not binded to shader";
        }
        let lightDirection = [0,0,0]
        lightDirection[0] = this.lightTarget[0] - this.lightPosition[0];
        lightDirection[1] = this.lightTarget[1] - this.lightPosition[1];
        lightDirection[2] = this.lightTarget[2] -this.lightPosition[2];
        this.gl.uniform3fv(this.spotlightPositionLocation, this.lightPosition);
        this.gl.uniform3fv(this.spotlightDirectionLocation, lightDirection);
        this.gl.uniform1f(this.spotlightLimitLocation, Math.cos(this.lightlimit * Math.PI / 180));
        this.gl.uniform3fv(this.spotlightAmbientLocation, this.lightAmbient);
        this.gl.uniform3fv(this.spotlightDiffuseLocation, this.lightDiffuse);
        this.gl.uniform3fv(this.spotlightSpecularLocation, this.lightSpecular);
    }
}