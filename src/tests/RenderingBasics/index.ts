import Color from "../../engine/datatype/Color.js";
import Sprite from "../../engine/datatype/Sprite.js";
import ImageTexture from "../../engine/datatype/texture/ImageTexture.js";
import Vector2 from "../../engine/datatype/Vector2.js";
import GameObject from "../../engine/instance/physical/GameObject.js";
import Scene from "../../engine/instance/physical/Scene.js";
import Game from "../../engine/instance/service/Game.js";
import engine from "../../engine/main.js";

const game = new engine.GAME();

const workspace = game.Workspace;
const mainScene: Scene = workspace.Main as Scene;
const camera = mainScene.camera;

const testGameObjectImage = new GameObject();
testGameObjectImage.name = "Image"
testGameObjectImage.sprite = new Sprite(new ImageTexture("../../engine/content/textures/babyshoe.jpg", Color.WHITE));
testGameObjectImage.parent = mainScene;

const testGameObjectImage2 = new GameObject();
testGameObjectImage2.sprite = new Sprite(new ImageTexture("../../engine/content/textures/nikaxe.png", Color.WHITE));
testGameObjectImage2.parent = mainScene;
testGameObjectImage2.position = new Vector2(0, 500);

game.maxSimulationFramerate = 120;

game.useRequestAnimationFrameForSimulation = true;

camera?.simulated.connect(() => {
    const time = performance.now();
    //camera.position = new Vector2(Math.cos(time/1000)*500, Math.sin(time/1000)*500);
    camera.zoom = 1-Math.abs(Math.cos(time/250)+1)/8;
})

game.startGame();