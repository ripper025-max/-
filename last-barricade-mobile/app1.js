
(function(){
  if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
      if(typeof r==="number") r=[r,r,r,r];
      if(!Array.isArray(r)) r=[0,0,0,0];
      var a=r.length===1?[r[0],r[0],r[0],r[0]]:r.length===2?[r[0],r[1],r[0],r[1]]:r;
      var tl=a[0]||0,tr=a[1]||0,br=a[2]||0,bl=a[3]||0;
      this.moveTo(x+tl,y); this.lineTo(x+w-tr,y); this.quadraticCurveTo(x+w,y,x+w,y+tr);
      this.lineTo(x+w,y+h-br); this.quadraticCurveTo(x+w,y+h,x+w-br,y+h);
      this.lineTo(x+bl,y+h); this.quadraticCurveTo(x,y+h,x,y+h-bl);
      this.lineTo(x,y+tl); this.quadraticCurveTo(x,y,x+tl,y); this.closePath();
      return this;
    };
  }
})();


const EQUIP=[
 {id:"rifle",name:"M4 카빈",icon:"🔫",type:"weapon",rarity:"common",desc:"생존자의 기본 자동소총. 연사력이 빠르고 안정적.",base:11,cd:.18},
 {id:"shotgun",name:"전술 산탄총",icon:"💥",type:"weapon",rarity:"rare",desc:"가까운 적에게 넓게 산탄을 발사.",base:12,cd:.72},
 {id:"gatling",name:"M2 자동포탑",icon:"🔩",type:"turret",rarity:"common",desc:"고속 탄환을 지속적으로 퍼붓는 기본 방어 병기.",base:9,cd:.12},
 {id:"rocket",name:"로켓 포드",icon:"🚀",type:"turret",rarity:"rare",desc:"밀집한 좀비 떼에 범위 폭발을 가함.",base:58,cd:1.7},
 {id:"flame",name:"화염방사기",icon:"🔥",type:"turret",rarity:"rare",desc:"철조망 앞의 적을 지속적으로 태움.",base:8,cd:.08},
 {id:"mortar",name:"81mm 박격포",icon:"💣",type:"turret",rarity:"epic",desc:"긴 간격으로 광범위 고폭탄을 발사.",base:95,cd:2.8},
 {id:"tesla",name:"전기 철조망",icon:"⚡",type:"wall",rarity:"epic",desc:"철조망에 닿은 적을 감전시키고 둔화.",base:16,cd:.55},
 {id:"drone",name:"전투 드론",icon:"🛸",type:"turret",rarity:"epic",desc:"전장을 횡단하며 우선 목표를 자동 사격.",base:16,cd:.32},
 {id:"mine",name:"대인지뢰 살포기",icon:"💣",type:"support",rarity:"rare",desc:"바리케이드 앞에 지뢰를 주기적으로 살포.",base:80,cd:4.2},
 {id:"airstrike",name:"미사일 지원",icon:"☄️",type:"support",rarity:"legend",desc:"주기적으로 전장 전체에 미사일 폭격.",base:130,cd:7.5}
];
const R={common:{n:"COMMON",c:"#aeb9b5",w:46},rare:{n:"RARE",c:"#69c7ff",w:34},epic:{n:"EPIC",c:"#b08cf4",w:17},legend:{n:"LEGEND",c:"#ffc85a",w:3}};
const starter=["rifle","gatling","rocket","flame"];
let meta=JSON.parse(localStorage.getItem("last_barricade_save")||"null")||{gem:1600,scrap:500,best:0,owned:Object.fromEntries(starter.map(id=>[id,{copies:1,bonus:0}]))};
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
const eq=id=>EQUIP.find(e=>e.id===id);
function save(){localStorage.setItem("last_barricade_save",JSON.stringify(meta));sync()}
const nav=[["home","🏚️","기지"],["arsenal","🧰","무기고"],["crate","📦","보급"],["guide","📋","규칙"]];
$$("[data-nav]").forEach(n=>n.innerHTML=nav.map(x=>`<button data-go="${x[0]}"><span class="ico">${x[1]}</span>${x[2]}</button>`).join(""));
$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
function show(id){if(run.active&&id!=="battle")return;$$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));$$("[data-go]").forEach(b=>b.classList.toggle("active",b.dataset.go===id));sync()}
function card(e,locked=false){return `<button class="item ${locked?"lock":""}" onclick="detail('${e.id}')"><div class="ii">${e.icon}</div><b>${e.name}</b><small style="color:${R[e.rarity].c}">${R[e.rarity].n}</small></button>`}
function sync(){
 $$("[data-gem]").forEach(x=>x.textContent=meta.gem);$$("[data-scrap]").forEach(x=>x.textContent=meta.scrap);
 $("#arsenalGrid").innerHTML=EQUIP.map(e=>card(e,!meta.owned[e.id])).join("");
 $("#guideGrid").innerHTML=EQUIP.map(e=>card(e,!meta.owned[e.id])).join("");
}
function detail(id){
 const e=eq(id),o=meta.owned[id];
 $("#modal").innerHTML=`<h2>${e.icon} ${e.name}</h2><p style="color:${R[e.rarity].c}">${R[e.rarity].n}</p>
 <div class="detail"><div class="big">${e.icon}</div><div><h3>${o?"보유 중":"미해금"}</h3><p>${e.desc}<br><br>기본 화력 ${e.base}<br>영구 보너스 ${o?Math.round(o.bonus*100):0}%</p></div></div>
 <button class="secondary" style="width:100%" onclick="closePop()">닫기</button>`;
 $("#popup").classList.add("show");
}
function closePop(){$("#popup").classList.remove("show")}
$("#popup").onclick=e=>{if(e.target.id==="popup")closePop()}
let toastT;function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("show"),1400)}
function rarity(){let x=Math.random()*100,a=0;for(const[k,v]of Object.entries(R)){a+=v.w;if(x<a)return k}return"common"}
function openCrate(n){
 const cost=n===5?450:100;if(meta.gem<cost)return toast("보석이 부족합니다");meta.gem-=cost;
 $("#crateBox").classList.remove("pop");void $("#crateBox").offsetWidth;$("#crateBox").classList.add("pop");
 const out=[];
 for(let i=0;i<n;i++){const r=rarity(),pool=EQUIP.filter(e=>e.rarity===r),e=pool[Math.floor(Math.random()*pool.length)],fresh=!meta.owned[e.id];if(fresh)meta.owned[e.id]={copies:1,bonus:0};else{let o=meta.owned[e.id];o.copies++;if(o.copies%3===0)o.bonus=Math.min(.6,o.bonus+.06)}out.push({e,fresh})}
 save();setTimeout(()=>{$("#modal").innerHTML=`<h2>SUPPLY DROP</h2><p>새로 해금한 병기는 다음 작전부터 선택지에 등장합니다.</p><div class="grid" style="margin:14px 0">${out.map(x=>`<div class="item" style="${x.fresh?"outline:2px solid #b8f36a":""}"><div class="ii">${x.e.icon}</div><b>${x.e.name}</b><small>${x.fresh?"NEW":R[x.e.rarity].n}</small></div>`).join("")}</div><button class="primary" onclick="closePop()">확인</button>`;$("#popup").classList.add("show")},250)
}

// ---------- battle ----------
const canvas=$("#game"),ctx=canvas.getContext("2d");
if(!ctx){showRuntimeError("이 브라우저에서는 Canvas 2D를 사용할 수 없습니다. Safari/Chrome에서 여십시오.");}
const run={active:false,paused:false,t:120,wave:1,php:100,wall:100,kills:0,xp:0,next:18,level:1,enemies:[],shots:[],fx:[],mines:[],systems:{rifle:1},cd:{},activeCd:{airstrike:0,wall:0,missile:0},spawn:0,last:0,shake:0,boss:false};
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);run.w=r.width;run.h=r.height;run.wallY=r.height*.69;run.player={x:r.width*.5,y:r.height*.84}}
addEventListener("resize",resize);
function startRun(){
 Object.assign(run,{active:true,paused:false,t:120,wave:1,php:100,wall:100,kills:0,xp:0,next:18,level:1,enemies:[],shots:[],fx:[],mines:[],systems:{rifle:1},cd:{},activeCd:{airstrike:0,wall:0,missile:0},spawn:0,last:performance.now(),shake:0,boss:false});
 show("battle");
 requestAnimationFrame(function(){
   resize();
   run.last=performance.now();
   syncBattle();
   requestAnimationFrame(loop);
 });
}
function quitRun(){finish(false)}
function dmg(id,lv){const e=eq(id);return e.base*(1+(lv-1)*.45)*(1+(meta.owned[id]?.bonus||0))}
function spawnEnemy(){
 const boss=run.t<18&&!run.boss,brute=!boss&&Math.random()<Math.min(.13,run.wave*.012),runner=!boss&&!brute&&Math.random()<.22;
 if(boss)run.boss=true;
 let hp=(boss?1300:brute?240:runner?66:92)*(1+(run.wave-1)*.21);
 run.enemies.push({x:24+Math.random()*(run.w-48),y:-30,r:boss?27:brute?19:runner?11:14,hp,max:hp,speed:(boss?17:brute?20:runner?61:35)*(1+run.wave*.02),boss,brute,runner,slow:0,burn:0,attack:0,dead:false,hit:0,seed:Math.random()*10})
}
function targetNearest(){return run.enemies.filter(e=>!e.dead&&e.hp>0).sort((a,b)=>b.y-a.y)[0]}
function targetCluster(){
 const es=run.enemies.filter(e=>!e.dead&&e.hp>0);
 if(!es.length)return null;
 let best=es[0],bs=-1;
 for(const e of es){
   let s=0;
   for(const o of es)if(Math.hypot(e.x-o.x,e.y-o.y)<80)s++;
   if(s>bs){bs=s;best=e}
 }
 return best
}
function projectile(type,x,y,target,speed,damage,color,extra={}){if(!target)return;run.shots.push({type,x,y,target,tx:target.x,ty:target.y,speed,d:damage,color,life:3,...extra})}
function hit(e,d,type){
 if(!e||e.dead||e.hp<=0)return;e.hp-=d;e.hit=.08;
 if(type==="flame"){e.burn=Math.max(e.burn,1.8)}
 if(type==="tesla"){e.slow=Math.max(e.slow,1.2)}
 run.fx.push({type:"num",x:e.x,y:e.y-15,text:Math.round(d),life:.35,max:.35,color:type==="flame"?"#ff9a57":"#dce8e4"});
 if(e.hp<=0)kill(e)
}
function kill(e){if(e.dead)return;e.dead=true;run.kills++;run.xp+=e.boss?48:e.brute?12:6;meta.scrap+=e.boss?60:e.brute?4:1;run.fx.push({type:"pop",x:e.x,y:e.y,life:.34,max:.34,color:e.boss?"#ffc95a":"#79a27c"});checkLevel()}
function fire(id,lv){
 const p=run.player,D=dmg(id,lv),t=targetNearest();if(!t)return;
 if(id==="rifle"){projectile("bullet",p.x+22,p.y-18,t,620,D,"#d8f1c4");muzzle(p.x+24,p.y-18,"#eaffc7")}
 if(id==="shotgun"){const candidates=run.enemies.filter(e=>!e.dead&&e.y>run.h*.25).sort((a,b)=>b.y-a.y).slice(0,5);for(const e of candidates)hit(e,D*(.8+Math.random()*.35),"shotgun");run.fx.push({type:"cone",x:p.x,y:p.y-22,life:.12,max:.12,color:"#ffd79a"});muzzle(p.x+22,p.y-18,"#fff1c9")}
 if(id==="gatling"){const s=turretPos(id);projectile("bullet",s.x,s.y-10,t,700,D,"#ffe483");muzzle(s.x,s.y-11,"#ffe483")}
 if(id==="rocket"){const s=turretPos(id),c=targetCluster();projectile("rocket",s.x,s.y-8,c,260,D,"#ff756a")}
 if(id==="mortar"){const s=turretPos(id),c=targetCluster();projectile("shell",s.x,s.y-12,c,190,D,"#c8cbc9",{arc:0})}
 if(id==="drone"){const s=dronePos();projectile("bullet",s.x,s.y,t,620,D,"#65d8ff");muzzle(s.x,s.y,"#65d8ff")}
}
function turretPos(id){
 const order=["gatling","rocket","flame","mortar"],i=order.indexOf(id);
 const xs=[.17,.34,.66,.83];return{x:run.w*xs[Math.max(0,i)],y:run.h*.78}
}
function dronePos(){return{x:run.w*.5+Math.cos(performance.now()/850)*run.w*.27,y:run.h*.56+Math.sin(performance.now()/600)*22}}
function muzzle(x,y,color){run.fx.push({type:"muzzle",x,y,life:.08,max:.08,color})}
function interval(id,lv){const e=eq(id);return Math.max(.07,e.cd/(1+(lv-1)*.13))}