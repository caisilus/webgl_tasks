import fragmentShader from "./shaders/shader.frag";
import vertexShader from "./shaders/shader.vert";

import {TriangleDrawer} from "./drawer";
import {Drawer} from "./refactored_drawer";
import {Vertex2DWithColor} from "./vertex2d";


function main(){
    const canvas = document.querySelector("canvas#mycanvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "800");
    canvas.setAttribute("height", "600");

    if (canvas == null) {
        throw "canvas not found";
    }

    const gl = canvas.getContext("webgl2")

    if (gl == null) {
        throw "GL is not supported";
    }

    let vertices = [new Vertex2DWithColor(-1.0, 1.0, [255,0,0]), 
                    new Vertex2DWithColor(0.0, -1.0, [0,255,0]),
                    new Vertex2DWithColor(1.0, 1.0,  [0,0,255])];
    const drawer = new Drawer(gl);
    drawer.buildProgram();
    drawer.draw(vertices);
}

main();
