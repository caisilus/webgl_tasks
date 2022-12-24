import {Transformator} from "../src/transformator";

export class TankController {
    moveSpeed: number = 0.2;
    rotationSpeed: number = 1.0;

    constructor(private transformator: Transformator) {
        this.transformator = transformator;
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
            // case "a": {
            //     this.transformator.moveRight(-this.cameraMoveSpeed);
            //     break;
            // }
            // case "d": {
            //     this.transformator.moveRight(this.cameraMoveSpeed);
            //     break;
            // }
            default: {
                break;
            }
        }
    }
}