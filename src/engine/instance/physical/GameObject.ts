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

function numLerp(a: number, b: number, t: number) {
    return a+(b-a)*t
}

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

    private prevPosition: Vector2 = this.position.clone();
    private prevCameraPosition: Vector2 = Vector2.ZERO;
    private prevCameraZoom: number = 1;

    public preSimulation(game: Game, scene: Scene): void {
        const cameraPosition = scene.camera ? scene.camera.position : Vector2.ZERO;
        const cameraZoom = scene.camera ? scene.camera.zoom : 1
        this.prevCameraPosition = cameraPosition;
        this.prevCameraZoom = cameraZoom;
    }

    public simulate(game: Game, scene: Scene): void {
        this.prevPosition = this.position.clone();
        super.simulate(game, scene);
    }

    public render(renderService: RenderService, game: Game, scene: Scene) {
        const context = renderService.canvasContext;
        const texture404 = renderService.reglGetTexture(new URL("../../content/textures/404.png", import.meta.url).href);

        if(!texture404) return;

        const cameraPosition = scene.camera ? scene.camera.position : Vector2.ZERO;
        const cameraZoom = scene.camera ? scene.camera.zoom : 1

        const cameraRelativeSize = this.size.multiplied(new Vector2(cameraZoom));
        const alpha = game.simulationAccumulator / (1/game.maxSimulationFramerate);

        const renderedCameraPosition = this.prevCameraPosition.lerped(cameraPosition, alpha);
        const renderedCameraZoom = numLerp(this.prevCameraZoom, cameraZoom, alpha);

        const lerpedPosition = this.prevPosition.lerped(this.position, alpha);
        const renderPosition = lerpedPosition.subtracted(renderedCameraPosition).multiply(new Vector2(renderedCameraZoom));

        this.sprite.textureLayers.forEach((spriteTexture) => {
            const drawCommand = renderService.reglGetDrawCommand(spriteTexture.shader);
            if(spriteTexture instanceof ImageTexture) {
                const texture = renderService.reglGetTexture(spriteTexture.imageURL);
                drawCommand({
                    objectColor: spriteTexture.tintColor.shaderVec4,
                    objectPosition: renderPosition.toShaderVec2(renderService.screenSize),
                    objectSize: cameraRelativeSize.toShaderVec2(renderService.screenSize),
                    objectRotation: this.rotation,
                    renderType: RENDERTYPE.IMAGE,
                    texture: texture ? texture : texture404
                });
            } else if (spriteTexture instanceof ShapeTexture) {
                if(spriteTexture.shapeType == SHAPE.RECTANGLE) {
                    drawCommand({
                        objectColor: spriteTexture.color.shaderVec4,
                        objectPosition: renderPosition.toShaderVec2(renderService.screenSize),
                        objectSize: cameraRelativeSize.toShaderVec2(renderService.screenSize),
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