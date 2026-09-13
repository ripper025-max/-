function systemUpdate(dt){
 for(const[id,lv]of Object.entries(run.systems)){
  if(["tesla","mine","airstrike","flame"].includes(id))continue;
  run.cd[id]=(run.cd[id]||0)-dt;if(run.cd[id]<=0){fire(id,lv);run.cd[id]=interval(id,lv)}
 }
 if(run.systems.flame){
  const lv=run.systems.flame;run.cd.flame=(run.cd.flame||0)-dt;
  if(run.cd.flame<=0){
   const x=run.w*.78;for(const e of run.enemies)if(e.y>run.wallY-125&&e.y<run.wallY&&Math.abs(e.x-x)<110)hit(e,dmg("flame",lv),"flame");
   run.fx.push({type:"flame",x,y:run.wallY-4,life:.12,max:.12,color:"#ff8b4f"});run.cd.flame=.12
  }
 }
 if(run.systems.tesla){
  run.cd.tesla=(run.cd.tesla||0)-dt;if(run.cd.tesla<=0){
   const near=run.enemies.filter(e=>!e.dead&&e.y>run.wallY-36&&e.y<run.wallY+8);
   near.slice(0,5).forEach((e,i)=>{hit(e,dmg("tesla",run.systems.tesla),"tesla");run.fx.push({type:"zap",x:e.x,y:run.wallY,tx:e.x,ty:e.y,life:.13,max:.13,color:"#67dfff"})});run.cd.tesla=interval("tesla",run.systems.tesla)
  }
 }
 if(run.systems.mine){
  run.cd.mine=(run.cd.mine||0)-dt;if(run.cd.mine<=0&&run.mines.length<6){run.mines.push({x:35+Math.random()*(run.w-70),y:run.wallY-45-Math.random()*90,armed:true});run.cd.mine=interval("mine",run.systems.mine)}
 }
 if(run.systems.airstrike){
  run.cd.airstrike=(run.cd.airstrike||0)-dt;if(run.cd.airstrike<=0){
   for(let i=0;i<5;i++)run.fx.push({type:"airmark",x:25+Math.random()*(run.w-50),y:80+Math.random()*(run.wallY-150),life:.75+i*.09,max:.75+i*.09,color:"#ff7a6c",damage:dmg("airstrike",run.systems.airstrike)});
   run.cd.airstrike=interval("airstrike",run.systems.airstrike)
  }
 }
}
function update(dt){
 run.t-=dt;if(run.t<=0)return finish(true);run.wave=Math.min(12,1+Math.floor((120-run.t)/10));
 for(const k of ["airstrike","wall","missile"]) if((run.activeCd[k]||0)>0) run.activeCd[k]=Math.max(0,run.activeCd[k]-dt);
 run.spawn-=dt;const rate=Math.max(.13,.68-run.wave*.037);
 if(run.spawn<=0){spawnEnemy();run.spawn=rate*(.78+Math.random()*.45)}
 for(const e of run.enemies){
  e.hit=Math.max(0,e.hit-dt);if(e.burn>0){e.burn-=dt;hit(e,9*dt*(run.systems.flame||1),"burn")}if(e.slow>0)e.slow-=dt;
  if(e.y<run.wallY-10){e.y+=e.speed*(e.slow>0?.55:1)*dt}
  else{
   e.attack-=dt;if(e.attack<=0){const d=e.boss?9:e.brute?5:2.2;run.wall-=d;run.shake=.12;e.attack=e.boss?.65:(e.brute?.9:1.0);run.fx.push({type:"impact",x:e.x,y:run.wallY,life:.16,max:.16,color:"#d5ddd7"})}
  }
 }
 for(const m of run.mines){
  if(!m.armed)continue;const e=run.enemies.find(e=>!e.dead&&Math.hypot(e.x-m.x,e.y-m.y)<25);
  if(e){m.armed=false;run.fx.push({type:"blast",x:m.x,y:m.y,life:.34,max:.34,color:"#ffbd64"});for(const z of run.enemies)if(Math.hypot(z.x-m.x,z.y-m.y)<72)hit(z,dmg("mine",run.systems.mine||1)*(1-Math.min(.45,Math.hypot(z.x-m.x,z.y-m.y)/160)),"mine");run.shake=.2}
 }
 run.mines=run.mines.filter(m=>m.armed);
 systemUpdate(dt);
 for(const s of run.shots){
  s.life-=dt;if(s.target&&!s.target.dead&&s.target.hp>0){s.tx=s.target.x;s.ty=s.target.y}
  const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy)||1,step=Math.min(d,s.speed*dt);s.x+=dx/d*step;s.y+=dy/d*step;
  if(d<10&&!s.hit){s.hit=true;if(s.type==="rocket"||s.type==="shell"){const rad=s.type==="shell"?95:72;run.fx.push({type:"blast",x:s.tx,y:s.ty,life:.34,max:.34,color:s.type==="shell"?"#ffd07a":"#ff755f"});for(const e of run.enemies)if(Math.hypot(e.x-s.tx,e.y-s.ty)<rad)hit(e,s.d*(1-Math.min(.5,Math.hypot(e.x-s.tx,e.y-s.ty)/(rad*1.8))),s.type);run.shake=.22}else hit(s.target,s.d,s.type)}
 }
 run.shots=run.shots.filter(s=>s.life>0&&!s.hit);
 for(const f of run.fx){f.life-=dt;if(f.type==="airmark"&&f.life<=0&&!f.done){f.done=true;run.fx.push({type:"blast",x:f.x,y:f.y,life:.4,max:.4,color:"#ff765f"});for(const e of run.enemies)if(Math.hypot(e.x-f.x,e.y-f.y)<85)hit(e,f.damage,"airstrike");run.shake=.28}}
 run.fx=run.fx.filter(f=>f.life>0||f.type==="airmark"&&!f.done);
 run.enemies=run.enemies.filter(e=>!e.dead&&e.hp>0);
 if(run.wall<=0){
  for(const e of run.enemies){if(e.y>=run.wallY-10)e.y+=e.speed*1.25*dt;if(e.y>run.h*.86&&!e.reached){e.reached=true;run.php-=e.boss?40:e.brute?18:9;e.dead=true;run.shake=.35}}
 }
 if(run.php<=0)return finish(false);
 checkLevel();syncBattle()
}
function checkLevel(){
 if(run.xp>=run.next && !run.paused){
   run.xp-=run.next;
   run.level++;
   run.next=Math.floor(run.next*1.28+5);
   openChoices();
 }
}
function availableChoices(){
 const unlocked=EQUIP.filter(e=>meta.owned[e.id]);
 let list=unlocked.map(e=>({id:e.id,lv:run.systems[e.id]||0})).filter(x=>x.lv<5);
 if(run.wall<88) list.push({id:"repair",lv:0});
 if(run.php<78) list.push({id:"medkit",lv:0});
 const fresh=list.filter(x=>x.id!=="repair"&&x.id!=="medkit"&&x.lv===0);
 const upgrades=list.filter(x=>x.id!=="repair"&&x.id!=="medkit"&&x.lv>0);
 const util=list.filter(x=>x.id==="repair"||x.id==="medkit");
 const picks=[];
 function addRandom(arr){
   if(!arr.length)return;
   const candidates=arr.filter(x=>!picks.some(p=>p.id===x.id));
   if(!candidates.length)return;
   picks.push(candidates[Math.floor(Math.random()*candidates.length)]);
 }
 addRandom(fresh);addRandom(upgrades);addRandom(util);
 while(picks.length<3){
   const candidates=list.filter(x=>!picks.some(p=>p.id===x.id));
   if(!candidates.length)break;
   picks.push(candidates[Math.floor(Math.random()*candidates.length)]);
 }
 return picks;
}
function openChoices(){
 run.paused=true;
 const list=availableChoices();
 $("#choices").innerHTML=list.map(c=>{
  if(c.id==="repair")return `<button class="choice" onclick="choose('repair')"><div class="ci">🧱</div><div><b>방벽 긴급 수리</b><small>바리케이드 내구도 +35.</small></div><div class="rank">REPAIR</div></button>`;
  if(c.id==="medkit")return `<button class="choice" onclick="choose('medkit')"><div class="ci">🩹</div><div><b>응급 처치</b><small>생존자 체력 +30.</small></div><div class="rank">HEAL</div></button>`;
  const e=eq(c.id),next=c.lv+1;
  const evo=next===5;
  return `<button class="choice" onclick="choose('${c.id}')"><div class="ci">${e.icon}</div><div><b>${c.lv===0?"설치 · ":""}${e.name}${evo?" · FINAL":""}</b><small>${c.lv===0?e.desc:`Lv.${c.lv} → Lv.${next} · 화력/주기 강화${evo?" · 최종 진화":""}`}</small></div><div class="rank">${c.lv===0?"NEW":evo?"EVOLVE":"LV "+next}</div></button>`;
 }).join("");
 $("#choiceLayer").classList.add("show");
}
function choose(id){
 if(id==="repair"){
   run.wall=Math.min(100,run.wall+35);
   run.fx.push({type:"banner",text:"BARRICADE REPAIRED +35",life:.9,max:.9,color:"#b8f36a"});
 }else if(id==="medkit"){
   run.php=Math.min(100,run.php+30);
   run.fx.push({type:"banner",text:"MEDKIT +30",life:.9,max:.9,color:"#69c8ff"});
 }else{
   run.systems[id]=Math.min(5,(run.systems[id]||0)+1);
   run.fx.push({type:"banner",text:(run.systems[id]===1?"DEPLOYED · ":"UPGRADED · ")+eq(id).name,life:1.0,max:1.0,color:R[eq(id).rarity].c});
 }
 const layer=$("#choiceLayer"); if(layer) layer.classList.remove("show");
 run.paused=false; syncActiveButtons();
}
function useActive(id){
 if(!run.active || run.paused)return;
 if((run.activeCd[id]||0)>0)return;
 if(id==="airstrike"){
   run.activeCd.airstrike=30;
   for(let i=0;i<7;i++)run.fx.push({type:"airmark",x:25+Math.random()*(run.w-50),y:70+Math.random()*(run.wallY-130),life:.6+i*.08,max:.6+i*.08,color:"#ff7a6c",damage:120});
   run.fx.push({type:"banner",text:"TACTICAL AIRSTRIKE",life:1,max:1,color:"#ffc95a"});
 }else if(id==="wall"){
   run.activeCd.wall=25;run.wall=Math.min(100,run.wall+28);run.fx.push({type:"banner",text:"EMERGENCY BARRICADE +28",life:1,max:1,color:"#b8f36a"});run.shake=.12;
 }else if(id==="missile"){
   run.activeCd.missile=20;
   const targets=run.enemies.filter(e=>!e.dead).sort((a,b)=>b.y-a.y).slice(0,6);
   if(!targets.length){run.activeCd.missile=0;return;}
   targets.forEach((e,i)=>run.fx.push({type:"airmark",x:e.x,y:e.y,life:.35+i*.06,max:.35+i*.06,color:"#ffb25d",damage:95}));
   run.fx.push({type:"banner",text:"MISSILE SUPPORT",life:1,max:1,color:"#ff9a57"});
 }
 syncActiveButtons();
}
function syncActiveButtons(){
 const defs=[["airstrike","airBtn",30],["wall","wallBtn",25],["missile","missileBtn",20]];
 for(const [id,btnId,maxcd] of defs){
   const b=document.getElementById(btnId); if(!b)continue;
   const cd=Math.max(0,run.activeCd[id]||0);
   b.disabled=cd>0 || !run.active || run.paused;
   b.classList.toggle("ready",cd<=0 && run.active && !run.paused);
   const s=b.querySelector("span");if(s)s.textContent=cd>0?Math.ceil(cd)+"s":"READY";
 }
}
function syncBattle(){
 syncActiveButtons();
 $("#php").textContent=Math.max(0,Math.ceil(run.php));$("#wallhp").textContent=Math.max(0,Math.ceil(run.wall));$("#kills").textContent=run.kills;$("#wave").textContent=run.wave;$("#time").textContent=Math.max(0,Math.ceil(run.t));const pct=Math.max(0,run.wall);$("#basefill").style.width=pct+"%";$("#baselabel").textContent=`BARRICADE ${Math.ceil(Math.max(0,run.wall))}%`
}
function finish(win){
 if(!run.active)return;run.active=false;meta.best=Math.max(meta.best,Math.floor(120-run.t));if(win){meta.gem+=180;meta.scrap+=120}else meta.gem+=25;save();
 $("#modal").innerHTML=`<div style="text-align:center"><div style="font-size:54px;margin:8px">${win?"🏆":"☠️"}</div><h2>${win?"LINE HELD":"POSITION LOST"}</h2><p>${win?"120초 동안 방어선을 유지했습니다.":"방어선이 돌파됐습니다."}<br><br>처치 ${run.kills} · 최종 Wave ${run.wave}<br>${win?"💎180 + 🔩120":"💎25"}</p><div style="height:12px"></div><button class="primary" onclick="closePop();show('home')">기지로 복귀</button></div>`;$("#popup").classList.add("show")
}
