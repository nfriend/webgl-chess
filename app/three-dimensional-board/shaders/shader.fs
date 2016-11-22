precision mediump float;

struct PointLight {
    vec3 position;
    vec3 diffuse;
    vec3 specular;
    vec3 ambient;
};

varying vec2 passedVertexTextureCoords;
varying vec3 normalInterpolation, passedVertexPosition;
varying vec4 passedVertexColor;

uniform sampler2D sampler;
uniform mat4 projectionMatrix, modelViewMatrix, normalMatrix;

#define NUM_LIGHTS 1
uniform PointLight lights[NUM_LIGHTS];

// const vec3 lightPos = vec3(-1.0, 1.0, 1.0);
// const vec3 diffuseColor = vec3(0.5, 0.5, 0.5);
// const vec3 specColor = vec3(1.0, 1.0, 1.0);
// const vec3 ambientColor = vec3(0.05, 0.05, 0.05);

vec4 calculateLight(PointLight light, vec3 normal, vec3 fragmentPosition, vec4 textureColor) {
    vec3 lightDirection = normalize(light.position - fragmentPosition);

    float diffuseAmount = max(dot(lightDirection, normal), 0.0);

    vec3 reflectDirection = reflect(-lightDirection, normal);
    vec3 viewDirection = normalize(-passedVertexPosition);
    float specularAmount = pow(max(dot(viewDirection, reflectDirection), 0.0), 16.0); // final number is shininess

    vec4 diffuse = vec4(light.diffuse, 1.0) * diffuseAmount * textureColor;
    vec4 specular = vec4(light.specular, 1.0) * specularAmount * textureColor;
    vec4 ambient = vec4(light.ambient, 1.0) * textureColor;

    return diffuse + specular + ambient;
}

void main() {

    vec3 normal = normalize(normalInterpolation); 
    vec4 textureColor = texture2D(sampler, passedVertexTextureCoords);

    vec4 result = vec4(0.0, 0.0, 0.0, 0.0);
    for(int i = 0; i < NUM_LIGHTS; i++) {
        result += calculateLight(lights[i], normal, passedVertexPosition, textureColor);
    }

    gl_FragColor = result;
}

