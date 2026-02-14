(function () {
    const app = document.querySelector('.app');
    const app = document.querySelector('.app');
    const socket = io();

    let uname;

    const selectUserNameField = app.querySelector('#username');
    const selectMessageField = app.querySelector('#message-input');
    const selectJoinButton = app.querySelector('.join-screen #join-user');
    const selectSendButton = app.querySelector('.chat-screen #send-message');


    function joinChat() {
        let username = selectUserNameField.value;
        if (username.length == 0) {
            window.alert("Please enter username");
            return;
        }

        socket.emit('newuser', username);
        uname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');

    }

    function sendMessage() {
        let message = selectMessageField.value;
        if (message.length == 0) {
            return;
        }
        renderMessage('my', {
            username: uname,
            text: message
        });
        socket.emit('chat', {
            username: uname,
            text: message
        });
        selectMessageField.value = '';
    }

    selectUserNameField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            joinChat();
        }
    });

    selectMessageField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.type === 'click') {
            event.preventDefault();
            sendMessage();
        }
    });

    selectJoinButton.addEventListener('click', joinChat);
    selectSendButton.addEventListener('click', sendMessage);

    app.querySelector('.chat-screen #exit-chat').addEventListener('click', function () {
        socket.emit('exituser', uname);
        window.location.href = window.location.href;
    });

    socket.on('update', function (update) {
        renderMessage('update', update);
    });

    socket.on('chat', function (message) {
        renderMessage('other', message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector('.chat-screen .messages');
        if (type == 'my') {
            let el = document.createElement('div');
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `
                <div>
                    <div class='name'>${message.username}</div>
                    <div class='text'>${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == 'other') {
            let el = document.createElement('div');
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `
                <div>
                    <div class='name'>${message.username}</div>
                    <div class='text'>${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == 'update') {
            let el = document.createElement('div');
            el.setAttribute('class', 'update');
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();