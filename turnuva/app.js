
"use strict";
const $=id=>document.getElementById(id);
const KEY="povSwissLiveV1";
const PEER_KEY="povSwissPeerIdV1";
let lang=localStorage.getItem("povLang")||"en";
let state=freshState();
let peer=null, liveClients=new Set(), liveActive=false, livePeerId=null, viewerUrl="";

const I={
en:{
 managerSubtitle:"Swiss Tournament Manager · Partner Draw · Live Scores",liveOff:"Live board off",liveOn:"Live board on",
 tabTeams:"Players & Teams",tabSwiss:"Swiss Tournament",tabStandings:"Standings",tabLive:"Live & QR",
 tournamentSetup:"Tournament setup",tournamentSetupSub:"Set the event format before building teams.",tournamentName:"Tournament name",teamFormat:"Team format",
 singles:"Singles / Tête-à-tête",doubles:"Doubles / Doublettes",triples:"Triples / Triplettes",teamMethod:"Team method",balanced:"Balanced partner draw",random:"Fully random",
 teamNamingNote:"Teams are named after their shooter — for example, “Team Senih”.",playerPools:"Player pools",playerPoolsSub:"Enter shooters and pointers separately. Balanced mode uses the roles when forming teams.",
 shooters:"Shooters / Tireurs",pointers:"Pointers / Pointeurs",add:"Add",noShooters:"No shooters added.",noPointers:"No pointers added.",generatedTeams:"Generated teams",noTeams:"No teams built yet.",
 buildTeams:"Build teams",reshuffle:"Reshuffle",swissSetup:"Swiss setup",swissSetupSub:"Each new round is paired from the current standings while avoiding repeat opponents when possible.",swissRounds:"Swiss rounds",terrains:"Terrains",
 swissRules:"Pairing order: match points → Buchholz → point differential → points scored. A team will not receive a second bye until necessary.",createNextRound:"Create next Swiss round",resetRounds:"Reset rounds",
 teams:"Teams",roundsPlayed:"Rounds created",completedMatches:"Completed matches",liveViewers:"Live viewers",roundsMatches:"Rounds & matches",scoreSub:"Enter scores after each match. The next Swiss round unlocks when all current-round matches are complete.",
 printPdf:"Print / Save PDF",standings:"Swiss standings",standingsSub:"Buchholz is the sum of your opponents’ match points and rewards strength of schedule.",
 playoff:"Playoffs",playoffSub:"Choose a 4, 8, 16 or 32-team Championship bracket, then decide whether to add an equal-size Consolation bracket.",createPlayoffs:"Create playoffs",championshipPlayoff:"Championship Playoff",consolationPlayoff:"Consolation Playoff",championshipOnly:"Championship only",withConsolation:"Championship + Consolation",liveBoard:"Public live scoreboard",
 liveBoardSub:"Spectators scan one QR code and see standings, pairings and scores update on their phones.",publicUrl:"Public website URL",startLive:"Start live board",stopLive:"Stop live board",spectatorLink:"Spectator link",
 copyLink:"Copy link",openBoard:"Open public board",liveRequirement:"Free live mode uses a direct browser-to-browser connection. Keep this organizer page open during the tournament. No spectator account is required.",
 scanQr:"Scan to follow live",scanQrSub:"Once the site is hosted publicly and Live Board is started, this QR opens the spectator scoreboard.",qrWaiting:"Start Live Board to create the QR code.",
 remove:"Remove",shooter:"Shooter",pointer:"Pointer",team:"Team",unassigned:"Unassigned",players:"players",teamsBuilt:"teams built",
 noRounds:"No Swiss rounds have been created yet.",round:"Round",terrain:"Terrain",bye:"BYE",byeWin:"Bye win",matchPts:"Pts",buchholz:"BH",played:"P",wins:"W",losses:"L",ties:"T",pf:"PF",pa:"PA",diff:"Diff",
 noStandings:"Build teams to see standings.",needTeams:"Build at least two teams first.",finishRound:"Finish every match in the current round before creating the next one.",maxRoundsDone:"All configured Swiss rounds have been created.",
 duplicatePlayer:"That player is already registered.",needPlayers:"Add players first.",notEnoughPlayers:"Not enough players for one complete team.",unassignedNote:"Player count does not divide evenly by the selected format.",
 resetConfirm:"Reset all Swiss rounds, scores and playoffs?",playoffWait:"Complete all configured Swiss rounds before creating the playoffs.",playoffNeedTeams:"This setup needs at least {n} total teams: {size} Championship + {size} Consolation.",playoffNeedMainTeams:"This setup needs at least {size} teams for the Championship bracket.",noPlayoff:"No playoff bracket has been created yet.",semifinals:"Semifinals",quarterfinals:"Quarterfinals",roundOf16:"Round of 16",roundOf32:"Round of 32",final:"Final",champion:"Champion",consolationChampion:"Consolation Champion",
 localHostWarn:"You are opening the site as a local file. The tournament manager works, but phone QR sharing requires the folder to be published on a free web host first. Then paste that public URL here.",
 hostedOk:"This page is already hosted publicly. Live QR sharing can use the current site address.",enterPublicUrl:"Enter the public website URL first.",peerUnavailable:"Live connection library could not load. Check your internet connection.",
 liveStarted:"Live board is running. Keep this organizer tab open.",liveStopped:"Live board stopped.",copyDone:"Link copied.",currentRoundComplete:"Current round complete — next Swiss round is ready.",
 noCurrentRound:"Create the first Swiss round when teams are ready.",roundInProgress:"Round in progress. Enter every score to unlock the next pairing.",allRoundsComplete:"Swiss stage complete.",tieAllowed:"Timed games can be entered as ties; both teams receive 0.5 match points."
},
fr:{
 managerSubtitle:"Gestionnaire suisse · Tirage des partenaires · Scores en direct",liveOff:"Tableau en direct fermé",liveOn:"Tableau en direct actif",
 tabTeams:"Joueurs et équipes",tabSwiss:"Tournoi suisse",tabStandings:"Classement",tabLive:"Direct et QR",
 tournamentSetup:"Configuration du tournoi",tournamentSetupSub:"Définissez le format avant de créer les équipes.",tournamentName:"Nom du tournoi",teamFormat:"Format des équipes",
 singles:"Tête-à-tête / Singles",doubles:"Doublettes / Doubles",triples:"Triplettes / Triples",teamMethod:"Méthode d'équipe",balanced:"Tirage équilibré",random:"Entièrement aléatoire",
 teamNamingNote:"Les équipes portent le nom de leur tireur — par exemple « Équipe Senih ».",playerPools:"Listes de joueurs",playerPoolsSub:"Entrez séparément les tireurs et les pointeurs. Le mode équilibré utilise les rôles pour former les équipes.",
 shooters:"Tireurs / Shooters",pointers:"Pointeurs / Pointers",add:"Ajouter",noShooters:"Aucun tireur ajouté.",noPointers:"Aucun pointeur ajouté.",generatedTeams:"Équipes créées",noTeams:"Aucune équipe créée.",
 buildTeams:"Créer les équipes",reshuffle:"Mélanger",swissSetup:"Configuration suisse",swissSetupSub:"Chaque nouvelle ronde est appariée selon le classement actuel tout en évitant les adversaires déjà rencontrés lorsque possible.",swissRounds:"Rondes suisses",terrains:"Terrains",
 swissRules:"Ordre d’appariement : points de match → Buchholz → différentiel → points marqués. Une équipe ne reçoit pas un deuxième bye avant que ce soit nécessaire.",createNextRound:"Créer la prochaine ronde",resetRounds:"Réinitialiser les rondes",
 teams:"Équipes",roundsPlayed:"Rondes créées",completedMatches:"Matchs terminés",liveViewers:"Spectateurs en direct",roundsMatches:"Rondes et matchs",scoreSub:"Entrez les scores après chaque match. La ronde suivante se débloque lorsque tous les matchs sont terminés.",
 printPdf:"Imprimer / PDF",standings:"Classement suisse",standingsSub:"Le Buchholz est la somme des points de match de vos adversaires et récompense la force du parcours.",
 playoff:"Séries éliminatoires",playoffSub:"Choisissez un tableau Championnat de 4, 8, 16 ou 32 équipes, puis décidez si vous ajoutez un tableau Consolation de même taille.",createPlayoffs:"Créer les séries",championshipPlayoff:"Série Championnat",consolationPlayoff:"Série Consolation",championshipOnly:"Championnat seulement",withConsolation:"Championnat + Consolation",liveBoard:"Tableau public en direct",
 liveBoardSub:"Les spectateurs scannent un seul code QR et voient le classement, les appariements et les scores se mettre à jour sur leur téléphone.",publicUrl:"URL publique du site",startLive:"Démarrer le direct",stopLive:"Arrêter le direct",spectatorLink:"Lien spectateur",
 copyLink:"Copier le lien",openBoard:"Ouvrir le tableau",liveRequirement:"Le mode direct gratuit utilise une connexion directe entre navigateurs. Gardez cette page organisateur ouverte pendant le tournoi. Aucun compte spectateur n’est requis.",
 scanQr:"Scanner pour suivre en direct",scanQrSub:"Une fois le site publié et le tableau en direct démarré, ce QR ouvre le tableau des spectateurs.",qrWaiting:"Démarrez le tableau en direct pour créer le code QR.",
 remove:"Retirer",shooter:"Tireur",pointer:"Pointeur",team:"Équipe",unassigned:"Non assignés",players:"joueurs",teamsBuilt:"équipes créées",
 noRounds:"Aucune ronde suisse n’a encore été créée.",round:"Ronde",terrain:"Terrain",bye:"EXEMPT",byeWin:"Victoire par bye",matchPts:"Pts",buchholz:"BH",played:"J",wins:"V",losses:"D",ties:"N",pf:"PM",pa:"PC",diff:"Diff",
 noStandings:"Créez les équipes pour voir le classement.",needTeams:"Créez au moins deux équipes.",finishRound:"Terminez tous les matchs de la ronde actuelle avant de créer la suivante.",maxRoundsDone:"Toutes les rondes suisses configurées ont été créées.",
 duplicatePlayer:"Ce joueur est déjà inscrit.",needPlayers:"Ajoutez d’abord des joueurs.",notEnoughPlayers:"Pas assez de joueurs pour une équipe complète.",unassignedNote:"Le nombre de joueurs n’est pas divisible par le format choisi.",
 resetConfirm:"Réinitialiser toutes les rondes suisses, les scores et les séries ?",playoffWait:"Terminez toutes les rondes suisses configurées avant de créer les séries.",playoffNeedTeams:"Cette configuration exige au moins {n} équipes au total : {size} Championnat + {size} Consolation.",playoffNeedMainTeams:"Cette configuration exige au moins {size} équipes pour le tableau Championnat.",noPlayoff:"Aucun tableau éliminatoire n’a encore été créé.",semifinals:"Demi-finales",quarterfinals:"Quarts de finale",roundOf16:"Huitièmes de finale",roundOf32:"Seizièmes de finale",final:"Finale",champion:"Champion",consolationChampion:"Champion Consolation",
 localHostWarn:"Le site est ouvert comme fichier local. Le gestionnaire fonctionne, mais le partage QR sur téléphone nécessite d’abord de publier le dossier sur un hébergeur web gratuit. Collez ensuite l’URL publique ici.",
 hostedOk:"Cette page est déjà publiée. Le partage QR peut utiliser l’adresse actuelle du site.",enterPublicUrl:"Entrez d’abord l’URL publique du site.",peerUnavailable:"La bibliothèque de connexion en direct n’a pas chargé. Vérifiez votre connexion Internet.",
 liveStarted:"Le tableau en direct fonctionne. Gardez cet onglet organisateur ouvert.",liveStopped:"Tableau en direct arrêté.",copyDone:"Lien copié.",currentRoundComplete:"La ronde actuelle est terminée — la prochaine ronde suisse est prête.",
 noCurrentRound:"Créez la première ronde suisse lorsque les équipes sont prêtes.",roundInProgress:"Ronde en cours. Entrez tous les scores pour débloquer le prochain appariement.",allRoundsComplete:"Phase suisse terminée.",tieAllowed:"Les parties chronométrées peuvent être saisies à égalité; chaque équipe reçoit 0,5 point."
}};

