function connectToChat(clientName) {
  const host = window.document.location.host.replace(/:.*/, '');
  const client = new Colyseus.Client(
      location.protocol.replace("http", "ws") + "//" + host + (location.port
      ? ':' + location.port : ''));
  client.joinOrCreate("chat", {name: clientName}).then(room => {
    console.log("joined");
    room.onStateChange.once(function (state) {
      console.log("initial room state:", state);
    });

    // new room state
    room.onStateChange(function (state) {
      console.log(state);
    });

    // listen to patches coming from the server
    room.onMessage("messages", function (message) {
      const messageBody =
          '<li class="in"> ' +
          '   <div class="chat-body">' +
          '       <div class="chat-message">' +
          '           <h5>' + message.name + ' </h5>' +
          '           <p>' + message.value + '</p>' +
          '       </div>' +
          '   </div>' +
          '</li>';
      document.querySelector(".chat-list").innerHTML += messageBody;
    });

    room.onMessage("joined-or-left", function (message) {
      const messageBody =
          '<li> ' +
          '   <div class="chat-body">' +
          '       <div class="chat-message">' +
          '           <h5>' + message.name + ' </h5>' +
          '           <p>' + message.value + '</p>' +
          '       </div>' +
          '   </div>' +
          '</li>';
      document.querySelector(".chat-list").innerHTML += messageBody;
    });

    // send message to room on submit
    document.querySelector("form").onsubmit = function (e) {
      e.preventDefault();
      var messageToSend = document.querySelector("#messageToSend");
      let messageBody =
          '<li class="out"> ' +
          '   <div class="chat-body">' +
          '       <div class="chat-message">' +
          '           <h5> you </h5>' +
          '           <p>' + messageToSend.value + '</p>' +
          '       </div>' +
          '   </div>' +
          '</li>';
      document.querySelector(".chat-list").innerHTML += messageBody;

      // send data to room
      room.send("message", messageToSend.value);

      // clear messageToSend
      messageToSend.value = "";
    }
  });
}