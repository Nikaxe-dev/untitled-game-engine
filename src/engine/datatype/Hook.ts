export class HookConnection {
    public hook?: Hook
    public isOnce: boolean = false
    public fire(...params: any[]) {}
    public disconnect() {
        this.hook?.connections.splice(this.hook.connections.indexOf(this), 1)
        this.hook = undefined
    }

    constructor(hook: Hook, fire: () => undefined) {
        this.fire = fire
        this.hook = hook
    }
}

export class Hook {
    public connections: HookConnection[] = []
    public fire(...params: any[]) {
        this.connections.forEach((value, index) => {
            value.fire(...params)
        })
    }
    public connect(fire: (...params: any[]) => undefined) {
        const connection = new HookConnection(this, fire)
        this.connections.push(connection)
        return connection
    }
    public once(fire: (...params: any[]) => undefined) {
        this.connect(fire).isOnce = true
    }
}