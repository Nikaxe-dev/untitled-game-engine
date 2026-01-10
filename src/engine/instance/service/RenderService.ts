import Vector2 from "../../datatype/Vector2.js";
import Service from "../base/Service.js";
import GameObject from "../physical/GameObject.js";
import Scene from "../physical/Scene.js";
import Game from "./Game.js";

/**
 * The RenderService, which controls rendering for the game.
 */
export default class RenderService extends Service {
    /**
     * The size of the page in your browser.
     * @protected
     */
    protected _screenSize: Vector2 = new Vector2(window.innerWidth, window.innerHeight);

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
     * The public renderService canvas HTML element, used as the default canvas for Scenes.
     */
    public readonly canvas: HTMLCanvasElement;

    /**
     * Registers the HTML renderservice requires.
     * @private
     */
    private registerHTML() {
    }

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

    public async render() {
        if(this.automaticallyAdjustScreenSize) this.setScreenSizeAutomatic();
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
    }

    // Do some weird ass type shit to let typescript run this function
    public readonly regl;

    constructor(game: Game) {
        super(game);

        console.log("REGISTERING HTML FOR RENDERSERVICE");
        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas"
        document.body.appendChild(this.canvas);

        const style = document.createElement("link");
        style.rel = "stylesheet"
        style.href = new URL("../../content/html/index.css", import.meta.url).href;
        document.head.appendChild(style)
        
        // TODO: IMPORT REGL DONT KNOW HOW THE FUCK I DO IT BUT THATS FOR LATER I GUESS
        this.regl = regl({canvas: this.canvas});
    }
}