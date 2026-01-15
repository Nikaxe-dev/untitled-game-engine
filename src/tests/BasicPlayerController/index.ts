import { Color } from "../../engine/datatype/Color.js";
import { Sprite } from "../../engine/datatype/Sprite.js";
import { ImageTexture } from "../../engine/datatype/texture/ImageTexture.js";
import { Vector2 } from "../../engine/datatype/Vector2.js";
import { KEYCODE } from "../../engine/Enum.js";
import { GameObject } from "../../engine/instance/physical/GameObject.js";
import { Scene } from "../../engine/instance/physical/Scene.js";
import { Game } from "../../engine/instance/service/Game.js";
import { engine } from "../../engine/main.js";

const game = new engine.GAME();

const inputService = game.InputService;

const workspace = game.Workspace;
const mainScene: Scene = workspace.Main as Scene;
const camera = mainScene.camera;

const player = new GameObject();
player.name = "Image"
player.sprite = new Sprite(new ImageTexture("../../engine/content/textures/babyshoe.jpg", Color.WHITE));
player.parent = mainScene;

game.maxSimulationFramerate = 20;

const moveUp = inputService.registerInputHook([KEYCODE.W,KEYCODE.UP]);
const moveDown = inputService.registerInputHook([KEYCODE.S,KEYCODE.DOWN]);
const moveLeft = inputService.registerInputHook([KEYCODE.A,KEYCODE.LEFT]);
const moveRight = inputService.registerInputHook([KEYCODE.D,KEYCODE.RIGHT]);

const MOVEMENT_SPEED = 2500;

player.simulated.connect(() => {
    const SPEED = MOVEMENT_SPEED*game.simulationDeltaTime;
    if(moveUp.isDown) {
        player.velocity.add(new Vector2(0,SPEED));
    }
    if(moveDown.isDown) {
        player.velocity.add(new Vector2(0,-SPEED));
    }
    if(moveLeft.isDown) {
        player.velocity.add(new Vector2(-SPEED,0));
    }
    if(moveRight.isDown) {
        player.velocity.add(new Vector2(SPEED,0));
    }
    player.velocity.multiply(new Vector2(.5));
})

game.startGame();