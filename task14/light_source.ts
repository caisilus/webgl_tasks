export class LightSource{

    constructor(public lightPosition:Float32Array,
        public lightAmbient: Float32Array, 
        public lightDiffuse:Float32Array,
        public lightSpecular:Float32Array,
        public lightAttenuation:Float32Array,
        public lightColor: Float32Array = new Float32Array([1.0,1.0,1.0])){
            
        }
}
