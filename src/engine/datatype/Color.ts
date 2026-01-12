/**
 * A color, internally stored in RGBA.
 */
export class Color {
    public static get WHITE() {return new Color(255,255,255)};
    public static get BLACK() {return new Color(0,0,0)};
    public static get RED() {return new Color(255,0,0)};
    public static get GREEN() {return new Color(0,255,0)};
    public static get BLUE() {return new Color(0,0,255)};

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
    constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 255) {
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
     * @static
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

    /**
     * Replaces the color with the given hexCode.
     * 
     * @param hexCode The hexCode to replace the color with.
     * @returns Color
     * @public
     */
    public fromHex(hexCode: string = "#ff0000"): Color {
        const hexValue = hexCode.replace("#", "");
        const num = parseInt(hexValue, 16);
        this.r = (num >> 16) & 255;
        this.g = (num >> 8) & 255;
        this.b = num & 255;
        this.a = 255;
        return this
    }

    /**
     * Returns a new color using HSV.
     * @param h Hue (0-360)
     * @param s Saturation (0-100)
     * @param v Value (0-100)
     * @returns Color
     * @public @static
     */
    public static fromHSV(h: number = 0, s: number = 100, v: number = 100) {
        h /= 360;
        s /= 100;
        v /= 100;

        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i%6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return new Color(r,g,b);
    }

    /**
     * Changes the color to fit the HSV color given.
     * @param h Hue (0-360)
     * @param s Saturation (0-100)
     * @param v Value (0-100)
     * @returns this
     * @public
     */
    public fromHSV(h: number = 0, s: number = 100, v: number = 100) {
        h /= 360;
        s /= 100;
        v /= 100;

        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i%6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        this.r = r as number;
        this.g = g as number;
        this.b = b as number;
        this.a = 1;
        return this;
    }

    private componentToHex(c: number) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * The color as a hexCode.
     */
    get hex() {
        return "#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
    }

    /**
     * The color in HSV.
     * @returns [H,S,V]
     */
    get hsv() {
        const rs = this.r/255;
        const gs = this.g/255;
        const bs = this.b/255;

        let min = Math.min(rs,gs,bs);
        let max = Math.max(rs,gs,bs);
        let delta = max - min;
        let h,s,v;

        v = max

        if(delta === 0) {
            h = 0
            s = 0
        } else {
            s = delta / max;

            if (rs === max) {
                h = (gs - bs) / delta;
            } else if (gs === max) {
                h = 2 + (bs - rs) / delta;
            } else {
                h = 4 + (rs - gs) / delta;
            }

            h /= 6;
            if (h<0) h+= 1;
        }

        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(v * 100)
        ]
    }

    /**
     * The color as an Array, usable in shaders.
     */
    get shaderVec4() {
        return [
            this.r/255,
            this.g/255,
            this.b/255,
            this.a/255
        ]
    }
}