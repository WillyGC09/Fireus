document.addEventListener("DOMContentLoaded", () => {

const guildID = "1491434145740755064";
const container = document.getElementById("discord-widget");

if(!container) return;

container.innerHTML = `
<div class="discord-pro">

<div class="discord-energy"></div>

<div class="discord-counter">
<span id="discord-online">0</span>
</div>

<div class="discord-label">PLAYERS ONLINE</div>

<a id="discord-join" class="discord-btn" target="_blank">
JOIN DISCORD
</a>

</div>
`;

const style = document.createElement("style");
style.innerHTML = `

.discord-pro{
width:320px;
margin:60px auto;
padding:40px;
background:#0f1012;
border-radius:18px;
text-align:center;
color:white;
font-family:Arial;
position:relative;
overflow:hidden;
box-shadow:0 0 40px rgba(88,101,242,0.25);
}

/* animated aura */

.discord-energy{
position:absolute;
width:350%;
height:350%;
top:-120%;
left:-120%;
background:radial-gradient(circle,#5865F2 0%,transparent 60%);
opacity:0.25;
animation:spinAura 9s linear infinite;
}

@keyframes spinAura{
from{transform:rotate(0deg)}
to{transform:rotate(360deg)}
}

/* counter */

.discord-counter span{
font-size:64px;
font-weight:900;
color:#5865F2;
text-shadow:0 0 20px #5865F2;
}

/* label */

.discord-label{
margin-top:6px;
font-size:13px;
letter-spacing:3px;
opacity:0.7;
}

/* button */

.discord-btn{
display:inline-block;
margin-top:25px;
padding:12px 26px;
background:#5865F2;
border-radius:8px;
color:white;
text-decoration:none;
font-weight:bold;
transition:0.25s;
}

.discord-btn:hover{
background:#6f7bff;
box-shadow:0 0 20px #5865F2;
}

`;
document.head.appendChild(style);


function animateNumber(el,start,end,duration){

let startTime=null;

function frame(t){

if(!startTime) startTime=t;

let progress=Math.min((t-startTime)/duration,1);

el.textContent=Math.floor(progress*(end-start)+start);

if(progress<1) requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

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
document.getElementById("discord-online"),
currentOnline,
newOnline,
900
);

currentOnline=newOnline;

if(data.instant_invite){
document.getElementById("discord-join").href=data.instant_invite;
}

}catch(e){
console.warn("Discord widget failed",e);
}

}

updateDiscord();
setInterval(updateDiscord,15000);

});