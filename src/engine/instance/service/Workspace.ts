import Instance from "../base/Instance.js";
import Service from "../base/Service.js";
import Scene from "../physical/Scene.js";
import Game from "./Game.js";

/**
 * The workspace, which contains all scenes, which in turn contain all physical instances.
 */
export default class Workspace extends Service {
    public Main?: Scene;
}