import {Transformator} from "../src/transformator";
import {Camera} from "../src/camera";
import {vec3, glMatrix} from "gl-matrix";
import {SpotLightSource} from "../src/spot_light_source";

interface KeyDownDictionary {
    [key: string]: boolean;
}

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 10;
    keyDownDictionary: KeyDownDictionary = { "w": false, "s": false, "a": false, "d": false };
    localCameraPosition: vec3;
    localLight1Position: vec3;
    localLight2Position: vec3;

    constructor(private transformator: Transformator, private camera: Camera, 
                private light1: SpotLightSource, private light2: SpotLightSource) {
        this.transformator = transformator;
        this.camera = camera;
        this.light1 = light1;
        this.light2 = light2;

        const localCameraPositionArray = this.camera.position();
        this.localCameraPosition = vec3.fromValues(localCameraPositionArray[0], 
                                                   localCameraPositionArray[1], 
                                                   localCameraPositionArray[2]);
        
        const localLight1Position = this.light1.lightPosition;
        this.localLight1Position = vec3.fromValues(localLight1Position[0], 
                                                   localLight1Position[1], 
                                                   localLight1Position[2]);
        
        const localLight2Position = this.light2.lightPosition;
        this.localLight2Position = vec3.fromValues(localLight2Position[0], 
                                                   localLight2Position[1], 
                                                   localLight2Position[2]);
        
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
        
        this.moveCamera();
        this.moveLight();
    }

    moveCamera() {
        let cameraPosition = this.transformator.position();
        vec3.add(cameraPosition, cameraPosition, this.localCameraPosition);
        this.camera.setPosition(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    }

    moveLight() {
        let light1Position = this.transformator.position();
        vec3.add(light1Position, light1Position, this.localLight1Position);
        const ligth1PositionArray: [number, number, number] = [light1Position[0], 
                                                               light1Position[1], 
                                                               light1Position[2]]
        this.light1.moveToPoint(ligth1PositionArray);

        let light2Position = this.transformator.position();
        vec3.add(light2Position, light2Position, this.localLight2Position);
        const ligth2PositionArray: [number, number, number] = [light2Position[0], 
                                                               light2Position[1], 
                                                               light2Position[2]]
        this.light2.moveToPoint(ligth2PositionArray);
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
        this.light1.rotate(delta[1]);
        this.light2.rotate(delta[1]);
        this.alignLightsToTankFront(delta[1]);
    }

    private alignCameraToTankBack(rotationAngle: number) {
        const origin = vec3.fromValues(0, 0, 0);
        const radAngle = glMatrix.toRadian(rotationAngle);
        this.localCameraPosition = vec3.rotateY(this.localCameraPosition, this.localCameraPosition, origin, radAngle);
    }

    private alignLightsToTankFront(rotationAngle: number) {
        const origin = vec3.fromValues(0, 0, 0);
        const radAngle = glMatrix.toRadian(rotationAngle);
        this.localLight1Position = vec3.rotateY(this.localLight1Position, this.localLight1Position, origin, radAngle);
        this.localLight2Position = vec3.rotateY(this.localLight2Position, this.localLight2Position, origin, radAngle);
    }

    keyUp(e: KeyboardEvent) {
        console.log("up: " + e.key);
        this.keyDownDictionary[e.key] = false;
        console.log(`keyDownDictionary[w]: ${this.keyDownDictionary["w"]}`);
    }
}