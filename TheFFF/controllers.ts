class StateFrame {
    position: TSM.vec2;
    velocity: TSM.vec2;
    time: number;

    constructor() {
        this.position = new TSM.vec2([0, 0]);
        this.velocity = new TSM.vec2([0, 0]);
        this.time = performance.now();
    }

    clone(other: StateFrame) {
        this.position.x = other.position.x;
        this.position.y = other.position.y;
        this.velocity.x = other.velocity.x;
        this.velocity.y = other.velocity.y;
        this.time = other.time;
    }

    static lerp(a: StateFrame, b: StateFrame, t: number) {
        var result = new StateFrame();
        result.position.x = StateFrame.lerpf(a.position.x, b.position.x, t);
        result.position.y = StateFrame.lerpf(a.position.y, b.position.y, t);
        return result;
    }

    static lerpf(a: number, b: number, t: number) {
        if (t < 0) {
            t = 0;
        } else if (t > 1) {
            t = 1;
        }
        return a + (b - a) * t;
    }
}

class Controller {
    gameObject: GameObject;
    previous: StateFrame;
    current: StateFrame;
    interp: StateFrame;

    position: TSM.vec3;
    velocity: TSM.vec3;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        if (this.gameObject != null) {
            this.gameObject.setController(this);
        }

        this.position = new TSM.vec3([0, 0, 0]);
        this.velocity = new TSM.vec3([0, 0, 0]);

        this.previous = new StateFrame();
        this.current = new StateFrame();
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
        this.previous.clone(this.current);
        this.current.time = performance.now();
        if (sync.moveableState != null) {
            this.current.velocity.x = sync.moveableState.velocity.x;
            this.current.velocity.y = sync.moveableState.velocity.y;
        }
        this.current.position.x = sync.transformState.position.x;
        this.current.position.y = sync.transformState.position.y;
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
        if (this.gameObject == null) {
            return;
        }

        var time = performance.now() - 100;        
        var perc = (time - this.previous.time) / (this.current.time - this.previous.time);
        this.interp = StateFrame.lerp(this.previous, this.current, perc);
        this.gameObject.position.x = this.interp.position.x;
        this.gameObject.position.y = this.interp.position.y;
    }
}

class LocalPlayerController extends Controller {
    attacking: boolean;
    respectNetwork: boolean;
    moved: boolean;
    previouslyMoved: boolean;

    constructor(gameObject: GameObject) {
        super(gameObject);
        this.respectNetwork = false;
        this.moved = false;
        this.previouslyMoved = false;
    }

    update(dt) {
        if (this.respectNetwork) {
            super.update(dt);
        }

        if (this.gameObject == null) {
            return;
        }

        var speed = 10;
        this.previouslyMoved = this.moved;
        this.moved = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (game.input.getKey(Keys.A)) {
            this.velocity.x = -speed;
            this.moved = true;
        }
        if (game.input.getKey(Keys.D)) {
            this.velocity.x = speed;
            this.moved = true;
        }
        if (game.input.getKey(Keys.W)) {
            this.velocity.y = -speed;
            this.moved = true;
        }
        if (game.input.getKey(Keys.S)) {
            this.velocity.y = speed;
            this.moved = true;
        }

        if (!this.respectNetwork) {
            this.position.x += this.velocity.x * dt;
            this.position.y += this.velocity.y * dt;
            this.gameObject.position = this.position;
        }

        if (game.input.getMouseButtonDown(MouseButtons.LEFT) && !this.attacking) {
            this.gameObject.animations.play("attack");
            this.attacking = true;
        }

        if (this.moved != this.previouslyMoved) {
            if (this.moved) {
                this.gameObject.animations.play("walk", true);
            } else {
                this.gameObject.animations.stop("walk");
                this.gameObject.animations.play("idle", true);
            }
        }
    }
}

class NetworkPlayerController extends Controller {
    constructor(gameObject: GameObject) {
        super(gameObject);
    }

    update(dt) {
        super.update(dt);

        var vx = this.current.velocity.x * dt;
        var vy = this.current.velocity.y * dt;
        //this.position.x += vx;
        //this.position.y += vy;
        this.gameObject.position = this.position;
    }
}