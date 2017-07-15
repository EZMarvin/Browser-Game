var global = require('./clientConfig');

class ChatClient {
    constructor(params) {
        this.canvas = global.canvas;
        this.socket = global.socket;
        this.mobile = global.mobile;
        this.player = global.player;
        var self = this;
        this.commands = {};
        var input = document.getElementById('chatInput');
        input.addEventListener('keypress', this.sendChat.bind(this));
        input.addEventListener('keyup', function(key) {
            input = document.getElementById('chatInput');
            key = key.which || key.keyCode;
            if (key === global.KEY_ESC) {
                input.value = '';
                self.canvas.cv.focus();
            }
        });
        global.chatClient = this;
    }

    // Create chatbox line for user chat
    addChatLine(name, message, me) {
        var newline = document.createElement('li');

        newline.className = (me) ? 'me' : 'friend';
        newline.innerHTML = '<b>' + ((name.length < 1) ? 'Unnamed cell' : name) + '</b>: ' + message;
        this.appendMessage(newline);
    }

    // Create chatbox line for system info
    addSystemLine(message) {
        var newline = document.createElement('li');
        
        newline.className = 'system';
        newline.innerHTML = message;
        this.appendMessage(newline);
    }  

    // Append the message line to chatbox
    appendMessage(node) {
        var chatList = document.getElementById('chatList');
        if (chatList.childNodes.length > 10) {
            chatList.removeChild(chatList.childNodes[0]);
        }
        chatList.appendChild(node);
    }

    // Send chat to all active users
    sendChat(key) {
        var commands = this.commands,
            input = document.getElementById('chatInput');
        
        key = key.which || key.keyCode;

        if (key === global.KEY_ENTER) {
            console.log("input text :", input.value);
            var text = input.value.replace(/(<([^>]+)>)/ig, '');
            if (text !== '') {

                // TODO: add system command
                
                this.socket.emit('playerChat', { sender: this.player.name, message: text});
                this.addChatLine(this.player.name, text, true);
            }
            // Reset input
            input.value = '';
            this.canvas.cv.focus();
        }
    }

    printHelp() {
        var commands = this.commands;
        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                this.addSystemLine('-' + cmd + ': ' + commands[cmd].description);
            }
        }
    }

    registerFunctions() {
        // TO DO : command function
    }
}

module.exports = ChatClient;