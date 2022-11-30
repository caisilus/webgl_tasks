import {DrawData} from "../src/draw_data";
import {Vertex2DWithColor} from "../src/vertex2d";

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

            }
            default: {
                throw new Error(`Unknown figure name ${figureName}`);
            }
        }
    }
    
    private circleData(): DrawData {
        let centerColor: [number, number, number] = [255, 255, 255]
        let center = new Vertex2DWithColor(0.0, 0.0, centerColor);
        let vertices = [center];
        let countPoints = 360;
        let angle = 360 / countPoints;
        
        for (let i = 0; i <= countPoints; i++) {
            let degreeAngle = angle * i;
            let color = this.calculateColor(degreeAngle);
            let radAngle = this.toRadians(angle) * i;
            vertices.push(new Vertex2DWithColor(Math.cos(radAngle), Math.sin(radAngle), color));
        }

        let drawMethod = this.gl.TRIANGLE_FAN;
        
        return {
            "vertices": vertices,
            "drawMethod": drawMethod,
            "pointsCount": countPoints + 2,
            "attributeExtractor": Vertex2DWithColor
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