import {Transformator} from "../src/transformator";
import {Camera} from "../src/camera";
import { vec3, glMatrix } from "gl-matrix";

interface KeyDownDictionary {
    [key: string]: boolean;
}

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 10;
    keyDownDictionary: KeyDownDictionary = { "w": false, "s": false, "a": false, "d": false };
    localCameraPosition: vec3;

    constructor(private transformator: Transformator, private camera: Camera) {
        this.transformator = transformator;
        this.camera = camera;
        
        const localCameraPositionArray = this.camera.position();
        this.localCameraPosition = vec3.fromValues(localCameraPositionArray[0], 
                                                   localCameraPositionArray[1], 
                                                   localCameraPositionArray[2]);

        document.addEventListener('keydown', (e) => { this.keyDown(e); }, false);
        document.addEventListener('keyup', (e) => { this.keyUp(e); }, false);
    }

    updateTank() {
        if (this.keyDownDictionary["w"]) {
            this.moveTankForward();
        }
        if (this.keyDownDictionary["s"]) {
            this.moveTankBackward();
        }
        if (this.keyDownDictionary["a"]) {
            this.rotateTankLeft();
        }
        if (this.keyDownDictionary["d"]) {
            this.rotateTankRight();
        }
        let cameraPosition = this.transformator.position();
        
        vec3.add(cameraPosition, cameraPosition, this.localCameraPosition);
        this.camera.setPosition(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    }

    keyDown(e: KeyboardEvent): void {
        console.log("down: "+e.key);
        this.keyDownDictionary[e.key] = true;
    }

    moveTankForward() {
        this.transformator.moveForward(this.moveSpeed);
    }

    moveTankBackward() {
        const backwardSpeed = -0.5 * this.moveSpeed
        this.transformator.moveForward(backwardSpeed);
    }

    rotateTankRight() {
        const delta: [number, number, number] = [0, -this.rotationSpeed, 0];
        this.rotateTank(delta);
    }

    rotateTankLeft() {
        const delta: [number, number, number] = [0, this.rotationSpeed, 0];
        this.rotateTank(delta);
    }

    rotateTank(delta: [number, number, number]) {
        this.transformator.rotate(delta);
        this.camera.yaw += -delta[1];
        this.camera.rotateCamera();
        this.alignCameraToTankBack(delta[1]);
    }

    private alignCameraToTankBack(rotationAngle: number) {
        const origin = vec3.fromValues(0, 0, 0);
        const radAngle = glMatrix.toRadian(rotationAngle);
        this.localCameraPosition = vec3.rotateY(this.localCameraPosition, this.localCameraPosition, origin, radAngle);
    }

    keyUp(e: KeyboardEvent) {
        console.log("up: " + e.key);
        this.keyDownDictionary[e.key] = false;
        console.log(`keyDownDictionary[w]: ${this.keyDownDictionary["w"]}`);
    }
}