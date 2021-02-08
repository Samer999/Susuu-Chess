const schema = require('@colyseus/schema');

class ChatUsers extends schema.Schema {
  constructor(name) {
    super();
    this.name = name;
  }
}

schema.defineTypes(ChatUsers, {
  name: "string"
});

module.exports = ChatUsers;