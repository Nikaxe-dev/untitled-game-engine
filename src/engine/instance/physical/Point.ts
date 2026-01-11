import Vector2 from "../../datatype/Vector2.js";
import Instance from "../base/Instance.js";
import Game from "../service/Game.js";
import Scene from "./Scene.js";

/**
 * A Point in 2D Space with a Position and Velocity.
 * Used as the base for all 2D Instances.
 * 
 * @extends Instance
 */
export default class Point extends Instance {
    /**
     * The Vector2 position of the Point Instance.
     * 
     * @public
     */
    public position: Vector2 = Vector2.ZERO;

    /**
     * The amount added to the Position each frame.
     * @public
     */
    public velocity: Vector2 = Vector2.ZERO;

    public simulate(game: Game, scene: Scene): void {
        super.simulate(game, scene);
        const velocityAdd = new Vector2(this.velocity.x, this.velocity.y);
        if(this.simulationUseDeltatime && !isNaN(game.deltaTime)) {
            velocityAdd.multiply(new Vector2(game.deltaTime));
        }
        if(this.simulationUseSimulationSpeed && !isNaN(game.deltaTime)) {
            velocityAdd.multiply(new Vector2(game.simulationSpeed));
        }
        this.position.add(velocityAdd);
    }

    constructor() {
        super();
    }
}