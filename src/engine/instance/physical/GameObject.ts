import Color from "../../datatype/Color.js";
import Hook from "../../datatype/Hook.js";
import Sprite from "../../datatype/Sprite.js";
import ShapeTexture from "../../datatype/texture/ShapeTexture.js";
import Vector2 from "../../datatype/Vector2.js";
import { SHAPE } from "../../Enum.js";
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
        const regl = renderService.regl
    }
    
    constructor() {
        super();
    }
}