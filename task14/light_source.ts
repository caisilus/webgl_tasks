export class LightSource{

    lightPosition: Float32Array;
    lightIntense: Array<number> = [0.0,0.0,0.0];

    constructor(lp:Float32Array,li: Array<number>){
        this.lightIntense = li;
        this.lightPosition=lp;
    }
}