function emptyPlayoff(){return{size:0,consolationEnabled:false,championship:null,consolation:null}}
function freshState(){return{
 players:{shooter:[],pointer:[]},teams:[],unassigned:[],rounds:[],playoff:emptyPlayoff(),
 settings:{name:"Pétanque Ottawa-Vanier Tournament",teamSize:2,teamMethod:"balanced",maxRounds:4,terrains:8}
};}
function t(k){return I[lang][k]||k}
function uid(){return (crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now())}
function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function normalize(raw){
 const s=freshState(); if(!raw||typeof raw!=="object")return s;
 if(raw.players){if(Array.isArray(raw.players.shooter))s.players.shooter=raw.players.shooter;if(Array.isArray(raw.players.pointer))s.players.pointer=raw.players.pointer}
 if(Array.isArray(raw.teams))s.teams=raw.teams;if(Array.isArray(raw.unassigned))s.unassigned=raw.unassigned;if(Array.isArray(raw.rounds))s.rounds=raw.rounds;
 s.rounds.forEach(r=>(r.matches||[]).forEach(m=>{if(m.bye){m.scoreA=13;m.scoreB=7}}));
 if(raw.playoff&&raw.playoff.championship){s.playoff={...emptyPlayoff(),...raw.playoff,consolationEnabled:raw.playoff.consolationEnabled??!!raw.playoff.consolation}}if(raw.settings)s.settings={...s.settings,...raw.settings};return s;
}
function load(){
 try{state=normalize(JSON.parse(localStorage.getItem(KEY)||"null"))}catch(e){state=freshState()}
 $("tournamentName").value=state.settings.name;$("teamSize").value=state.settings.teamSize;$("teamMethod").value=state.settings.teamMethod;
 $("maxRounds").value=state.settings.maxRounds;$("terrainCount").value=state.settings.terrains;
 const hosted=location.protocol==="http:"||location.protocol==="https:";
 $("publicBaseUrl").value=hosted?new URL(".",location.href).href:(localStorage.getItem("povPublicBaseUrl")||"");
 $("hostWarning").textContent=hosted?t("hostedOk"):t("localHostWarn");
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));broadcastLive()}
function syncSettings(){
 state.settings.name=$("tournamentName").value.trim()||"Pétanque Ottawa-Vanier Tournament";
 state.settings.teamSize=Number($("teamSize").value)||2;state.settings.teamMethod=$("teamMethod").value;
 state.settings.maxRounds=Number($("maxRounds").value)||4;state.settings.terrains=Math.max(1,Number($("terrainCount").value)||1);save();
}
function teamDisplay(team){return `${lang==="fr"?"Équipe":"Team"} ${team.anchorName||"?"}`}
function teamDisplayById(id){const tm=state.teams.find(x=>x.id===id);return tm?teamDisplay(tm):"—"}
function playerById(id){return [...state.players.shooter,...state.players.pointer].find(p=>p.id===id)}
function roleName(r){return r==="shooter"?t("shooter"):t("pointer")}

