import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/shader3d.vert";

import {Drawer} from "../src/drawer";
import {DrawDataCreator} from "./data_creator";
import {Renderer3D} from "./renderer";

class Main {
    gl: WebGL2RenderingContext;
    select: HTMLSelectElement;
    drawer: Drawer;
    renderer: Renderer3D;
    dataCreator: DrawDataCreator;
    //rotationUniformLocation: WebGLUniformLocation | null;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        this.drawer = new Drawer(this.gl, vertexShader, fragmentShader);
        this.drawer.buildProgram();
        this.renderer = new Renderer3D(this.gl, this.drawer.getGLProgram());
        this.dataCreator = new DrawDataCreator(this.gl);
        //this.rotationUniformLocation = this.gl.getUniformLocation(this.drawer.getGLProgram(), "rotation");
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
        //let drawData = this.dataCreator.drawDataFromFigureName(figureName);
        
        switch (figureName) {
            case "Градиентный круг": {
                this.renderer.rotate([0, 0, performance.now() / 1000.0 * 60]);
                this.gl.disable(this.gl.DEPTH_TEST);
                this.gl.disable(this.gl.CULL_FACE);
                let drawData = this.dataCreator.circleData();
                this.drawer.draw(drawData);
                break;
            }
            case "Текстурирование куба": {
                this.renderer.rotate([performance.now() / 1000.0 * 60,
                performance.now() / 2 / 1000.0 * 60,
                performance.now() / 5 / 1000.0 * 60]);
                this.gl.enable(this.gl.DEPTH_TEST);
                this.gl.enable(this.gl.CULL_FACE);
                let drawData = this.dataCreator.cubeData();
                this.drawer.drawIndex(drawData);
                break;
            }
            case "Градиентный тетраэдр":{
                this.renderer.rotate([60,15,50]);                
                this.gl.enable(this.gl.DEPTH_TEST);
                this.gl.enable(this.gl.CULL_FACE);
                let drawData = this.dataCreator.tetrahedronData();
                this.drawer.drawIndex(drawData);
                break;
            }
            default: {
                throw new Error(`Unknown figure name ${figureName}`);
            }
        }
        requestAnimationFrame(() => {this.draw()});
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
