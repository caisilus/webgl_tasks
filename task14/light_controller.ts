import { vec3 } from "gl-matrix";
import { LightSource } from "./light_source";
import { ShaderProgram } from "../src/shader_program";
import { SpotLightSource } from "./spot_light_source";

export class LightController {
    lightSources: LightSource[] = [];
    spotlightsSources: SpotLightSource[] = [];
    currentMode: string;
    gl: WebGL2RenderingContext;
    //Направление глобального света
    globalLightDirection: number[] = [0.0,0.5,0.0];
    globalLightAmbient: number[] = [0.1,0.1,0.1];
    globalLightDiffuse: number[] = [0.5,0.5,0.5];
    globalLightSpecular: number[] = [0.9,0.9,0.9];

    //Параметры точечных источников света
    lightSourcesNumLocation : WebGLUniformLocation | null;
    lightSourcesNumLocationFrag : WebGLUniformLocation | null;

    lightPostionLocation: WebGLUniformLocation | null;
    lAmbient: WebGLUniformLocation | null;
    lDuffuse: WebGLUniformLocation | null;
    lSpecular: WebGLUniformLocation | null;

    //Параметры глобального источника света
    globalLightDirectionLocation: WebGLUniformLocation | null;
    globalLightAmbientLocation: WebGLUniformLocation | null;
    globalLightDiffuseLocation: WebGLUniformLocation | null;
    globalLightSpecularLocation: WebGLUniformLocation | null;

    //Параметры проецирующих источников света
    spotlightSourcesNumLocation: WebGLUniformLocation | null;
    spotlightSourcesNumLocationFrag: WebGLUniformLocation | null;

    spotlightPositionLocation: WebGLUniformLocation | null;
    spotlightDirectionLocation: WebGLUniformLocation | null;

    spotlightLimitLocation: WebGLUniformLocation | null;
    spotlightAmbientLocation: WebGLUniformLocation | null;
    spotlightDiffuseLocation: WebGLUniformLocation | null;
    spotlightSpecularLocation: WebGLUniformLocation | null;

    //Режимы источников света
    GlobalLightEnabledLocation: WebGLUniformLocation | null;
    PointLightEnabledLocation: WebGLUniformLocation | null;
    ProjLightEnabledLocation: WebGLUniformLocation | null;


    constructor(gl: WebGL2RenderingContext, readonly program: ShaderProgram, lm: string, ls:LightSource) {
        this.program = program;
        this.currentMode = lm;
        this.gl = gl;

        this.lightSources = [];
        this.spotlightsSources = [];

        //Параметры глобального источника света
        this.globalLightDirectionLocation = this.program.getUniformLocation("globalLightDirection");
        this.gl.uniform3fv(this.globalLightDirectionLocation, this.globalLightDirection)
        this.globalLightAmbientLocation = this.program.getUniformLocation("globalLightAmbient");
        this.gl.uniform3fv(this.globalLightAmbientLocation, this.globalLightAmbient)
        this.globalLightDiffuseLocation = this.program.getUniformLocation("globalLightDiffuse");
        this.gl.uniform3fv(this.globalLightDiffuseLocation, this.globalLightDiffuse)
        this.globalLightSpecularLocation = this.program.getUniformLocation("globalLightSpecular");
        this.gl.uniform3fv(this.globalLightSpecularLocation, this.globalLightSpecular)


        //Параметры точечных источников света
        this.lightSourcesNumLocation = this.program.getUniformLocation("num_lights");
        this.lightSourcesNumLocationFrag = this.program.getUniformLocation("num_lightsF");
        this.lightPostionLocation = this.program.getUniformLocation("lPosition");
        this.lAmbient = this.program.getUniformLocation("lAmbient");
        this.lDuffuse = this.program.getUniformLocation("lDiffuse");
        this.lSpecular = this.program.getUniformLocation("lSpecular");

        //Параметры проецирующих источников света
        this.spotlightSourcesNumLocation = this.program.getUniformLocation("num_spotlights");
        this.spotlightSourcesNumLocationFrag = this.program.getUniformLocation("num_spotlightsF");
        this.spotlightLimitLocation = this.program.getUniformLocation("slLimit");
        this.spotlightPositionLocation = this.program.getUniformLocation("slPosition");
        this.spotlightDirectionLocation = this.program.getUniformLocation("slDirection");
        this.spotlightAmbientLocation = this.program.getUniformLocation("slAmbient");
        this.spotlightDiffuseLocation = this.program.getUniformLocation("slDiffuse");
        this.spotlightSpecularLocation = this.program.getUniformLocation("slSpecular");

        //Режимы источников света
        this.GlobalLightEnabledLocation = this.program.getUniformLocation("globalLight");
        this.PointLightEnabledLocation = this.program.getUniformLocation("pointLight");
        this.ProjLightEnabledLocation = this.program.getUniformLocation("spotLight");
        this.switch_mode(lm);
        this.add_light_source(ls);
    }

