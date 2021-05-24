var chatDiv = document.getElementById("chat-box");

rtc.onChatMessage = function(message) {
  console.log(message)
  var newChat = document.createElement('div');
  newChat.className = 'container'
  newChat.innerHTML = `<p>${ message.payload }</p><span class="time-right">${ Date().toLocaleString() }</span>`
  chatDiv.appendChild(newChat)
}
