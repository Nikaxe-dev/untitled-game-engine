import Color from "../../datatype/Color.js";
import Hook from "../../datatype/Hook.js";
import { GAMESTOPREASON } from "../../Enum.js";
import engine from "../../main.js";
import Service from "../base/Service.js";
import GameObject from "../physical/GameObject.js";
import Scene from "../physical/Scene.js";
import RenderService from "./RenderService.js";
import Workspace from "./Workspace.js";

/**
 * The Game, including every service and game-specific property.
 */
export default class Game extends Service {
    /**
     * The workspace, which contains all scenes, which in turn contain all physical instances.
     */
    public Workspace: Workspace = new Workspace(this);
    
    /**
     * The RenderService, which controls rendering for the game.
     */
    public RenderService: RenderService = new RenderService(this);

    /**
     * The name of the Game.
     * @public
     * @readonly
     */
    public readonly NAME?: string;

    /**
     * The version of the Game currently running.
     * @public
     * @readonly
     */
    public readonly VERSION?: string;

    /**
     * The max framerate for the game.
     */
    public maxSimulationFramerate: number = 60;

    /**
     * The speed that simulations (player, npc, physics, ect) should run at.
     * Simulation and UI Speed are split to allow for an easy implementations of features that require pausing the gameplay (for example: a pause menu).
     * @public
     */
    public simulationSpeed: number = 1;

    /**
     * The speed that UI should run at.
     * Simulation and UI Speed are split to allow for an easy implementations of features that require pausing the gameplay (for example: a pause menu).
     * @public
     */
    public uiSpeed: number = 1;

    /**
     * The time the game took to simulate the last frame. Use it to achieve frame-independant speeds.
     * @public
     */
    public deltaTime: number = 1/this.maxSimulationFramerate;

    /**
     * Gets fired every time a the entire game is simulated.
     * @param sceneOrder The order of scenes being simulated.
     * @public
     */
    public readonly gameSimulated = new Hook();

    public backgroundColor = new Color(0,0,0,1)

    private getSimulatableDescendants(container: Scene) {
        return container.getDescendants().sort((a, b) => a.simOrder - b.simOrder);
    }

    public getSceneOrder() {
        return (this.Workspace.getChildren().filter(c => c instanceof Scene) as Scene[]).sort((a, b) => a.layer - b.layer);
    }

    private lastSimulateTime = performance.now();

    /**
     * Runs simulate on every simulatable Instance. Calling this starts a loop.
     * @public
     * @async
     */
    public async simulate() {
        const frameStartTime = performance.now();

        this.deltaTime = (frameStartTime - this.lastSimulateTime) / 1000;
        this.lastSimulateTime = frameStartTime;

        const sceneOrder = this.getSceneOrder();
        sceneOrder.forEach((scene, index) => {
            const simulatable = this.getSimulatableDescendants(scene);
            simulatable.forEach((instance, index) => {
                instance.simulate(this, scene);
                instance.simulated.fire(this, scene);
            })
        })
        this.gameSimulated.fire(sceneOrder);

        aaaa // TODO: FIX TIMING ISSUES

        const frameExecutionMilliseconds = performance.now() - frameStartTime;

        console.log(frameExecutionMilliseconds)
        
        if(frameExecutionMilliseconds < 1000/this.maxSimulationFramerate) {
            console.log(1000/this.maxSimulationFramerate-frameExecutionMilliseconds)
            await new Promise(resolve => setTimeout(resolve, 1000/this.maxSimulationFramerate-frameExecutionMilliseconds))
        }
        this.simulate();
    }

    public simulateLoopID?: number;

    /**
     * Starts all of the processes for the game.
     * Run this after configfuring the game.
     * @public
     */
    public startGame() {
        this.simulate();
        this.RenderService.startRenderLoop();
    }

    /**
     * Ends the main game loop.
     * @param reason The reason the game was stopped.
     */
    public endGame(reason: GAMESTOPREASON) {
        clearInterval(this.simulateLoopID);
        console.log(`GAMELOOP STOPPED. CODE: ${reason}`);
    }

    /**
     * @param noTemplate Controls whether to come with certain instances already in the game (such as a scene and camera under workspace).
     */
    constructor(noTemplate?: boolean) {
        console.log(`INITIALIZING ${engine.NAME} V${engine.VERSION}!`);
        super(null);

        if(!noTemplate) {
            const mainScene = new Scene(this.Workspace);
            mainScene.name = "Main";
        }

        console.log(`Hello from ${engine.NAME} V${engine.VERSION}!`);
    }
}