// **** WEBRTC UI **** //

var video;
var bandwidth;
var conference;
var pin;

var rtc = null;

var chatDiv = document.getElementById('chat-box');
var chatOutput = document.getElementById('chat-output');
var layoutSelect = document.getElementById('layout');


/* ~~~ SETUP AND TEARDOWN ~~~ */

function finalise(event) {
    rtc.disconnect();
    video.src = "";
}

function remoteDisconnect(reason) {
    cleanup();
    alert(reason);
    window.removeEventListener('beforeunload', finalise);
    window.close();
}

function doneSetup(videoURL, pin_status) {
    console.log("PIN status: " + pin_status);
    rtc.connect(pin);
}

function connected(videoURL) {
    video.poster = "";
    if (typeof(MediaStream) !== "undefined" && videoURL instanceof MediaStream) {
        video.srcObject = videoURL;
    } else {
        video.src = videoURL;
    }
}

function initialise(node, conference, userbw, name, userpin) {
    video = document.getElementById("video");
    console.log("Bandwidth: " + userbw);
    console.log("Conference: " + conference);

    pin = userpin;
    bandwidth = parseInt(userbw);

    rtc = new PexRTC();

    window.addEventListener('beforeunload', finalise);

    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = remoteDisconnect;
    rtc.onDisconnect = remoteDisconnect;

    rtc.makeCall(node, conference, name, bandwidth);

    rtc.onChatMessage = function(message) {
      var newChat = document.createElement('div');
      newChat.className = 'container';
      newChat.innerHTML = `<p><b>${ message.origin }:</b> ${ message.payload }</p><span class='time-right'>${ Date().toLocaleString() }</span>`;
      chatDiv.appendChild(newChat);
    };

    chatOutput.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
          var newChat = document.createElement('div');
          newChat.className = 'container outgoing';
          newChat.innerHTML = `<p><b>Me:</b> ${ chatOutput.value }</p><span class='time-left'>${ Date().toLocaleString() }</span>`;
          chatDiv.appendChild(newChat);
          rtc.sendChatMessage(chatOutput.value);
          chatOutput.value = "";
      }
    });

    layoutSelect.addEventListener("change"), function() {
      console.log("change layout here");
    };

}
