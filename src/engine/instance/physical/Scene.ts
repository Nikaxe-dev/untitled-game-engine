import { Instance } from "../base/Instance.js";
import { Game } from "../service/Game.js";
import { Workspace } from "../service/Workspace.js";
import { Camera } from "./Camera.js";

/**
 * Scenes are containers for GameObjects, located in 
 */
export class Scene extends Instance {
    /**
     * The camera the scene will render from.
     * @public
     */
    public camera?: Camera;
    
    /**
     * The layer of the scene, controlling the rendering order for every descendant of the Scene.
     * Does not change the order of simulation for the scene, use Instance.simOrder for this purpose.
     * @public
     */
    public layer: number = 0;

    /**
     * Whether the Scene gets rendered while contained in the Workspace.
     */
    public visibleInWorkspace: boolean = true;

    /**
     * Create a new scene.
     * @param noTemplate Optinal parameter that stops the Instance from creating additional Instances, such as the camera.
     */
    constructor(workspace: Workspace, noTemplate?: boolean) {
        super();

        const game: Game = workspace.parent as Game;
        const renderService = game.RenderService;
        const htmlCanvases = renderService.htmlCanvases;

        if(!noTemplate) {
            this.camera = new Camera()
            this.camera.parent = this
        }

        this.parent = workspace;
    }
}