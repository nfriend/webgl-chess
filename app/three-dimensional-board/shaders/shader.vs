precision mediump float;

attribute vec2 vertexTextureCoords;
attribute vec3 vertexPosition, vertexNormal;
attribute vec4 vertexColor;

uniform mat4 projectionMatrix, modelViewMatrix, normalMatrix;

varying vec2 passedVertexTextureCoords;
varying vec3 normalInterpolation, passedVertexPosition;
varying vec4 passedVertexColor;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
    vec4 vertPosition4 = modelViewMatrix * vec4(vertexPosition, 1.0);
    passedVertexPosition = vec3(vertPosition4) / vertPosition4.w;
    normalInterpolation = vec3(normalMatrix * vec4(vertexNormal, 0.0));
    passedVertexColor = vertexColor;
    passedVertexTextureCoords = vertexTextureCoords;
}