function setLang(l){
 lang=l;localStorage.setItem("povLang",lang);document.documentElement.lang=lang;
 $("langEn").classList.toggle("active",lang==="en");$("langFr").classList.toggle("active",lang==="fr");
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 $("shooterInput").placeholder=lang==="fr"?"Nom du tireur":"Shooter name";$("pointerInput").placeholder=lang==="fr"?"Nom du pointeur":"Pointer name";
 const hosted=location.protocol==="http:"||location.protocol==="https:";$("hostWarning").textContent=hosted?t("hostedOk"):t("localHostWarn");
 render();
}

function addPlayer(role){
 const inp=role==="shooter"?$("shooterInput"):$("pointerInput");const name=inp.value.trim();if(!name)return;
 const all=[...state.players.shooter,...state.players.pointer];if(all.some(p=>String(p.name).toLowerCase()===name.toLowerCase()))return alert(t("duplicatePlayer"));
 state.players[role].push({id:uid(),name,role});inp.value="";state.teams=[];state.unassigned=[];state.rounds=[];state.playoff=emptyPlayoff();save();render();inp.focus();
}
function removePlayer(role,id){
 state.players[role]=state.players[role].filter(p=>p.id!==id);state.teams=[];state.unassigned=[];state.rounds=[];state.playoff=emptyPlayoff();save();render();
}
function renderPlayers(){
 [["shooter","shooterList","shooterEmpty","shooterCount"],["pointer","pointerList","pointerEmpty","pointerCount"]].forEach(([role,l,e,c])=>{
  $(l).innerHTML="";$(e).classList.toggle("hidden",state.players[role].length>0);$(c).textContent=state.players[role].length;
  state.players[role].forEach(p=>{$(l).insertAdjacentHTML("beforeend",`<div class="player-row"><div><strong>${esc(p.name)}</strong> <span class="role ${role}">${roleName(role)}</span></div><button class="btn btn-danger btn-sm remove-player" data-role="${role}" data-id="${p.id}">${t("remove")}</button></div>`)})
 })
}

