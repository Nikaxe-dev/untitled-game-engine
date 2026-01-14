import { Hook } from "../../datatype/Hook";
import { Vector2 } from "../../datatype/Vector2";
import { KEYCODE } from "../../Enum";
import { Service } from "../base/Service";
import { Game } from "./Game";

export const KEYMAPPINGS: {[key: string]: KEYCODE} = {
    KeyA: KEYCODE.A,
    KeyB: KEYCODE.B,
    KeyC: KEYCODE.C,
    KeyD: KEYCODE.D,
    KeyE: KEYCODE.E,
    KeyF: KEYCODE.F,
    KeyG: KEYCODE.G,
    KeyH: KEYCODE.H,
    KeyI: KEYCODE.I,
    KeyJ: KEYCODE.J,
    KeyK: KEYCODE.K,
    KeyL: KEYCODE.L,
    KeyM: KEYCODE.M,
    KeyN: KEYCODE.N,
    KeyO: KEYCODE.O,
    KeyP: KEYCODE.P,
    KeyQ: KEYCODE.Q,
    KeyR: KEYCODE.R,
    KeyS: KEYCODE.S,
    KeyT: KEYCODE.T,
    KeyU: KEYCODE.U,
    KeyV: KEYCODE.V,
    KeyW: KEYCODE.W,
    KeyX: KEYCODE.X,
    KeyY: KEYCODE.Y,
    KeyZ: KEYCODE.Z,
    Digit0: KEYCODE.ZERO,
    Digit1: KEYCODE.ONE,
    Digit2: KEYCODE.TWO,
    Digit3: KEYCODE.THREE,
    Digit4: KEYCODE.FOUR,
    Digit5: KEYCODE.FIVE,
    Digit6: KEYCODE.SIX,
    Digit7: KEYCODE.SEVEN,
    Digit8: KEYCODE.EIGHT,
    Digit9: KEYCODE.NINE,
    Minus: KEYCODE.MINUS,
    Equal: KEYCODE.EQUALS,
    Backspace: KEYCODE.BACKSPACE,
    Tab: KEYCODE.TAB,
    Enter: KEYCODE.ENTER,
    Space: KEYCODE.SPACE,
    BracketLeft: KEYCODE.LEFTBRACKET,
    BracketRight: KEYCODE.RIGHTBRACKET,
    Backslash: KEYCODE.BACKSLASH,
    Comma: KEYCODE.COMMA,
    Period: KEYCODE.PERIOD,
    Slash: KEYCODE.SLASH,
    CapsLock: KEYCODE.CAPSLOCK,
    ShiftLeft: KEYCODE.LEFTSHIFT,
    ShiftRight: KEYCODE.RIGHTSHIFT,
    ControlLeft: KEYCODE.LEFTCTRL,
    ControlRight: KEYCODE.RIGHTCTRL,
    AltLeft: KEYCODE.LEFTALT,
    AltRight: KEYCODE.RIGHTALT,
    MetaLeft: KEYCODE.LEFTMETA,
    MetaRight: KEYCODE.RIGTHMETA,
    Escape: KEYCODE.ESCAPE,
    Pause: KEYCODE.PAUSE,
    PrintScreen: KEYCODE.PRINT,
    ScrollLock: KEYCODE.SCROLLOCK,
    NumLock: KEYCODE.NUMLOCK,
    Insert: KEYCODE.INSERT,
    Delete: KEYCODE.DELETE,
    Home: KEYCODE.HOME,
    End: KEYCODE.END,
    PageUp: KEYCODE.PAGEUP,
    PageDown: KEYCODE.PAGEDOWN,
    ArrowUp: KEYCODE.UP,
    ArrowDown: KEYCODE.DOWN,
    ArrowLeft: KEYCODE.LEFT,
    ArrowRight: KEYCODE.RIGHT,
    F1: KEYCODE.F1,
    F2: KEYCODE.F2,
    F3: KEYCODE.F3,
    F4: KEYCODE.F4,
    F5: KEYCODE.F5,
    F6: KEYCODE.F6,
    F7: KEYCODE.F7,
    F8: KEYCODE.F8,
    F9: KEYCODE.F9,
    F10: KEYCODE.F10,
    F11: KEYCODE.F11,
    F12: KEYCODE.F12,
    F13: KEYCODE.F13,
    F14: KEYCODE.F14,
    F15: KEYCODE.F15,
    Numpad0: KEYCODE.KEYPADZERO,
    Numpad1: KEYCODE.KEYPADONE,
    Numpad2: KEYCODE.KEYPADTWO,
    Numpad3: KEYCODE.KEYPADTHREE,
    Numpad4: KEYCODE.KEYPADFOUR,
    Numpad5: KEYCODE.KEYPADFIVE,
    Numpad6: KEYCODE.KEYPADSIX,
    Numpad7: KEYCODE.KEYPADSEVEN,
    Numpad8: KEYCODE.KEYPADEIGHT,
    Numpad9: KEYCODE.KEYPADNINE,
    NumpadDecimal: KEYCODE.KEYPADPERIOD,
    NumpadDivide: KEYCODE.KEYPADDIVIDE,
    NumpadMultiply: KEYCODE.KEYPADMULTIPLY,
    NumpadSubtract: KEYCODE.KEYPADMINUS,
    NumpadAdd: KEYCODE.KEYPADPLUS,
    NumpadEnter: KEYCODE.KEYPADENTER,
    NumpadEqual: KEYCODE.KEYPADEQUALS,
}

