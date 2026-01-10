/**
 * A color, internally stored in RGBA.
 */
export default class Color {
    public static readonly WHITE = new Color(255,255,255);
    public static readonly BLACK = new Color(0,0,0);
    public static readonly RED = new Color(255,0,0);
    public static readonly GREEN = new Color(0,255,0);
    public static readonly BLUE = new Color(0,0,255);

    public r: number = 0;
    public g: number = 0;
    public b: number = 0;
    public a: number = 255;

    /**
     * Constructs a new color from RGBA.
     * 
     * @param r The red component of the color.
     * @param g The green component of the color.
     * @param b The blue component of the color.
     * @param a The alpha component of the color.
     */
    constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }
    
    /**
     * Replaces the color with the given hexCode.
     * 
     * @param hexCode The hexCode to replace the color with.
     * @returns Color
     * @public
     */
    public static fromHex(hexCode: string = "#ff0000"): Color {
        const hexValue = hexCode.replace("#", "");
        const num = parseInt(hexValue, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        const a = 255;
        return new Color(r,g,b,a);
    }
}