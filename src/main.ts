import fragmentShader from "./shaders/shader_uniform.frag";
import vertexShader from "./shaders/shader_uniform.vert";

import {Drawer} from "./refactored_drawer";
import {Vertex2D, Vertex2DWithColor} from "./vertex2d";
import {DrawData} from "./draw_data";

class Main {
    gl: WebGL2RenderingContext;
    select: HTMLSelectElement;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = this.get_gl(canvas)
        this.configure_button()
        this.select = document.querySelector("select#selectFigure") as HTMLSelectElement;
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
        const drawer = new Drawer(this.gl, vertexShader, fragmentShader);
        drawer.buildProgram();
        let figureName = this.selectedFigureName();
        let drawData = this.drawDataFromFigureName(figureName);
        drawer.draw(drawData.vertices, drawData.drawMethod, drawData.pointsCount);
    }

    private selectedFigureName(): string {
        return this.select.options[this.select.options.selectedIndex].text;
    }

    private drawDataFromFigureName(name: string): DrawData {
        switch (name) {
            case "Треугольник": {
                let vertices = [new Vertex2D(-1.0, 1.0), 
                                new Vertex2D(0.0, -1.0),
                                new Vertex2D(1.0, 1.0)];
                let drawMethod = this.gl.TRIANGLES;
                let pointsCount = 3;
                return {
                    "vertices": vertices,
                    "drawMethod": drawMethod,
                    "pointsCount": pointsCount
                };
            }
            case "Прямоугольник": {
                let vertices = [new Vertex2D(-1.0, -1.0), 
                                new Vertex2D(-1.0, 1.0),
                                new Vertex2D(1.0, -1.0),
                                new Vertex2D(1.0, 1.0)];
                let drawMethod = this.gl.TRIANGLE_STRIP;
                let pointsCount = 4;
                return {
                    "vertices": vertices,
                    "drawMethod": drawMethod,
                    "pointsCount": pointsCount
                };
            }
        }

        return {
            "vertices": [],
            "drawMethod": this.gl.TRIANGLES,
            "pointsCount": 0
        };
    }
}

function f() {
    console.log("f")
}

function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "800");
    canvas.setAttribute("height", "600");
    const mainObj = new Main(canvas);
}

main();
