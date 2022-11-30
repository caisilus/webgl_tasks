import { glMatrix, mat4 } from "gl-matrix";
import {DrawData} from "../src/draw_data";

export class Renderer3D{
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

    rotateX(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateX(this.xRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
        mat4.mul(this.matWorld, this.xRotationMatrix, this.matWorld);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

    rotateY(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateY(this.yRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
        mat4.mul(this.matWorld, this.yRotationMatrix, this.matWorld);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

    rotateZ(angle: number) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.rotateZ(this.zRotationMatrix, identityMatrix, glMatrix.toRadian(angle));
        mat4.mul(this.matWorld, this.zRotationMatrix, this.matWorld);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

    translate(dx: number, dy: number, dz: number) {
        mat4.translate(this.matWorld, this.matWorld, [dx, dy, dz]);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

    scale(dx: number, dy: number, dz: number) {
        mat4.scale(this.matWorld, this.matWorld, [dx, dy, dz]);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, this.matWorld);
    }

}
