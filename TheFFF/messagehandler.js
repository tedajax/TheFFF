var MessageHandler = (function () {
    function MessageHandler(connection) {
        this.connection = connection;
        this.highSeqAck = 0;

        this.Protobuf = dcodeIO.ProtoBuf;
        this.builder = this.Protobuf.loadProtoFile("proto/core.proto");
        this.clientMessageRoot = this.builder.build("ClientMessage");
        this.messageRoot = this.builder.build("Message");
    }
    MessageHandler.prototype.onMessage = function (msg) {
    };
    return MessageHandler;
})();
//# sourceMappingURL=messagehandler.js.map
