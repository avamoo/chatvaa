// Importing

// Firebase - Store and get messages from the database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, onChildAdded, onChildRemoved, onChildChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

// Utility Functions

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}

let $ = (tag) => document.querySelector(tag);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function rndString(length) {
    let result = '';

    for ( let i = 0; i < length; i++ ) {
        result += chars.charAt(random(0, chars.length - 1));
    }
    return result;
}

function execCode(code) {
    setTimeout(code, 1);
}

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const day = [7, 1, 2, 3, 4, 5, 6];

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
    // Date
    let date = new Date();

    let message = $("#messageToSend").value;
    let name = username;
    let time = `${month[date.getUTCMonth()]} ${day[date.getUTCDay()]}, ${date.getFullYear()} ${addZero(date.getUTCHours())}:${addZero(date.getUTCMinutes())}`;

    const id = push(child(ref(db), 'messages')).key;

    set(ref(db, 'messages/' + id), {
        name: name,
        time: time,
        message: message
    });
    $("#messageToSend").value = "";
}

function openModal(content, script = "") {
    $("#modal").innerHTML = content;
    $("#modal").showModal();
    execCode(script);
}

function openLoginModal() {
    $("#modal").innerHTML = `<h3 class="bold">Create a username</h3>
    <input type="text" id="username" class="input-hidden" placeholder="Enter a username"></input>
    <button id="close" class="btn-dark">Submit</button>
    <style>
        #modal {
            background: #202225;
            color: white;
            padding: 2rem;
            border: none;
        }
    </style>`
    $("#modal > #close").addEventListener('click', () => {
        username = $("#username").value;
        console.log(username);
        closeModal();
    });
    $("#modal").showModal();
}

function closeModal() {
    $("#modal").close();
}

// Let them enter a username
let username;
openLoginModal();

// Notification sound
let notif = new Audio('notification.mp3');

// Listen for the user to click the submit button
$("#sendMessage").addEventListener("click", (e) => {
    if ($("#messageToSend").value != "") {
        sendMessage();
    };
});

const msg = ref(db, "messages/");
onChildAdded(msg, (data) => {
    let fullMessage = [data.val().name, data.val().time, data.val().message];
    if (data.val().name != username) {
        $(".messages").innerHTML += `<div class="message-wrapper"><p class="left msg-name-l">${fullMessage[0]} - ${fullMessage[1]}</p><div id="${data.key}" class="message msg-left">${fullMessage[2]}</div></div>`;
    } else {
        $(".messages").innerHTML += `<div class="message-wrapper"><p class="msg-name-r">${fullMessage[0]} - ${fullMessage[1]}</p><div id="${data.key}" class="message msg-right">${fullMessage[2]}</div></div>`;
    }
    $(`#${data.key}`).scrollIntoView();
    if (document.visibilityState == "hidden") {
        notif.play();
    }
});

onChildRemoved(msg, (data) => {
    $(`#${data.key}`).parentNode.remove();
});

onChildChanged(msg, (data) => {
    $(`#${data.key}`).innerHTML = `${data.val().message}*`;
    $(".message-wrapper:has(> #${data.key}) > p").innerHTML = `${data.val().name} - ${data.val().time}`;
});
