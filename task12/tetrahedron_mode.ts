import {Transformator} from './transformator';
import {TextureController} from './texture_controller';
import {DrawDataCreator} from "./data_creator";
import {Drawer} from "../src/drawer";

export class TetrahedronMode {
    constructor(private transformator: Transformator, private textureController: TextureController, 
                private dataCreator: DrawDataCreator, private gl: WebGL2RenderingContext) {
        this.transformator = transformator;
        this.gl = gl;
        this.textureController = textureController;
        this.dataCreator = dataCreator;
    }
    
    setup() {
        this.transformator.setdDefaultScaling();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.textureController.disable_textures();
        this.transformator.rotate([60,15,50]);
    }

    update(drawer: Drawer) {
        let drawData = this.dataCreator.tetrahedronData();
        drawer.drawIndex(drawData);
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "w": {
                this.transformator.translate(0,0.1,0);
                break;
            }
            case "s": {
                this.transformator.translate(0,-0.1,0);
                break;
            }
            case "a": {
                this.transformator.translate(0.1,0,0);
                break;
            }
            case "d": {
                this.transformator.translate(-0.1,0,0);
                break;
            }
            case "q": {
                this.transformator.translate(0,0,0.1);
                break;
            }
            case "e": {
                this.transformator.translate(0,0,-0.1);
                break;
            }
            default: {
                break;
            }
        }
    }
}