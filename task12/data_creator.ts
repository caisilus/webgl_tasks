import {DrawData} from "../src/draw_data"
import {Vertex2DWithColor} from "../src/vertex2d"

export class DrawDataCreator {
    constructor(readonly gl: WebGL2RenderingContext) {
        this.gl = gl;
    }
    
    drawDataFromFigureName(figureName: string): DrawData {
        switch (figureName) {
            case "Градиентный треугольник": {
                return this.triangleData();
            }
            default: {
                throw new Error(`Unknown figure name ${figureName}`);
            }
        }
    }

    private triangleData(): DrawData {
        let vertices = [new Vertex2DWithColor(-1.0, 1.0, [255, 0, 0]), 
                        new Vertex2DWithColor(0.0, -1.0, [0, 255, 0]),
                        new Vertex2DWithColor(1.0, 1.0, [0, 0, 255])];
        let drawMethod = this.gl.TRIANGLES;
        let pointsCount = 3;
        return {
            "vertices": vertices,
            "drawMethod": drawMethod,
            "pointsCount": pointsCount,
            "attributeExtractor": Vertex2DWithColor
        };
    }
}