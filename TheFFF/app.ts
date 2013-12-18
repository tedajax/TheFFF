declare var dcodeIO;

var game: Game;
var currTime: number;
var prevTime: number;

window.onload = initialize;

var connection: Connection;
var messageHandler: MessageHandler;

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

function loadJsonFile(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();

    return JSON.parse(request.responseText);
}