export class Light {

    [prop: string]: Vector;

    constructor(public position: Vector, public diffuse: Vector, public specular: Vector, public ambient: Vector) {
    }
}