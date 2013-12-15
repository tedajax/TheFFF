var MessageHandler = (function () {
    function MessageHandler() {
    }
    MessageHandler.prototype.parseMessage = function (msg) {
        this.parseCommands(msg.commands);
        this.parseReliableCommands(msg.reliableCommands);
    };

    MessageHandler.prototype.parseCommands = function (commands) {
        for (var i = 0; i < commands.length; ++i) {
            this.parseCommand(commands[i]);
        }
    };

    MessageHandler.prototype.parseReliableCommands = function (commands) {
        for (var i = 0; i < commands.length; ++i) {
            this.parseCommand(commands[i].command);
        }
    };

    MessageHandler.prototype.parseCommand = function (command) {
        switch (command.type) {
            case 100:
                console.log("wut");
                break;

            case 101:
                game.localPlayerId = command.connectResponse.playerId;
                break;

            case 102:
                console.log("ErROROROROROR");
                break;

            case 103:
                console.log("closed");
                break;

            case 104:
                this.parseStateSync(command.stateSync);
        }
    };

    MessageHandler.prototype.parseStateSync = function (sync) {
        var id = sync.networkId;

        if (sync.ownedState != null) {
            if (sync.ownedState.playerId == game.localPlayerId) {
                game.localEntityId = id;
            }
        }

        if (game.gameObjects.gameObjects[id] == null) {
            var go = game.gameObjects.add(new GameObject("mageIdle00"), id);
            go.sprite.alpha = true;
            var netController = new NetworkPlayerController(go);
        } else {
            var controller = game.gameObjects.gameObjects[id].controller;
            controller.handleStateSync(sync);
        }
    };
    return MessageHandler;
})();
//# sourceMappingURL=messagehandler.js.map
