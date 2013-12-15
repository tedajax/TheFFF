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
        console.log(msg);
    };

    Connection.prototype.sendMessage = function (msg) {
        if (!this.connected) {
            this.msgQueue.push(msg);
            return;
        }

        console.log("sending - " + this.msgQueue[0]);
        this.socket.send(this.msgQueue[0]);
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
