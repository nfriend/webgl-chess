export class WebGLManager {

    constructor(private gl: WebGLRenderingContext) {
    }

    initialize() {
        // Set clear color to black, fully opaque
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);
        // Near things obscure far things
        this.gl.depthFunc(this.gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}