// note: any dependencies imported here will be duplicated in the output
// because this file runs independently in a Web Worker.  Use
// discretion when adding dependencies.

class Vector3 {
    x: number;
    y: number;
    z: number;
}

class Vector2 {
    u: number;
    v: number;
}

// holds the parsed data in a structure similar 
// to the original .obj file
class ObjRawData {
    comments: string[] = [];
    vertices: Vector3[] = [];
    textureCoords: Vector2[] = [];
    vertexNormals: Vector3[] = [];
    faces: {
        vertexIndex: number;
        textureCoordIndex: number;
        normalIndex: number;
    }[][] = [];
    unknown: string[] = [];
}

// hold the parsed data in a format
// consumable by WebGL
class ObjRenderData {
    vertexCoords: number[] = [];
    vertexNormals: number[] = [];
    textureCoords: number[] = [];
    vertexIndices: number[] = [];
    vertexTangents: number[] = [];
    vertexBitangents: number[] = [];
}

export class Obj {
    rawData = new ObjRawData();
    renderData = new ObjRenderData();
}

export class ObjParser {
    public static parse(objText: string): Obj {
        const parsedObj = new Obj();
        const lines = objText.split(/\r?\n/);

        // first, populate all the "raw data" properties on this Obj object
        lines.forEach(line => {
            const lp = line.split(/\s+/);
            if (lp[0] === 'v') {
                parsedObj.rawData.vertices.push({ x: parseFloat(lp[1]), y: parseFloat(lp[2]), z: parseFloat(lp[3]) });
            } else if (lp[0] === 'vt') {
                parsedObj.rawData.textureCoords.push({ u: parseFloat(lp[1]), v: parseFloat(lp[2]) });
            } else if (lp[0] === 'vn') {
                parsedObj.rawData.vertexNormals.push({ x: parseFloat(lp[1]), y: parseFloat(lp[2]), z: parseFloat(lp[3]) });
            } else if (lp[0] === 'f') {
                parsedObj.rawData.faces.push([]);
                lp.slice(1).forEach(fp => {
                    const fvp = fp.split(/\//);
                    const vertexIndex = parseInt(fvp[0], 10);
                    const textureCoordIndex = parseInt(fvp[1], 10);
                    const normalIndex = parseInt(fvp[2], 10);
                    parsedObj.rawData.faces[parsedObj.rawData.faces.length - 1].push({
                        vertexIndex: isNaN(vertexIndex) ? null : vertexIndex,
                        textureCoordIndex: isNaN(textureCoordIndex) ? null : textureCoordIndex,
                        normalIndex: isNaN(normalIndex) ? null : normalIndex
                    });
                });
            } else if (/^#/.test(lp[0])) {
                parsedObj.rawData.comments.push(line);
            } else {
                parsedObj.rawData.unknown.push(line);
            }
        });

        // then, rearrange the data into a more consumable, WebGL-friendly format
        let vertexIndex = 0;
        parsedObj.rawData.faces.forEach(rawFace => {
            rawFace.forEach(faceIndices => {

                if (faceIndices.vertexIndex !== null && typeof faceIndices.vertexIndex !== 'undefined') {
                    const rawCoord = parsedObj.rawData.vertices[faceIndices.vertexIndex - 1];
                    parsedObj.renderData.vertexCoords.push(rawCoord.x, rawCoord.y, rawCoord.z);
                } else {
                    throw `Error while parsing .obj file.  Face didn't provide a vertex index`;
                }

                if (faceIndices.normalIndex !== null && typeof faceIndices.normalIndex !== 'undefined') {
                    const rawNormal = parsedObj.rawData.vertexNormals[faceIndices.normalIndex - 1];
                    parsedObj.renderData.vertexNormals.push(rawNormal.x, rawNormal.y, rawNormal.z);
                } else {
                    throw `Error while parsing .obj file.  Face didn't provide a vertex normal index`;
                }

                if (faceIndices.textureCoordIndex !== null && typeof faceIndices.textureCoordIndex !== 'undefined') {
                    const rawTextureCoord = parsedObj.rawData.textureCoords[faceIndices.textureCoordIndex - 1];
                    parsedObj.renderData.textureCoords.push(rawTextureCoord.u, rawTextureCoord.v)
                } else {
                    throw `Error while parsing .obj file.  Face didn't provide a texture coordinate index`;
                }

                parsedObj.renderData.vertexIndices.push(vertexIndex++);
            });

            const vertexCoords = parsedObj.renderData.vertexCoords;
            const last3VertexCoords: Vector3[] = [];
            for (var i = 2; i >= 0; i--) {
                last3VertexCoords.push({
                    x: vertexCoords[vertexCoords.length - (i * 3) - 3],
                    y: vertexCoords[vertexCoords.length - (i * 3) - 2],
                    z: vertexCoords[vertexCoords.length - (i * 3) - 1],
                });
            }

            const textureCoords = parsedObj.renderData.textureCoords;
            const last3TextureCoords: Vector2[] = [];
            for (var i = 2; i >= 0; i--) {
                last3TextureCoords.push({
                    u: textureCoords[textureCoords.length - (i * 2) - 2],
                    v: textureCoords[textureCoords.length - (i * 2) - 1],
                });
            }

            const { tangent, bitangent } = this.computeTanAndBitan(last3VertexCoords, last3TextureCoords);

            for (var i = 0; i < 3; i++) {
                parsedObj.renderData.vertexTangents.push(tangent.x, tangent.y, tangent.z);
                parsedObj.renderData.vertexBitangents.push(bitangent.x, bitangent.y, bitangent.z);
            }
        });

        return parsedObj;
    }

    private static computeTanAndBitan(vertexCoords: Vector3[], textureCoords: Vector2[]): { tangent: Vector3, bitangent: Vector3 } {

        const deltaPos1 = this.subtractVector3(vertexCoords[1], vertexCoords[0]);
        const deltaPos2 = this.subtractVector3(vertexCoords[2], vertexCoords[0]);

        const deltaUV1 = this.subtractVector2(textureCoords[1], textureCoords[0]);
        const deltaUV2 = this.subtractVector2(textureCoords[2], textureCoords[0]);

        const r = 1 / (deltaUV1.u * deltaUV2.v - deltaUV1.v * deltaUV2.u);
        const tangent = this.multiplyVector3(this.subtractVector3(this.multiplyVector3(deltaPos1, deltaUV2.v), this.multiplyVector3(deltaPos2, deltaUV1.v)), r);
        const bitangent = this.multiplyVector3(this.subtractVector3(this.multiplyVector3(deltaPos2, deltaUV1.u), this.multiplyVector3(deltaPos1, deltaUV2.u)), r);

        return { tangent, bitangent };
    }

    private static multiplyVector3(vector1: Vector3, scalar: number): Vector3 {
        return {
            x: vector1.x * scalar,
            y: vector1.y * scalar,
            z: vector1.z * scalar
        };
    }

    private static subtractVector3(vector1: Vector3, vector2: Vector3): Vector3 {
        return {
            x: vector1.x - vector2.x,
            y: vector1.y - vector2.y,
            z: vector1.z - vector2.z
        };
    }

    private static subtractVector2(vector1: Vector2, vector2: Vector2): Vector2 {
        return {
            u: vector1.u - vector2.u,
            v: vector1.v - vector2.v,
        };
    }
}

onmessage = ev => {
    postMessage(ObjParser.parse(ev.data), undefined);
}