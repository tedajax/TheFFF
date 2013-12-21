declare var dcodeIO;

var game: Game;
var currTime: number;
var prevTime: number;

window.onload = initialize;

var connection: Connection;
var messageHandler: MessageHandler;

var FPS = 60;
var framesThisSecond = 0;
var lastTick;

function initialize() {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas');
    canvas.addEventListener("contextmenu", (e: MouseEvent) => {
        if (e.button == 2) {
            e.preventDefault();
            return false;
        }
    }, false);
    game = new Game(canvas);
   
    game.initialize(); 

    messageHandler = new MessageHandler();
    connection = new Connection("ws://caemlyn.xsfn.net:8081/");
    connection.connect();

    connection.sendCommands([{ "type": 100, "connectRequest": {} }]);

    lastTick = new Date().getTime();
    framesThisSecond = 0;

    setTimeout(update, 1000 / FPS);
    requestAnimationFrame(render);
}

function update() {
    prevTime = (currTime != null) ? currTime : new Date().getTime();
    currTime = new Date().getTime();
    var dt = (currTime - prevTime) / 1000.0;
    game.update(dt);

    setTimeout(update, 1000 / FPS);
}

function render() {
    game.render();

    ++framesThisSecond;
    var now = new Date().getTime();
    if (now - lastTick >= 1000) {
        console.log("FPS: " + framesThisSecond);
        framesThisSecond = 0;
        lastTick = now;
    }

    requestAnimationFrame(render);
}

function loadJsonFile(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();

    return JSON.parse(request.responseText);
}