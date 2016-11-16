precision mediump float;

varying vec3 normalInterpolation, passedVertexPosition;
varying vec4 passedVertexColor;

const vec3 lightPos = vec3(-1.0, 1.0, 1.0);
const vec3 diffuseColor = vec3(0.5, 0.5, 0.5);
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const vec3 ambientColor = vec3(0.02, 0.02, 0.02);

void main() {

    vec3 normal = normalize(normalInterpolation); 
    vec3 lightDir = normalize(lightPos - passedVertexPosition);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;

    if (lambertian > 0.0) {

        vec3 reflectDir = reflect(-lightDir, normal);
        vec3 viewDir = normalize(-passedVertexPosition);

        float specAngle = max(dot(reflectDir, viewDir), 0.0);
        specular = pow(specAngle, 4.0);

        // shininess
        specular = pow(specAngle, 16.0);
    }

    gl_FragColor = passedVertexColor * .5  + vec4((lambertian * diffuseColor * .1) + specular * specColor, 1.0);
}
