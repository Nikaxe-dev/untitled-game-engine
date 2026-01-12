import { Game } from "../service/Game.js";
import { Instance } from "./Instance.js";

/**
 * Service class, used for services.
 * Parent is readonly here, making sure it is set to the game or null.
 * 
 * @extends Instance
 */
export class Service extends Instance {
    protected set parent(newParent: Instance | null) {
        this.setParent(newParent);
    }

    /**
     * @readonly is a service
     */
    get parent() {
        return super.parent;
    }

    /**
     * @param game The game instance the service is being declared under. Or null if it is an independent service (such as game)
     */
    constructor(game: Game | null) {
        super();
        console.log(`INITIALIZING SERVICE ${this.className}${game ? ` in ${game.name}` : ''}`);
        this.parent = game;
    }
}