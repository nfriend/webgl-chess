import { Obj } from '../obj-service/obj-parser';
import { BaseObject } from './base-object';

export class Table extends BaseObject {

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, obj: Obj, textureImage: HTMLImageElement) {
        super(gl, shaderProgram, obj, textureImage);
        
        this._location = $V([0, 0, 0]);
    }
}