import { vec3 } from "gl-matrix";
import { LightSource } from "./light_source";

export class LightController{
    lightSource: LightSource;
    currentMode:string;
    gl:WebGL2RenderingContext;
    reverseLightDirectionLocation:WebGLUniformLocation | null;
    flag: WebGLUniformLocation|null;

    constructor(gl:WebGL2RenderingContext, readonly program: WebGLProgram,lm: string,ls:LightSource){
        this.currentMode = lm;
        this.lightSource = ls;
        this.gl = gl;
        this.reverseLightDirectionLocation = this.gl.getUniformLocation(program,"u_reverseLightDirection");
        this.gl.uniform3fv(this.reverseLightDirectionLocation, this.lightSource.lightPosition);
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