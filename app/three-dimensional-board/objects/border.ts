import { Obj } from '../obj-service/obj-parser';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';

export class Border extends BaseObject {

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, obj: Obj, textureImage: HTMLImageElement) {
        super(gl, shaderProgram, obj, textureImage);
    }
}