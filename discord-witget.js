document.addEventListener("DOMContentLoaded", () => {

const guildID = "1491434145740755064";
const container = document.getElementById("discord-widget");

container.innerHTML = `
<div class="dc-widget">

  <div class="dc-glow"></div>

  <div class="dc-icon">
    <img id="server-icon">
  </div>

  <div class="dc-online">
      <span id="online-count">0</span>
      <div class="dc-label">ONLINE</div>
  </div>

  <a id="join-btn" class="dc-join" target="_blank">
      Join Server
  </a>

</div>
`;

const style = document.createElement("style");
style.innerHTML = `

.dc-widget{
    width:280px;
    padding:30px;
    border-radius:18px;
    background:#111214;
    position:relative;
    overflow:hidden;
    font-family:Arial;
    text-align:center;
    color:white;
}

/* animated aura */

.dc-glow{
    position:absolute;
    width:300%;
    height:300%;
    background:radial-gradient(circle,#5865F2 0%,transparent 60%);
    opacity:0.25;
    top:-100%;
    left:-100%;
    animation:spinGlow 8s linear infinite;
}

@keyframes spinGlow{
    from{transform:rotate(0deg)}
    to{transform:rotate(360deg)}
}

/* server icon */

.dc-icon img{
    width:72px;
    height:72px;
    border-radius:50%;
    margin-bottom:15px;
    box-shadow:0 0 20px rgba(88,101,242,0.9);
}

/* online counter */

.dc-online span{
    font-size:48px;
    font-weight:800;
    color:#5865F2;
    text-shadow:0 0 20px #5865F2;
}

.dc-label{
    font-size:13px;
    opacity:0.7;
    letter-spacing:2px;
}

/* join button */

.dc-join{
    margin-top:18px;
    display:inline-block;
    padding:10px 20px;
    border-radius:8px;
    background:#5865F2;
    color:white;
    font-weight:bold;
    text-decoration:none;
    transition:0.25s;
}

.dc-join:hover{
    background:#6f7bff;
    box-shadow:0 0 18px #5865F2;
}

`;
document.head.appendChild(style);


function animateNumber(el,start,end,duration){

let startTime=null;

function step(t){

if(!startTime) startTime=t;

const progress=Math.min((t-startTime)/duration,1);

el.textContent=Math.floor(progress*(end-start)+start);

if(progress<1) requestAnimationFrame(step);

}

requestAnimationFrame(step);

}


let currentOnline=0;

async function updateDiscord(){

try{

const res = await fetch(
`https://discord.com/api/guilds/${guildID}/widget.json`
);

const data = await res.json();

const newOnline=data.presence_count;

animateNumber(
document.getElementById("online-count"),
currentOnline,
newOnline,
900
);

currentOnline=newOnline;

if(data.instant_invite){
document.getElementById("join-btn").href=data.instant_invite;
}

/* icon fetch */

const guildRes=await fetch(
`https://discord.com/api/v10/guilds/${guildID}`
);

const guild=await guildRes.json();

if(guild.icon){
document.getElementById("server-icon").src=
`https://cdn.discordapp.com/icons/${guildID}/${guild.icon}.png?size=256`;
}

}catch(e){
console.error("Discord widget error",e);
}

}

updateDiscord();

setInterval(updateDiscord,15000);

});