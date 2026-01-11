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

class PhysicsObject extends GameObject {
    public simulate(game: Game, scene: Scene): void {
        this.velocity.subtract(new Vector2(0,10));
        super.simulate(game, scene);
    }
}

const testGameObjectImage = new PhysicsObject();
testGameObjectImage.name = "Image"
testGameObjectImage.sprite = new Sprite(new ImageTexture("../../engine/content/textures/babyshoe.jpg", Color.WHITE));
testGameObjectImage.parent = mainScene;

const testGameObjectRect = new PhysicsObject();
testGameObjectRect.name = "Rect";
testGameObjectRect.position = new Vector2(0,0);
testGameObjectRect.parent = mainScene;

game.gameSimulated.connect(() => {
    console.log(`DeltaTime: ${game.deltaTime}`)
});

game.maxSimulationFramerate = 10;

game.startGame();