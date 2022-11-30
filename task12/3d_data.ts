import {DrawData} from "../src/draw_data";

export class Renderer3D{
    private aspect: number;
    private zNear: number;
    private zFar: number;

    constructor(readonly gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.zNear = 1;
        this.zFar = 2000;
    }

    private genPerspectiveMat(fieldOfViewInRadians: number, aspect: number, near: number, far: number): Float32Array {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }

    private genTranslationMat(dx: number, dy: number, dz: number): Float32Array {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            dx, dy, dz, 1
        ]);
    }

    private genXRotationMat(angleInRadians: number): Float32Array {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return new Float32Array([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }

    private genYRotationMat(angleInRadians: number): Float32Array {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return new Float32Array([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    private genZRotationMat(angleInRadians: number): Float32Array {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return new Float32Array([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    private genScalingMat(sx: number, sy: number, sz: number): Float32Array {
        return new Float32Array([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    }

}
