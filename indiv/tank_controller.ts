import {Transformator} from "../src/transformator";

interface KeyDownDictionary {
    [key: string]: boolean;
}

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 10;
    rotation: [number, number, number];
    keyDownDictionary: KeyDownDictionary = { "w": false, "s": false, "a": false, "d": false };

    constructor(private transformator: Transformator, initialRotation: [number, number, number]) {
        this.transformator = transformator;
        this.rotation = initialRotation;
        document.addEventListener('keydown', (e) => { this.keyDown(e); }, false);
        document.addEventListener('keyup', (e) => { this.keyUp(e); }, false);
    }

    keyDown(e: KeyboardEvent): void {
        console.log("down: "+e.key);
        this.keyDownDictionary[e.key] = true;
    }

    moveTankForward() {
        this.transformator.moveForward(this.moveSpeed);
    }

    moveTankBackward() {
        this.transformator.moveForward(-0.5 * this.moveSpeed);
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
        this.rotation[0] += delta[0];
        this.rotation[0] = this.rotation[0] % 360;
        this.rotation[1] += delta[1];
        this.rotation[1] = this.rotation[1] % 360;
        this.rotation[2] += delta[2];
        this.rotation[2] = this.rotation[2] % 360;

        this.transformator.rotate(this.rotation);
    }

    keyUp(e: KeyboardEvent) {
        console.log("up: " + e.key);
        this.keyDownDictionary[e.key] = false;
        console.log(`keyDownDictionary[w]: ${this.keyDownDictionary["w"]}`);
    }
}