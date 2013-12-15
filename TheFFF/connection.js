var Connection = (function () {
    function Connection(url) {
        this.url = url;
        this.connected = false;
        this.msgQueue = [];
    }
    Connection.prototype.connect = function () {
        var _this = this;
        if (this.connected) {
            return;
        }

        try  {
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = "arraybuffer";
        } catch (exception) {
            console.log(exception);
        }
        this.socket.onopen = function () {
            return _this.onOpen();
        };
        this.socket.onmessage = function (msg) {
            return _this.onMessage(msg);
        };
        this.socket.onclose = function () {
            return _this.onClose();
        };
    };

    Connection.prototype.onOpen = function () {
        console.log("connection to " + this.url + " succesful");
        this.connected = true;

        this.flushQueue();
    };

    Connection.prototype.onMessage = function (msg) {
        var Protobuf = dcodeIO.ProtoBuf;
        var builder = Protobuf.loadProtoFile("proto/core.proto");
        var root = builder.build("Message");
        //console.log(root.decode(msg.data));
    };

    Connection.prototype.sendMessage = function (msg) {
        if (!this.connected) {
            this.msgQueue.push(msg);
            return;
        }

        console.log("sending - " + msg);
        this.socket.send(msg);
    };

    Connection.prototype.flushQueue = function () {
        if (!this.connected) {
            return;
        }

        while (this.msgQueue.length > 0) {
            this.sendMessage(this.msgQueue[0]);
            this.msgQueue = this.msgQueue.slice(1);
        }
    };

    Connection.prototype.onClose = function () {
        console.log("closing connection to " + this.url);
    };
    return Connection;
})();
//# sourceMappingURL=connection.js.map
