import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/shader.vert";

import {Drawer} from "../src/drawer";
import {DrawDataCreator} from "./data_creator";

class Main {
    gl: WebGL2RenderingContext;
    select: HTMLSelectElement;
    drawer: Drawer;
    dataCreator: DrawDataCreator;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        this.configure_button()
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
        this.drawer = new Drawer(this.gl, vertexShader, fragmentShader);
        this.drawer.buildProgram();
        this.dataCreator = new DrawDataCreator(this.gl);
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

    configure_button() {
        const draw_button = document.querySelector("button#drawButton") as HTMLButtonElement;
        draw_button.addEventListener("click", () => {this.draw()});
    }

    draw() {
        let figureName = this.selectedFigureName();
        let drawData = this.dataCreator.drawDataFromFigureName(figureName);
        this.drawer.draw(drawData, [0, 255, 0]);
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
