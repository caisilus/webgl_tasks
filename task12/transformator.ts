import { glMatrix, mat3, mat4 } from "gl-matrix";
import {DrawData} from "../src/draw_data";

export class Transformator{
    private cameraPosition: Float32Array = new Float32Array([0, 0, -5]);
    private cameraTarget: Float32Array = new Float32Array([0, 0, 0]);
    private cameraUp: Float32Array = new Float32Array([0, 1, 0]);
    private fovDegrees: number = 45;

    private aspect: number;
    private zNear: number = 1;
    private zFar: number = 1000;

    private matWorldUniformLocation: WebGLUniformLocation | null;
    private matViewUniformLocation: WebGLUniformLocation | null;
    private matProjUniformLocation: WebGLUniformLocation | null;

    private matWorld: Float32Array;
    private matView: Float32Array;
    private matProj: Float32Array;

    private xRotationMatrix: Float32Array = new Float32Array(16);
	private yRotationMatrix: Float32Array = new Float32Array(16);
    private zRotationMatrix: Float32Array = new Float32Array(16);

    private translationMatrix: Float32Array = new Float32Array(16);
    private scalingMatrix: Float32Array = new Float32Array(16);
    private rotateMatrix: Float32Array = new Float32Array(16);


    constructor(readonly gl: WebGL2RenderingContext, readonly programm: WebGLProgram) {
        this.gl = gl;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.matWorldUniformLocation = this.gl.getUniformLocation(programm, "mWorld");
        this.matViewUniformLocation = this.gl.getUniformLocation(programm, "mView");
        this.matProjUniformLocation = this.gl.getUniformLocation(programm, "mProj");



        this.matWorld = new Float32Array(16);
        this.matView = new Float32Array(16);
        this.matProj = new Float32Array(16);

        mat4.identity(this.matWorld);
        mat4.identity(this.translationMatrix);
        mat4.identity(this.scalingMatrix);
        mat4.identity(this.rotateMatrix);
        this.setUpView();
        this.setUpProjection();
        gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

    public setUpView() {
        mat4.lookAt(this.matView, this.cameraPosition, this.cameraTarget, this.cameraUp);
        this.gl.uniformMatrix4fv(this.matViewUniformLocation, false, this.matView);
    }

    public setUpProjection() {
        mat4.perspective(this.matProj, glMatrix.toRadian(this.fovDegrees), this.aspect, this.zNear, this.zFar);
        this.gl.uniformMatrix4fv(this.matProjUniformLocation, false, this.matProj);
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
