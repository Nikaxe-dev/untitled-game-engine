import Vector2 from "../../datatype/Vector2.js";
import Point from "./Point.js";

export default class Camera extends Point {
    public static CENTRE = new Camera()

    public zoom: number = 1;
}