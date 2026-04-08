const guildID = "1491434145740755064";
const container = document.getElementById("discord-widget");

container.innerHTML = `
<div class="discord-card">
  <div class="discord-header">
    <div class="online-dot"></div>
    <span id="server-name">Loading...</span>
  </div>

  <div class="discord-body">
    <div class="online-number" id="online-count">0</div>
    <div class="online-text">members online</div>
  </div>

  <a id="join-btn" class="join-btn" target="_blank">Join Server</a>
</div>
`;

const style = document.createElement("style");
style.innerHTML = `
.discord-card{
  width:260px;
  padding:20px;
  border-radius:16px;
  background:#1e1f22;
  color:white;
  font-family:sans-serif;
  text-align:center;
  box-shadow:0 0 20px rgba(88,101,242,0.6);
  transition:0.3s;
}

.discord-card:hover{
  box-shadow:0 0 35px rgba(88,101,242,0.9);
}

.discord-header{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin-bottom:15px;
  font-weight:bold;
}

.online-dot{
  width:10px;
  height:10px;
  background:#23a55a;
  border-radius:50%;
  box-shadow:0 0 8px #23a55a;
}

.online-number{
  font-size:40px;
  font-weight:bold;
  color:#5865F2;
  text-shadow:0 0 10px rgba(88,101,242,0.9);
}

.online-text{
  opacity:0.8;
  margin-bottom:15px;
}

.join-btn{
  display:inline-block;
  padding:10px 18px;
  border-radius:8px;
  background:#5865F2;
  color:white;
  text-decoration:none;
  font-weight:bold;
  transition:0.2s;
}

.join-btn:hover{
  background:#6d78ff;
}
`;
document.head.appendChild(style);


function animateNumber(el, start, end, duration){
  let startTime = null;

  function step(timestamp){
    if(!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    el.textContent = Math.floor(progress * (end - start) + start);

    if(progress < 1){
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

let currentOnline = 0;

async function updateDiscord(){
  try{
    const res = await fetch(`https://discord.com/api/guilds/${guildID}/widget.json`);
    const data = await res.json();

    document.getElementById("server-name").textContent = data.name;

    const newOnline = data.presence_count;

    animateNumber(
      document.getElementById("online-count"),
      currentOnline,
      newOnline,
      800
    );

    currentOnline = newOnline;

    if(data.instant_invite){
      document.getElementById("join-btn").href = data.instant_invite;
    }

  }catch(e){
    console.error("Discord widget error", e);
  }
}

updateDiscord();
setInterval(updateDiscord, 20000);