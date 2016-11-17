// note: any dependencies imported here will be duplicated in the output
// because this file runs independently in a Web Worker.  Use
// discretion when adding dependencies.

class Vector3 {
    x: number;
    y: number;
    z: number;
}

class Vertex {
    coord: Vector3;
    normal: Vector3;
    textureCoord: { u: number; v: number; };
    originalIndex: number;
}

class Face {
    vertices: Vertex[] = [];
}

// holds the parsed data in a structure similar 
// to the original .obj file
class ObjRawData {
    comments: string[] = [];
    vertices: Vector3[] = [];
    textureCoords: { u: number; v: number; }[] = [];
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
                    parsedObj.renderData.textureCoords.push(0.0, 0.0);
                }

                parsedObj.renderData.vertexIndices.push(vertexIndex++);
            });
        });

        return parsedObj;
    }
}

onmessage = ev => {
    postMessage(ObjParser.parse(ev.data), undefined);
}