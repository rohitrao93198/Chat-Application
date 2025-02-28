document.addEventListener("DOMContentLoaded", loadChat);

let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
let usersData = JSON.parse(localStorage.getItem("usersData")) || [];
let chatWith = "";

function loadChat() {
    if (!currentUser) {
        return window.location.href = "login.html";
    }

    document.getElementById("userName").textContent = currentUser.name;

    let userList = document.getElementById("userList");
    userList.innerHTML = "";


    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile !== currentUser.mobile) {
            let li = document.createElement("li");
            li.textContent = usersData[i].name + " - " + usersData[i].mobile;
            li.onclick = function () {
                selectUser(usersData[i]);
            };
            userList.appendChild(li);
        }
    }


    if (!chatWith) {
        document.getElementById("chat").style.display = "none";
        document.getElementById("noUserMessage").style.display = "block";
    } else {
        document.getElementById("chat").style.display = "block";
        document.getElementById("noUserMessage").style.display = "none";
    }

    document.getElementById("message").addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}

function selectUser(user) {
    chatWith = user;
    document.getElementById("chatWith").textContent = user.name;
    loadMessages();

    // Show chat container when a user is selected
    document.getElementById("chat").style.display = "block";
    document.getElementById("noUserMessage").style.display = "none";
}

function loadMessages() {
    usersData = JSON.parse(localStorage.getItem("usersData")) || [];
    let currentUserData = null;
    let chatWithData = null;

    // Find the current user and the chat partner using a loop
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile === currentUser.mobile) {
            currentUserData = usersData[i];
        }
        if (usersData[i].mobile === chatWith.mobile) {
            chatWithData = usersData[i];
        }
    }

    if (!currentUserData || !chatWithData) return;

    let messages = currentUserData.chats[chatWith.mobile] || [];
    let messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {
        let div = document.createElement("div");
        div.className = messages[i].sender === currentUser.name ? "sent" : "received";
        div.innerHTML = messages[i].text +
            ` <small class="time" style="margin-left:8px; color:gray;">${messages[i].time}</small>`;
        messagesDiv.appendChild(div);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
}

function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();

    if (!message) return alert("Message cannot be empty.");
    if (!chatWith) return alert("Please select a user to chat with.");

    let currentUserData = null;
    let chatWithData = null;

    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile === currentUser.mobile) {
            currentUserData = usersData[i];
        }
        if (usersData[i].mobile === chatWith.mobile) {
            chatWithData = usersData[i];
        }
    }

    if (!currentUserData || !chatWithData) {
        alert("Error loading chat data.");
        return;
    }

    let currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let newMessage = {
        sender: currentUser.name,
        text: message,
        time: currentTime
    };

    // Ensure chat arrays exist before pushing messages
    if (!currentUserData.chats[chatWith.mobile]) {
        currentUserData.chats[chatWith.mobile] = [];
    }
    if (!chatWithData.chats[currentUser.mobile]) {
        chatWithData.chats[currentUser.mobile] = [];
    }

    // Add message to both users' chat histories
    currentUserData.chats[chatWith.mobile].push(newMessage);
    chatWithData.chats[currentUser.mobile].push(newMessage);

    localStorage.setItem("usersData", JSON.stringify(usersData));

    messageInput.value = "";
    loadMessages();
}

function clearChat() {
    usersData = JSON.parse(localStorage.getItem("usersData")) || [];
    let currentUserData = null;

    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile === currentUser.mobile) {
            currentUserData = usersData[i];
        }
    }

    if (!currentUserData) return;

    currentUserData.chats[chatWith.mobile] = [];
    localStorage.setItem("usersData", JSON.stringify(usersData));
    loadMessages();
}


function removeAllData() {
    let usersData = JSON.parse(localStorage.getItem("usersData")) || [];

    let updatedUsersData = [];
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].mobile !== currentUser.mobile) {
            updatedUsersData.push(usersData[i]);
        }
    }

    localStorage.setItem("usersData", JSON.stringify(updatedUsersData));

    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

setInterval(() => {
    if (chatWith) {
        loadMessages();
    }
}, 1000);





