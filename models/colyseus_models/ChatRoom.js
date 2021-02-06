const colyseus = require('colyseus');
const ChatState = require('./ChatState');
const ChatUser = require('./ChatUsers');

class ChatRoom extends colyseus.Room {
    // When room is initialized

    onCreate (options) {
        this.setState(new ChatState());
        this.connectedSessions = {};

        this.onMessage("message", (client, message) => {
            let messageBody = {};
            messageBody.value = message;
            messageBody.name = this.state.chatUsers.get(client.sessionId).name;
            this.broadcast("messages", messageBody, {except: client });
        });
    }

    onAuth (client, options, request) {
        console.log(request.sessionID);
        return true;
    }

    // When client successfully join the room
    onJoin (client, options, auth) {
        this.state.chatUsers.set(client.sessionId, new ChatUser(options.name));
        const name = this.state.chatUsers.get(client.sessionId).name;
        const value = 'Joined!';
        const messageBody = {name, value};
        this.broadcast("joined-or-left", messageBody, {except: client });
    }

    // When a client leaves the room
    onLeave (client, consented) {
        const name = this.state.chatUsers.get(client.sessionId).name;
        const value = 'Left!';
        const messageBody = {name, value};
        this.broadcast("joined-or-left", messageBody, {except: client});
        this.state.chatUsers.delete(client.sessionId);
    }

    onDispose () { }
}

module.exports = ChatRoom;