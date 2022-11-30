import {Vertex2D} from "./vertex2d"
import {IAttributeExtractor} from "./attribute_extractor"

export interface DrawData {
    vertices: Array<Vertex2D>;
    drawMethod: number;
    pointsCount: number;
    attributeExtractor: IAttributeExtractor
}