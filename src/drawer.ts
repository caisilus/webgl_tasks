export class TriangleDrawer {
    gl: WebGL2RenderingContext;
    vertexShader: WebGLShader | null;
    fragmentShader: WebGLShader | null;
    program: WebGLProgram | null;
    triangleVerticesBuffer: WebGLBuffer | null;

    constructor(gl: WebGL2RenderingContext, vertexShaderText: string, fragmentShaderText: string) {
        this.gl = gl;
        this.program = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.triangleVerticesBuffer = null;
        this.createProgram(vertexShaderText, fragmentShaderText);
    }

    createProgram(vertexShaderText: string, fragmentShaderText: string) {
        this.createAndCompileShaders(vertexShaderText, fragmentShaderText);
        if (!this.shadersCompiledSuccessfully()) {
            return;
        }
        this.program = this.gl.createProgram();
        this.attachShadersToProgram();
        this.compileAndLinkProgram();
    }
    
    createAndCompileShaders(vertexShaderText: string, fragmentShaderText: string) {
        this.vertexShader = this.createAndCompileShader("vertex", vertexShaderText, 
                                                        this.gl.VERTEX_SHADER)

        this.fragmentShader = this.createAndCompileShader("fragment", fragmentShaderText, 
                                                          this.gl.FRAGMENT_SHADER)
    }

    createAndCompileShader(shaderName: string, shaderText: string, glShaderType: number): WebGLShader | null {
        // create shader
        var shader = this.gl.createShader(glShaderType);

        if (shader == null) {
            console.error(`Cannot create shader ${shaderName}`);
            return null;
        }

        // set shader sources
        this.gl.shaderSource(shader, shaderText);
        
        // check shader compilation errors
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`Compilation error in ${shaderName} shader:`, this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }

    shadersCompiledSuccessfully() {
        return (this.vertexShader != null) && (this.fragmentShader != null);
    }

    attachShadersToProgram() {
        if (this.program == null) {
            console.error("program is not created");
            return;
        }

        if (this.vertexShader != null) {
            this.gl.attachShader(this.program, this.vertexShader);
        }
        if (this.fragmentShader != null) {
            this.gl.attachShader(this.program, this.fragmentShader);
        }
        this.gl.linkProgram(this.program);
    }

    compileAndLinkProgram() {
        if (this.program == null) {
            console.error("program is not created");
            return;
        }

        // link errors
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error("Link error in program:", this.gl.getProgramInfoLog(this.program));
        }

        // validating a program, only for development
        this.gl.validateProgram(this.program)
        if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            console.error("Program validation error in program:", this.gl.getProgramInfoLog(this.program))
        }
    }

    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.setBg()
        // vertices
        var triangleVertices = 
        [
            x1, y1,
            x2, y2,
            x3, y3
        ]

        this.createBuffer(triangleVertices)

        this.bindAttributeToBuffer('vertPosition')

        // main render loop
        this.gl.useProgram(this.program)
        this.gl.drawArrays(this.gl.TRIANGLES, 
                    0, // how many to skip 
                    3  // how many to use
                    )
    }

    setBg() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    createBuffer(data: Array<number>) {
        this.triangleVerticesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVerticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }
    
    bindAttributeToBuffer(attr_name: string) {
        if (this.program == null) {
            return;
        }

        var positionAttributeLocation = this.gl.getAttribLocation(this.program, 
            attr_name // attr name in shader
            );
         
        this.gl.vertexAttribPointer(positionAttributeLocation, // attr location
                                    2, // number of elements per attribute
                                    this.gl.FLOAT, // type of elements
                                    false, // is data normalized
                                    2 * Float32Array.BYTES_PER_ELEMENT, // size of a vertex
                                    0 // offset from the begining of a single vertex to this attr
                                   );

        this.gl.enableVertexAttribArray(positionAttributeLocation);


        // main render loop
        this.gl.useProgram(this.program)
        this.gl.drawArrays(this.gl.TRIANGLES, 
        0, // how many to skip 
        3  // how many to use
        );
    }
}