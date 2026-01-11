import Color from "../../datatype/Color.js";
import Hook from "../../datatype/Hook.js";
import Vector2 from "../../datatype/Vector2.js";
import { GAMESTOPREASON } from "../../Enum.js";
import { Texture2D } from "../../regl.js";
import Shader from "../../shaders/Shader.js";
import Service from "../base/Service.js";
import GameObject from "../physical/GameObject.js";
import Scene from "../physical/Scene.js";
import Game from "./Game.js";

interface REGLCancellable {
    cancel(): void;
}

/**
 * The RenderService, which controls rendering for the game.
 */
export default class RenderService extends Service {
    /**
     * The size of the page in your browser.
     * @protected
     */
    protected _screenSize: Vector2 = new Vector2(100);

    /**
     * The size of the page in your browser.
     * @public
     */
    public get screenSize() {
        return this._screenSize;
    }

    public set screenSize(newSize: Vector2) {
        this._screenSize = newSize;
        this.applyScreenSize();
    }

    /**
     * Controls whether the game automatically sets the screenSize to (window.screen.width, window.screen.height).
     */
    public automaticallyAdjustScreenSize: boolean = true;

    /**
     * Sets the screen size based on the pages current size.
     * @public
     */
    public setScreenSizeAutomatic() {
        this.screenSize.x = window.innerWidth;
        this.screenSize.y = window.innerHeight;
        this.applyScreenSize();
    }
    
    /**
     * Applies the screen size to each scene Instance.
     * @public
     */
    public applyScreenSize() {
        const game: Game = this.parent as Game;
        this.canvas.width = this.screenSize.x;
        this.canvas.height = this.screenSize.y;
    }

    private getRenderableDescendants(container: Scene) {
        return (container.getDescendants().filter(c => c instanceof GameObject && c.sprite.visible) as GameObject[]).sort((a, b) => a.sprite.zIndex - b.sprite.zIndex);
    }

    /**
     * The loaded images in HTML form.
     * @private
     */
    private loadedImages: {[key: string]: HTMLImageElement} = {};
    private loadedTextures: {[key: string]: {texture?: any}} = {};
    private reglDrawCommands: {[key: string]: (props: {[key: string]: any}) => void} = {};

    /**
     * The div containing all loaded images.
     * @private
     */
    private loadedImagesDiv: HTMLDivElement = document.body.appendChild(document.createElement("div"));

    /**
     * Loads an image in memory.
     * @param imageURL The url leading to the image.
     */
    private getImage(imageURL: string): HTMLImageElement {
        if(this.loadedImages[imageURL]) return this.loadedImages[imageURL];
        const image = document.createElement("img");
        image.style.display = "none";
        image.src = imageURL;
        this.loadedImagesDiv.appendChild(image);
        this.loadedImages[imageURL] = image
        return image
    }

    /**
     * Gets or creates a REGL Texture.
     * @param imageURL The url to the image.
     * @returns REGLTexture
     */
    public reglGetTexture(imageURL: string) {
        if(this.loadedTextures[imageURL]) {
            return this.loadedTextures[imageURL].texture;
        } else {
            const image = this.getImage(imageURL);
            image.onload = () => {
                const texture = this.canvasContext.texture({
                    data: image,
                    flipY: true,
                });
                this.loadedTextures[imageURL] = { texture: texture };
                return texture;
            }
        }
    }
    
    /**
     * Gets or creates a REGL command function that draws a rectangle, using the given shader.
     * @param shader The shader to use in the draw function.
     * @returns Draw Command Function
     */
    public reglGetDrawCommand(shader: typeof Shader) {
        if(!this.reglDrawCommands[shader.name]) {
            this.reglDrawCommands[shader.name] = this.canvasContext({
                frag: shader.fragmentCode,
                vert: shader.vertexCode,

                attributes: {
                    vertexPosition: this.canvasContext.buffer([
                        [-1, -1],
                        [1, -1],
                        [1,  1],

                        [1,1],
                        [-1,1],
                        [-1,-1]
                    ]),

                    vertexUV: this.canvasContext.buffer([
                        [0,0],
                        [1,0],
                        [1,1],

                        [1,1],
                        [0,1],
                        [0,0]
                    ])
                },

                uniforms: this.shaderUniforms,

                primitive: "triangles",
                count: 6
            });
        }
        return this.reglDrawCommands[shader.name];
    }

    /**
     * Gets fired every time the entire game is rendered.
     * @param sceneOrder The order of scenes being rendered.
     * @public
     */
    public readonly frameRendered = new Hook();

    /**
     * The [REGL](https://github.com/regl-project/regl/tree/main) context of the canvas.
     * @public
     * @readonly
     */
    public readonly canvasContext;

    /**
     * The [REGL](https://github.com/regl-project/regl/tree/main) rendering loop.
     * @public
     * @readonly
     */
    public reglRenderLoop?: REGLCancellable;

    /**
     * Starts the REGL rendering loop.
     */
    public startRenderLoop() {
        this.reglRenderLoop = this.canvasContext.frame(() => this.render());
    }

    public shaderUniforms;

    public async render() {
        try {
            this.screenSize.x = window.innerWidth;
            this.screenSize.y = window.innerHeight;

            const game: Game = this.parent as Game;

            this.canvasContext.clear({
                color: [game.backgroundColor.r,game.backgroundColor.g,game.backgroundColor.b,game.backgroundColor.a],
                depth: 1
            });

            const sceneOrder = (this.parent as Game).getSceneOrder();
            sceneOrder.forEach((scene, index) => {
                if(scene.visibleInWorkspace) {
                    const renderable = this.getRenderableDescendants(scene);
                    renderable.forEach((gameobject, index) => {
                        gameobject.render(this, this.parent as Game, scene);
                        gameobject.rendered.fire(this, this.parent, scene);
                    })
                }
            })

            this.frameRendered.fire(sceneOrder);
        } catch (error) {
            console.error("RENDERSERVICE HAS RUN INTO AN ERROR. CANCELLING RENDER AND SIMULATION LOOPS.");
            (this.parent as Game).endGame(GAMESTOPREASON.ERROR);
            this.reglRenderLoop?.cancel();
            throw error;
        }
    }

    constructor(game: Game) {
        super(game);

        console.log("REGISTERING HTML FOR RENDERSERVICE");
        // this.canvas = document.createElement("canvas");
        // this.canvas.className = "engine-canvas"
        // document.body.appendChild(this.canvas);

        const style = document.createElement("link");
        style.rel = "stylesheet"
        style.href = new URL("../../content/html/index.css", import.meta.url).href;
        document.head.appendChild(style)

        this.canvasContext = createREGL();

        this.shaderUniforms = {
                // @ts-ignore
                objectColor: this.canvasContext.prop('objectColor'), // When applied with texture, use this as a tint.

                // @ts-ignore
                objectPosition: this.canvasContext.prop('objectPosition'),

                // @ts-ignore
                objectSize: this.canvasContext.prop('objectSize'),

                // @ts-ignore
                texture: this.canvasContext.prop('texture'),

                // @ts-ignore
                renderType: this.canvasContext.prop('renderType'), // 0 for IMAGE, 1 for BOLD (which is just a single color),

                // @ts-ignore
                objectRotation: this.canvasContext.prop('objectRotation'), // in radians

                time: (context: any) => context.time
        }
    }
}