import Game from "./instance/service/game";

/**
 * The main engine class, storing public properties accessible from everywhere, along with certain other classes in the framework.
 */
export default class engine {
    /**
     * The name of the engine, this is here so it can be renamed at any point.
     * @public
     * @readonly
     */
    public static readonly NAME = "engine";

    /**
     * The current version of the engine running.
     * @public
     * @readonly
     */
    public static readonly VERSION = "1.0.0";

    /**
     * The GAME class, designed to allow for running multiple instances of the engine in one page.
     * @public
     * @readonly
     */
    public static readonly GAME = Game;
}