// attribute vec3 aVertexPosition;
// attribute vec4 aVertexColor;
// attribute vec4 aVertexNormal;
// 
// uniform mat4 uMVMatrix;
// uniform mat4 uPMatrix;
// 
// varying vec4 N;
// varying vec4 v;
// 
// void main(void) {
//     v = vec3(gl_ModelViewMatrix * aVertexPosition);       
//     N = normalize(gl_NormalMatrix * aVertexNormal);
//     gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
// }


attribute vec3 vertexPosition, vertexNormal;
attribute vec4 vertexColor;

uniform mat4 projectionMatrix, modelViewMatrix, normalMatrix;

varying vec3 normalInterpolation, passedVertexPosition;
varying vec4 passedVertexColor;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
    vec4 vertPosition4 = modelViewMatrix * vec4(vertexPosition, 1.0);
    passedVertexPosition = vec3(vertPosition4) / vertPosition4.w;
    normalInterpolation = vec3(normalMatrix * vec4(vertexNormal, 0.0));
    passedVertexColor = vertexColor;
}
