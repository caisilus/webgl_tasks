import { glMatrix, mat4 } from "gl-matrix";
import { ShaderProgram } from "./shader_program";

export class Transformator{
    private matWorldUniformLocation: WebGLUniformLocation | null;
    private matWorld: Float32Array;

    private xRotationMatrix: Float32Array = new Float32Array(16);
	private yRotationMatrix: Float32Array = new Float32Array(16);
    private zRotationMatrix: Float32Array = new Float32Array(16);

    private translationMatrix: Float32Array = new Float32Array(16);
    private scalingMatrix: Float32Array = new Float32Array(16);
    private rotateMatrix: Float32Array = new Float32Array(16);

    readonly forward: [number, number, number];

    constructor(readonly gl: WebGL2RenderingContext, readonly program: ShaderProgram) {
        this.gl = gl;
        this.matWorldUniformLocation = program.getUniformLocation("mWorld");

        this.matWorld = new Float32Array(16);

        mat4.identity(this.matWorld);
        mat4.identity(this.translationMatrix);
        mat4.identity(this.scalingMatrix);
        mat4.identity(this.rotateMatrix);
        gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    
        this.forward = [0, 0, 1];
    }

    rotate(angle: [number, number, number]) {
        this.rotateX(angle[0]);
        this.rotateY(angle[1]);
        this.rotateZ(angle[2]);
        var rotateXYMatrix = new Float32Array(16);
        mat4.mul(rotateXYMatrix, this.xRotationMatrix, this.yRotationMatrix);
        mat4.mul(this.rotateMatrix, rotateXYMatrix, this.zRotationMatrix);
        this.buildWorldMatrix();
    }

    private rotateX(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateX(this.xRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
    }

    private rotateY(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateY(this.yRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
    }

    private rotateZ(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateZ(this.zRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
    }

    translate(dx: number, dy: number, dz: number) {
        mat4.translate(this.translationMatrix, this.translationMatrix, [dx, dy, dz]);
        this.buildWorldMatrix();
    }

    moveForward(moveSpeed: number) {
        this.translate(this.forward[0] * moveSpeed, this.forward[1] * moveSpeed, this.forward[2] * moveSpeed);
    }

    scale(dx: number, dy: number, dz: number) {
        mat4.scale(this.scalingMatrix, this.scalingMatrix, [dx, dy, dz]);
        this.buildWorldMatrix();
    }

    setdDefaultScaling(){
        mat4.identity(this.scalingMatrix);
        this.buildWorldMatrix();
    }

    setDefaultTranslation() {
        mat4.identity(this.translationMatrix);
        this.buildWorldMatrix();
    }

    buildWorldMatrix(){
        var scaleTranslateMatrix = new Float32Array(16);
        mat4.mul(scaleTranslateMatrix, this.scalingMatrix, this.translationMatrix);
        mat4.mul(this.matWorld, scaleTranslateMatrix, this.rotateMatrix);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

}