function makeTeam(members){
 const shooter=members.find(p=>p.role==="shooter");const anchor=(shooter||members[0]).name;
 return{id:uid(),anchorName:anchor,players:members.map(p=>p.id)};
}
function buildTeams(){
 syncSettings();const size=state.settings.teamSize;let S=shuffle(state.players.shooter),P=shuffle(state.players.pointer),teams=[],left=[];
 const all=[...S,...P];if(!all.length)return alert(t("needPlayers"));if(all.length<size)return alert(t("notEnoughPlayers"));
 if(size===1){teams=shuffle(all).map(p=>makeTeam([p]))}
 else if(state.settings.teamMethod==="random"){
  const mix=shuffle(all);while(mix.length>=size)teams.push(makeTeam(mix.splice(0,size)));left=mix.map(p=>p.id);
 }else if(size===2){
  while(S.length+P.length>=2){let m=[];if(S.length&&P.length)m=[S.shift(),P.shift()];else{const src=S.length?S:P;m=[src.shift(),src.shift()].filter(Boolean)}if(m.length===2)teams.push(makeTeam(m));else left.push(...m.map(x=>x.id))}
  left.push(...S.map(x=>x.id),...P.map(x=>x.id));
 }else{
  while(S.length+P.length>=3){let m=[];
   if(S.length&&P.length>=2)m=[S.shift(),P.shift(),P.shift()];
   else if(S.length>=2&&P.length)m=[S.shift(),S.shift(),P.shift()];
   else{const src=S.length>=3?S:P;if(src.length>=3)m=[src.shift(),src.shift(),src.shift()];else break}
   if(m.length===3)teams.push(makeTeam(m));
  }left.push(...S.map(x=>x.id),...P.map(x=>x.id));
 }
 state.teams=teams;state.unassigned=left;state.rounds=[];state.playoff=emptyPlayoff();save();render();
}
function renderTeams(){
 $("teamGrid").innerHTML="";if(!state.teams.length){$("teamSummary").textContent=t("noTeams");return}
 $("teamSummary").textContent=`${state.teams.length} ${t("teamsBuilt")}`;
 state.teams.forEach(tm=>{
  const members=tm.players.map(playerById).filter(Boolean);
  const body=members.map(p=>`<div class="team-member"><strong>${esc(p.name)}</strong><span class="role ${p.role}">${roleName(p.role)}</span></div>`).join("");
  $("teamGrid").insertAdjacentHTML("beforeend",`<div class="team-card"><div class="team-card-head"><strong>${esc(teamDisplay(tm))}</strong><span>${members.length} ${t("players")}</span></div><div class="team-card-body">${body}</div></div>`);
 });
 if(state.unassigned.length){
  const names=state.unassigned.map(playerById).filter(Boolean).map(p=>esc(p.name)).join(", ");
  $("teamGrid").insertAdjacentHTML("beforeend",`<div class="team-card"><div class="team-card-head"><strong>${t("unassigned")}</strong></div><div class="team-card-body"><div class="notice gold">${t("unassignedNote")}</div><p>${names}</p></div></div>`);
 }
}

