import { glMatrix,vec3, mat3, mat4 } from "gl-matrix";

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
    private matCamera: Float32Array;
    private matView: Float32Array;
    private matProj: Float32Array;

    public pitch: number = 0;
    public yaw: number = 0;

    constructor(readonly gl: WebGL2RenderingContext, readonly programm: WebGLProgram) {
        this.gl = gl;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.matCameraUniformLocation = this.gl.getUniformLocation(programm, "mCamera");
        this.matCamera = new Float32Array(16);
        this.matView = new Float32Array(16);
        this.matProj = new Float32Array(16);
        this.setUpView();
        this.setUpProjection();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);

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
    private coutDiection(pitch: number, yaw: number) {
        this.cameraDirection = new Float32Array(3);
        this.cameraDirection[0] = Math.cos(pitch) * Math.cos(yaw);
        this.cameraDirection[1] = Math.sin(pitch);
        this.cameraDirection[2] = Math.cos(pitch) * Math.sin(yaw);
        this.cameraUp = new Float32Array(3);
        this.cameraUp[0] = Math.sin(pitch);
        this.cameraUp[1] =  - Math.cos(pitch) * Math.cos(yaw + Math.PI / 2);
        this.cameraUp[2] = Math.cos(pitch) * Math.sin(yaw + Math.PI / 2);
        vec3.normalize(this.cameraUp, this.cameraUp);
        vec3.normalize(this.cameraDirection, this.cameraDirection);
        console.log("dir:" + this.cameraDirection);
    }

    private setUpView() {
        mat4.lookAt(this.matView, this.cameraPosition, this.cameraTarget, this.cameraUp);
    }

    private setUpProjection() {
        mat4.perspective(this.matProj, glMatrix.toRadian(this.fovDegrees), this.aspect, this.zNear, this.zFar);
    }

    public moveCamera(x: number, y: number, z: number) {
        this.cameraPosition[0] += x;
        this.cameraPosition[1] += y;
        this.cameraPosition[2] += z;
        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
    }

    public moveForward(d: number){
        //this.countDirection();
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
        this.countDirection();
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
        this.countDirection();
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
        this.countDirection();
    }

    public rotateCamera() {
        this.coutDiection(this.pitch, this.yaw)

        this.cameraTarget[0] = this.cameraPosition[0] + this.cameraDirection[0];
        this.cameraTarget[1] = this.cameraPosition[1] + this.cameraDirection[1];
        this.cameraTarget[2] = this.cameraPosition[2] + this.cameraDirection[2];

        this.setUpView();
        mat4.multiply(this.matCamera, this.matProj, this.matView);
        this.gl.uniformMatrix4fv(this.matCameraUniformLocation, false, this.matCamera);
    }

}