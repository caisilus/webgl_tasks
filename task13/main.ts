import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/shader3d.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "../task12/texture_controller";
import {DrawDataCreator} from "../task12/data_creator";
import {Transformator} from "../src/transformator";
import { CameraController } from "./camera_controller";
import { Loader } from "./obj_loader";
import {DrawData, IndexDrawData} from "../src/draw_data";
import {Vertex3DWithColor} from "../src/vertex3d";

import Cattle from "../static/objects/cattle.obj";
import Saved from "../static/objects/saved.obj";
import Turky from "../static/objects/Cooked_Turkey.obj";
import Piramid from "../static/objects/pyramids.obj";
import Cat from "../static/objects/Cat.obj";
import SPAN from "../static/objects/spam.obj";


class Main {
    gl: WebGL2RenderingContext;
    select: HTMLSelectElement;
    drawer: Drawer;
    transformator: Transformator;
    cameraController: CameraController;
    textureController: TextureController;
    dataCreator: DrawDataCreator;
    loader: Loader;
    data: IndexDrawData;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        this.drawer = new Drawer(this.gl, vertexShader, fragmentShader);
        this.drawer.buildProgram();
        this.transformator = new Transformator(this.gl, this.drawer.getGLProgram());
        this.cameraController = new CameraController(this.gl, this.drawer.getGLProgram());
        this.textureController = new TextureController(this.gl, this.drawer.getGLProgram());
        this.textureController.load_textures();
        this.dataCreator = new DrawDataCreator(this.gl);
        this.loader = new Loader(this.gl);
        fetch(SPAN)
        .then(response => response.text())
        .then(text => this.data = this.loader.objtoDrawData(text));

        this.transformator.setdDefaultScaling();
        this.transformator.setDefaultTranslation();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
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
        this.textureController.bind_textures();
        if (this.data){
            this.drawer.drawIndex(this.data);
        }
        this.transformator.rotate([performance.now() / 1000.0 * 60,
        performance.now() / 2 / 1000.0 * 60,
        performance.now() / 5 / 1000.0 * 60]);
        this.textureController.bind_textures();
        requestAnimationFrame(() => {this.update()});
    }

    onKeyUp(event: KeyboardEvent) {
        
    }
}



function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
