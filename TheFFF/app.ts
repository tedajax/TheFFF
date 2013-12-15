declare var dcodeIO;

var game: Game;
var currTime: number;
var prevTime: number;

window.onload = initialize;

var connection: Connection;

function initialize() {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas');
    game = new Game(canvas);
    
    var Protobuf = dcodeIO.ProtoBuf;
    var builder = Protobuf.loadProtoFile("proto/core.proto");
    var root = builder.build();
    var myMessage = new root.ClientMessage({
      "token": Math.floor(Math.random() * 10000000),
      "message": {
        "seqAck": 0,
        "reliableCommands": [],
        "commands": [
          {
            "type": 100,
            "connectRequest": {}
          }
        ]
      }
    });
    var byteBuffer = myMessage.encode();
    var buffer = byteBuffer.toArrayBuffer();

    game.initialize(); 

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