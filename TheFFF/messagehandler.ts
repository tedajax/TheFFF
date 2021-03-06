class MessageHandler {
    hasLogged: boolean;
    constructor() {
    }

    parseMessage(msg: any) {
        this.parseCommands(msg.commands);
        this.parseReliableCommands(msg.reliableCommands);
    }

    parseCommands(commands: any[]) {
        for (var i = 0; i < commands.length; ++i) {
            this.parseCommand(commands[i]);
        }
    }

    parseReliableCommands(commands: any[]) {
        for (var i = 0; i < commands.length; ++i) {
            this.parseCommand(commands[i].command);
        }
    }

    parseCommand(command: any) {
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
                break; 

            case 105:
                this.destroyEntity(command.entityDestroy);
                break;
        }
    }

    parseStateSync(sync: any) {
        var id = sync.networkId;
        
        if (sync.ownedState != null) {
            if (sync.ownedState.playerId == game.localPlayerId) {
                game.localEntityId = id;

                if (game.gameObjects.gameObjects[id] == null) {
                    var go = game.gameObjects.add(new GameObject("mage", ["idle", "walk", "attack"]), id);
                    go.animations.play("idle", true);
                    go.sprite.alpha = true;
                    var netController = new NetworkPlayerController(go);
                } else {
                    var controller = game.gameObjects.gameObjects[id].controller;
                    controller.handleStateSync(sync);
                }
            }
        }

        
    }

    destroyEntity(destroy: any) {
        var id = destroy.networkId;
        game.gameObjects.gameObjects[id] = null;
    }
} 