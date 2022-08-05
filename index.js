// Importing

// Firebase - Store and get messages from the database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

// Utility Functions

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

let $ = (tag) => document.querySelector(tag);

// Firebase Configuration
const firebaseConfig = {
apiKey: "AIzaSyCjweAPXjo0FCn3K6w2faBUifYKknQtAM8",
authDomain: "chatvaa.firebaseapp.com",
projectId: "chatvaa",
storageBucket: "chatvaa.appspot.com",
messagingSenderId: "251440542274",
appId: "1:251440542274:web:b1e3b335a548a329cbb3db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Chatvaa-related functions
function sendMessage() {
    let message = $("#messageToSend").value;
    let name = username;
    let time = `${addZero(date.getUTCHours())}:${addZero(date.getUTCMinutes())}`;

    const id = push(child(ref(db), 'messages')).key;

    set(ref(db, 'messages/' + id), {
        name: name,
        time: time,
        message: message
    });
    $("#messageToSend").value = "";
    return false;
}

// Let them enter a username
let username = prompt("Create a username", "Joe");

// Date
let date = new Date();

// Listen for the user to click the submit button
$("#sendMessage").addEventListener("click", (e) => {
    if ($("#messageToSend").value != "") {
        sendMessage();
    };
});

const newMsg = ref(db, "messages/");
onChildAdded(newMsg, (data) => {
    if (data.val().name != username) {
        let fullMessage = [data.val().name, data.val().time, data.val().message];
        $(".messages").innerHTML += `<div class="message-wrapper"><p class="left msg-name-l">${fullMessage[0]} - ${fullMessage[1]}</p><div id="${data.key}" class="message msg-left">${fullMessage[2]}</div></div>`;
    } else {
        let fullMessage = [data.val().name, data.val().time, data.val().message];
        $(".messages").innerHTML += `<div class="message-wrapper"><p class="msg-name-r">${fullMessage[0]} - ${fullMessage[1]}</p><div id="${data.key}" class="message msg-right">${fullMessage[2]}</div></div>`;
    }
});

onChildRemoved(newMsg, (data) => {
    $(`#${data.key}`).parentNode.removeChild($(`#${data.key}`))
})