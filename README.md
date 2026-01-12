# untitled game engine
<p align="left"><a href="https://nikaxe-dev.github.io/untitled-game-engine/docs" target="_blank">Documentation</a></p>

---

## Introduction

This is a 2D game engine/framework made for typescript. Each game object (referred to as an `Instance` class) uses a parent-child relationship to allow for easy orginization of your game.
Each child applies a getter to its parent, letting you access children in a very simple way. There is also a `getChild()` method on each instance that takes in a path seperated by dots, if you want to use that.

Currently, documentation is the exact same as the documentation in-code. Later, when this project is fully realized, I will provide proper documentation with tutorials. For now, I am open to people contributing to the docs.

For now, you can use the in-code documentation.

## How to use this

Clone the repository, remove all directories in `src` other than `engine`. Then create your game inside something like `src/game`.
You can distribute the `/build` folder, although you might want to put an index page in it that redirects to the games page.

### How to build:
The engine comes with a useful `build.bat` script to automatically build your project. By default it also builds the documentation (in `/docs`), but you can run the script with the flag `--noDocs` to disable this.
