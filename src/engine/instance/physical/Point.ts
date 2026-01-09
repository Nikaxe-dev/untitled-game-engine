import Vector2 from "@engine/datatype/Vector2";
import Instance from "../base/Instance";

/**
 * A Point in 2D Space.
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
    public Position: Vector2 = new Vector2(0);
}