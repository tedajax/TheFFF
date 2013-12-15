class Controller {
    gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        if (this.gameObject != null) {
            this.gameObject.setController(this);
        }
    }

    posess(gameObject: GameObject) {
        this.gameObject.setController(null);
        this.gameObject = gameObject;
        this.gameObject.setController(this);
    }

    unposess() {
        this.gameObject.setController(null);
        this.gameObject = null;
    }

    update(dt) {
        
    }
}

class LocalPlayerController extends Controller {
    constructor(gameObject: GameObject) {
        super(gameObject);
    }

    update(dt) {
        if (this.gameObject == null) {
            return;
        }

        var speed = 500;
        if (game.input.getKey(Keys.A)) {
            this.gameObject.position.x -= speed * dt;
        }
        if (game.input.getKey(Keys.D)) {
            this.gameObject.position.x += speed * dt;
        }
        if (game.input.getKey(Keys.W)) {
            this.gameObject.position.y -= speed * dt;
        }
        if (game.input.getKey(Keys.S)) {
            this.gameObject.position.y += speed * dt;
        }
    }
}