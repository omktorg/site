// chat.js - Chat room module

// Gossip network variables
let net = null;                 // GossipsubNetwork instance
let gossipTopic = null;         // Current room topic
const GOSSIP_NS = "gossip";     // Namespace for gossip signals

// Chat state variables
let chatInitialized = false;
let ws = null;
let myId = null;
let currentRoom = null;
const peers = new Map();
const roomMembers = new Set();

// DOM elements
const peerCountEl = document.getElementById("peerCount");
const msgInput = document.getElementById("msg");
const logEl = document.getElementById("log");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

// Append system message
function appendSys(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "system-message";
  const span = document.createElement("span");
  span.textContent = text;
  wrapper.appendChild(span);
  logEl.appendChild(wrapper);
  logEl.scrollTop = logEl.scrollHeight;
}

// Append chat message
function appendMsg(text, fromMe = false, fromId = "") {
  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${fromMe ? "me" : "peer"}`;

  if (!fromMe && fromId) {
    const sender = document.createElement("div");
    sender.className = "text-muted small mb-1";
    sender.textContent = t('user_placeholder', fromId);
    bubble.appendChild(sender);
  }

  const content = document.createElement("div");
  content.textContent = text;
  bubble.appendChild(content);

  const time = document.createElement("div");
  time.className = "text-end small mt-1";
  time.style.opacity = "0.7";
  time.textContent = getCurrentTime();
  bubble.appendChild(time);

  logEl.appendChild(bubble);
  logEl.scrollTop = logEl.scrollHeight;
}

// Set online status
function setOnline(on) {
  statusDot.classList.toggle("online", on);
  statusDot.classList.toggle("offline", !on);
  statusText.textContent = on ? t('status_connected') : t('status_disconnected');
}

// Determine who should initiate connection
function shouldInitiate(remoteId) {
  return String(myId) > String(remoteId);
}

// Update peer count
function updatePeerCount() {
  let connectedCount = 0;
  let ready = false;
  
  if (net) {
    const status = net.getNetworkStatus();
    connectedCount = status.peers.filter(p => p.status === 'connected').length;
    ready = connectedCount > 0;
  }

  peerCountEl.textContent = String(connectedCount);
  msgInput.disabled = !ready;
  document.querySelector('#chatForm button[type="submit"]').disabled = !ready;

  if (connectedCount === 0 && ws && ws.readyState === WebSocket.OPEN) {
    appendSys(t('chat_sys_waiting'));
  }
}

// Attach Gossipsub network
function attachGossip(room) {
  if (net) return;  // Avoid duplicate initialization
  
  net = new GossipsubNetwork({
    nodeId: String(myId),
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  });

  // Listen for Gossipsub connection events
  net.addEventListener('peerconnected', (ev) => {
    updatePeerCount();
  });

  net.addEventListener('peerdisconnected', (ev) => {
    const status = net.getNetworkStatus();
    updatePeerCount();
  });

  // Set signal sender
  net.setSignalSender((to, payload) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: "signal",
      to,
      data: { ns: GOSSIP_NS, payload }
    }));
  });

  // Subscribe to room topic
  gossipTopic = `chat:${room}`;
  net.subscribe(gossipTopic);

  // Handle incoming messages
  net.addEventListener("message", (ev) => {
    const { topic, content, from } = ev.detail;
    if (topic !== gossipTopic) return;
    
    const text = (content && content.text) ? content.text : String(content);
    appendMsg(`[G] ${text}`, false, from);
  });
}

// Connect to signaling server
function connectSignaling(room) {
  const WS_PORT = 8081;
  const isSecure = window.location.protocol === 'https:';
  const wsProtocol = isSecure ? 'wss' : 'ws';
  const wsUrl = `${wsProtocol}://${window.location.hostname}:${WS_PORT}`;

  appendSys(t('chat_sys_connecting_to_server'));

  ws = new WebSocket(wsUrl);
  setOnline(false);

  ws.addEventListener("open", () => {
    setOnline(true);
    appendSys(t('chat_sys_joining_room'));
    ws.send(JSON.stringify({ type: "join", room }));
    document.getElementById("joinBtn").disabled = true;
    document.getElementById("room").disabled = true;
    document.getElementById("leaveBtn").disabled = false;
    currentRoom = room;
  });

  ws.addEventListener("message", (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      console.error("Failed to parse message:", ev.data);
      return;
    }

    if (msg.type === "hello") {
      myId = msg.id;
      return;
    }

    if (msg.type === "joined") {
      myId = msg.id || myId;
      appendSys(t('chat_sys_join_success', msg.room));
      document.getElementById("roomName").textContent = msg.room;
      document.getElementById("roomName").style.display = 'inline-block';

      attachGossip(msg.room);

      roomMembers.clear();
      if (Array.isArray(msg.peers)) {
        for (const id of msg.peers) roomMembers.add(id);
      }

      if (msg.peers && msg.peers.length > 0) {
        for (const id of msg.peers) {
          if (shouldInitiate(id)) net?.dialWithTrickle(id);
        }
      }

      return;
    }

    if (msg.type === "peer-joined") {
      appendSys(t('chat_sys_peer_joined'));
      roomMembers.add(msg.id);
      if (net && shouldInitiate(msg.id)) {
        net.dialWithTrickle(msg.id);
      }
      return;
    }

    if (msg.type === "signal") {
      const from = msg.from;
      if (msg.data && msg.data.ns === GOSSIP_NS) {
        net?.handleSignal(from, msg.data.payload);
      }
      return;
    }

    if (msg.type === "peer-left") {
      try { 
        roomMembers.delete(msg.id);
      } catch { }
      appendSys(t('chat_sys_peer_left'));
      try { 
        if (net && typeof net.disconnectPeer === 'function') {
          net.disconnectPeer(msg.id);
        }
      } catch { }
      updatePeerCount();
      return;
    }
  });

  ws.addEventListener("close", () => {
    setOnline(false);
    appendSys(t('chat_sys_server_disconnected'));
    document.getElementById("joinBtn").disabled = false;
    document.getElementById("room").disabled = false;
    document.getElementById("leaveBtn").disabled = true;
    document.getElementById("roomName").style.display = 'none';

    if (net) {
      net.disconnect();
      net = null;
    }
    gossipTopic = null;

    updatePeerCount();
  });

  ws.addEventListener("error", (err) => {
    appendSys(t('chat_sys_connection_error'));
    console.error("WebSocket error:", err);
  });
}

