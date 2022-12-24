import {Transformator} from "../src/transformator";

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 10;
    rotation: [number, number, number];

    constructor(private transformator: Transformator, initialRotation: [number, number, number]) {
        this.transformator = transformator;
        this.rotation = initialRotation;
        document.addEventListener('keydown', (e) => { this.keyDown(e); }, false);
    }

    keyDown(e: KeyboardEvent): void {
        switch (e.key) {
            case "w": {
                this.transformator.moveForward(this.moveSpeed);
                break;
            }
            case "s": {
                this.transformator.moveForward(-0.5 * this.moveSpeed);
                break;
            }
            case "a": {
                let delta: [number, number, number] = [0, this.rotationSpeed, 0];
                this.rotateTank(delta);
                console.log(`rotation vector: ${this.rotation}`);
                this.transformator.rotate(this.rotation);
                // this.transformator.updateForward();
                break;
            }
            case "d": {
                let delta: [number, number, number] = [0, -this.rotationSpeed, 0];
                this.rotateTank(delta);
                console.log(`rotation vector: ${this.rotation}`);
                this.transformator.rotate(this.rotation);
                // this.transformator.updateForward();
                break;
            }
            default: {
                break;
            }
        }
    }

    private rotateTank(delta: [number, number, number]) {
        this.rotation[0] += delta[0];
        this.rotation[0] = this.rotation[0] % 360;
        this.rotation[1] += delta[1];
        this.rotation[1] = this.rotation[1] % 360;
        this.rotation[2] += delta[2];
        this.rotation[2] = this.rotation[2] % 360;
    }
}