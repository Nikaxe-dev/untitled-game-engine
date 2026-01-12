import { Texture } from "./texture/Texture.js";

/**
 * Stores how a GameObject Instance is drawn.
 */
export class Sprite {
    /**
     * The textures to draw in order.
     */
    public textureLayers: Texture[] = [];

    /**
     * Controls whether the sprite gets rendered every frame.
     */
    public visible: boolean = true;

    /**
     * Controls the order the Sprite is rendered on.
     */
    public zIndex: number = 0;

    /**
     * 
     * @param param1 The texture. Can be an Array. Texture[] | Texture
     */
    constructor(param1?: Texture[] | Texture) {
        if(param1) {
            this.textureLayers = param1 instanceof Array ? param1 : [param1]
        }
    }
}