import {IAttribute} from "./attribute"

export interface IAttributeExtractor {
    attributes(gl: WebGL2RenderingContext): Array<IAttribute>;
}