function matchKey(a,b){return[a,b].sort().join("|")}
function historySet(){const s=new Set();state.rounds.forEach(r=>r.matches.forEach(m=>{if(!m.bye)s.add(matchKey(m.a,m.b))}));return s}
function byeHistory(){const s=new Set();state.rounds.forEach(r=>r.matches.forEach(m=>{if(m.bye)s.add(m.a)}));return s}
function completed(m){return m.bye||(Number.isFinite(m.scoreA)&&Number.isFinite(m.scoreB))}
function currentRoundComplete(){if(!state.rounds.length)return true;return state.rounds[state.rounds.length-1].matches.every(completed)}

function rawStats(){
 const map={};state.teams.forEach(tm=>map[tm.id]={id:tm.id,MP:0,P:0,W:0,L:0,T:0,PF:0,PA:0,D:0,BH:0,opps:[]});
 state.rounds.forEach(r=>r.matches.forEach(m=>{
  const A=map[m.a];if(!A)return;
  if(m.bye){A.P++;A.W++;A.MP+=1;A.PF+=13;A.PA+=7;return}
  if(!completed(m))return;const B=map[m.b];if(!B)return;
  A.P++;B.P++;A.PF+=m.scoreA;A.PA+=m.scoreB;B.PF+=m.scoreB;B.PA+=m.scoreA;A.opps.push(B.id);B.opps.push(A.id);
  if(m.scoreA>m.scoreB){A.W++;B.L++;A.MP+=1}else if(m.scoreB>m.scoreA){B.W++;A.L++;B.MP+=1}else{A.T++;B.T++;A.MP+=.5;B.MP+=.5}
 }));
 Object.values(map).forEach(x=>x.D=x.PF-x.PA);
 Object.values(map).forEach(x=>x.BH=x.opps.reduce((sum,id)=>sum+(map[id]?.MP||0),0));
 return map;
}
function standingsData(){
 const map=rawStats();return Object.values(map).sort((a,b)=>b.MP-a.MP||b.BH-a.BH||b.D-a.D||b.PF-a.PF||teamDisplayById(a.id).localeCompare(teamDisplayById(b.id)));
}

