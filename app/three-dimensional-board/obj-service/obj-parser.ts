export class Vertex {
    constructor(public x: number, public y: number, public z: number) { }
}

export class TextureCoord {
    constructor(public u: number, public v: number) { }
}

export class VertexNormal {
    constructor(public x: number, public y: number, public z: number) { }
}

export class Face {
    vertices: Array<{
        vertexIndex: number;
        textureCoordIndex: number;
        normalIndex: number;
    }> = [];
}

export class Obj {
    comments: string[] = [];
    vertices: Vertex[] = [];
    textureCoords: TextureCoord[] = [];
    vertexNormals: VertexNormal[] = [];
    faces: Face[] = [];

    unknown: string[] = [];
}

export class ObjParser {
    public static parse(objText: string): Obj {
        const parsedObj = new Obj();
        const lines = objText.split(/\r?\n/);

        lines.forEach(line => {
            const lp = line.split(/\s+/);
            if (lp[0] === 'v') {
                parsedObj.vertices.push(new Vertex(parseFloat(lp[1]), parseFloat(lp[2]), parseFloat(lp[3])));
            } else if (lp[0] === 'vt') {
                parsedObj.textureCoords.push(new TextureCoord(parseFloat(lp[1]), parseFloat(lp[2])));
            } else if (lp[0] === 'vn') {
                parsedObj.vertexNormals.push(new VertexNormal(parseFloat(lp[1]), parseFloat(lp[2]), parseFloat(lp[3])));
            } else if (lp[0] === 'f') {
                const face = new Face();
                lp.slice(1).forEach(fp => {
                    const fvp = fp.split(/\//); 
                    const vertexIndex = parseInt(fvp[0], 10);
                    const textureCoordIndex = parseInt(fvp[1], 10);
                    const normalIndex = parseInt(fvp[2], 10);
                    face.vertices.push({
                        vertexIndex: isNaN(vertexIndex) ? null : vertexIndex,
                        textureCoordIndex: isNaN(textureCoordIndex) ? null : textureCoordIndex,
                        normalIndex: isNaN(normalIndex) ? null : normalIndex
                    });
                });
                parsedObj.faces.push(face);
            } else if (/^#/.test(lp[0])) {
                parsedObj.comments.push(line);
            } else {
                parsedObj.unknown.push(line);
            }
        });

        return parsedObj;
    }
}