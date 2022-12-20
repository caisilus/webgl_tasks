import { vec3 } from "gl-matrix";
import { LightSource } from "./light_source";

export class LightController{
    lightSource: LightSource;
    currentMode:string;
    gl:WebGL2RenderingContext;
    reverseLightDirectionLocation:WebGLUniformLocation | null;
    lColor:WebGLUniformLocation | null;
    lAmbient:WebGLUniformLocation | null;
    lDuffuse:WebGLUniformLocation | null;
    lSpecular:WebGLUniformLocation | null;
    lAttenuation:WebGLUniformLocation | null;
    flag: WebGLUniformLocation|null;

    constructor(gl:WebGL2RenderingContext, readonly program: WebGLProgram,lm: string,ls:LightSource){
        this.currentMode = lm;
        this.lightSource = ls;
        this.gl = gl;
        this.reverseLightDirectionLocation = this.gl.getUniformLocation(program,"u_reverseLightDirection");
        this.gl.uniform3fv(this.reverseLightDirectionLocation, this.lightSource.lightPosition);
        this.lColor = this.gl.getUniformLocation(program,"lColor");
        this.gl.uniform3fv(this.lColor, this.lightSource.lightColor);
        this.lAmbient = this.gl.getUniformLocation(program,"lAmbient");
        this.gl.uniform3fv(this.lAmbient, this.lightSource.lightAmbient);
        this.lDuffuse = this.gl.getUniformLocation(program,"lDiffuse");
        this.gl.uniform3fv(this.lDuffuse, this.lightSource.lightDiffuse);
        this.lSpecular = this.gl.getUniformLocation(program,"lSpecular");
        this.gl.uniform3fv(this.lSpecular, this.lightSource.lightSpecular);
        this.lAttenuation = this.gl.getUniformLocation(program,"lAttenuation");
        this.gl.uniform3fv(this.lAttenuation, this.lightSource.lightAttenuation);
        this.flag = this.gl.getUniformLocation(program, "f");
        this.switch_mode(lm);
    }

    switch_mode(new_mode:string){
        this.currentMode = new_mode;
        switch (this.currentMode){
            case "directional":{
                this.gl.uniform1i(this.flag,0);
                break;
            }
            case "point":{
                this.gl.uniform1i(this.flag,1);
                break;
            }
            case "projector":{
                this.gl.uniform1i(this.flag,2);
                break;
            }
            default:{
                throw new Error('No such light mode');
            }
        }
    }

    update_light_source(ls:LightSource){
        this.lightSource = this.lightSource
    }


}