import {Drawer} from "../src/drawer";
import {Transformator} from "../src/transformator";
import {IAttributeExtractor} from "./attribute_extractor";
import {IBufferable} from "../src/ibufferable";
import {IndexDrawData} from "../src/draw_data";
import { ShaderProgram } from "./shader_program";

export class Object3D {
    protected gl: WebGL2RenderingContext
    protected program: ShaderProgram;
    protected vao: WebGLVertexArrayObject;
    protected drawer: Drawer
    protected numberOfInstances = 1;
    readonly transformator: Transformator
    protected indexData: IndexDrawData | null = null;

    constructor(drawer: Drawer) {
        this.gl = drawer.gl;
        this.program = drawer.program;

        const vao = this.gl.createVertexArray();
        if (vao == null) {
            throw new Error("Could not create vertex array for object");
        }
        this.vao = vao;
        this.drawer = drawer;
        this.transformator = new Transformator(this.gl, this.program);
        // this.loadData(); 
    }

    protected loadData() {
        console.log("Loading data...");
        this.getObjectData().then((indexData) => this.prepareData(indexData));
    }

    protected prepareData(indexData: IndexDrawData) {
        console.log("Preparing data...");
        console.log(indexData);
        this.indexData = indexData;
        this.drawer.enableVAO(this.vao);
        this.drawer.prepareVertices(this.indexData.attributeExtractor, this.indexData.vertices);
        this.drawer.prepareIndices(this.indexData.indices);
        this.drawer.disableVAO();
    }

    protected async getObjectData(): Promise<IndexDrawData> {
        throw new Error("ObjectData() not implemented for object");
    }

    createInstances(attributeExtractor: IAttributeExtractor, instanceAttributes: IBufferable[]) {
        this.drawer.enableVAO(this.vao);
        this.drawer.prepareInstanceAttributes(attributeExtractor, instanceAttributes);
        this.numberOfInstances = instanceAttributes.length;
        console.log(`Createt ${this.numberOfInstances} instances`);
        this.drawer.disableVAO(); 
    }

    draw() {
        if (this.indexData == null) {
            throw new Error("Data is not initialized before drawing");
        }
        this.drawer.enableVAO(this.vao);
        this.transformator.buildWorldMatrix();
        if (this.numberOfInstances == 1) {
            this.drawer.drawIndex(this.indexData);
        } else {
            this.drawer.drawIndexInstances(this.indexData, this.numberOfInstances);
        }
        this.drawer.disableVAO();
    }
}