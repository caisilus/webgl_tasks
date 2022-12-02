import {DrawData, IndexDrawData} from "../src/draw_data";
import {Vertex3DWithColor} from "../src/vertex3d";

export class DrawDataCreator {
    constructor(readonly gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    
    drawDataFromFigureName(figureName: string): DrawData {
        switch (figureName) {
            case "Градиентный круг": {
                return this.circleData();
            }
            case "Текстурирование куба": {
                return this.cubeData();
            }
            default: {
                throw new Error(`Unknown figure name ${figureName}`);
            }
        }
    }

    public tetrahedronData(): IndexDrawData{
        let vertices = [
            // X, Y, Z           R, G, B
            new Vertex3DWithColor(1,1,-1, [255,255,0]), //Y
            new Vertex3DWithColor(1,-1,1, [255,0,255]), //M
            new Vertex3DWithColor(-1,1,1, [0,255,255]), //C
            new Vertex3DWithColor(-1,-1,-1, [255,255,255])//W
        ];
        let indices = [
            1,0,2,
            3,1,2,
            3,0,1,
            2,0,3
        ];
        let countPoints = vertices.length;
        let drawMethod = this.gl.TRIANGLES;
        return {
            "indices": indices,
            "vertices": vertices,
            "drawMethod": drawMethod,
            "pointsCount": countPoints,
            "attributeExtractor": Vertex3DWithColor
        };
    }

    public cubeData(): IndexDrawData {

        let boxVertices = 
        [ // X, Y, Z           R, G, B
            // Top
            new Vertex3DWithColor(-1.0, 1.0, -1.0,   [177, 177, 177], [0.0, 0.0]),
            new Vertex3DWithColor(-1.0, 1.0, 1.0,   [177, 177, 177], [0.0, 1.0]),
            new Vertex3DWithColor(1.0, 1.0, 1.0,   [177, 177, 177], [1.0, 1.0]),
            new Vertex3DWithColor(1.0, 1.0, -1.0,   [177, 177, 177], [1.0, 0.0]),
    
            // Left
            new Vertex3DWithColor(-1.0, 1.0, 1.0,   [191, 64, 177], [0.0, 0.0]),
            new Vertex3DWithColor(-1.0, -1.0, 1.0,   [191, 64, 177], [1.0, 0.0]),
            new Vertex3DWithColor(-1.0, -1.0, -1.0,   [191, 64, 177], [1.0, 1.0]),
            new Vertex3DWithColor(-1.0, 1.0, -1.0,   [191, 64, 177], [0.0, 1.0]),
    
            // Right
            new Vertex3DWithColor(1.0, 1.0, 1.0,   [64, 64, 191], [1.0, 1.0]),
            new Vertex3DWithColor(1.0, -1.0, 1.0,   [64, 64, 191], [0.0, 1.0]),
            new Vertex3DWithColor(1.0, -1.0, -1.0,   [64, 64, 191], [0.0, 0.0]),
            new Vertex3DWithColor(1.0, 1.0, -1.0,   [64, 64, 191], [1.0, 0.0]),
    
            // Front
            new Vertex3DWithColor(1.0, 1.0, 1.0,   [255, 0, 38], [1.0, 1.0]),
            new Vertex3DWithColor(1.0, -1.0, 1.0,   [255, 0, 38], [1.0, 0.0]),
            new Vertex3DWithColor(-1.0, -1.0, 1.0,   [255, 0, 38], [0.0, 0.0]),
            new Vertex3DWithColor(-1.0, 1.0, 1.0,   [255, 0, 38], [0.0, 1.0]),
    
            // Back
            new Vertex3DWithColor(1.0, 1.0, -1.0,   [0, 255, 38], [0.0, 0.0]),
            new Vertex3DWithColor(1.0, -1.0, -1.0,   [0, 255, 38], [0.0, 1.0]),
            new Vertex3DWithColor(-1.0, -1.0, -1.0,   [0, 255, 38], [1.0, 1.0]),
            new Vertex3DWithColor(-1.0, 1.0, -1.0,   [0, 255, 38], [1.0, 0.0]),
    
            // Bottom
            new Vertex3DWithColor(-1.0, -1.0, -1.0,   [177, 177, 255], [1.0, 1.0]),
            new Vertex3DWithColor(-1.0, -1.0, 1.0,   [177, 177, 255], [1.0, 0.0]),
            new Vertex3DWithColor(1.0, -1.0, 1.0,   [177, 177, 255], [0.0, 0.0]),
            new Vertex3DWithColor(1.0, -1.0, -1.0,   [177, 177, 255], [0.0, 1.0]),
        ];
    
        let boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,
    
            // Left
            5, 4, 6,
            6, 4, 7,
    
            // Right
            8, 9, 10,
            8, 10, 11,
    
            // Front
            13, 12, 14,
            15, 14, 12,
    
            // Back
            16, 17, 18,
            16, 18, 19,
    
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

        let countPoints = boxVertices.length;
        let drawMethod = this.gl.TRIANGLES;
        return {
            "indices": boxIndices,
            "vertices": boxVertices,
            "drawMethod": drawMethod,
            "pointsCount": countPoints,
            "attributeExtractor": Vertex3DWithColor
        };
    }

    public circleData(): DrawData {
        let centerColor: [number, number, number] = [255, 255, 255]
        let center = new Vertex3DWithColor(0.0, 0.0, 0.0, centerColor);
        let vertices = [center];
        let countPoints = 360;
        let angle = 360 / countPoints;
        
        for (let i = 0; i <= countPoints; i++) {
            let degreeAngle = angle * i;
            let color = this.calculateColor(degreeAngle);
            let radAngle = this.toRadians(angle) * i;
            vertices.push(new Vertex3DWithColor(Math.cos(radAngle), Math.sin(radAngle), 0.0, color));
        }

        let drawMethod = this.gl.TRIANGLE_FAN;
        
        return {
            "vertices": vertices,
            "drawMethod": drawMethod,
            "pointsCount": countPoints + 2,
            "attributeExtractor": Vertex3DWithColor
        };
    }

    private toRadians(angle: number): number {
        return angle / 180.0 * Math.PI
    }

    private calculateColor(degreeAngle: number): [number, number, number] {
        let r = this.calculateRed(degreeAngle);
        let g = this.calculateGreen(degreeAngle);
        let b = this.calculateBlue(degreeAngle);
        return [r, g, b];
    }
    
    calculateRed(degreeAngle: number): number {
        let step = 255.0 / 60.0;
      
        if (degreeAngle < 60){
            return 255;
        }

        if (degreeAngle < 120) {
            return 255 - (degreeAngle - 60) * step;
        }

        if (degreeAngle < 240) {
            return 0;
        }

        if (degreeAngle < 300) {
            return (degreeAngle - 240) * step;
        }

        return 255;
    }

    calculateGreen(degreeAngle: number): number {
        let step = 255.0 / 60
        
        if (degreeAngle < 60){
            return degreeAngle * step;
        }

        if (degreeAngle < 180) {
            return 255;
        }

        if (degreeAngle < 240) {
            return 255 - (degreeAngle - 180) * step;
        }

        return 0;
    }

    calculateBlue(degreeAngle: number): number {
        let step = 255.0 / 60.0;
        
        if (degreeAngle < 120){
            return 0;
        }

        if (degreeAngle < 180) {
            return (degreeAngle - 120) * step;
        }

        if (degreeAngle < 300) {
            return 255;
        }

        return 255 - (degreeAngle - 300) * step;
    }
}