var game;
var currTime;
var prevTime;

window.onload = initialize;

var connection;
var messageHandler;

function initialize() {
    var canvas = document.getElementById('canvas');
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
//# sourceMappingURL=app.js.map
