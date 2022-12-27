import { glMatrix,vec3, mat3, mat4 } from "gl-matrix";
import { ShaderProgram } from "./shader_program";

export class Camera{
    private cameraPosition: Float32Array = new Float32Array([0, 0, -100]);
    private cameraTarget: Float32Array = new Float32Array([0, 0, 0]);
    private cameraUp: Float32Array = new Float32Array([0, 1, 0]);

    private cameraDirection: Float32Array;
    private fovDegrees: number = 45;

    private aspect: number;
    private zNear: number = 1;
    private zFar: number = 1000;

    private matCameraUniformLocation: WebGLUniformLocation | null;
    private camPositionLocation: WebGLUniformLocation | null;
    private matCamera: Float32Array;
    private matView: Float32Array;
    private matProj: Float32Array;

    public pitch: number = 0;
    public yaw: number = 0;

    constructor(readonly gl: WebGL2RenderingContext, readonly program: ShaderProgram) {
        this.gl = gl;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.matCameraUniformLocation = program.getUniformLocation("mCamera");
        this.matCamera = new Float32Array(16);
        this.matView = new Float32Array(16);
        this.matProj = new Float32Array(16);
        this.setUpView();
        this.setUpProjection();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
        this.camPositionLocation = this.program.getUniformLocation("camPosition");

        this.cameraDirection = new Float32Array(3);
        this.countDirection();
    }

    private countDirection() {
        this.cameraDirection = new Float32Array(3);
        this.cameraDirection[0] = this.cameraTarget[0] - this.cameraPosition[0];
        this.cameraDirection[1] = this.cameraTarget[1] - this.cameraPosition[1];
        this.cameraDirection[2] = this.cameraTarget[2] - this.cameraPosition[2];
        vec3.normalize(this.cameraDirection, this.cameraDirection);
        console.log("dir:" + this.cameraDirection);

        this.pitch = Math.asin(this.cameraDirection[1]);
        this.yaw = Math.atan2(this.cameraDirection[2], this.cameraDirection[0]);
    }

    private setUpView() {
        let iden = mat4.create();
        mat4.identity(iden);
        let invertpos = vec3.fromValues(
            -this.cameraPosition[0],
            -this.cameraPosition[1],
            -this.cameraPosition[2]
        )
        mat4.rotateX(this.matView, iden, glMatrix.toRadian(this.pitch));
        mat4.rotateY(this.matView, this.matView, glMatrix.toRadian(180 + this.yaw));
        mat4.translate(this.matView, this.matView, invertpos);
        console.log("pitch:" + this.pitch);
    }

    private setUpProjection() {
        mat4.perspective(this.matProj, glMatrix.toRadian(this.fovDegrees), this.aspect, this.zNear, this.zFar);
    }

    public setPosition(x: number, y: number, z: number) {
        let dx = x - this.cameraPosition[0];
        let dy = y - this.cameraPosition[1];
        let dz = z - this.cameraPosition[2];
        this.moveCamera(dx, dy, dz);
    }

    public moveCamera(x: number, y: number, z: number) {
        this.cameraPosition[0] += x;
        this.cameraPosition[1] += y;
        this.cameraPosition[2] += z;
        this.gl.uniform3fv(this.camPositionLocation, this.cameraPosition);

        this.cameraTarget[0] += x;
        this.cameraTarget[1] += y;
        this.cameraTarget[2] += z;
        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
        //this.countDirection();
    }

    public moveForward(d: number){
        console.log("dir:" + this.cameraDirection);
        this.cameraPosition[0] += this.cameraDirection[0] * d;
        this.cameraPosition[1] += this.cameraDirection[1] * d;
        this.cameraPosition[2] += this.cameraDirection[2] * d;

        this.cameraTarget[0] += this.cameraDirection[0] * d;
        this.cameraTarget[1] += this.cameraDirection[1] * d;
        this.cameraTarget[2] += this.cameraDirection[2] * d;
        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
        //this.countDirection();
    }

    public moveRight(d: number){
        /* this.countDirection(); */
        let right = new Float32Array(3);
        vec3.cross(right, this.cameraDirection, this.cameraUp);
        vec3.normalize(right, right);
        console.log("right:" + right);
        this.cameraPosition[0] += right[0] * d;
        this.cameraPosition[1] += right[1] * d;
        this.cameraPosition[2] += right[2] * d;

        this.cameraTarget[0] += right[0] * d;
        this.cameraTarget[1] += right[1] * d;
        this.cameraTarget[2] += right[2] * d;
        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
        //this.countDirection();
    }

    public moveUp(d: number){
        //this.countDirection();
        console.log("up:" + this.cameraUp);
        this.cameraPosition[0] += this.cameraUp[0] * d;
        this.cameraPosition[1] += this.cameraUp[1] * d;
        this.cameraPosition[2] += this.cameraUp[2] * d;

        this.cameraTarget[0] += this.cameraUp[0] * d;
        this.cameraTarget[1] += this.cameraUp[1] * d;
        this.cameraTarget[2] += this.cameraUp[2] * d;
        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
        //this.countDirection();
    }

    public rotateCamera() {
        this.setUpView();
        // this.coutDiection(this.pitch, this.yaw)

        // this.cameraTarget[0] = this.cameraPosition[0] + this.cameraDirection[0];
        // this.cameraTarget[1] = this.cameraPosition[1] + this.cameraDirection[1];
        // this.cameraTarget[2] = this.cameraPosition[2] + this.cameraDirection[2];

        // this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
    }

    public getCameraPosition(){
        return this.cameraPosition
    }

    public changeProgram(program: ShaderProgram) {
        this.gl.useProgram(program.program);
        this.camPositionLocation = program.getUniformLocation("camPosition");
        this.matCameraUniformLocation = program.getUniformLocation("mCamera");
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
    }

    public position(): Float32Array {
        return this.cameraPosition;
    }
}