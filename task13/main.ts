import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/test_shader.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "../task12/texture_controller";
import {DrawDataCreator} from "../task12/data_creator";
import {Transformator} from "../src/transformator";
import { CameraController } from "./camera_controller";
import { Loader } from "./obj_loader";
import {DrawData, IndexDrawData} from "../src/draw_data";
import {Vertex3DWithColor} from "../src/vertex3d";
import {instanceAttributes, Offset} from "./instance_attributes";
import { ProgramBuilder } from "../src/program_builder";

import Cattle from "../static/objects/cattle.obj";
import Saved from "../static/objects/saved.obj";
import Turky from "../static/objects/Cooked_Turkey.obj";
import Piramid from "../static/objects/pyramids.obj";
import Cat from "../static/objects/Cat.obj";
import Span from "../static/objects/spam.obj";


class Main {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    drawer: Drawer;
    transformator: Transformator;
    cameraController: CameraController;
    textureController: TextureController;
    loader: Loader;

    data: IndexDrawData | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        const programBuilder = new ProgramBuilder(this.gl);
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);
        this.drawer = new Drawer(this.gl, this.program);

        
        this.transformator = new Transformator(this.gl, this.program);
        this.cameraController = new CameraController(this.gl, this.program);
        this.textureController = new TextureController(this.gl, this.program);
        this.loader = new Loader(this.gl);

        this.loadModel(Span);

        //this.textureController.disable_textures();
        this.transformator.setdDefaultScaling();
        this.transformator.setDefaultTranslation();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.configure_loop();
    }

    loadModel(url: string): void {
        fetch(url)
        .then(response => response.text())
        .then(text =>  this.createObject(this.loader.objtoDrawData(text)));
    }

    createObject(indexData: IndexDrawData){
        this.data = indexData;
        console.log(this.data);
        this.drawer.prepareVertices(indexData.attributeExtractor, indexData.vertices);
        this.drawer.prepareIndices(indexData.indices);
        this.drawer.prepareInstanceAttributes(Offset, instanceAttributes());
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
        this.transformator.rotate([performance.now() / 1000.0 * 60,
        performance.now() / 2 / 1000.0 * 60,
        performance.now() / 5 / 1000.0 * 60]);
        if (this.data){
            //this.drawer.drawIndex(this.data);
            this.drawer.drawIndexInstances(this.data, 3);
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
