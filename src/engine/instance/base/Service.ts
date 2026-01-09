import Game from "@engine/instance/service/game";
import Instance from "./Instance";

/**
 * Service class, used for services.
 * Parent is readonly here, making sure it is set to the game or null.
 * 
 * @extends Instance
 */
export default class Service extends Instance {
    protected set parent(newParent: Instance | null) {
        this.setParent(newParent);
    }

    get parent() {
        return super.parent
    }

    /**
     * @param game The game instance the service is being declared under. Or null if it is an independent service (such as game)
     */
    constructor(game: Game | null) {
        super();
        this.parent = game;
    }
}