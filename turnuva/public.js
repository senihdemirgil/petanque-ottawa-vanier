
"use strict";
const $=id=>document.getElementById(id);
let lang=localStorage.getItem("povPublicLang")||"en", peer=null, conn=null, data=null;
const T={
en:{liveScores:"Live tournament scores",connecting:"Connecting…",connected:"LIVE · Connected",disconnected:"Connection lost · showing last update",waiting:"Waiting for tournament data…",currentRound:"Current round",standings:"Standings",results:"Previous results",liveBoard:"Live Board",round:"Round",terrain:"Terrain",bye:"BYE",noRound:"No round has been published yet.",noResults:"No completed rounds yet.",team:"Team",pts:"Pts",bh:"BH",w:"W",l:"L",diff:"Diff",updated:"Updated"},
fr:{liveScores:"Scores du tournoi en direct",connecting:"Connexion…",connected:"EN DIRECT · Connecté",disconnected:"Connexion perdue · dernière mise à jour affichée",waiting:"En attente des données du tournoi…",currentRound:"Ronde actuelle",standings:"Classement",results:"Résultats précédents",liveBoard:"Tableau en direct",round:"Ronde",terrain:"Terrain",bye:"EXEMPT",noRound:"Aucune ronde publiée pour le moment.",noResults:"Aucune ronde terminée pour le moment.",team:"Équipe",pts:"Pts",bh:"BH",w:"V",l:"D",diff:"Diff",updated:"Mis à jour"}
};
function t(k){return T[lang][k]||k}
function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function teamName(id){const tm=data?.teams?.find(x=>x.id===id);return tm?`${lang==="fr"?"Équipe":"Team"} ${tm.anchorName}`:"—"}
function setLang(l){lang=l;localStorage.setItem("povPublicLang",l);document.documentElement.lang=l;$("langEn").classList.toggle("active",l==="en");$("langFr").classList.toggle("active",l==="fr");document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));render()}
function status(mode){$("connectionDot").classList.toggle("on",mode==="connected");$("connectionText").textContent=mode==="connected"?t("connected"):mode==="lost"?t("disconnected"):t("connecting")}
function render(){
 if(!data){$("viewerMessage").classList.remove("hidden");$("currentRoundArea").innerHTML=`<div class="empty">${t("noRound")}</div>`;$("publicStandings").innerHTML="";$("resultsArea").innerHTML="";return}
 $("viewerMessage").classList.add("hidden");$("publicTournamentName").textContent=data.tournamentName||"Pétanque Ottawa-Vanier";
 const rounds=data.rounds||[], current=rounds[rounds.length-1];$("roundLabel").textContent=current?`${t("round")} ${current.number}`:"";
 if(!current)$("currentRoundArea").innerHTML=`<div class="empty">${t("noRound")}</div>`;
 else{
  let h="";current.matches.forEach(m=>{if(m.bye){h+=`<div class="viewer-match"><span class="terrain">${t("bye")}</span><strong>${esc(teamName(m.a))}</strong><div class="viewer-score">13–0</div><span></span></div>`}
   else{const sc=(m.scoreA==null||m.scoreB==null)?"—":`${m.scoreA} – ${m.scoreB}`;h+=`<div class="viewer-match"><span class="terrain">${t("terrain")} ${m.terrain}</span><strong>${esc(teamName(m.a))}</strong><div class="viewer-score">${sc}</div><strong class="right">${esc(teamName(m.b))}</strong></div>`}});
  $("currentRoundArea").innerHTML=h;
 }
 const s=data.standings||[];$("publicStandings").innerHTML=s.length?`<div class="table-wrap"><table><thead><tr><th>#</th><th>${t("team")}</th><th>${t("pts")}</th><th>${t("bh")}</th><th>${t("w")}</th><th>${t("l")}</th><th>${t("diff")}</th></tr></thead><tbody>${s.map((x,i)=>`<tr class="${i<4?"top4":""}"><td class="rank">${i+1}</td><td><strong>${esc(teamName(x.id))}</strong></td><td><strong>${x.MP}</strong></td><td>${x.BH}</td><td>${x.W}</td><td>${x.L}</td><td>${x.D>0?"+":""}${x.D}</td></tr>`).join("")}</tbody></table></div>`:"";
 const prev=rounds.slice(0,-1).reverse();$("resultsArea").innerHTML=prev.length?prev.map(r=>`<div class="round"><div class="round-head"><strong>${t("round")} ${r.number}</strong></div>${r.matches.map(m=>m.bye?`<div class="bye-row"><strong>${esc(teamName(m.a))}</strong><strong>13–0 · ${t("bye")}</strong></div>`:`<div class="viewer-match"><span class="terrain">${t("terrain")} ${m.terrain}</span><strong>${esc(teamName(m.a))}</strong><div class="viewer-score">${m.scoreA??"—"} – ${m.scoreB??"—"}</div><strong class="right">${esc(teamName(m.b))}</strong></div>`).join("")}</div>`).join(""):`<div class="empty">${t("noResults")}</div>`;
}
function connect(){
 const host=new URLSearchParams(location.search).get("host");if(!host){$("viewerMessage").textContent="Missing live tournament code.";status("lost");return}
 if(typeof Peer==="undefined"){setTimeout(connect,800);return}
 peer=new Peer(undefined,{debug:0});peer.on("open",()=>{conn=peer.connect(host,{reliable:true,serialization:"json"});conn.on("open",()=>status("connected"));conn.on("data",d=>{data=d;status("connected");render()});conn.on("close",()=>{status("lost");setTimeout(reconnect,2500)});conn.on("error",()=>status("lost"))});peer.on("error",()=>{status("lost");setTimeout(reconnect,3000)});
}
function reconnect(){try{if(peer)peer.destroy()}catch(e){}peer=null;conn=null;connect()}
document.addEventListener("DOMContentLoaded",()=>{$("langEn").addEventListener("click",()=>setLang("en"));$("langFr").addEventListener("click",()=>setLang("fr"));setLang(lang);status("connecting");connect()});
