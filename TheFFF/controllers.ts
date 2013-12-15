class Controller {
    gameObject: GameObject;
    position: TSM.vec2;
    velocity: TSM.vec2;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        if (this.gameObject != null) {
            this.gameObject.setController(this);
        }

        this.position = new TSM.vec2([0, 0]);
        this.velocity = new TSM.vec2([0, 0]);
    }

    posess(gameObject: GameObject) {
        if (gameObject == null) {
            return;
        }

        if (this.gameObject != null) {
            this.gameObject.setController(null);
        }

        this.gameObject = gameObject;
        this.gameObject.setController(this);
    }

    handleStateSync(sync: any) {
        if (sync.moveableState != null) {
            this.velocity.x = sync.moveableState.velocity.x;
            this.velocity.y = sync.moveableState.velocity.y;
        }
        this.position.x = sync.transformState.position.x;
        this.position.y = sync.transformState.position.y;
        this.gameObject.position = this.position;
    }

    getStateSyncInfo() {
        var info = {
            "transformState": {
                "position": {
                    "x": this.position.x,
                    "y": this.position.y
                }
            },
            "moveableState": {
                "velocity": {
                    "x": this.velocity.x,
                    "y": this.velocity.y
                }
            }
        };

        return info;
    }

    unposess() {
        this.gameObject.setController(null);
        this.gameObject = null;
    }

    update(dt) {
        
    }
}

class LocalPlayerController extends Controller {
    attacking: boolean;

    constructor(gameObject: GameObject) {
        super(gameObject);
    }

    update(dt) {
        if (this.gameObject == null) {
            return;
        }

        var speed = 500;
        var moved = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (game.input.getKey(Keys.A)) {
            this.velocity.x = -speed;
            moved = true;
        }
        if (game.input.getKey(Keys.D)) {
            this.velocity.x = speed;
            moved = true;
        }
        if (game.input.getKey(Keys.W)) {
            this.velocity.y = -speed;
            moved = true;
        }
        if (game.input.getKey(Keys.S)) {
            this.velocity.y = speed;
            moved = true;
        }

        //this.position.x += this.velocity.x * dt;
        //this.position.y += this.velocity.y * dt;
        //this.gameObject.position = this.position;

        if (game.input.getMouseButtonDown(MouseButtons.LEFT)) {
            this.gameObject.setActiveAnimation("Attack");
            this.attacking = true;
        }

        if (!this.attacking) {
            if (moved) {
                this.gameObject.setActiveAnimation("Walk");
            } else {
                this.gameObject.setActiveAnimation("Idle");
            }
        }
    }
}

class NetworkPlayerController extends Controller {
    constructor(gameObject: GameObject) {
        super(gameObject);
    }

    update(dt) {
        var vx = this.velocity.x * dt;
        var vy = this.velocity.y * dt;
        //this.position.x += vx;
        //this.position.y += vy;
        this.gameObject.position = this.position;
    }
}