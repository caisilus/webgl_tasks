import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/shader3d.vert";

import {Drawer} from "../src/drawer";
import {TextureController} from "./texture_contoller";
import {DrawDataCreator} from "./data_creator";
import {Renderer3D} from "./renderer";
class Main {
    gl: WebGL2RenderingContext;
    select: HTMLSelectElement;
    drawer: Drawer;
    renderer: Renderer3D;
    texture_controller: TextureController;
    dataCreator: DrawDataCreator;
    //rotationUniformLocation: WebGLUniformLocation | null;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        this.drawer = new Drawer(this.gl, vertexShader, fragmentShader);
        this.drawer.buildProgram();
        this.renderer = new Renderer3D(this.gl, this.drawer.getGLProgram());

        this.texture_controller = new TextureController(this.gl, this.drawer.getGLProgram());
        this.texture_controller.load_textures();

        document.addEventListener('keyup', (e) => {this.onKeyUp(e)}, false);
        
        this.dataCreator = new DrawDataCreator(this.gl);
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
        requestAnimationFrame(() => {this.draw()});
    }

    draw() {
        let figureName = this.selectedFigureName();
        
        switch (figureName) {
            case "Градиентный круг": {
                this.gl.disable(this.gl.DEPTH_TEST);
                this.gl.disable(this.gl.CULL_FACE);
                this.texture_controller.disable_textures();
                this.renderer.rotate([0, 0, performance.now() / 1000.0 * 60]);
                let drawData = this.dataCreator.circleData();
                this.drawer.draw(drawData);
                break;
            }
            case "Текстурирование куба": {
                this.gl.enable(this.gl.DEPTH_TEST);
                this.gl.enable(this.gl.CULL_FACE);
                this.renderer.rotate([performance.now() / 1000.0 * 60,
                performance.now() / 2 / 1000.0 * 60,
                performance.now() / 5 / 1000.0 * 60]);
                this.texture_controller.bind_textures();
                let drawData = this.dataCreator.cubeData();
                this.drawer.drawIndex(drawData);
                break;
            }
            default: {
                throw new Error(`Unknown figure name ${figureName}`);
            }
        }
        requestAnimationFrame(() => {this.draw()});
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "w":{
                console.log(this);
                this.texture_controller.increase_color_mix();
                break;
            }
            case "s":{
                this.texture_controller.decrease_color_mix();
                break;
            }
            case "a":{
                this.texture_controller.decrease_textures_mix();
                break;
            }
            case "d":{
                this.texture_controller.increase_textures_mix();
                break;
            }
            default: {
                break;
            }
        }
    }

    rotation(): Float32Array {
        let rotation = new Float32Array(4);
        let radAngle = performance.now() / 1000.0 / 6 * 2 * Math.PI;
        let sin = Math.sin(radAngle);
        let cos = Math.cos(radAngle);
        rotation[0] = cos;
        rotation[1] = sin
        rotation[2] = -sin;
        rotation[3] = cos;
        return rotation;
    }

    private selectedFigureName(): string {
        return this.select.options[this.select.options.selectedIndex].text;
    } 
}

function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
