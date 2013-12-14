var game;
var currTime;
var prevTime;

window.onload = initialize;

function initialize() {
    var canvas = document.getElementById('canvas');
    game = new Game(canvas);

    game.initialize();

    var FPS = 60;
    setInterval(tick, 1000 / FPS);
}

function tick() {
    update();
    render();
}

function update() {
    prevTime = (currTime != null) ? currTime : new Date().getTime();
    currTime = new Date().getTime();
    var dt = (currTime - prevTime) / 1000.0;
    game.update(dt);
}

function render() {
    game.render();
}
//# sourceMappingURL=app.js.map