function pairBacktrack(ids,hist){
 const memo=new Set();
 function rec(arr){
  if(!arr.length)return[];
  const key=arr.join(",");if(memo.has(key))return null;memo.add(key);
  const a=arr[0];
  const candidates=arr.slice(1).map((b,i)=>({b,i:i+1,rematch:hist.has(matchKey(a,b))})).sort((x,y)=>Number(x.rematch)-Number(y.rematch)||x.i-y.i);
  for(const c of candidates){
   const rest=arr.filter((_,i)=>i!==0&&i!==c.i);const sub=rec(rest);
   if(sub)return[[a,c.b],...sub];
  }return null;
 }
 return rec(ids)||[];
}
function createNextRound(){
 syncSettings();if(state.teams.length<2)return alert(t("needTeams"));if(state.rounds.length>=state.settings.maxRounds)return alert(t("maxRoundsDone"));if(!currentRoundComplete())return alert(t("finishRound"));
 let order=state.rounds.length===0?shuffle(state.teams.map(x=>x.id)):standingsData().map(x=>x.id);
 let bye=null;
 if(order.length%2===1){const byes=byeHistory();for(let i=order.length-1;i>=0;i--){if(!byes.has(order[i])){bye=order[i];order.splice(i,1);break}}if(!bye)bye=order.pop()}
 const pairs=pairBacktrack(order,historySet());const matches=[];let terrain=1;
 pairs.forEach(([a,b])=>{matches.push({id:uid(),a,b,scoreA:null,scoreB:null,terrain});terrain=terrain>=state.settings.terrains?1:terrain+1});
 if(bye)matches.push({id:uid(),a:bye,b:null,scoreA:13,scoreB:7,terrain:null,bye:true});
 state.rounds.push({number:state.rounds.length+1,matches,createdAt:new Date().toISOString()});state.playoff=emptyPlayoff();save();render();switchTab("swiss");
}
function setScore(roundIndex,matchId,side,value){
 const m=state.rounds[roundIndex]?.matches.find(x=>x.id===matchId);if(!m||m.bye)return;const v=value===""?null:Math.max(0,parseInt(value,10)||0);
 if(side==="A")m.scoreA=v;else m.scoreB=v;save();renderSwiss();renderStandings();renderPlayoff();
}
function renderSwiss(){
 $("kpiTeams").textContent=state.teams.length;$("kpiRound").textContent=state.rounds.length;
 $("kpiMatches").textContent=state.rounds.flatMap(r=>r.matches).filter(m=>!m.bye&&completed(m)).length;$("kpiLive").textContent=liveClients.size;
 let status=t("noCurrentRound");if(state.rounds.length){if(state.rounds.length>=state.settings.maxRounds&&currentRoundComplete())status=t("allRoundsComplete");else status=currentRoundComplete()?t("currentRoundComplete"):t("roundInProgress")}
 $("swissStatus").textContent=status+" "+t("tieAllowed");
 const root=$("roundsArea");root.innerHTML="";if(!state.rounds.length){root.innerHTML=`<div class="empty">${t("noRounds")}</div>`;return}
 state.rounds.forEach((r,ri)=>{
  let h=`<div class="round"><div class="round-head"><strong>${t("round")} ${r.number}</strong><span>${r.matches.filter(m=>!m.bye).length} ${lang==="fr"?"matchs":"matches"}</span></div>`;
  r.matches.forEach(m=>{
   if(m.bye){h+=`<div class="bye-row"><span><span class="terrain">${t("bye")}</span> <strong>${esc(teamDisplayById(m.a))}</strong></span><strong>${t("byeWin")} · 13–7</strong></div>`;return}
   h+=`<div class="match"><span class="terrain">${t("terrain")} ${m.terrain}</span><strong>${esc(teamDisplayById(m.a))}</strong><input class="score swiss-score" data-round="${ri}" data-id="${m.id}" data-side="A" type="number" min="0" value="${m.scoreA??""}"><span class="center">–</span><input class="score swiss-score" data-round="${ri}" data-id="${m.id}" data-side="B" type="number" min="0" value="${m.scoreB??""}"><strong class="right">${esc(teamDisplayById(m.b))}</strong></div>`;
  });h+="</div>";root.insertAdjacentHTML("beforeend",h);
 });
}
function renderStandings(){
 const root=$("standingsArea");if(!state.teams.length){root.innerHTML=`<div class="empty">${t("noStandings")}</div>`;return}
 const s=standingsData(),cut=state.playoff.size||Number($("playoffSize")?.value)||8;root.innerHTML=`<div class="table-wrap"><table><thead><tr><th>#</th><th>${t("team")}</th><th>${t("matchPts")}</th><th>${t("buchholz")}</th><th>${t("played")}</th><th>${t("wins")}</th><th>${t("losses")}</th><th>${t("ties")}</th><th>${t("pf")}</th><th>${t("pa")}</th><th>${t("diff")}</th></tr></thead><tbody>${s.map((x,i)=>`<tr class="${i<cut?"top4":""}"><td class="rank">${i+1}</td><td><strong>${esc(teamDisplayById(x.id))}</strong></td><td><strong>${x.MP}</strong></td><td>${x.BH}</td><td>${x.P}</td><td>${x.W}</td><td>${x.L}</td><td>${x.T}</td><td>${x.PF}</td><td>${x.PA}</td><td>${x.D>0?"+":""}${x.D}</td></tr>`).join("")}</tbody></table></div>`;
}
function seedOrder(n){
 let order=[1,2];
 for(let size=2;size<n;size*=2){const mirror=size*2+1,next=[];order.forEach(seed=>next.push(seed,mirror-seed));order=next}
 return order;
}
function buildKnockout(ids){
 const order=seedOrder(ids.length),rounds=[];
 const first=[];for(let i=0;i<order.length;i+=2){first.push({id:uid(),a:ids[order[i]-1],b:ids[order[i+1]-1],scoreA:null,scoreB:null})}
 rounds.push({matches:first});let count=first.length;
 while(count>1){count=Math.floor(count/2);rounds.push({matches:Array.from({length:count},()=>({id:uid(),a:null,b:null,scoreA:null,scoreB:null}))})}
 return{entrants:[...ids],rounds};
}
function knockoutWinner(m){if(!m||!m.a||!m.b||m.scoreA==null||m.scoreB==null||m.scoreA===m.scoreB)return null;return m.scoreA>m.scoreB?m.a:m.b}
function refreshBracket(bracket){
 if(!bracket?.rounds?.length)return;
 for(let r=1;r<bracket.rounds.length;r++){
  const prev=bracket.rounds[r-1].matches,cur=bracket.rounds[r].matches;
  cur.forEach((m,i)=>{const a=knockoutWinner(prev[i*2]),b=knockoutWinner(prev[i*2+1]);if(m.a!==a||m.b!==b){m.a=a;m.b=b;m.scoreA=null;m.scoreB=null}})
 }
}
function playoffRoundName(matchCount){if(matchCount===16)return t("roundOf32");if(matchCount===8)return t("roundOf16");if(matchCount===4)return t("quarterfinals");if(matchCount===2)return t("semifinals");return t("final")}
function playoffRequirementText(){
 const size=Number($("playoffSize")?.value)||state.playoff.size||8;
 const consolationEnabled=$("consolationMode")?$("consolationMode").value==="yes":!!state.playoff.consolationEnabled;
 return consolationEnabled
  ?t("playoffNeedTeams").replaceAll("{n}",String(size*2)).replaceAll("{size}",String(size))
  :t("playoffNeedMainTeams").replaceAll("{size}",String(size));
}
function renderPlayoffRequirement(){
 if($("playoffRequirement"))$("playoffRequirement").textContent=playoffRequirementText();
 if(!state.playoff.size&&$("consolationOrganizerSection")){
  const wants=$("consolationMode")?.value==="yes";$("consolationOrganizerSection").classList.toggle("hidden",!wants);
 }
}
function createPlayoff(){
 const size=Number($("playoffSize").value)||8;
 const consolationEnabled=$("consolationMode").value==="yes";
 if(state.rounds.length<state.settings.maxRounds||!currentRoundComplete())return alert(t("playoffWait"));
 const required=size*(consolationEnabled?2:1);
 if(state.teams.length<required)return alert(playoffRequirementText());
 const ranked=standingsData().map(x=>x.id),main=ranked.slice(0,size),consolation=consolationEnabled?ranked.slice(size,size*2):[];
 state.playoff={size,consolationEnabled,championship:buildKnockout(main),consolation:consolationEnabled?buildKnockout(consolation):null};save();renderPlayoff();
}
function setPlayScore(kind,roundIndex,matchIndex,side,value){
 const bracket=state.playoff[kind],m=bracket?.rounds?.[roundIndex]?.matches?.[matchIndex];if(!m||!m.a||!m.b)return;
 const v=value===""?null:Math.max(0,parseInt(value,10)||0);if(side==="A")m.scoreA=v;else m.scoreB=v;refreshBracket(bracket);save();renderPlayoff();
}
function bracketHtml(bracket,kind){
 if(!bracket?.rounds?.length)return`<div class="empty">${t("noPlayoff")}</div>`;
 let h="";bracket.rounds.forEach((round,ri)=>{h+=`<div class="round"><div class="round-head"><strong>${playoffRoundName(round.matches.length)}</strong><span>${round.matches.length} ${lang==="fr"?"matchs":"matches"}</span></div>`;
  round.matches.forEach((m,mi)=>{const disabled=(!m.a||!m.b)?"disabled":"";h+=`<div class="match"><span class="terrain">${mi+1}</span><strong>${esc(m.a?teamDisplayById(m.a):"TBD")}</strong><input ${disabled} class="score playoff-score" data-bracket="${kind}" data-round="${ri}" data-index="${mi}" data-side="A" type="number" min="0" value="${m.scoreA??""}"><span>–</span><input ${disabled} class="score playoff-score" data-bracket="${kind}" data-round="${ri}" data-index="${mi}" data-side="B" type="number" min="0" value="${m.scoreB??""}"><strong class="right">${esc(m.b?teamDisplayById(m.b):"TBD")}</strong></div>`});h+="</div>";
 });
 const final=bracket.rounds[bracket.rounds.length-1].matches[0],champ=knockoutWinner(final);if(champ){const label=kind==="championship"?t("champion"):t("consolationChampion");h+=`<div class="notice green" style="margin-top:12px;text-align:center;font-size:18px"><strong>🏆 ${label}: ${esc(teamDisplayById(champ))}</strong></div>`}return h;
}
function renderPlayoff(){
 if(state.playoff.size&&$("playoffSize"))$("playoffSize").value=String(state.playoff.size);
 if(state.playoff.size&&$("consolationMode"))$("consolationMode").value=state.playoff.consolationEnabled?"yes":"no";
 renderPlayoffRequirement();
 $("championshipArea").innerHTML=bracketHtml(state.playoff.championship,"championship");
 const showConsolation=state.playoff.size?!!state.playoff.consolationEnabled:$("consolationMode")?.value==="yes";
 $("consolationOrganizerSection").classList.toggle("hidden",!showConsolation);
 $("consolationArea").innerHTML=showConsolation?bracketHtml(state.playoff.consolation,"consolation"):"";
}