export const SHIFTKEYMAPPINGS: {[key: string]: KEYCODE} = {
    Digit1: KEYCODE.EXCLAMATION,
    Digit2: KEYCODE.AT,
    Digit3: KEYCODE.HASH,
    Digit4: KEYCODE.DOLLAR,
    Digit5: KEYCODE.PERCENT,
    Digit6: KEYCODE.CARET,
    Digit7: KEYCODE.AMBERSAND,
    Digit8: KEYCODE.ASTERISK,
    Digit9: KEYCODE.LEFTPARENTHESIS,
    Digit0: KEYCODE.RIGHTPARENTHESIS
}

/**
 * A class designed to make managing inputs much easier by detecting multiple inputs at once.
 */
export class InputHook {
    private inputService: InputService;

    public keycodes: KEYCODE[] = [];

    public down = new Hook();
    public up = new Hook();

    public get isDown() {
        let isdown = false;
        this.keycodes.forEach(keycode => {
            isdown = isdown || this.inputService.keyDown(keycode);
            if(isdown) {
                return isdown;
            }
        })
        return isdown;
    }

    /**
     * DO NOT USE THIS CONSTRUCTOR TO CREATE AN INPUTHOOK, USE inputService.registerInputHook() INSTEAD.
     * @param inputService The local inputService.
     */
    constructor(inputService: InputService) {
        this.inputService = inputService;
    }
}

/**
 * The InputService, which is responsible for capturing user mouse and keyboard input.
 */
export class InputService extends Service {
    /**
     * All of the InputHooks in the game.
     */
    private inputHooks: InputHook[] = [];

    /**
     * A list of all keycodes currently pressed.
     */
    private keycodesDown: Set<KEYCODE> = new Set();
    
    /**
     * Checks whether a key is currently down.
     * @param key The KEYCODE to check for.
     * @returns boolean
     */
    public keyDown(key: KEYCODE) {
        return this.keycodesDown.has(key);
    }

    public mousePositionScreen: Vector2 = Vector2.ZERO;

    public registerInputHook(keycodes: KEYCODE[]): InputHook {
        const inputHook = new InputHook(this);
        inputHook.keycodes = keycodes;
        this.inputHooks.push(inputHook);
        return inputHook;
    }

    public SHIFT = this.registerInputHook([KEYCODE.LEFTSHIFT,KEYCODE.RIGHTSHIFT]);

    constructor(game: Game) {
        super(game);
        addEventListener("keydown", event => {
            let keycode = KEYMAPPINGS[event.code];
            if(this.SHIFT.isDown && SHIFTKEYMAPPINGS[keycode]) {
                keycode = SHIFTKEYMAPPINGS[keycode];
            }
            if(keycode) {
                this.keycodesDown.add(keycode);
            }
            this.inputHooks.forEach(hook => {
                if(hook.keycodes.includes(keycode)) {
                    hook.down.fire();
                }
            });
        });
        addEventListener("keyup", event => {
            let keycode = KEYMAPPINGS[event.code];
            if(this.SHIFT.isDown && SHIFTKEYMAPPINGS[keycode]) {
                keycode = SHIFTKEYMAPPINGS[keycode];
            }
            this.inputHooks.forEach(hook => {
                if(hook.keycodes.includes(keycode)) {
                    hook.up.fire();
                }
            });
        });
        addEventListener("mousedown", event => {
            if(event.button == 0) {
                this.keycodesDown.add(KEYCODE.MOUSELEFT);
            }
            if(event.button == 1) {
                this.keycodesDown.add(KEYCODE.MOUSEMIDDLE);
            }
            if(event.button == 2) {
                this.keycodesDown.add(KEYCODE.MOUSERIGHT);
            }
        });
        addEventListener("mouseup", event => {
            if(event.button == 0) {
                this.keycodesDown.delete(KEYCODE.MOUSELEFT);
            }
            if(event.button == 1) {
                this.keycodesDown.delete(KEYCODE.MOUSEMIDDLE);
            }
            if(event.button == 2) {
                this.keycodesDown.delete(KEYCODE.MOUSERIGHT);
            }
        });
        addEventListener("wheel", event => {
            const code = event.deltaY > 0 ? KEYCODE.WHEELDOWN : KEYCODE.WHEELUP;
            this.keycodesDown.add(code);
            setTimeout(() => {
                this.keycodesDown.delete(code);
            }, 50);
        });
        addEventListener("mousemove", event => {
            this.mousePositionScreen.x = event.clientX;
            this.mousePositionScreen.y = event.clientY;
        });
    }
}