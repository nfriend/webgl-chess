import { Obj } from '../obj-service/obj-parser';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';

export class Square extends BaseObject {

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, obj: Obj, textureImage: HTMLImageElement, squareString: string, color: { r: number, g: number, b: number, a: number }) {
        super(gl, shaderProgram, obj, textureImage);
        
        this.color = color;
        this._location = squareToCoordsMap[squareString];
    }
}