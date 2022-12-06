import {Transformator} from './transformator';
import {TextureController} from './texture_controller';
import {DrawDataCreator} from "./data_creator";
import {Drawer} from "../src/drawer";
import {DataChangeFrequency} from "../src/buffer";

export class CubeMode {
    constructor(private transformator: Transformator, private textureController: TextureController, 
                private dataCreator: DrawDataCreator, private gl: WebGL2RenderingContext) {
        this.transformator = transformator;
        this.gl = gl;
        this.textureController = textureController;
        this.dataCreator = dataCreator;
    }
    
    setup() {
        this.transformator.setdDefaultScaling();
        this.transformator.setDefaultTranslation();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
    }

    update(drawer: Drawer) {
        this.transformator.rotate([performance.now() / 1000.0 * 60,
        performance.now() / 2 / 1000.0 * 60,
        performance.now() / 5 / 1000.0 * 60]);
        this.textureController.bind_textures();
        let drawData = this.dataCreator.cubeData();
        drawer.drawIndex(drawData);
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "w": {
                this.textureController.increase_color_mix();
                break;
            }
            case "s": {
                this.textureController.decrease_color_mix();
                break;
            }
            case "a": {
                this.textureController.decrease_textures_mix();
                break;
            }
            case "d": {
                this.textureController.increase_textures_mix();
                break;
            }
            default: {
                break;
            }
        }
    }
}