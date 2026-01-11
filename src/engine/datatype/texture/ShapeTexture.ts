import { SHAPE } from "../../Enum.js";
import Shader from "../../shaders/Shader.js";
import Color from "../Color.js";
import Texture from "./Texture.js";

/**
 * Describes a shape to render, with a color.
 */
export default class ShapeTexture extends Texture {
    /**
     * The type of shape to render.
     */
    public shapeType: SHAPE;

    /**
     * The color of the shape.
     */
    public color: Color;

    constructor(shapeType: SHAPE = SHAPE.RECTANGLE, color: Color = Color.WHITE, shader: typeof Shader = Shader) {
        super(shader);
        this.shapeType = shapeType;
        this.color = color;
    }
}