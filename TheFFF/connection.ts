declare var ProtoBuf;

class Connection {
    socket: WebSocket;
    url: string;
    connected: boolean;
    msgQueue: Object[];

    constructor(url) {
        this.url = url;
        this.connected = false;
        this.msgQueue = [];
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
        var Protobuf = dcodeIO.ProtoBuf;
        var builder = Protobuf.loadProtoFile("proto/core.proto");
        var root = builder.build("Message");
        //console.log(root.decode(msg.data));
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
            this.msgQueue = this.msgQueue.slice(1);
        }
    }

    onClose() {
        console.log("closing connection to " + this.url);
    }
} 