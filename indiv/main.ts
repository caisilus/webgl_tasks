import vertexShader from "./shaders/shader.vert";
import fragmentShader from "./shaders/shader.frag";

import {Drawer} from "../src/drawer";
import {Camera} from "../src/camera";
import {ShaderProgram} from "../src/shader_program";

import { CameraController } from "../src/camera_controller";
import { IndexDrawData } from "../src/draw_data";
import { ProgramBuilder } from "../src/program_builder";

import TankModel from "./models/Tanks.obj";
import TankTexture from "./models/Tank.png";

import FieldModel from "./models/Field.obj";
import FieldTexture from "./models/Field.png";

import ChristmasTreeModel from "./models/ChristmasTree.obj";
import ChristmasTreeTexture from "./models/ChristmasTree.png";

import { Texture } from "../src/texture";
import { LightController } from "../src/light_controller";
import { LightSource } from "../src/light_source";
import { SpotLightSource } from "../src/spot_light_source";
import { LoadedObject } from "../src/loaded_object";
import { TankController } from "./tank_controller";

class Main {
    gl: WebGL2RenderingContext;
    program: ShaderProgram;
    drawer: Drawer;
    camera: Camera;
    tankController: TankController;
    // cameraController: CameraController;
    grass: LoadedObject;
    tank: LoadedObject;
    christmasTree: LoadedObject;
    lightController: LightController;
    lastFrameTime: number = 0.0;
    deltaTime: number = 0.0;
    
    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas);
        const programBuilder = new ProgramBuilder(this.gl);
        
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program.program);
        this.drawer = new Drawer(this.gl, this.program);

        this.camera = new Camera(this.gl, this.program);
        // this.cameraController = new CameraController(this.gl, this.camera);
        // this.cameraController.cameraMoveSpeed = 2.0;
        // this.cameraController.cameraRotationSpeed = 20;
        this.camera.setPosition(0, 3, -10);
        
        this.tank = new LoadedObject(this.drawer, TankModel, TankTexture);
        this.tank.transformator.setdDefaultScaling();
        this.tank.transformator.translate(0, 0, 0);
        this.tank.transformator.rotate([0, 90, 0]);

        this.tankController = new TankController(this.tank.transformator, [0, 90, 0]);
        
        this.grass = new LoadedObject(this.drawer, FieldModel, FieldTexture);
        this.grass.transformator.scale(2, 1, 2);
        this.grass.transformator.setDefaultTranslation();

        this.christmasTree = new LoadedObject(this.drawer, ChristmasTreeModel, ChristmasTreeTexture);
        this.christmasTree.transformator.translate(5, 0, 10);

        
        let spls0 = new SpotLightSource( 
            this.gl,       
            [0, 200, 0], // lightPosition
            [0, 0, 0], // lightTarget
            10, //lightLimit
            [0.2,0.2,0.2], // lightAmbient
            [1,1,1], // lightDiffuse
            [1,1,1], // lightSpecular
        );

        let spls1 = new SpotLightSource(
            this.gl,          
            [0, 50, -200], // lightPosition
            [0, 50, 0], // lightTarget
            5, //lightLimit
            [0.2,0.0,0.0], // lightAmbient
            [0.2,0.2,0.2], // lightDiffuse
            [1,1,1], // lightSpecular
        );
        
        this.lightController = new LightController(this.gl, this.program)
        this.lightController.add_spotlight_source(spls0);
        //this.lightController.add_spotlight_source(spls1);
        this.lightController.set_active_lights([true, false, true]);
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
        requestAnimationFrame((frameTime) => {this.update(frameTime)});
    }

    update(frameTime: number) {
        this.countDeltaTime(frameTime);
        console.log(this.deltaTime);
        Drawer.clearBg(this.gl);
        this.grass.draw();
        this.updateTank();
        this.tank.draw();
        this.christmasTree.draw();
        requestAnimationFrame((frameTime) => {this.update(frameTime)});
    }

    countDeltaTime(frameTime: number){
        this.deltaTime = frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
    }

    updateTank() {
        this.tankController.moveSpeed = 5.0 / 1000 * this.deltaTime;
        this.tankController.rotationSpeed = 60.0 / 1000 * this.deltaTime;
        if (this.tankController.keyDownDictionary["w"]) {
            this.tankController.moveTankForward();
        }
        if (this.tankController.keyDownDictionary["s"]) {
            this.tankController.moveTankBackward();
        }
        if (this.tankController.keyDownDictionary["a"]) {
            this.tankController.rotateTankLeft();
        }
        if (this.tankController.keyDownDictionary["d"]) {
            this.tankController.rotateTankRight();
        }
    }
}

function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
