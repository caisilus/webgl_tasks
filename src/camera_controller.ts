import {Camera} from "./camera";
import {vec2} from "gl-matrix";

export class CameraController{
    camera: Camera;
    canvas: HTMLCanvasElement;
    cameraMoveSpeed: number = 1;
    cameraRotationSpeed: number = 0.1;

    drag: boolean = false;
    oldAngels: Array<number> = [0, 0];


    startMousePosition: vec2 = vec2.create();
    endMousePosition: vec2 = vec2.create();

    constructor(readonly gl: WebGL2RenderingContext, camera: Camera)
    {
        this.canvas = gl.canvas as HTMLCanvasElement;
        this.camera = camera;
        

        document.addEventListener("mousedown", (e) => { this.mouse_button_down(e); }, false);
        document.addEventListener("mouseup", (e) => { this.mouse_button_up(e); }, false);
        document.addEventListener("mouseout", (e) => { this.mouse_button_up(e); }, false);
        document.addEventListener( "mousemove", (e) => { this.mouse_move(e); }, false );
        document.addEventListener( 'keyup', (e) => { this.key_button_up(e); }, false );
    }

    mouse_button_down(e: MouseEvent) {
        console.log(e.button);
        if(e.button == 0){
            this.drag = true;
            this.startMousePosition = this.get_mouse_pos(e.clientX, e.clientY);
            this.oldAngels = new Array<number>(this.camera.pitch, this.camera.yaw);
        }
    }

    mouse_button_up(e: MouseEvent) {
        if(e.button == 0){ this.drag = false; }
        this.endMousePosition = vec2.create();
        this.startMousePosition = vec2.create();
        this.oldAngels = [0, 0];
    }

    mouse_move(e: MouseEvent) {
        if (this.drag){
            e.preventDefault();
            this.endMousePosition = this.get_mouse_pos(e.clientX, e.clientY);
            let mouseVec = vec2.subtract(vec2.create(),this.endMousePosition, this.startMousePosition);
            
            this.camera.pitch = this.oldAngels[0] - (mouseVec[1] / this.canvas.clientWidth) * this.cameraRotationSpeed;
            if(this.camera.pitch > 180) this.camera.pitch = 180;
            if(this.camera.pitch < -180) this.camera.pitch = -180;
        
            this.camera.yaw = this.oldAngels[1] - (mouseVec[0]/ this.canvas.clientHeight) * this.cameraRotationSpeed;
            if(this.camera.yaw > 89) this.camera.yaw = 89;
            if(this.camera.yaw < -89) this.camera.yaw = -89;
            this.camera.rotateCamera();
        }
     };

    key_button_up(e: KeyboardEvent) {
        switch (e.key) {
            case "w": {
                this.camera.moveForward(this.cameraMoveSpeed);
                break;
            }
            case "s": {
                this.camera.moveForward(-this.cameraMoveSpeed);
                break;
            }
            case "a": {
                this.camera.moveRight(-this.cameraMoveSpeed);
                break;
            }
            case "d": {
                this.camera.moveRight(this.cameraMoveSpeed);
                break;
            }
            case "q": {
                this.camera.moveUp(this.cameraMoveSpeed);
                break;
            }
            case "e": {
                this.camera.moveUp(-this.cameraMoveSpeed);
                break;
            }
            default: {
                break;
            }
        }
    }

    get_mouse_pos(clientX: number, clientY: number) {
        var rect = this.canvas.getBoundingClientRect();
        return vec2.fromValues(clientX - rect.left, clientY - rect.top);
    }
}