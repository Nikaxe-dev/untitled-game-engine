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
     * Protected _parent, only accesible in Instance classes.
     * @protected
     */
    protected _parent: Instance | null = null;
    
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
            Object.defineProperty(newParent, this.name, {
                get() {
                    return this;
                },
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
            Object.defineProperty(this.parent, newName, {
                get() {return this;},
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