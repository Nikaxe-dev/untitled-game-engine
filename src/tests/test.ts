import engine from "@engine";
import Instance from "@engine/instance/base/Instance";

const game = new engine.GAME();
const a = new Instance();
a.parent = game
a.name = "A"
console.log(game.getChild(""))