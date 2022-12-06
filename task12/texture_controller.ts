import {Texture} from "../src/texture";
import Cat from '../src/images/cat.png';
import Goodman from '../src/images/goodman.png';
import Seal from '../src/images/seal.png';

export class TextureController{
    private texturesMixLocation: WebGLUniformLocation | null;
    private colorMixLocation: WebGLUniformLocation | null;
    private texture1: Texture;
    private texture2: Texture;

    public textures_mix: number;
    public color_mix: number;

    constructor(readonly gl: WebGL2RenderingContext, readonly programm: WebGLProgram) {
        this.gl = gl;
        this.programm = programm;
        this.texturesMixLocation = this.gl.getUniformLocation(programm, "texturesMix");
        this.colorMixLocation = this.gl.getUniformLocation(programm, "colorMix");
        this.texture1 = new Texture(this.gl, this.programm, "u_texture1", 0);
        this.texture2 = new Texture(this.gl, this.programm, "u_texture2", 1);
        this.color_mix = 1.0;
        this.textures_mix = 0.0;
        this.set_color_mix();
        this.set_textures_mix();
        this.load_textures();
    }

    increase_textures_mix(){
        this.textures_mix += 0.05;
        if (this.textures_mix > 1.0){
            this.textures_mix = 1.0;
        }
        this.set_textures_mix();
    }

    decrease_textures_mix(){
        this.textures_mix -= 0.05;
        if (this.textures_mix < 0.0){
            this.textures_mix = 0.0;
        }
        this.set_textures_mix();
    }

    increase_color_mix(){
        this.color_mix += 0.05;
        if (this.color_mix > 1.0){
            this.color_mix = 1.0;
        }
        this.set_color_mix();
    }

    decrease_color_mix(){
        this.color_mix -= 0.05;
        if (this.color_mix < 0.0){
            this.color_mix = 0.0;
        }
        this.set_color_mix();
    }

    set_textures_mix(){
        if (this.texturesMixLocation == null) {
            throw "texturesMixLocation is null";
        }
        this.gl.uniform1f(this.texturesMixLocation, this.textures_mix);
    }

    set_color_mix(){
        if (this.colorMixLocation == null) {
            throw "colorMixLocation is null";
        }
        this.gl.uniform1f(this.colorMixLocation, this.color_mix);
    }

    load_textures(){
        let img1 = new Image();
        img1.crossOrigin = 'anonymous'
        img1.src = Goodman;
        img1.onload =() => {
            return this.texture1.loadImage(img1);
        };

        let img2 = new Image();
        img2.crossOrigin = 'anonymous'
        img2.src = Cat;
        img2.onload =() => {
            return this.texture2.loadImage(img2);
        };
    }

    bind_textures(){
        this.texture1.bind();
        this.texture2.bind();
    }

    disable_textures(){
        this.color_mix = 1.0;
        this.textures_mix = 0.0;
        this.set_color_mix();
        this.set_textures_mix();
    }
}