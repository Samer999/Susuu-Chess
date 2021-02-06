const schema = require('@colyseus/schema');
const ChatUser = require('./ChatUsers');

class ChatState extends schema.Schema {
    constructor() {
        super();
        this.chatUsers = new schema.MapSchema();
    }
}
schema.defineTypes(ChatState, {
    chatUsers: { map: ChatUser }
});


module.exports = ChatState;