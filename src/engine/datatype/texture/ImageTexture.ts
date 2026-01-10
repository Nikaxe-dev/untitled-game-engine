import Color from "../Color.js";
import Texture from "./Texture.js";

/**
 * Describes an image to render.
 */
export default class ImageTexture extends Texture {
    /**
     * The URL pointing to the image of the texture.
     * @public
     */
    public imageURL: string;

    /**
     * A color that the image is tinted as. Leave as white to use the original images color.
     */
    public tintColor: Color;

    constructor(imageURL: string, tintColor: Color = Color.WHITE) {
        super();
        this.tintColor = tintColor;
        this.imageURL = imageURL;
    }
}