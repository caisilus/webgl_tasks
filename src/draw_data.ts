import {IBufferable} from "./ibufferable";
import {IAttributeExtractor} from "./attribute_extractor"



export interface DrawData {
    vertices: Array<IBufferable>;
    drawMethod: number;
    pointsCount: number;
    attributeExtractor: IAttributeExtractor
}

export interface IndexDrawData {
    indices: Array<number>;
    vertices: Array<IBufferable>;
    drawMethod: number;
    pointsCount: number;
    attributeExtractor: IAttributeExtractor
}