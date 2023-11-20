const sendButton = document.getElementById('send-button');
const messageBox = document.getElementById('message-box');
const messageList = document.getElementById('message-list');
const emojiPicker = document.getElementById('emoji-picker');
const emojiButton = document.getElementById('emoji-button');
const emojiModal = document.getElementById('emoji-modal');
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'];
let messageCount = 0;

emojis.forEach(emoji => {
    let emojiButton = document.createElement('button');
    emojiButton.textContent = emoji;
    emojiButton.style.border = 'none';
    emojiButton.addEventListener('click', function() {
        if (currentUser) {
            messageBox.value += this.textContent;
            emojiModal.style.display = 'none';
        } else {
            alert('Musisz się zalogować, aby używać emoji!');
        }
    });
    emojiPicker.appendChild(emojiButton);
});

window.addEventListener('click', function(event) {
    if (event.target == emojiModal) {
        emojiModal.style.display = 'none';
    }
});

emojiButton.addEventListener('click', function() {
    emojiModal.style.display = emojiModal.style.display === 'none' ? 'block' : 'none';
});

const thumbnailContainer = document.createElement('div');
const inputContainer = document.getElementById('input-container');

function showThumbnail(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
        while (thumbnailContainer.firstChild) {
            thumbnailContainer.removeChild(thumbnailContainer.firstChild);
        }

        const img = document.createElement('img');
        img.src = reader.result;
        img.style.width = '100px';
        img.style.height = 'auto';
        thumbnailContainer.appendChild(img);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.addEventListener('click', () => {
            while (thumbnailContainer.firstChild) {
                thumbnailContainer.removeChild(thumbnailContainer.firstChild);
            }
            mediaFile.value = '';
        });
        thumbnailContainer.appendChild(removeButton);

        inputContainer.appendChild(thumbnailContainer);
    };
    reader.readAsDataURL(file);
}

function sendMessage() {
    let messageContent = messageBox.value.trim();
    const mediaFile = document.querySelector('#mediaFile');
    const file = mediaFile.files[0];
    if(currentUser && (messageContent !== '' || file)) {
        let newMessage = document.createElement('div');
        newMessage.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        newMessage.style.display = 'flex';
        newMessage.style.justifyContent = 'space-between';
        newMessage.style.flexDirection = 'column';
        newMessage.style.width = '100%';

        let messageContentContainer = document.createElement('div');
        messageContentContainer.style.display = 'flex';
        messageContentContainer.style.flexDirection = 'column';

        let messageHeader = document.createElement('div');
        messageHeader.style.display = 'flex';
        messageHeader.style.justifyContent = 'space-between';

        let userName = document.createElement('p');
        userName.innerHTML = `<strong>${currentUser}</strong>`;
        messageHeader.appendChild(userName);

        let timestamp = document.createElement('p');
        let date = new Date();
        timestamp.textContent = date.toLocaleString();
        messageHeader.appendChild(timestamp);

        messageContentContainer.appendChild(messageHeader);

        let messageText = document.createElement('p');
        messageText.textContent = messageContent;
        messageContentContainer.appendChild(messageText);

        newMessage.appendChild(messageContentContainer);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Usuń wiadomość';

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.style.width = '100%';
                img.style.height = 'auto';
                newMessage.appendChild(img);
                newMessage.appendChild(deleteButton);
                mediaFile.value = '';

                while (thumbnailContainer.firstChild) {
                    thumbnailContainer.removeChild(thumbnailContainer.firstChild);
                }
                messageBox.style.paddingRight = '';
            };
            reader.readAsDataURL(file);
        } else {
            newMessage.appendChild(deleteButton);
        }

        messageList.appendChild(newMessage);
        messageBox.value = '';

        deleteButton.addEventListener('click', function() {
            newMessage.textContent = 'Wiadomość została usunięta';
            newMessage.classList.add('deleted-message');
        });

        setTimeout(() => {
            messageList.scrollTop = messageList.scrollHeight;
        }, 0);
    } else {
        alert('Musisz się zalogować i wpisać wiadomość, aby wysłać wiadomość!');
    }
}

sendButton.addEventListener('click', sendMessage);

messageBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

let currentUser = null;

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('register-username');
    let password = document.getElementById('register-password');

    // Check if username already exists
    if (localStorage.getItem(username.value)) {
        alert('Username already exists!');
        return;
    }

    // Store username and password in local storage
    localStorage.setItem(username.value, password.value);

    alert('Registration successful!');
    username.value = '';
    password.value = '';
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    // Check if username exists
    if (!localStorage.getItem(username.value)) {
        alert('Username does not exist!');
        return;
    }

    // Check if password matches
    if (localStorage.getItem(username.value) !== password.value) {
        alert('Incorrect password!');
        return;
    }

    currentUser = username.value;
    messageBox.disabled = false;
    onLogin(username.value);
    username.value = '';
    password.value = '';
});

messageBox.disabled = true;

document.querySelector('#mediaFile').addEventListener('change', (e) => {
    if (!currentUser) {
        alert('Musisz się zalogować, aby dodać obrazek!');
        e.target.value = '';
        return;
    }
    const file = e.target.files[0];
    if (file) {
        showThumbnail(file);
    }
});

function onLogin(username) {
    // Usuń pola input
    var loginForm = document.getElementById('login-form');
    while (loginForm.firstChild) {
        loginForm.removeChild(loginForm.firstChild);
    }

    // Dodaj nowy tekst
    var text = document.createElement('p');
    text.textContent = 'Jesteś zalogowany jako: ' + username;
    loginForm.appendChild(text);

    // Dodaj przycisk wyloguj
    var logoutButton = document.createElement('button');
    logoutButton.textContent = 'Wyloguj się';
    logoutButton.addEventListener('click', onLogout);

    // Dodaj klasę do przycisku
    logoutButton.className = 'logout-button';

    loginForm.appendChild(logoutButton);

    // Włącz możliwość pisania wiadomości, dodawania emotikonów i obrazków
    messageBox.disabled = false;
    emojiButton.disabled = false;
    document.querySelector('#mediaFile').disabled = false;
}

function onLogout() {
    // Usuń tekst i przycisk
    var loginForm = document.getElementById('login-form');
    while (loginForm.firstChild) {
        loginForm.removeChild(loginForm.firstChild);
    }

    // Dodaj pola input dla loginu i hasła
    var usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username';
    loginForm.appendChild(usernameInput);

    var passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';
    loginForm.appendChild(passwordInput);

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Login';
    loginForm.appendChild(submitButton);

    // Wyłącz możliwość pisania wiadomości, dodawania emotikonów i obrazków
    messageBox.disabled = true;
    emojiButton.disabled = true;
    document.querySelector('#mediaFile').disabled = true;

    // Wyloguj użytkownika
    currentUser = null;
}