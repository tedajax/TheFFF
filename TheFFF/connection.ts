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

    onMessage(msg: Object) {
        console.log(msg);
    }

    sendMessage(msg: Object) {
        if (!this.connected) {
            this.msgQueue.push(msg);
            return;
        }

        console.log("sending - " + this.msgQueue[0]);
        this.socket.send(this.msgQueue[0]);
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