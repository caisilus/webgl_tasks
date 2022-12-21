import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/test_shader.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "../src/texture_controller";
import {Transformator} from "../src/transformator";
import { CameraController } from "../src/camera_controller";
import { Loader } from "../src/obj_loader";
import { IndexDrawData } from "../src/draw_data";
import { ProgramBuilder } from "../src/program_builder";

import Cat from "../static/objects/Cat.obj";
import Span from "../static/objects/spam.obj";
import CoockedTurkey from "../static/objects/Cooked_Turkey.obj";

import CatTex from '../src/images/Cat.jpg';
import SpanTexture from '../src/images/spam_BaseColor.jpg';
import CoockedTexture from "../src/images/Cooked_Turkey.jpg";
import { Texture } from "../src/texture";
import { PlanetAttribute } from "./instance_attributes";

import {LoadedObject} from "../src/loaded_object";


class Main {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    vaos: WebGLVertexArrayObject[] = [];
    drawer: Drawer;
    cameraController: CameraController;
    textureController: TextureController;
    turkey: LoadedObject;
    span: LoadedObject;

    // textures: {[key:number]: Texture} = {};
    // data: {[key:number]: IndexDrawData} = {}; 
    instanceAttributes: PlanetAttribute[]; 
    // num_drawers: number;

    // num_instances: number[] = [1 , 2];
    
    angleUniform: WebGLUniformLocation | null;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        const programBuilder = new ProgramBuilder(this.gl);
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);

        this.drawer = new Drawer(this.gl, this.program); 
        this.cameraController = new CameraController(this.gl, this.program);
        this.textureController = new TextureController(this.gl, this.program);
        
        this.turkey = new LoadedObject(this.drawer, this.textureController, CoockedTurkey, CoockedTexture);
        this.span = new LoadedObject(this.drawer, this.textureController, Span, SpanTexture);
        this.instanceAttributes = [new PlanetAttribute(40.0, 1.0, 1.0), 
                                   new PlanetAttribute(60.0, 2.0, 0.2)]
        this.span.createInstances(PlanetAttribute, this.instanceAttributes);

        // this.transformator.setdDefaultScaling();
        // this.transformator.setDefaultTranslation();
        // this.transformator.rotate([0, 0, 90]);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.angleUniform = this.gl.getUniformLocation(this.program, "angle");
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
        
        this.turkey.transformator.rotate([0, 0, performance.now() / 3 / 1000.0 * 60]);
        
        this.turkey.draw();

        this.span.transformator.rotate([0, performance.now() / 2 / 1000.0 * 60, 0]);
        this.span.draw();

        if (this.angleUniform != null) {
            this.gl.uniform1f(this.angleUniform, performance.now() / 1000.0);
        }
        requestAnimationFrame(() => {this.update()});
    }
}

function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
