import {Object3D} from "../src/object3d";
import {IndexDrawData} from "../src/draw_data";
import {Drawer} from "../src/drawer";
import {Loader} from "../src/obj_loader";
import {Texture} from "../src/texture";
import {TextureController} from "../src/texture_controller";
import { ShaderProgram } from "./shader_program";

export class LoadedObject extends Object3D {
    private loader: Loader;
    private texture: Texture | null;

    constructor(drawer: Drawer, private modelUrl: string, private textureUrl: string | null = null) {
        super(drawer);
        this.modelUrl = modelUrl;
        this.textureUrl = textureUrl;
        this.loader = new Loader(this.gl);
        this.texture = null;
        this.loadData();
    }

    public static fromProgram(program: ShaderProgram, modelUrl: string, textureUrl: string | null = null): LoadedObject {
        const drawer = new Drawer(program.gl, program);
        return new LoadedObject(drawer, modelUrl, textureUrl);
    }

    private loadModel(url: string) : Promise<IndexDrawData> {
        // console.log(url);
        return fetch(url)
        .then(response => response.text())
        .then(text => this.indexData = this.loader.objtoDrawData(text));
    }

    private loadTexture(url: string) {
        let img1 = new Image();
        img1.crossOrigin = 'anonymous'
        img1.src = url;
        img1.onload = () => {
            let texture = new Texture(this.gl, this.program, "u_texture1", 0);
            texture.loadImage(img1);
            this.texture = texture;
        };
    }

    protected async getObjectData() : Promise<IndexDrawData> {
        if (this.textureUrl) {
            this.loadTexture(this.textureUrl);
        }
        return await this.loadModel(this.modelUrl);
    }

    draw() {
        if (this.indexData == null) {
            return;
        }
        
        if (this.texture != null) {
            this.texture.bind();
            // this.textureControler.texture1 = this.texture;
            // this.textureControler.bind_textures();
        }
        super.draw();
    }
}