function publicState(){
 return{
  version:1, tournamentName:state.settings.name, sentAt:new Date().toISOString(), teams:state.teams.map(tm=>({id:tm.id,anchorName:tm.anchorName})),
  rounds:state.rounds, standings:standingsData(), playoff:state.playoff
 };
}
function broadcastLive(){
 if(!liveActive)return;const data=publicState();for(const c of [...liveClients]){try{if(c.open)c.send(data);else liveClients.delete(c)}catch(e){liveClients.delete(c)}}renderLiveIndicators();
}
function renderLiveIndicators(){
 $("liveDot").classList.toggle("on",liveActive);$("liveText").textContent=liveActive?t("liveOn"):t("liveOff");$("kpiLive").textContent=liveClients.size;
}
function normalizeBaseUrl(input){
 try{const u=new URL(input);if(!["http:","https:"].includes(u.protocol))return null;u.hash="";u.search="";if(!u.pathname.endsWith("/"))u.pathname=u.pathname.replace(/[^/]+$/,"");return u.href}catch(e){return null}
}
function buildViewerUrl(base,peerId){return new URL(`public.html?host=${encodeURIComponent(peerId)}`,base).href}
function startLive(){
 const base=normalizeBaseUrl($("publicBaseUrl").value.trim());if(!base)return alert(t("enterPublicUrl"));
 localStorage.setItem("povPublicBaseUrl",base);if(typeof Peer==="undefined" || typeof QRCode==="undefined")return alert(t("peerUnavailable"));
 if(peer){try{peer.destroy()}catch(e){}}
 livePeerId=localStorage.getItem(PEER_KEY);if(!livePeerId){livePeerId="pov-"+Math.random().toString(36).slice(2,10);localStorage.setItem(PEER_KEY,livePeerId)}
 peer=new Peer(livePeerId,{debug:0});
 peer.on("open",id=>{
  liveActive=true;livePeerId=id;viewerUrl=buildViewerUrl(base,id);$("viewerLink").textContent=viewerUrl;$("liveDetails").classList.remove("hidden");$("startLive").classList.add("hidden");$("stopLive").classList.remove("hidden");
  const qr=$("qrCode");qr.innerHTML="";new QRCode(qr,{text:viewerUrl,width:210,height:210,colorDark:"#071b30",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
  $("hostWarning").className="notice green";$("hostWarning").textContent=t("liveStarted");renderLiveIndicators();broadcastLive();
 });
 peer.on("connection",conn=>{conn.on("open",()=>{liveClients.add(conn);conn.send(publicState());renderLiveIndicators()});conn.on("close",()=>{liveClients.delete(conn);renderLiveIndicators()});conn.on("error",()=>{liveClients.delete(conn);renderLiveIndicators()})});
 peer.on("error",err=>{if(err.type==="unavailable-id"){localStorage.removeItem(PEER_KEY);livePeerId=null;$("hostWarning").className="notice red";$("hostWarning").textContent="Live ID temporarily unavailable. Press Start Live Board again."}else{$("hostWarning").className="notice red";$("hostWarning").textContent=err.message||String(err)}});
}
function stopLive(){
 liveActive=false;liveClients.clear();if(peer){try{peer.destroy()}catch(e){}}peer=null;$("startLive").classList.remove("hidden");$("stopLive").classList.add("hidden");$("liveDetails").classList.add("hidden");
 $("qrCode").innerHTML=`<div class="empty">${t("qrWaiting")}</div>`;$("hostWarning").className="notice gold";$("hostWarning").textContent=t("liveStopped");renderLiveIndicators();
}
function resetRounds(){if(!confirm(t("resetConfirm")))return;state.rounds=[];state.playoff=emptyPlayoff();save();render()}
function switchTab(name){document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===`panel-${name}`))}
function render(){renderPlayers();renderTeams();renderSwiss();renderStandings();renderPlayoff();renderLiveIndicators()}