    add_light_source(ls: LightSource) {
        this.lightSources.push(ls);

        //Передаём количество источников света в шейдер
        this.gl.uniform1i(this.lightSourcesNumLocation, this.lightSources.length);
        this.gl.uniform1i(this.lightSourcesNumLocationFrag, this.lightSources.length);
        console.log(this.lightSources.length);
        //Передаём позиции источников света в шейдер
        let lpos = []
        for (let i = 0; i < this.lightSources.length; i++) {
            lpos.push(this.lightSources[i].lightPosition[0]);
            lpos.push(this.lightSources[i].lightPosition[1]);
            lpos.push(this.lightSources[i].lightPosition[2]);
        }
        this.gl.uniform3fv(this.lightPostionLocation, lpos);

        //Передаём параметры источников света в шейдер
        let lambient = []
        for (let i = 0; i < this.lightSources.length; i++) {
            lambient.push(this.lightSources[i].lightAmbient[0]);
            lambient.push(this.lightSources[i].lightAmbient[1]);
            lambient.push(this.lightSources[i].lightAmbient[2]);
        }
        this.gl.uniform3fv(this.lAmbient, lambient);

        let ldiffuse = []
        for (let i = 0; i < this.lightSources.length; i++) {
            ldiffuse.push(this.lightSources[i].lightDiffuse[0]);
            ldiffuse.push(this.lightSources[i].lightDiffuse[1]);
            ldiffuse.push(this.lightSources[i].lightDiffuse[2]);
        }
        this.gl.uniform3fv(this.lDuffuse, ldiffuse);

        let lspecular = []
        for (let i = 0; i < this.lightSources.length; i++) {
            lspecular.push(this.lightSources[i].lightSpecular[0]);
            lspecular.push(this.lightSources[i].lightSpecular[1]);
            lspecular.push(this.lightSources[i].lightSpecular[2]);
        }
        this.gl.uniform3fv(this.lSpecular, lspecular);
    }

    add_spotlight_source(sls: SpotLightSource) {
        this.spotlightsSources.push(sls);

        //Передаём количество источников света в шейдер
        this.gl.uniform1i(this.spotlightSourcesNumLocation, this.spotlightsSources.length);
        this.gl.uniform1i(this.spotlightSourcesNumLocationFrag, this.spotlightsSources.length);

        //Передаём лимиты источников света в шейдер
        let slimit = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            let radlimit = this.spotlightsSources[i].lightlimit * Math.PI / 180
            slimit.push(Math.cos(radlimit));
        }
        this.gl.uniform1fv(this.spotlightLimitLocation, slimit);

        //Передаём позиции источников света в шейдер
        let slpos = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            slpos.push(this.spotlightsSources[i].lightPosition[0]);
            slpos.push(this.spotlightsSources[i].lightPosition[1]);
            slpos.push(this.spotlightsSources[i].lightPosition[2]);
        }
        this.gl.uniform3fv(this.spotlightPositionLocation, slpos);

        //Передаём направления источников света в шейдер
        let slDir = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            let sldir = []
            sldir[0] = this.spotlightsSources[i].lightTarget[0] - this.spotlightsSources[i].lightPosition[0];
            sldir[1] = this.spotlightsSources[i].lightTarget[1] - this.spotlightsSources[i].lightPosition[1];
            sldir[2] = this.spotlightsSources[i].lightTarget[2] - this.spotlightsSources[i].lightPosition[2];
            slDir.push(sldir[0]);
            slDir.push(sldir[1]);
            slDir.push(sldir[2]);
        }
        this.gl.uniform3fv(this.spotlightDirectionLocation, slDir);

        //Передаём параметры источников света в шейдер
        let slambient = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            slambient.push(this.spotlightsSources[i].lightAmbient[0]);
            slambient.push(this.spotlightsSources[i].lightAmbient[1]);
            slambient.push(this.spotlightsSources[i].lightAmbient[2]);
        }
        this.gl.uniform3fv(this.spotlightAmbientLocation, slambient);

        let sldiffuse = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            sldiffuse.push(this.spotlightsSources[i].lightDiffuse[0]);
            sldiffuse.push(this.spotlightsSources[i].lightDiffuse[1]);
            sldiffuse.push(this.spotlightsSources[i].lightDiffuse[2]);
        }
        this.gl.uniform3fv(this.spotlightDiffuseLocation, sldiffuse);

        let slspecular = []
        for (let i = 0; i < this.spotlightsSources.length; i++) {
            slspecular.push(this.spotlightsSources[i].lightSpecular[0]);
            slspecular.push(this.spotlightsSources[i].lightSpecular[1]);
            slspecular.push(this.spotlightsSources[i].lightSpecular[2]);
        }
        this.gl.uniform3fv(this.spotlightSpecularLocation, slspecular);
    }


    set_active_lights(flags: [boolean, boolean, boolean]) {
        let global = flags[0] ? 1 : 0;
        let point = flags[1] ? 1 : 0;
        let proj = flags[2] ? 1 : 0;
        this.gl.uniform1i(this.GlobalLightEnabledLocation, global);
        this.gl.uniform1i(this.PointLightEnabledLocation, point);
        this.gl.uniform1i(this.ProjLightEnabledLocation, proj);
    }

    switch_mode(new_mode:string){
        this.currentMode = new_mode;
        switch (this.currentMode){
            case "directional": {
                this.gl.uniform1i(this.GlobalLightEnabledLocation,1);
                this.gl.uniform1i(this.PointLightEnabledLocation,0);
                this.gl.uniform1i(this.ProjLightEnabledLocation,0);
                break;
            }
            case "point": {
                this.gl.uniform1i(this.GlobalLightEnabledLocation,0);
                this.gl.uniform1i(this.PointLightEnabledLocation,1);
                this.gl.uniform1i(this.ProjLightEnabledLocation,0);
                break;
            }
            case "projector": {
                this.gl.uniform1i(this.GlobalLightEnabledLocation,0);
                this.gl.uniform1i(this.PointLightEnabledLocation,0);
                this.gl.uniform1i(this.ProjLightEnabledLocation,1);
                break;
            }
            default: {
                throw new Error('No such light mode');
            }
        }
    }
}