import {Vertex2D} from "./vertex2d"

export interface DrawData {
    vertices: Array<Vertex2D>;
    drawMethod: number;
    pointsCount: number;
}