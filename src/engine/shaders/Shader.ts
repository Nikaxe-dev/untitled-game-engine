/**
 * A shader, which is defined as a static class which stores the fragmentCode, and vertexCode together in one place.
 * The shader classes name MUST be completely unique.
 * @description This is the default shader, which supports transforming the object with rotation, size, and position, along with rendering an image with a tint, or having a bold color.
 * @uniform `texture` : `sampler2D`, this is the texture given. Can be unset, so make sure it exists.
 * @uniform `objectColor` : `vec4`, this is the color.
 * @uniform `renderType` : `int`, this is the type of rendering used in fragmentCode. 0 is an IMAGE, 1 is BOLD (just fill with the objectColor).
 * @uniform `objectPosition` : `vec2`, this is the position to offset the vertex by.
 * @uniform `objectSize` : `vec2`, multiply the vertexPositions by this before offsetting them.
 * @uniform `objectRotation` : `float`, the rotation of the object being rendered. (RADIANS)
 * @uniform `time` : `float`, the time elasped since the creation of the REGL object.
 * 
 * @attribute `vertexPosition` : `vec2`, the relative position of the vertex.
 * @attribute `vertexUV` : `vec2`, the UV coordinates of the vertex.
 * @attribute `vertexIndex` : `float` the index of the current vertex.
 */
export default class Shader {
    /**
     * Pushes items to an array and returns that array again.
     * @param array The array to push to.
     * @param items The items to push.
     * @returns The array.
     */
    protected static pushItems(array: any[], items: any[] | any) {
        if (Array.isArray(items)) array.push(...items);
        else array.push(items);
        return array;
    }

    /**
     * A list of glsl code that gets ran in the main function of the vertexCode.
     * Allows for easy additional functionality to shaders.
     */
    public static vertexAdditionalMainCode: string[] = [];

    /**
     * A list of glsl code that gets ran before the main function of the vertexCode.
     * Use this to add additional functions.
     */
    public static vertexDeclarationAdditions: string[] = [];

        /**
     * A list of glsl code that gets ran in the main function of the vertexCode.
     * Allows for easy additional functionality to shaders.
     */
    public static fragmentAdditionalMainCode: string[] = [];

    /**
     * A list of glsl code that gets ran before the main function of the vertexCode.
     * Use this to add additional functions.
     */
    public static fragmentDeclarationAdditions: string[] = [];

    /**
     * The code for the fragment shader.
     * @readonly
     * @public
     * @static
     */
    public static get fragmentCode() { return `
        precision mediump float;
        precision mediump int;

        uniform sampler2D texture;
        uniform vec4 objectColor;
        uniform int renderType;
        uniform float time;

        varying vec2 vUV;

        ${this.fragmentDeclarationAdditions.join("\n")}

        void main() {
            vec4 color = objectColor;

            if (renderType == 0) {
                vec4 texColor = texture2D(texture, vUV);
                color = texColor * objectColor;
            }

            ${this.fragmentAdditionalMainCode.join("\n")}

            gl_FragColor = color;
        }
    `}

    /**
     * The code for the vertex shader.
     * @readonly
     * @public
     * @static
     */
    public static get vertexCode() { return `
        precision mediump float;

        attribute vec2 vertexPosition;
        attribute vec2 vertexUV;
        attribute float vertexIndex;

        uniform vec2 objectPosition;
        uniform vec2 objectSize;
        uniform float objectRotation;
        uniform float time;

        varying vec2 vUV;

        mat2 rotate(float angle) {
            return mat2(
                cos(angle), -sin(angle),
                sin(angle), cos(angle)
            );
        }

        ${this.vertexDeclarationAdditions.join("\n")}

        void main() {
            vec2 position = vertexPosition;
            position *= rotate(-objectRotation);
            position *= objectSize;
            position += objectPosition;

            ${this.vertexAdditionalMainCode.join("\n")}

            gl_Position = vec4(position, 0, 1);
            vUV = vertexUV;
        }
    `}
}

// Example on how you can add to the code array modifications.
// class ShaderExtended extends Shader {
//     public static fragmentAdditionalMainCode: string[] = this.pushItems(...super.fragmentAdditionalMainCode, []);
// }