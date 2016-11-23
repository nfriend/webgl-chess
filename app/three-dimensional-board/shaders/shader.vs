precision mediump float;

struct PointLight {
    vec3 position;
    vec3 diffuse;
    vec3 specular;
    vec3 ambient;
};

attribute vec2 vertexTextureCoords;
attribute vec3 vertexPosition, vertexNormal, vertexTangent, vertexBitangent;
attribute vec4 vertexColor;

uniform mat4 projectionMatrix, modelViewMatrix, normalMatrix;

varying vec2 passedVertexTextureCoords;
varying vec3 normalInterpolation, passedVertexPosition;
varying vec4 passedVertexColor;

#define NUM_LIGHTS 4
varying vec3 passedLightDirection[NUM_LIGHTS];
uniform PointLight lights[NUM_LIGHTS];

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
    vec4 vertPosition4 = modelViewMatrix * vec4(vertexPosition, 1.0);
    passedVertexPosition = vec3(vertPosition4) / vertPosition4.w;
    normalInterpolation = vec3(normalMatrix * vec4(vertexNormal, 0.0));
    passedVertexColor = vertexColor;
    passedVertexTextureCoords = vertexTextureCoords;

    for(int i = 0; i < NUM_LIGHTS; i++) {
	    vec3 lightDirection = normalize(lights[i].position.xyz - passedVertexPosition);
        passedLightDirection[i] = normalize(vec3(
            dot(lightDirection, normalize(vertexTangent)), 
            dot(lightDirection, normalize(vertexBitangent)), 
            dot(lightDirection, normalize(vertexNormal))
        ));
    }
}
