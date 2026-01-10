/**
 * Represents a 2D position.
 */
export default class Vector2 {
    public static readonly ZERO = new Vector2(0,0);
    public static readonly ONE = new Vector2(1,1);
    public static readonly TWO = new Vector2(2,2);

    /**
     * @param x The X-component of the vector.
     * @param y The Y-component of the vector.
     */
    constructor(x: number = 0, y: number = x) {
        this.x = x
        this.y = y
    }

    /**
     * X-component of the Vector.
     * @public
     */
    public x: number = 0;

    /**
     * Y-component of the Vector.
     * @public
     */
    public y: number = 0;

    /**
     * Adds another Vector to the Vector.
     * 
     * @param vector The vector to add.
     * @public
     */
    public add(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Subtracts the Vector by another.
     * 
     * @param vector The vector to subtract.
     * @public
     */
    public subtract(vector: Vector2) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Multiplies the Vector by another.
     * 
     * @param vector The vector to multiply by.
     * @public
     */
    public multiply(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Divides the Vector by another.
     * 
     * @param vector The vector to divide by.
     * @public
     */
    public divide(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    get magnitude() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    get unit() {
        return this.divide(new Vector2(this.magnitude));
    }
}