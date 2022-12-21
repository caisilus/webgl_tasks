import { vec3 } from "gl-matrix";
import { LightSource } from "./light_source";
import { ShaderProgram } from "../src/shader_program";

export class LightController {
    lightSource: LightSource;
    currentMode: string;
    gl: WebGL2RenderingContext;
    reverseLightDirectionLocation: WebGLUniformLocation | null;
    lColor: WebGLUniformLocation | null;
    lAmbient: WebGLUniformLocation | null;
    lDuffuse: WebGLUniformLocation | null;
    lSpecular: WebGLUniformLocation | null;
    lAttenuation: WebGLUniformLocation | null;
    flag: WebGLUniformLocation | null;

    constructor(gl: WebGL2RenderingContext, readonly program: ShaderProgram, lm: string, ls:LightSource) {
        this.currentMode = lm;
        this.lightSource = ls;
        this.gl = gl;
        this.reverseLightDirectionLocation = program.getUniformLocation("u_reverseLightDirection");
        this.gl.uniform3fv(this.reverseLightDirectionLocation, this.lightSource.lightPosition);
        this.lColor = program.getUniformLocation("lColor");
        this.gl.uniform3fv(this.lColor, this.lightSource.lightColor);
        this.lAmbient = program.getUniformLocation("lAmbient");
        this.gl.uniform3fv(this.lAmbient, this.lightSource.lightAmbient);
        this.lDuffuse = program.getUniformLocation("lDiffuse");
        this.gl.uniform3fv(this.lDuffuse, this.lightSource.lightDiffuse);
        this.lSpecular = program.getUniformLocation("lSpecular");
        this.gl.uniform3fv(this.lSpecular, this.lightSource.lightSpecular);
        this.lAttenuation = program.getUniformLocation("lAttenuation");
        this.gl.uniform3fv(this.lAttenuation, this.lightSource.lightAttenuation);
        this.flag = program.getUniformLocation("f");
        this.switch_mode(lm);
    }

    switch_mode(new_mode:string){
        this.currentMode = new_mode;
        switch (this.currentMode){
            case "directional": {
                this.gl.uniform1i(this.flag,0);
                break;
            }
            case "point": {
                this.gl.uniform1i(this.flag,1);
                break;
            }
            case "projector": {
                this.gl.uniform1i(this.flag,2);
                break;
            }
            default: {
                throw new Error('No such light mode');
            }
        }
    }

    update_light_source(ls: LightSource) {
        this.lightSource = this.lightSource
    }


}