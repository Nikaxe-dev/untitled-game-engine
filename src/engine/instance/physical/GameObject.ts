import Color from "../../datatype/Color.js";
import Hook from "../../datatype/Hook.js";
import Sprite from "../../datatype/Sprite.js";
import ImageTexture from "../../datatype/texture/ImageTexture.js";
import ShapeTexture from "../../datatype/texture/ShapeTexture.js";
import Vector2 from "../../datatype/Vector2.js";
import { RENDERTYPE, SHAPE } from "../../Enum.js";
import Game from "../service/Game.js";
import RenderService from "../service/RenderService.js";
import Point from "./Point.js";
import Scene from "./Scene.js";

export default class GameObject extends Point {
    /**
     * The size of the GameObject.
     */
    public size: Vector2 = new Vector2(100);

    /**
     * The rotation of the GameObject (in radians).
     */
    public rotation: number = 0;

    /**
     * Fires every time the Instance is simulated.
     * @param RenderService The rendering context for the scenes canvas.
     * @param Game The game instance.
     * @param Scene The scene the instance is under.
     */
    public rendered = new Hook;

    /**
     * The sprite to render the GameObject with.
     */
    public sprite: Sprite = new Sprite(new ShapeTexture(SHAPE.RECTANGLE, Color.RED));

    public render(renderService: RenderService, game: Game, scene: Scene) {
        const context = renderService.canvasContext;
        const texture404 = renderService.reglGetTexture(new URL("../../content/textures/404.png", import.meta.url).href);

        if(!texture404) return;

        this.sprite.textureLayers.forEach((spriteTexture) => {
            const drawCommand = renderService.reglGetDrawCommand(spriteTexture.shader);
            if(spriteTexture instanceof ImageTexture) {
                const texture = renderService.reglGetTexture(spriteTexture.imageURL);
                drawCommand({
                    objectColor: spriteTexture.tintColor.shaderVec4,
                    objectPosition: this.position.toShaderVec2(renderService.screenSize),
                    objectSize: this.size.toShaderVec2(renderService.screenSize),
                    objectRotation: this.rotation,
                    renderType: RENDERTYPE.IMAGE,
                    texture: texture ? texture : texture404
                });
            } else if (spriteTexture instanceof ShapeTexture) {
                if(spriteTexture.shapeType == SHAPE.RECTANGLE) {
                    drawCommand({
                        objectColor: spriteTexture.color.shaderVec4,
                        objectPosition: this.position.toShaderVec2(renderService.screenSize),
                        objectSize: this.size.toShaderVec2(renderService.screenSize),
                        objectRotation: this.rotation,
                        renderType: RENDERTYPE.BOLD,
                        texture: texture404 // Use constant texture 404
                    });
                } else {
                    console.warn(`GameObject ${this.name} is using an unimplemented shape for one of its textures.`)
                }
            }
        })
    }
    
    constructor() {
        super();
    }
}