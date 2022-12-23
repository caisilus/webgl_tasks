import phongShader from "./shaders/fong_shader.frag";
import toonShader from "./shaders/toon_shader.frag";
import bidirectShader from "./shaders/bidir_shader.frag";
import vertexShader from "./shaders/shader.vert";

import {Drawer} from "../src/drawer";
import {Camera} from "../src/camera";
import {ShaderProgram} from "../src/shader_program";

import { CameraController } from "../src/camera_controller";
import { IndexDrawData } from "../src/draw_data";
import { ProgramBuilder } from "../src/program_builder";

import Cat from "../static/objects/Cat.obj";
import Span from "../static/objects/spam.obj";
import Grass from "../static/objects/Grass.obj";
import Gun from "../static/objects/Gun.obj";

import CatTex from '../src/images/Cat.jpg';
import SpanTex from '../src/images/spam_BaseColor.jpg';
import GrassTex from '../src/images/Grass_BaseColor.jpg';
import GunTex from '../src/images/Gun.png';

import { Texture } from "../src/texture";
import { LightController } from "./light_controller";
import { LightSource } from "./light_source";
import { SpotLightSource } from "./spot_light_source";
import { mat4 } from "gl-matrix";
import { LoadedObject } from "../src/loaded_object";


class Main {
    gl: WebGL2RenderingContext;
    phongProgram: ShaderProgram;
    toonProgram: ShaderProgram;
    bidirectProgram: ShaderProgram;
    program: ShaderProgram;
    drawer: Drawer;
    camera: Camera;
    cameraController: CameraController;
    grass: LoadedObject;
    cat: LoadedObject;
    gun: LoadedObject;
    lightController: LightController;
    textures: {[key:number]: Texture} = {};
    data: {[key:number]: IndexDrawData} = {}; 
    
    select:HTMLSelectElement;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        const programBuilder = new ProgramBuilder(this.gl);
        
        this.phongProgram = programBuilder.buildProgram(vertexShader, phongShader);
        this.toonProgram = programBuilder.buildProgram(vertexShader, toonShader);
        this.bidirectProgram = programBuilder.buildProgram(vertexShader, bidirectShader);
        
        
        //this.program = this.toonProgram;
        this.program = this.phongProgram;
        //this.program = this.bidirectProgram;
        this.gl.useProgram(this.program.program);
        
        this.drawer = new Drawer(this.gl, this.program);
        
        this.camera = new Camera(this.gl, this.program);
        this.cameraController = new CameraController(this.gl, this.camera);
        this.camera.setPosition(0, 50, -200);
        
        this.cat = new LoadedObject(this.drawer, Cat, CatTex);
        this.cat.transformator.setdDefaultScaling();
        this.cat.transformator.translate(0, 10, 0);
        this.cat.transformator.rotate([270, 0, 180]);

        this.grass = new LoadedObject(this.drawer, Grass, GrassTex);
        this.grass.transformator.setdDefaultScaling();
        this.grass.transformator.setDefaultTranslation();
        this.grass.transformator.rotate([270, 0, 0]);

        this.gun = new LoadedObject(this.drawer, Gun, GunTex);
        this.gun.transformator.translate(0.19, 0.47, 0);
        this.gun.transformator.scale(50, 50, 50);
        this.gun.transformator.rotate([0, 270, 0]);

        let ls0 = new LightSource(
            [0, 50, 500], // lightPosition
            [0.2,0.0,0.0], // lightAmbient
            [0.2,0.2,0.2], // lightDiffuse
            [1,1,1], // lightSpecular
        );
        let ls1 = new LightSource(
            [-500, -500, 0], // lightPosition
            [0.0,0.0,0.2], // lightAmbient
            [0.2,0.2,0.2], // lightDiffuse
            [1,1,1], // lightSpecular
        );

        let spls0 = new SpotLightSource(            
            [0, 200, 0], // lightPosition
            [0, 0, 0], // lightTarget
            5, //lightLimit
            [0.2,0.0,0.0], // lightAmbient
            [0.2,0.2,0.2], // lightDiffuse
            [1,1,1], // lightSpecular
        );

        let spls1 = new SpotLightSource(            
            [0, 50, -200], // lightPosition
            [0, 50, 0], // lightTarget
            5, //lightLimit
            [0.2,0.0,0.0], // lightAmbient
            [0.2,0.2,0.2], // lightDiffuse
            [1,1,1], // lightSpecular
        );
        this.lightController = new LightController(this.gl, this.program, "directional", ls0)
        this.lightController.add_light_source(ls1);
        this.lightController.add_spotlight_source(spls0);
        this.lightController.add_spotlight_source(spls1);
        
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.select.addEventListener('change', (e) => { this.onSelectChange(e); });
        this.configure_loop();
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
        this.drawer.clearBg();
        this.grass.draw();
        this.cat.draw();
        this.gun.draw();
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
            case "Прожектор": {
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
