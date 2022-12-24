import {Transformator} from "../src/transformator";

interface KeyDownDictionary {
    [key: string]: boolean;
}

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 10;
    keyDownDictionary: KeyDownDictionary = { "w": false, "s": false, "a": false, "d": false };

    constructor(private transformator: Transformator) {
        this.transformator = transformator;
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
        this.transformator.rotate(delta);
    }

    keyUp(e: KeyboardEvent) {
        console.log("up: " + e.key);
        this.keyDownDictionary[e.key] = false;
        console.log(`keyDownDictionary[w]: ${this.keyDownDictionary["w"]}`);
    }
}