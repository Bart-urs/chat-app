const sendButton = document.getElementById('send-button');
const messageBox = document.getElementById('message-box');
const messageList = document.getElementById('message-list');
const emojiPicker = document.getElementById('emoji-picker');
const emojiButton = document.getElementById('emoji-button');
const emojiModal = document.getElementById('emoji-modal');

// Lista emoji do wyboru
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'];

// Wypełnij emojiPicker naszymi emoji
emojis.forEach(emoji => {
    let emojiButton = document.createElement('button');
    emojiButton.textContent = emoji;
    emojiButton.addEventListener('click', function() {
        messageBox.value += this.textContent;
        emojiModal.style.display = 'none'; // Ukryj modal po wybraniu emoji
    });
    emojiPicker.appendChild(emojiButton);
});

// Pokaż/ukryj emojiPicker po kliknięciu przycisku emoji
emojiButton.addEventListener('click', function() {
    emojiModal.style.display = emojiModal.style.display === 'none' ? 'block' : 'none';
});

sendButton.addEventListener('click', () => {
    let newMessage = document.createElement('p');
    newMessage.textContent = messageBox.value;
    messageList.appendChild(newMessage);

    messageBox.value = '';
});

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Tutaj powinna nastąpić rzeczywista autentykacja
    // Na razie załóżmy, że jest poprawna
    currentUser = username;
    console.log(`Logged in as ${username}`);
});

messageBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendButton.click();
    }
});



document.getElementById('send-button').addEventListener('click', () => {
    let newMessage = document.createElement('div');
    let userName = document.createElement('p');
    let timestamp = document.createElement('p');
    let messageText = document.createElement('p');

    let date = new Date();
    timestamp.textContent = date.toLocaleString();

    setTimeout(function() {
        messageList.scrollTop = messageList.scrollHeight;
    }, 200);

    userName.textContent = currentUser;

    newMessage.appendChild(userName);
    newMessage.appendChild(timestamp);
    newMessage.appendChild(messageText);

    messageText.textContent = messageBox.value;
    messageList.appendChild(newMessage);

    messageBox.value = '';
});