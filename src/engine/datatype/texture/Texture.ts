import Shader from "../../shaders/Shader.js";

/**
 * Stores and loads how to render a texture.
 */
export default class Texture {
    public shader: typeof Shader;

    constructor(shader: typeof Shader) {
        this.shader = shader;
    }
}