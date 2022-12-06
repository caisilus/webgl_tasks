import {Transformator} from '../src/transformator';
import {TextureController} from './texture_controller';
import {DrawDataCreator} from "./data_creator";
import {Drawer} from "../src/drawer";
import {DataChangeFrequency} from "../src/buffer";
import {DrawData} from "../src/draw_data";

export class CircleMode {
    circleData: DrawData;
    
    constructor(private transformator: Transformator, private textureController: TextureController, 
                private dataCreator: DrawDataCreator, private gl: WebGL2RenderingContext) {
        this.transformator = transformator;
        this.gl = gl;
        this.textureController = textureController;
        this.dataCreator = dataCreator;
        this.circleData = dataCreator.circleData();
    }
    
    setup(drawer: Drawer) {
        console.log("setup");
        drawer.prepareVertices(this.circleData.attributeExtractor, this.circleData.vertices);
        this.transformator.setDefaultTranslation();
        this.transformator.rotate([0, 0, 0]);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.textureController.disable_textures();
    }

    update(drawer: Drawer) {
        this.transformator.rotate([0, 0, performance.now() / 1000.0 * 60]);
        drawer.draw(this.circleData);
    }

    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "w": {
                this.transformator.scale(1.0, 1.1, 1.0);
                break;
            }
            case "s": {
                this.transformator.scale(1.0, 0.9, 1.0);
                break;
            }
            case "a": {
                this.transformator.scale(0.9, 1.0, 1.0);
                break;
            }
            case "d": {
                this.transformator.scale(1.1, 1.0, 1.0);
                break;
            }
            default: {
                break;
            }
        }
    }
}