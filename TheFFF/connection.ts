declare var ProtoBuf;

class Connection {
    socket: WebSocket;
    url: string;
    connected: boolean;
    msgQueue: Object[];

    token: number;
    highSeqAck: number;
    Protobuf: any;
    builder: any;
    messageRoot: any;

    constructor(url) {
        this.url = url;
        this.connected = false;
        this.msgQueue = [];

        this.token = Math.floor(Math.random() * 1000000) + 1;
        this.highSeqAck = 0;

        this.Protobuf = dcodeIO.ProtoBuf;
        this.builder = this.Protobuf.loadProtoFile("proto/core.proto");
        this.messageRoot = this.builder.build();
    }

    connect() {
        if (this.connected) {
            return;
        }

        try {
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = "arraybuffer";
        } catch (exception) {
            console.log(exception);
        }
        this.socket.onopen = () => this.onOpen();
        this.socket.onmessage = (msg) => this.onMessage(msg);
        this.socket.onclose = () => this.onClose();
    }

    onOpen() {
        console.log("connection to " + this.url + " succesful");
        this.connected = true;

        this.flushQueue();
    }

    onMessage(msg: MessageEvent) {
        var data = this.messageRoot.decode(msg.data);
        var seqAck = data["seqAck"];
        if (seqAck > this.highSeqAck) {
            this.highSeqAck = seqAck;
        }
    }

    sendCommands(commands: any[]) {
        var msg = {
            "token": this.token,
            "message": {
                "seqAck": 0,
                "reliableCommands": [],
                "commands": commands
            }
        };

        console.log(msg);
        var message = this.messageRoot.ClientMessage(msg);
        
        this.sendMessage(message.encode().toArrayBuffer());
    }

    sendMessage(msg: Object) {
        if (!this.connected) {
            this.msgQueue.push(msg);
            return;
        }

        console.log("sending - " + msg);
        this.socket.send(msg);
    }

    flushQueue() {
        if (!this.connected) {
            return;
        }

        while (this.msgQueue.length > 0) {
            this.sendMessage(this.msgQueue[0]);
            this.msgQueue.shift();
        }
    }

    onClose() {
        console.log("closing connection to " + this.url);
    }
} 