document.addEventListener("DOMContentLoaded",()=>{
 load();setLang(lang);
 document.querySelectorAll(".tab-btn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
 $("langEn").addEventListener("click",()=>setLang("en"));$("langFr").addEventListener("click",()=>setLang("fr"));
 $("addShooter").addEventListener("click",()=>addPlayer("shooter"));$("addPointer").addEventListener("click",()=>addPlayer("pointer"));
 $("shooterInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addPlayer("shooter")}});$("pointerInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addPlayer("pointer")}});
 $("buildTeams").addEventListener("click",buildTeams);$("reshuffleTeams").addEventListener("click",buildTeams);$("nextRound").addEventListener("click",createNextRound);$("resetRounds").addEventListener("click",resetRounds);
 $("createPlayoff").addEventListener("click",createPlayoff);$("printTournament").addEventListener("click",()=>window.print());$("startLive").addEventListener("click",startLive);$("stopLive").addEventListener("click",stopLive);
 $("copyLink").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(viewerUrl);$("copyLink").textContent=t("copyDone");setTimeout(()=>$("copyLink").textContent=t("copyLink"),1300)}catch(e){}});
 $("openViewer").addEventListener("click",()=>{if(viewerUrl)window.open(viewerUrl,"_blank")});
 ["tournamentName","teamSize","teamMethod","maxRounds","terrainCount"].forEach(id=>$(id).addEventListener("change",syncSettings));$("playoffSize").addEventListener("change",renderPlayoffRequirement);$("consolationMode").addEventListener("change",renderPlayoffRequirement);
 document.addEventListener("click",e=>{const b=e.target.closest(".remove-player");if(b)removePlayer(b.dataset.role,b.dataset.id)});
 document.addEventListener("change",e=>{if(e.target.matches(".swiss-score"))setScore(Number(e.target.dataset.round),e.target.dataset.id,e.target.dataset.side,e.target.value);if(e.target.matches(".playoff-score"))setPlayScore(e.target.dataset.bracket,Number(e.target.dataset.round),Number(e.target.dataset.index),e.target.dataset.side,e.target.value)});
 render();
});
