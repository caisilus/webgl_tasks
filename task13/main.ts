import fragmentShader from "./shaders/test_shader.frag";
import vertexShader from "./shaders/test_shader.vert";

import {ProgramBuilder} from "../src/program_builder";
import {Drawer} from "../src/drawer";
import {Transformator} from "../src/transformator";
import {DrawDataCreator} from "../task12/data_creator";
import {IndexDrawData} from "../src/draw_data";
import {Offset, instanceAttributes} from "./instance_attributes";

class Main {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    drawer: Drawer;
    transformator: Transformator;
    cubeData: IndexDrawData;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        const programBuilder = new ProgramBuilder(this.gl);
        this.program = programBuilder.buildProgram(vertexShader, fragmentShader);
        this.drawer = new Drawer(this.gl, this.program);
        this.transformator = new Transformator(this.gl, this.program);
        const dataCreator = new DrawDataCreator(this.gl);
        this.cubeData = dataCreator.cubeData();
        this.drawer.prepareVertices(this.cubeData.attributeExtractor, this.cubeData.vertices);
        this.drawer.prepareIndices(this.cubeData.indices);
        console.log("here");
        this.drawer.prepareInstanceAttributes(Offset, instanceAttributes());
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.transformator.scale(0.3, 0.3, 0.3);
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
        this.transformator.rotate([performance.now() / 1000.0 * 60,
        performance.now() / 2 / 1000.0 * 60,
        performance.now() / 5 / 1000.0 * 60]);
        this.drawer.drawIndexInstances(this.cubeData, 3);
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