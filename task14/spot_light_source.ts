export class SpotLightSource{

    constructor(
        public lightPosition:number[],
        public lightTarget:number[],
        public lightlimit:number,
        public lightAmbient: number[], 
        public lightDiffuse:number[],
        public lightSpecular:number[]){
        }
}