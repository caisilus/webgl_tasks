import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/test_shader.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "../src/texture_contoller";
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

import CatTex from '../src/images/Cat.jpg';
import Goodman from '../src/images/goodman.png';
import Seal from '../src/images/seal.png';
import Spam from '../src/images/spam_BaseColor.jpg';
import { Texture } from "../src/texture";


class Main {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    drawers: Drawer[] = [];
    transformator: Transformator;
    cameraController: CameraController;
    textureController: TextureController;
    loader: Loader;

    textures: {[key:number]: Texture} ={};
    data: {[key:number]: IndexDrawData} ={}; 
    num_drawers: number;

    num_instances: number[] = [1 , 3];
    objects_radius: number[] = [5, ];

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        const programBuilder = new ProgramBuilder(this.gl);
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);
        this.num_drawers = 2;
        for (let i = 0; i < this.num_drawers; i++){
            this.drawers.push(new Drawer(this.gl, this.program));
        }

        
        this.transformator = new Transformator(this.gl, this.program);
        this.cameraController = new CameraController(this.gl, this.program);
        this.textureController = new TextureController(this.gl, this.program);
        this.textureController.load_textures();

        let textures_url = [CatTex, Spam];

        this.load_textures(textures_url);

        this.loader = new Loader(this.gl);
        

        this.loadModel(Span, 1);
        this.loadModel(Cat, 0);

        this.transformator.setdDefaultScaling();
        this.transformator.setDefaultTranslation();
        this.transformator.rotate([0, 0, 90]);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
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
        let offsets = this.createOffsets(this.num_instances[ind], 30);
        this.drawers[ind].prepareInstanceAttributes(Offset, offsets);
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

    createOffsets(num: number, dist_between: number){
        let offsets: Offset[] = [];
        for (let i = 0; i < num; i++){
            offsets.push(new Offset( -(num / 2) *dist_between + i  * dist_between, 0.0, 0.0));
        }
        return offsets;
    }

    update() {
        this.drawers[0].clearBg();
        
        if (Object.keys(this.data).length == this.num_drawers && Object.keys(this.textures).length == this.num_drawers){
            for (let i = 0; i < this.num_drawers; i++){
                this.textureController.texture1 = this.textures[i];
                this.textureController.bind_textures();

                this.transformator.rotate([-90 + performance.now() / 1000.0 * 0,
                performance.now() / 2 / 1000.0 * 60 * i,
                0 + performance.now() / 5 / 1000.0 * 60]);

                this.drawers[i].drawIndexInstances(this.data[i], this.num_instances[i]);
            }
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
