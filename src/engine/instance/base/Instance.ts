import Hook from "../../datatype/Hook.js";
import Scene from "../physical/Scene.js";
import Game from "../service/Game.js";

export default class Instance {
    /**
     * Your code editor couldnt find this, assume it is an Instance.
     */
    [key: string]: Instance | any

    /**
     * The name of the instances class.
     * @public
     * @readonly
     */
    public readonly className: string;

    /**
     * Controls the order the Instance is simulated in. Filtered by descendants of the scene.
     */
    public simOrder: number = 0;

    /**
     * Protected _parent, only accesible in Instance classes.
     * @protected
     */
    protected _parent: Instance | null = null;

    /**
     * Fires every frame if the instance is under a scene (which is under the Workspace).
     * @param Game The game instance
     * @param Scene The scene the instance is under
     */
    public simulated = new Hook;

    /**
     * Controls whether the built in simulate functions use game.deltaTime in their speed calculations.
     */
    public simulationUseDeltatime: boolean = true;

    /**
     * Controls whether the built in simulate functions use game.simulationSpeed in their speed calculations.
     */
    public simulationUseSimulationSpeed: boolean = true;

    /**
     * Simulates the Instance.
     * @param game The game the Instance is located under.
     * @param scene The scene the Instance is located under.
     */
    public simulate(game: Game, scene: Scene) {
        
    }

    /**
     * Runs before any Instance has been simulated.
     * @param game The game the Instance is located under.
     * @param scene The scene the Instance is located under.
     */
    public preSimulation(game: Game, scene: Scene) {

    }
    
    /**
     * The Instances Parent, which is where it is located under in the Instance tree.
     * When the Parent is null, assume it has none.
     * @public
     */
    public get parent() {
        return this._parent;
    }

    /**
     * A protected Instance function that applies a new parent on the instance.
     * 
     * @param newParent The new parent to set
     * @protected
     */
    protected setParent(newParent: Instance | null) {
        const oldParent = this._parent;
        this._parent = newParent;

        // Remove from old parents children
        if(oldParent) {
            const index = oldParent.getChildIndexFromInstance(this);
            if(index) {
                oldParent.children.splice(index, 1);
                delete (oldParent as any)[this.name];
            }
        }

        // Push Instance into new Parent and declare getter for the Instances name.
        if(newParent) {
            newParent.children.push(this);
            const me = this;
            Object.defineProperty(newParent, this.name, {
                get() {return me;},
                configurable: true,
            });
        }
    }

    public set parent(newParent: Instance | null) {
        this.setParent(newParent);
    }

    /**
     * Protected _name, there to let getters and settters be used.
     * @protected
     */
    protected _name: string;

    /**
     * The name of the Instance, used in most contexts.
     * @public
     */
    public get name() {
        return this._name;
    }

    public set name(newName: string) {
        const oldName = this.name;
        this._name = newName;
        if(this.parent) {
            delete (this.parent as any)[oldName];
            const me = this
            Object.defineProperty(this.parent, newName, {
                get() {return me;},
                configurable: true,
            })
        }
    }

    /**
     * All children located under the Instance.
     * 
     * @protected
     */
    protected readonly children: Instance[] = [];

    /**
     * Attempts to find an Instance under children, and returns the index it found it at.
     * 
     * @param instance The Instance you are looking for.
     * @returns number?
     * @protected
     */
    protected getChildIndexFromInstance(instance: Instance): number | void {
        return this.children.findIndex((child) => child === instance);
    }

    /**
     * Returns an array of the children inside the Instance.
     * @returns Instance[]
     * @public
     */
    public getChildren(): Instance[] {
        return this.children;
    }

    /**
     * Returns an array of the descendants of the Instance.
     * @returns Instance[]
     * @public
     */
    public getDescendants(): Instance[] {
        const res: Instance[] = [];

        this.children.forEach((child, index) => {
            res.push(child);
            if(child.children.length > 0) child.getDescendants().forEach(c => res.push(c));
        })

        return res;
    }

    /**
     * Gets the ancestry of the Instance.
     * @returns Instance[]
     */
    public getAncestry(): Instance[] {
        const res: Instance[] = [];
        let current: Instance = this;

        while(current.parent != null) {
            current = current.parent;
            res.push(current);
        }

        return res;
    }

    /**
     * Gets a child with the given path relative to the Instance its being ran on. You can use a path for this.
     * @param path The path to the Instance you are trying to get. Use dots as a seperator.
     * @returns Instance
     * @public
     */
    public getChild(path: string = ""): Instance {
        const parts = path.split(".");
        let current: Instance | undefined = this;
        parts.forEach((part, index) => {
            current = current?.children.find(c => c.name === part);
        })
        return current;
    }

    constructor() {
        this.className = this.constructor.name;
        this.name = this.className;
        this._name = this.className;
    }
}