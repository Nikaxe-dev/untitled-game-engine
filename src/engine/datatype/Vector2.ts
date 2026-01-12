function numLerp(a: number, b: number, t: number) {
    return a+(b-a)*t
}

/**
 * Represents a 2D position.
 */
export default class Vector2 {
    public static get ZERO() {return new Vector2(0,0);};
    public static get ONE() {return new Vector2(1,1);};
    public static get TWO() {return new Vector2(2,2);};

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
     * Returns a copy of the vector added by the vector.
     * 
     * @param vector The vector to add by.
     * @public
     */
    public added(vector: Vector2) {
        return new Vector2(this.x+vector.x,this.y+vector.y);
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
     * Returns a copy of the vector subtracted by the vector.
     * 
     * @param vector The vector to subtract by.
     * @public
     */
    public subtracted(vector: Vector2) {
        return new Vector2(this.x-vector.x,this.y-vector.y);
    }

    /**
     * Multiplies the Vector by another.
     * 
     * @param vector The vector to multiply by.
     * @public
     */
    public multiply(vector: Vector2) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    /**
     * Returns a copy of the vector multiplied by the vector.
     * 
     * @param vector The vector to multiply by.
     * @public
     */
    public multiplied(vector: Vector2) {
        return new Vector2(this.x*vector.x, this.y*vector.y);
    }

    /**
     * Divides the Vector by another.
     * 
     * @param vector The vector to divide by.
     * @public
     */
    public divide(vector: Vector2) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }

    /**
     * Returns a copy of the vector divided by the vector.
     * 
     * @param vector The vector to divide by.
     * @public
     */
    public divided(vector: Vector2) {
        return new Vector2(this.x/vector.x,this.y/vector.y);
    }

    /**
     * The magnitude of the Vector.
     */
    get magnitude() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }

    /**
     * The Unit Vector of the Vector.
     */
    get unit() {
        return this.divided(new Vector2(this.magnitude));
    }

    /**
     * The ratio of x:y.
     */
    get ratio() {
        return this.x/this.y;
    }

    /**
     * Gets a version of the vector usable in shaders.
     * @param screenSize The size of the canvas/screen.
     * @returns [xScale, yScale]
     */
    public toShaderVec2(screenSize: Vector2) {
        const vectorResult = this.divided(screenSize);
        return [vectorResult.x,vectorResult.y];
    }

    /**
     * Linear interpolates towards the given vector.
     * @param vector the vector to lerp towards
     * @param alpha the interpolation factor
     */
    public lerp(vector: Vector2, alpha: number) {
        this.x = numLerp(this.x, vector.x, alpha);
        this.y = numLerp(this.y, vector.y, alpha);
        return this;
    }

    /**
     * Returns a new vector that is linear interpolated towards the given vector.
     * @param vector the vector to lerp towards
     * @param alpha the interpolation factor
     * @returns A new vector instance.
     */
    public lerped(vector: Vector2, alpha: number) {
        return new Vector2(numLerp(this.x, vector.x, alpha), numLerp(this.y, vector.y, alpha));
    }

    public clone() {
        return new Vector2(this.x, this.y);
    }
}