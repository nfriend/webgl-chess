declare module Sylvester {
    interface MatrixStatic {
        Translation(v: Vector): Matrix;
    }
}

interface Matrix {
    flatten(): number[];
    ensure4x4(): Matrix;
    make3x3(): Matrix;
}

interface Vector {
    flatten(): Array<number>;
}

declare var mht: (m: number[]) => string;
declare var makeLookAt: (ex: number, ey: number, ez: number, cx: number, cy: number, cz: number, ux: number, uy: number, uz: number) => Matrix;
declare var makeOrtho: (left: number, right: number, bottom: number, top: number, znear: number, zfar: number) => Matrix;
declare var makePerspective: (fovy: number, aspect: number, znear: number, zfar: number) => Matrix;
declare var makeFrustum: (left: number, right: number, bottom: number, top: number, znear: number, zfar: number) => Matrix;
