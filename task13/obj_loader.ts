import {Vertex3DWithColor} from "../src/vertex3d";

export class Loader{
    private gl: WebGL2RenderingContext;
    objPositions: number[][] = [[0, 0, 0]];
    objTexcoords: number[][] = [[0, 0]];
    objNormals: number[][] = [[0, 0, 0]];
    objVertexData: number[][][] = [[], [], []];
    webglVertexData: number[][][] = [[], [], []]
    num_faces: number = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    parse_obj_text(text: string) {
      this.objPositions = [[0, 0, 0]];
      this.objTexcoords = [[0, 0]];
      this.objNormals = [[0, 0, 0]];
    
      // same order as `f` indices
      this.webglVertexData = [[], [], [], []];

      const lines = text.split('\n');
      for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        this.parse_line(lines[lineNo]);
      }
      console.log(this.num_faces);
      console.log(this.webglVertexData);
      return this.webglVertexData;
    }

    parse_line(line: string) {
      line = line.trim();
      if (line === '' || line.startsWith('#')) {
        return
      }
      const keyword = line.split(/\s+/)[0];
      const parts = line.split(/\s+/).slice(1);

      switch (keyword) {
        case 'v':
          this.objPositions.push(parts.map(parseFloat));
          break;
        case 'vn':
          this.objNormals.push(parts.map(parseFloat));
          break;
        case 'vt':
          this.objTexcoords.push(parts.map(parseFloat));
          break;
        case 'f':
          const numTriangles = parts.length - 2;
          for (let tri = 0; tri < numTriangles; tri++) {
            this.addVertex(parts[0]);
            this.addVertex(parts[tri + 1]);
            this.addVertex(parts[tri + 2]);
            this.num_faces++;
          }
          
          break;
        default:
          console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
          break;
      }
    }

    addVertex(vert: string) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex
        if (i == 0) {
          this.webglVertexData[0].push(this.objPositions[index]);
        }
        else{
          if (i == 1){
            this.webglVertexData[1].push(this.objTexcoords[index]);
          }
          else{
            this.webglVertexData[2].push(this.objNormals[index]);
          }
        }
        if (i == 0) {
          this.webglVertexData[3].push([index]);
        }
      });
    }

    objtoDrawData(obj: string) {
      let data = this.parse_obj_text(obj);

      let vertices: Vertex3DWithColor[] = [];
      let indices: number[] = [];
      
      for (let i = 0; i < data[0].length; i++) {
        if (data[1][i] == undefined) {
          data[1][i] = [0, 0];
        }
        vertices.push(new Vertex3DWithColor(
          data[0][i][0], //x
          data[0][i][1], //y
          data[0][i][2], //z
          [255, 255, 255], //color
          [data[1][i][0], 1-data[1][i][1]],//texcoord
          [data[2][i][0],data[2][i][1],data[2][i][2],] //normal
        ));
        indices.push(i);
      }
      let drawMethod = this.gl.TRIANGLES;
      let countPoints = vertices.length;
      return {
        "indices": indices,
        "vertices": vertices,
        "drawMethod": drawMethod,
        "pointsCount": countPoints,
        "attributeExtractor": Vertex3DWithColor
      };
    }
}
