export class Texture{
    texnimber: number;
    texture: WebGLTexture | null;
    private imageLocation: WebGLUniformLocation | null;

    constructor(readonly gl: WebGL2RenderingContext,readonly programm: WebGLProgram, sampler_name: string, num: number){
        this.gl = gl;
        this.imageLocation = this.gl.getUniformLocation(programm, sampler_name);
        this.texnimber = num;
        this.texture = null;
    }
    
    loadImage(image: HTMLImageElement){
        this.gl.activeTexture(this.gl.TEXTURE0 + this.texnimber);
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        // Set the parameters so we don't need mips
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        // Upload the image into the texture.
        let mipLevel = 0;               // the largest mip
        let internalFormat = this.gl.RGBA;   // format we want in the texture
        let srcFormat = this.gl.RGBA;        // format of data we are supplying
        let srcType = this.gl.UNSIGNED_BYTE; // type of data we are supplying
        this.gl.texImage2D(this.gl.TEXTURE_2D,
                      mipLevel,
                      internalFormat,
                      srcFormat,
                      srcType,
                      image);
    }

    bind(){
        this.gl.activeTexture(this.gl.TEXTURE0 + this.texnimber);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.imageLocation, this.texnimber);
    }
}