// Initialize chat room
function initChatRoom() {
  if (chatInitialized) return;
  chatInitialized = true;

  const roomInput = document.getElementById("room");
  const joinBtn = document.getElementById("joinBtn");
  const leaveBtn = document.getElementById("leaveBtn");
  const chatForm = document.getElementById("chatForm");

  // Join button handler
  joinBtn.addEventListener("click", () => {
    const room = roomInput.value.trim() || "lobby";
    connectSignaling(room);
  });

  // Leave button handler
  leaveBtn.addEventListener("click", () => {
    try { ws?.send(JSON.stringify({ type: "leave" })); } catch { }
    try { ws?.close(); } catch { }
  });

  // Chat form submission
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    if (net && gossipTopic) {
      try {
        net.publish(gossipTopic, { text, from: myId });
        appendMsg(text, true);
        msgInput.value = "";
      } catch (err) {
        console.error("Failed to send via Gossipsub:", err);
        appendSys(t('chat_sys_send_failed_gossip'));
      }
    } else {
      appendSys(t('chat_sys_send_failed_network'));
    }
  });

  // Enter key handling
  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event("submit"));
    }
  });

  // Auto-join from URL parameter
  try {
    const params = new URLSearchParams(window.location.search);
    const autoRoom = params.get('room');
    if (autoRoom) {
      roomInput.value = autoRoom;
      appendSys(t('chat_sys_auto_join_url', autoRoom));
      connectSignaling(autoRoom);
    }
  } catch (e) {
    console.error('auto-join failed:', e);
  }
}

// Initialize chat when tab is shown
document.getElementById('chatroom-tab').addEventListener('shown.bs.tab', function() {
  if (!chatInitialized) {
    initChatRoom();
  }
});