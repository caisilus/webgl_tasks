import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/test_shader.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "../src/texture_contoller";
import {Transformator} from "../src/transformator";
import { CameraController } from "../task13/camera_controller";
import { Loader } from "../task13/obj_loader";
import { IndexDrawData } from "../src/draw_data";
import { ProgramBuilder } from "../src/program_builder";

import Cat from "../static/objects/Cat.obj";
import Span from "../static/objects/spam.obj";
import CoockedTurkey from "../static/objects/Cooked_Turkey.obj";

import CatTex from '../src/images/Cat.jpg';
import Spam from '../src/images/spam_BaseColor.jpg';
import CoockedTexture from "../src/images/Cooked_Turkey.jpg";
import { Texture } from "../src/texture";
import { PlanetAttribute } from "../task13/instance_attributes";
import { LightController } from "./light_controller";
import { LightSource } from "./light_source";
import { mat4 } from "gl-matrix";


class Main {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    drawers: Drawer[] = [];
    transformator: Transformator;
    cameraController: CameraController;
    textureController: TextureController;
    loader: Loader;
    lightController: LightController;
    textures: {[key:number]: Texture} = {};
    data: {[key:number]: IndexDrawData} = {}; 
    instanceAttributes: PlanetAttribute[][]; 
    num_drawers: number;

    num_instances: number[] = [1];
    angleUniform: WebGLUniformLocation | null;

    select:HTMLSelectElement;
    camPosition: WebGLUniformLocation|null;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        const programBuilder = new ProgramBuilder(this.gl);
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);
        this.num_drawers = 1;
        for (let i = 0; i < this.num_drawers; i++){
            this.drawers.push(new Drawer(this.gl, this.program));
        }       
        

        this.transformator = new Transformator(this.gl, this.program);
        this.cameraController = new CameraController(this.gl, this.program);
        this.textureController = new TextureController(this.gl, this.program);
        this.textureController.load_textures();

        let textures_url = [CatTex];

        this.load_textures(textures_url);

        this.loader = new Loader(this.gl);
        
        this.loadModel(Cat, 0);

        this.instanceAttributes = [[new PlanetAttribute(0.0, 0.0, 0.0)]]

        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        let ls = new LightSource(new Float32Array([-20, 50, -20]),new Float32Array([0.2,0.2,0.2]),new Float32Array([1.0,1.0,1.0]),new Float32Array([1.0,1.0,1.0]),new Float32Array([0.5,0.5,0.5]));
        this.lightController = new LightController(this.gl,this.program, "directional", ls)
        
        this.camPosition = this.gl.getUniformLocation(this.program, "camPosition");
        this.gl.uniform3fv(this.camPosition, this.cameraController.camera.getCameraPosition());
        var shininessLocation = this.gl.getUniformLocation(this.program, "u_shininess");
        this.gl.uniform1f(shininessLocation, 50.0);

        //projector
        var lightDirectionLocation = this.gl.getUniformLocation(this.program, "u_lightDirection");
        var limitLocation = this.gl.getUniformLocation(this.program, "u_limit");
        var lightWorldPositionLocation = this.gl.getUniformLocation(this.program, "u_lightWorldPosition");
        this.gl.uniform3fv(lightWorldPositionLocation, this.lightController.lightSource.lightPosition);
        var lmat = mat4.create();
        var target = new Float32Array([-20,-10,0]);
        var up = new Float32Array([0, 1, 0]);
        var lightRotationX = 0;
        var lightRotationY = 0;
        mat4.lookAt(lmat, this.lightController.lightSource.lightPosition, target, up);
        let x = mat4.create();
        mat4.fromXRotation(x, lightRotationX);
        mat4.multiply(lmat, x, lmat);
        let y = mat4.create();
        mat4.fromYRotation(y,lightRotationY)
        mat4.multiply(lmat,y, lmat);
        let lightDirection = [-lmat[8], -lmat[9],-lmat[10]];
    
        this.gl.uniform3fv(lightDirectionLocation, lightDirection);
        this.gl.uniform1f(limitLocation, Math.cos(this.degToRad(10)));

        var innerLimitLocation = this.gl.getUniformLocation(this.program, "u_innerLimit");
        var outerLimitLocation = this.gl.getUniformLocation(this.program, "u_outerLimit");
        this.gl.uniform1f(innerLimitLocation, Math.cos(this.degToRad(10)));
        this.gl.uniform1f(outerLimitLocation, Math.cos(this.degToRad(30)));

        this.transformator.setdDefaultScaling();
        this.transformator.setDefaultTranslation();
        this.transformator.rotate([0, 0, 90]);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.angleUniform = this.gl.getUniformLocation(this.program, "angle");
        this.select.addEventListener('change', (e) => { this.onSelectChange(e); });
        this.configure_loop();
    }

    loadModel(url: string, drawer_ind: number): void {
        fetch(url)
        .then(response => response.text())
        .then(text =>  this.createObject(this.loader.objtoDrawData(text), drawer_ind));
    }

    load_textures(urls: string[]): void {
        for (let i = 0; i < urls.length; i++){
            let img1 = new Image();
            img1.crossOrigin = 'anonymous'
            img1.src = urls[i];
            img1.onload =() => {
                let texture = new Texture(this.gl, this.program, "u_texture1", 0);
                texture.loadImage(img1);
                this.textures[i] = texture;
            };
        }
    }

    createObject(indexData: IndexDrawData, ind : number){
        this.data[ind] = indexData;
        this.drawers[ind].enableVAO();
        this.drawers[ind].prepareVertices(indexData.attributeExtractor, indexData.vertices);
        this.drawers[ind].prepareIndices(indexData.indices);
        let planetAttributes = this.instanceAttributes[ind];
        this.drawers[ind].prepareInstanceAttributes(PlanetAttribute, planetAttributes);
        this.drawers[ind].disableVAO();
    }

    get_gl(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        if (canvas == null) {
            throw "canvas not found";
        }
    
        const gl = canvas.getContext("webgl2");
    
        if (gl == null) {
            throw "GL is not supported";
        }
    
        return gl
    }

    configure_loop() {
        requestAnimationFrame(() => {this.update()});
    }

    update() {
        this.drawers[0].clearBg();
        
        if (Object.keys(this.data).length == this.num_drawers){
            for (let i = 0; i < this.num_drawers; i++){
                this.textureController.texture1 = this.textures[i];
                this.textureController.bind_textures();

                this.transformator.rotate([-90 + performance.now() / 1000.0 * 0,
                performance.now() / 2 / 1000.0 * 60 * i,
                0 + performance.now() / 5 / 1000.0 * 60]);

                if (this.angleUniform != null) {
                    this.gl.uniform1f(this.angleUniform, performance.now() / 1000.0);
                }
                this.drawers[i].drawIndexInstances(this.data[i], this.num_instances[i]);
            }
        }
        requestAnimationFrame(() => {this.update()});
    }
    onSelectChange(event: Event) {
        console.log("onSelectChange");
        const lightMode = this.selectedLightMode();
        switch (lightMode) {
            case "Направленное": {
                this.lightController.switch_mode("directional");
                break;
            }
            case "Точечное": {
                this.lightController.switch_mode("point");
                break;
            }
            case "Прожекторр": {
                this.lightController.switch_mode("projector");
                break;
            }
            default: {
                throw new Error(`Unknown figure name ${lightMode}`);
            }
        }
        
    }
    private selectedLightMode(): string {
        return this.select.options[this.select.options.selectedIndex].text;
    } 
    private degToRad(d:number) {
        return d * Math.PI/180;
      }
}

function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
