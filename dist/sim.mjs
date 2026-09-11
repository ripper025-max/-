import{addExtraSkills}from'./nature.mjs';
import{skillCue}from'./skill-fx.mjs';
import{WORLD,TOWN,REGIONS,SERVICES,FIELD_PACKS,inTown,regionAt,worldObjects}from'./world.mjs';
export{WORLD,TOWN,SERVICES,inTown,regionAt};
import{WEAPONS,CLASS_WEAPONS,weaponType,normalizeWeapons,TRAITS,traitValue,EXTRA_CLASSES,EXTRA_LEGENDS,BOSSES}from'./arsenal.mjs';
export{WEAPONS,CLASS_WEAPONS,weaponType,TRAITS,traitValue,BOSSES};
import{RUNES,RUNE_RANKS,skillSpec,affixValue,enchantCost}from'./progression.mjs';
export{RUNES,RUNE_RANKS,enchantCost};
export const VERSION=1;
export const RARITIES=[{name:'일반',color:'#a8b4b5',mult:1},{name:'마법',color:'#68b6e6',mult:1.16},{name:'희귀',color:'#d7cd72',mult:1.35},{name:'영웅',color:'#b99be8',mult:1.56},{name:'전설',color:'#f2a65a',mult:1.85}];
export const SLOTS={weapon:'무기',armor:'방어구',ring:'반지',relic:'유물'};
export const AFFIXES={damage:['공격력',''],health:['최대 생명력',''],crit:['극대화 확률','%'],haste:['공격 속도','%'],cdr:['재사용 대기시간 감소','%'],leech:['생명력 흡수','%'],armor:['피해 감소','%'],resource:['기력 회복','%'],skill:['스킬 피해','%'],speed:['이동 속도','%']};
export const LEGENDS={echo:{name:'불씨를 깨우는 자',text:'기본 공격이 적중하면 대상 주변에 공격력 40%의 잿불 폭발이 발생합니다.'},chain:{name:'천둥의 서약',text:'극대화 적중 시 가까운 적 최대 3명에게 공격력 70%의 번개가 전이됩니다.'},frost:{name:'겨울의 맹세',text:'피격 시 주변 적을 2초 동안 얼리고 공격력 70%의 피해를 줍니다. 재사용 6초.'},blood:{name:'붉은 갈증',text:'모든 피해의 8%만큼 생명력을 추가로 흡수합니다.'},nova:{name:'몰락한 별의 심장',text:'세 번째 스킬 사용 시 주변에 공격력 180%의 추가 폭발이 발생합니다.'},vortex:{name:'끝없는 격류',text:'첫 번째 스킬의 범위가 35% 넓어지고 피해가 35% 증가합니다.'}};
export const CLASSES={
  knight:{name:'전사',role:'근접 · 회전베기',color:'#cf8b57',icon:'sword',basic:'검격',baseHp:155,baseDamage:13,range:2.6,speed:5.5,
    skills:[{name:'회전베기',icon:'whirl',desc:'주변을 크게 베어 공격력 210%의 피해. 적중한 적을 밀쳐냅니다.',cost:25,cd:3.4,mult:2.1,range:3.8},{name:'대지 강타',icon:'shock',desc:'바라보는 방향으로 충격파. 공격력 290% 피해와 1.5초 기절.',cost:35,cd:6,mult:2.9,range:9},{name:'심판의 일격',icon:'meteor',desc:'주변에 잿불을 폭발시켜 공격력 520% 피해. 4초간 피해를 받지 않습니다.',cost:60,cd:17,mult:5.2,range:6.2}],
    passives:[{name:'칼날 연마',icon:'sword',desc:'포인트마다 모든 공격력이 8% 증가합니다.',key:'might'},{name:'피의 갑옷',icon:'shield',desc:'포인트마다 최대 생명력 12%, 생명력 흡수 1% 증가.',key:'vigor'},{name:'전투의 흐름',icon:'bolt',desc:'포인트마다 기력 회복 12%, 재사용 대기시간 감소 4%.',key:'flow'}]},
  mage:{name:'원소술사',role:'원거리 · 화염과 서리',color:'#66bdcf',icon:'staff',basic:'화염탄',baseHp:120,baseDamage:16,range:13,speed:5.3,
    skills:[{name:'서리 고리',icon:'frost',desc:'주변에 공격력 180% 피해를 주고 2.5초간 얼립니다.',cost:25,cd:4,mult:1.8,range:4.5},{name:'화염 폭풍',icon:'flame',desc:'조준 지점에 4초간 화염 지대. 초당 공격력 100% 피해.',cost:35,cd:6.5,mult:1,range:10},{name:'운석 낙하',icon:'meteor',desc:'조준 지점에 운석을 떨어뜨려 공격력 600% 광역 피해.',cost:60,cd:17,mult:6,range:12}],
    passives:[{name:'비전 증폭',icon:'staff',desc:'포인트마다 모든 공격력이 8% 증가합니다.',key:'might'},{name:'영혼 보호',icon:'shield',desc:'포인트마다 최대 생명력 12%, 생명력 흡수 1% 증가.',key:'vigor'},{name:'끝없는 마력',icon:'bolt',desc:'포인트마다 기력 회복 12%, 재사용 대기시간 감소 4%.',key:'flow'}]},
  ranger:{name:'사냥꾼',role:'원거리 · 관통과 연사',color:'#a5bf74',icon:'bow',basic:'속사',baseHp:135,baseDamage:13,range:15,speed:6,
    skills:[{name:'다중 사격',icon:'arrows',desc:'5발의 관통 화살을 부채꼴로 발사. 화살마다 공격력 130% 피해.',cost:25,cd:3.5,mult:1.3,range:14},{name:'맹독 덫',icon:'trap',desc:'조준 지점에 5초간 독 지대. 초당 공격력 90% 피해와 55% 둔화.',cost:30,cd:6,mult:.9,range:10},{name:'화살비',icon:'rain',desc:'조준 지점에 8차례 사격. 매회 공격력 80%의 광역 피해.',cost:55,cd:16,mult:.8,range:13}],
    passives:[{name:'예리한 조준',icon:'bow',desc:'포인트마다 모든 공격력이 8% 증가합니다.',key:'might'},{name:'야생의 생명',icon:'shield',desc:'포인트마다 최대 생명력 12%, 생명력 흡수 1% 증가.',key:'vigor'},{name:'사냥의 호흡',icon:'bolt',desc:'포인트마다 기력 회복 12%, 재사용 대기시간 감소 4%.',key:'flow'}]}
};
Object.assign(CLASSES,EXTRA_CLASSES);Object.assign(LEGENDS,EXTRA_LEGENDS);addExtraSkills(CLASSES,RUNES);
export const ROOMS=REGIONS;
export function playerSkill(p,index){const sourceIndex=p.profile.skillChoices?.[index]??index;return{...skillSpec(p.profile,index,CLASSES[p.cls].skills[sourceIndex],p.stats.cdr),sourceIndex};}
function validChoices(v){return Array.isArray(v)&&v.length===3&&new Set(v).size===3&&v.every(n=>Number.isInteger(n)&&n>=0&&n<5);}
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function seeded(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function id(){return globalThis.crypto?.randomUUID?.()??`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;}
export function xpNeeded(level){return Math.round(60+level*35+level*level*6);}
export function makeItem(cls,ilvl=1,rarity=0,rng=Math.random,forceLegend){
  const slot=['weapon','armor','ring','relic'][Math.floor(rng()*4)];
  return itemForSlot(slot,cls,ilvl,rarity,rng,forceLegend);
}
export function itemForSlot(slot,cls,ilvl=1,rarity=0,rng=Math.random,forceLegend){
  const bases={weapon:cls==='knight'?['장검','대검','고대 검']:cls==='mage'?['지팡이','화염봉','비전 홀']:['장궁','사냥꾼의 활','전투궁'],armor:['갑옷','외투','흉갑'],ring:['반지','인장','가락지'],relic:['성물','부적','목걸이']};
  const prefixes=['잊힌','갈망의','수호자의','서약의','심연의','새벽의','폭풍의','빛바랜'];
  const level=clamp(Math.round(ilvl),1,120),r=clamp(rarity,0,4);
  const power=Math.round((12+level*5)*(1+r*.17));
  let base=slot==='weapon'?Math.round((8+level*1.9)*RARITIES[r].mult):slot==='armor'?Math.round((19+level*4)*RARITIES[r].mult):Math.round((3+level*.65)*RARITIES[r].mult);
  const affixes=[];const pool=Object.keys(AFFIXES);const count=[0,1,2,3,3][r];
  for(let i=0;i<count;i++){const key=pool.splice(Math.floor(rng()*pool.length),1)[0];const ratio=.75+rng()*.5;const values={damage:3+level*.8,health:14+level*2.5,crit:3+level*.2,haste:5+level*.4,cdr:3+level*.18,leech:1+level*.1,armor:3+level*.15,resource:8+level*.6,skill:8+level*.8,speed:4+level*.2};affixes.push({key,value:Math.max(1,Math.round(values[key]*ratio*(1+r*.13)))});}
  const legendPool=Object.keys(LEGENDS).filter(k=>!LEGENDS[k].cls);const legend=r===4?(forceLegend??legendPool[Math.floor(rng()*legendPool.length)]):null;const weapon=slot==='weapon'?CLASS_WEAPONS[cls][Math.floor(rng()*CLASS_WEAPONS[cls].length)]:null;
  const name=legend?LEGENDS[legend].name:`${r?prefixes[Math.floor(rng()*prefixes.length)]+' ':''}${weapon?WEAPONS[weapon].name:bases[slot][Math.floor(rng()*3)]}`;
  return{id:id(),slot,cls,level,rarity:r,power,base,affixes,legend,name,upgrades:0,...(weapon?{weaponType:weapon}:{})};
}
export function freshProfile(cls){return{cls,level:1,xp:0,points:2,ranks:[1,1,1,0,0,0],runes:[0,0,0],bag:[],equipped:{weapon:itemForSlot('weapon',cls,1,0,()=>.1),armor:itemForSlot('armor',cls,1,0,()=>.1),ring:null,relic:null}};}
export function stats(profile){
  const c=CLASSES[profile.cls];let s={hp:c.baseHp+(profile.level-1)*13,damage:c.baseDamage+(profile.level-1)*2,crit:5,haste:0,cdr:0,leech:0,armor:0,resource:0,skill:0,speed:c.speed,legends:[]};
  for(const item of Object.values(profile.equipped)){if(!item)continue;if(item.slot==='weapon')s.damage+=item.base;else if(item.slot==='armor')s.hp+=item.base;else if(item.slot==='ring')s.damage+=item.base;else s.skill+=item.base;for(const a of item.affixes){if(a.key==='health')s.hp+=a.value;else if(a.key==='speed')s.speed+=c.speed*a.value/100;else s[a.key]+=a.value;}if(item.legend)s.legends.push(item.legend);}
  const [a,b,cRank]=profile.ranks.slice(3);
  if(profile.cls==='assassin'){s.crit+=a*4;s.hp*=1+b*.1;s.speed*=1+b*.03;s.resource+=cRank*15;s.cdr+=cRank*3;}
  else if(profile.cls==='necromancer'){s.skill+=a*12;s.hp*=1+b*.09;s.leech+=b*1.5;s.cdr+=cRank*4;s.resource+=cRank*10;}
  else if(profile.cls==='engineer'){s.damage*=1+a*.07;s.haste+=a*3;s.hp*=1+b*.1;s.armor+=b*2;s.cdr+=cRank*4;}
  else{s.damage*=1+a*.08;s.hp*=1+b*.12;s.leech+=b;s.resource+=cRank*12;s.cdr+=cRank*4;}
  if(s.legends.includes('blood'))s.leech+=8;
  s.hp=Math.round(s.hp);s.damage=Math.round(s.damage);s.crit=clamp(s.crit,0,75);s.armor=clamp(s.armor,0,60);s.cdr=clamp(s.cdr,0,55);s.haste=clamp(s.haste,0,120);s.leech=clamp(s.leech,0,30);s.speed=Math.min(s.speed,9);return s;
}
function validAffix(a){return !!(a&&Object.hasOwn(AFFIXES,a.key)&&Number.isFinite(a.value)&&a.value>=0&&a.value<=1000);}
function validItem(i){
  if(!(i&&typeof i.id==='string'&&i.id.length<100&&typeof i.name==='string'&&i.name.length<80&&Object.hasOwn(SLOTS,i.slot)&&Object.hasOwn(CLASSES,i.cls)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<=4&&Number.isFinite(i.level)&&i.level>=1&&i.level<=120&&Number.isFinite(i.power)&&i.power>=0&&i.power<10000&&Number.isFinite(i.base)&&i.base>=0&&i.base<5000&&Number.isInteger(i.upgrades)&&i.upgrades>=0&&i.upgrades<=5&&Array.isArray(i.affixes)&&i.affixes.length<=4&&i.affixes.every(validAffix)&&(!i.legend||Object.hasOwn(LEGENDS,i.legend))))return false;
  if(i.weaponType!==undefined&&!Object.hasOwn(WEAPONS,i.weaponType))return false;
  if(['favorite','junk'].some(k=>i[k]!==undefined&&typeof i[k]!=='boolean'))return false;
  if(i.enchantedIndex!=null&&(!Number.isInteger(i.enchantedIndex)||i.enchantedIndex<0||i.enchantedIndex>=i.affixes.length))return false;
  if(i.enchantRolls!==undefined&&(!Number.isInteger(i.enchantRolls)||i.enchantRolls<0||i.enchantRolls>100000))return false;
  if(i.enchantOffer){const o=i.enchantOffer;if(!Number.isInteger(o.index)||o.index!==i.enchantedIndex||!Array.isArray(o.options)||o.options.length!==2||!o.options.every(validAffix))return false;const other=i.affixes.filter((_,n)=>n!==o.index).map(a=>a.key);if(o.options.some(a=>other.includes(a.key)))return false;}
  return true;
}
export function validateSave(data){
  if(!data||data.version!==VERSION||!data.profiles||typeof data.profiles!=='object')return null;
  const p={};
  for(const [key,v] of Object.entries(data.profiles)){if(!(/^[01]:[a-z]+$/.test(key)&&Object.hasOwn(CLASSES,key.split(':')[1]))||!v||v.cls!==key.split(':')[1]||!Number.isInteger(v.level)||v.level<1||v.level>50||!Number.isFinite(v.xp)||v.xp<0||v.xp>=xpNeeded(v.level)||!Number.isInteger(v.points)||v.points<0||v.points>250||!Array.isArray(v.ranks)||v.ranks.length!==6||v.ranks.some((r,i)=>!Number.isInteger(r)||r<(i<3?1:0)||r>5)||!v.equipped||!Array.isArray(v.bag)||v.bag.length>72)return null;
    if(v.bag.some(i=>!validItem(i))||Object.entries(v.equipped).some(([slot,i])=>!Object.hasOwn(SLOTS,slot)||(i&&(!validItem(i)||i.slot!==slot))))return null;
    if(!v.equipped.weapon||!v.equipped.armor)return null;
    if(v.skillChoices!==undefined&&!validChoices(v.skillChoices))return null;
    if(v.loadouts?.some(l=>l?.skillChoices!==undefined&&!validChoices(l.skillChoices)))return null;
    if(v.overflow!==undefined&&(!Array.isArray(v.overflow)||v.overflow.some(i=>!validItem(i))))return null;
    const ids=[...v.bag,...(v.overflow||[]),...Object.values(v.equipped).filter(Boolean)].map(i=>i.id);if(new Set(ids).size!==ids.length)return null;
    const runes=v.runes??[0,0,0];if(!Array.isArray(runes)||runes.length!==3||runes.some((n,i)=>!Number.isInteger(n)||n<0||n>2||v.ranks[i]<RUNE_RANKS[n]))return null;
    if(v.loadouts!==undefined&&(!Array.isArray(v.loadouts)||v.loadouts.length>3||v.loadouts.some(l=>l&&(!l.equipment||Object.entries(l.equipment).some(([k,id])=>!Object.hasOwn(SLOTS,k)||(id!==null&&typeof id!=='string'))||!Array.isArray(l.ranks)||l.ranks.length!==6||l.ranks.some((r,i)=>!Number.isInteger(r)||r<(i<3?1:0)||r>5)||!Array.isArray(l.runes)||l.runes.length!==3||l.runes.some((n,i)=>!Number.isInteger(n)||n<0||n>2||l.ranks[i]<RUNE_RANKS[n])))))return null;
    p[key]=normalizeWeapons({...structuredClone(v),runes:[...runes]});
  }
  if(!Number.isSafeInteger(data.gold)||data.gold<0||data.gold>1e9||!Number.isInteger(data.bestDepth)||data.bestDepth<1||data.bestDepth>100)return null;
  if(data.shards!==undefined&&(!Number.isSafeInteger(data.shards)||data.shards<0||data.shards>1e9))return null;
  return{version:VERSION,profiles:p,shards:data.shards||0,gold:data.gold,bestDepth:data.bestDepth,settings:{boss:Object.hasOwn(BOSSES,data.settings?.boss)?data.settings.boss:'ember',impact:data.settings?.impact!==false,sound:data.settings?.sound!==false,volume:clamp(Number.isFinite(data.settings?.volume)?data.settings.volume:.45,0,1),difficulty:['adventure','standard','veteran'].includes(data.settings?.difficulty)?data.settings.difficulty:'adventure',particles:data.settings?.particles!==false,zoom:clamp(Number.isFinite(data.settings?.zoom)?data.settings.zoom:.88,.65,1.12)},lastClasses:Array.isArray(data.lastClasses)&&data.lastClasses.length>0&&data.lastClasses.every(x=>Object.hasOwn(CLASSES,x))?data.lastClasses.slice(0,2):['knight']};
}
export function freshSave(){return{version:VERSION,profiles:{},gold:0,shards:0,bestDepth:1,settings:{boss:'ember',impact:true,sound:true,volume:.45,difficulty:'adventure',particles:true,zoom:.88},lastClasses:['knight']};}
export class Game{
  constructor(save=freshSave(),seed=Date.now()){
    this.save=save;this.rng=seeded(seed);this.players=[];this.enemies=[];this.shots=[];this.zones=[];this.fx=[];this.texts=[];this.drops=[];this.events=[];this.chests=[];this.rooms=ROOMS.map((r,i)=>({...r,id:i,state:'locked',discovered:i===0}));this.state='title';this.paused=false;this.time=0;this.depth=1;this.room=0;this.kills=0;this.runGold=0;this.runLegends=0;this.portal=null;this.shake=0;this.dropTurn=0;this.completed=false;this.titleClock=0;this.summons=[];this.pending=[];this.hitStop=0;this.flash=0;this.townChannel=null;this.townReturn=null;this.obstacles=this.makeObstacles();
  }
  makeObstacles(){return worldObjects().filter(o=>o.solid);}
  event(type,data={}){this.events.push({type,...data});}
  toast(text,kind='normal',subtitle=''){this.event('toast',{text,kind,subtitle});}
  begin(classes=['knight'],depth=1){
    this.bossKey=this.save.settings.boss||'ember';this.rift={phase:'ready',progress:0,goal:100,elapsed:0,limit:900,timed:false};this.summons=[];this.pending=[];this.hitStop=0;this.flash=0;this.townChannel=null;this.townReturn=null;
    this.save.lastClasses=classes;this.depth=clamp(Math.floor(depth),1,this.save.bestDepth);this.players=classes.map((cls,index)=>{const key=`${index}:${cls}`;const profile=this.save.profiles[key]??freshProfile(cls);normalizeWeapons(profile);this.save.profiles[key]=profile;profile.runes??=[0,0,0];profile.skillChoices??=[0,1,2];const s=stats(profile);return{id:index,cls,profile,stats:s,x:index*1.5-.75,z:4.5,vx:0,vz:0,face:{x:0,z:-1},hp:s.hp,mana:100,cd:[0,0,0],attackCd:0,potionCd:0,frostCd:0,chargeResource:0,focus:0,heat:0,overheated:0,overdrive:0,bear:0,ward:0,battleBuff:0,traitHits:0,lastSkill:-1,legendCd:0,actionPose:null,invuln:1,anim:0,animType:'idle',walk:0,down:false,revive:0,combo:0,mark:null,hit:0};});
    this.enemies=[];this.shots=[];this.zones=[];this.fx=[];this.texts=[];this.drops=[];this.events=[];this.chests=[];this.rooms=ROOMS.map((r,i)=>({...r,id:i,state:i===0?'clear':i===4?'locked':'active',discovered:i===0}));this.room=0;this.time=0;this.kills=0;this.runGold=0;this.runLegends=0;this.dropTurn=0;this.portal=null;this.completed=false;this.paused=false;this.state='playing';for(let i=1;i<4;i++)this.spawnRoom(i,true);this.room=0;this.toast('새벽불 마을 · 장비를 정비하고 균열에 도전하세요.','normal','C 마을 정비 · G 지도 · B 마을 귀환');this.event('save');
  }
  enterRift(){if(this.state!=='playing'||this.rift?.phase!=='ready'||!this.partyInTown())return false;for(const p of this.players){p.x=p.id*2-1;p.z=-23;p.invuln=2;p.mark=null;}this.startRift();return true;}
  startRift(){if(this.rift?.phase!=='ready')return;this.rift.phase='hunting';this.toast('균열 시작 · 적을 처치해 진행도를 채우세요.','normal','정예는 더 많은 진행도 · 15분 안에 완료하면 추가 보상');}
  awakenGuardian(){if(this.rift.phase!=='hunting')return;this.rift.phase='guardian';this.rift.progress=this.rift.goal;this.spawnRoom(4,true);this.rooms[4].discovered=true;this.targetRegion=4;this.toast('균열 수호자가 모습을 드러냈습니다.','legendary',BOSSES[this.bossKey].name+' · 지도에 위치 표시');this.effect('pillar',ROOMS[4].x,ROOMS[4].z-2,'#ffbe94',{r:5,life:2});this.event('sound',{name:'boss'});}
  profileRefresh(p){const before=p.stats?.hp??0;p.stats=stats(p.profile);for(const m of this.summons.filter(m=>m.owner===p&&m.permanent))if(!p.stats.legends.includes('eternal')){m.permanent=false;m.life=12;}if(before&&p.stats.hp>before)p.hp+=p.stats.hp-before;p.hp=clamp(p.hp,0,p.stats.hp);this.event('save');}
  equip(index,itemId){const p=this.players[index];if(!p)return false;const at=p.profile.bag.findIndex(i=>i.id===itemId);if(at<0)return false;const item=p.profile.bag[at];if(item.slot==='weapon'&&(item.cls!==p.cls||item.weaponType!==CLASS_WEAPONS[p.cls][0]))return false;const old=p.profile.equipped[item.slot];p.profile.bag.splice(at,1);if(old)p.profile.bag.push(old);p.profile.equipped[item.slot]=item;item.junk=false;this.profileRefresh(p);this.event('sound',{name:'equip'});return true;}
  sell(index,itemId){const p=this.players[index];if(!p)return false;const at=p.profile.bag.findIndex(i=>i.id===itemId);if(at<0)return false;const item=p.profile.bag[at];if(this.protectedItem(p,item)||item.enchantOffer)return false;this.save.gold+=this.sellValue(item);p.profile.bag.splice(at,1);this.event('save');this.event('sound',{name:'coin'});return true;}
  sellValue(i){return 8+i.level*3+i.rarity*14+i.upgrades*12;}
  upgradeCost(i){return 45+i.level*8+i.upgrades*65;}
  upgrade(index,itemId,useShards=false){const p=this.players[index];const i=[...p.profile.bag,...Object.values(p.profile.equipped)].find(i=>i?.id===itemId);if(!i||i.upgrades>=5)return false;const metal=4*(i.upgrades+1),cost=Math.ceil(this.upgradeCost(i)*(useShards?.5:1));if(this.save.gold<cost||(useShards&&(this.save.shards||0)<metal))return false;this.save.gold-=cost;if(useShards)this.save.shards-=metal;i.base=Math.ceil(i.base*1.12);i.power+=7;i.upgrades++;this.profileRefresh(p);this.event('sound',{name:'level'});return true;}
  learn(index,node){const p=this.players[index];if(!p||!Number.isInteger(node)||node<0||node>5||p.profile.points<1||p.profile.ranks[node]>=5)return false;p.profile.points--;p.profile.ranks[node]++;this.profileRefresh(p);this.event('sound',{name:'level'});return true;}
  respec(index){const p=this.players[index];if(!p)return;const spent=p.profile.ranks.reduce((a,r,i)=>a+r-(i<3?1:0),0);p.profile.points+=spent;p.profile.ranks=[1,1,1,0,0,0];p.profile.runes=[0,0,0];this.profileRefresh(p);}
  chooseSkill(index,slot,choice){const p=this.players[index];if(!p||!inTown(p)||!Number.isInteger(slot)||slot<0||slot>2||!Number.isInteger(choice)||choice<0||choice>=CLASSES[p.cls].skills.length)return false;const choices=p.profile.skillChoices||[0,1,2];if(choices.some((n,i)=>i!==slot&&n===choice))return false;p.profile.skillChoices=[...choices];p.profile.skillChoices[slot]=choice;p.profile.runes[slot]=0;this.summons=this.summons.filter(m=>m.owner!==p);this.zones=this.zones.filter(z=>z.owner!==p);this.event('save');return true;}
  chooseRune(index,skill,choice){const p=this.players[index];if(!p||!Number.isInteger(skill)||skill<0||skill>2||!Number.isInteger(choice)||choice<0||choice>2||p.profile.ranks[skill]<RUNE_RANKS[choice])return false;p.profile.runes??=[0,0,0];p.profile.runes[skill]=choice;this.event('save');this.event('sound',{name:'equip'});return true;}
  findItem(index,itemId){const p=this.players[index];return p?[...p.profile.bag,...Object.values(p.profile.equipped)].find(i=>i?.id===itemId):null;}
  enchant(index,itemId,affixIndex){
    const item=this.findItem(index,itemId);if(!item||!Number.isInteger(affixIndex)||affixIndex<0||affixIndex>=item.affixes.length||item.enchantOffer||(item.enchantedIndex!=null&&item.enchantedIndex!==affixIndex))return false;
    const cost=enchantCost(item);if(this.save.gold<cost)return false;
    const other=item.affixes.filter((_,i)=>i!==affixIndex).map(a=>a.key),pool=Object.keys(AFFIXES).filter(k=>!other.includes(k)),options=[];
    for(let i=0;i<2;i++){const key=pool.splice(Math.floor(this.rng()*pool.length),1)[0];options.push({key,value:affixValue(key,item.level,item.rarity,this.rng)});}
    this.save.gold-=cost;item.enchantedIndex=affixIndex;item.enchantRolls=(item.enchantRolls||0)+1;item.enchantOffer={index:affixIndex,options};this.event('save');this.event('sound',{name:'spell'});return true;
  }
  resolveEnchant(index,itemId,choice){const p=this.players[index],item=this.findItem(index,itemId);if(!item?.enchantOffer||!Number.isInteger(choice)||choice< -1||choice>1)return false;if(choice>=0)item.affixes[item.enchantOffer.index]={...item.enchantOffer.options[choice]};delete item.enchantOffer;this.profileRefresh(p);this.event('sound',{name:'equip'});return true;}
  protectedItem(p,item){return !!item.favorite||p.profile.loadouts?.some(l=>l&&Object.values(l.equipment).includes(item.id));}
  toggleFavorite(index,id){const p=this.players[index],item=this.findItem(index,id);if(!p||!item)return false;item.favorite=!item.favorite;if(item.favorite)item.junk=false;this.event('save');return true;}
  toggleJunk(index,id){const p=this.players[index],item=p?.profile.bag.find(i=>i.id===id);if(!item||this.protectedItem(p,item)||item.enchantOffer)return false;item.junk=!item.junk;this.event('save');return true;}
  salvageable(index){const p=this.players[index];return p?p.profile.bag.filter(i=>i.junk&&!this.protectedItem(p,i)&&!i.enchantOffer):[];}
  salvage(index,ids){const p=this.players[index];if(!p||!Array.isArray(ids))return false;const candidates=this.salvageable(index).filter(i=>ids.includes(i.id));if(!candidates.length)return false;const metals=candidates.reduce((a,i)=>a+1+i.rarity*2,0);const selected=new Set(candidates.map(i=>i.id));p.profile.bag=p.profile.bag.filter(i=>!selected.has(i.id));this.save.shards=(this.save.shards||0)+metals;this.toast(`${candidates.length}개 분해 · 강화 파편 +${metals}`);this.event('save');return true;}
  saveLoadout(index,slot){const p=this.players[index];if(!p||!Number.isInteger(slot)||slot<0||slot>2)return false;p.profile.loadouts??=[null,null,null];p.profile.loadouts[slot]={equipment:Object.fromEntries(Object.keys(SLOTS).map(k=>[k,p.profile.equipped[k]?.id||null])),ranks:[...p.profile.ranks],runes:[...p.profile.runes],skillChoices:[...(p.profile.skillChoices||[0,1,2])]};this.event('save');return true;}
  clearLoadout(index,slot){const p=this.players[index];if(!p?.profile.loadouts?.[slot])return false;p.profile.loadouts[slot]=null;this.event('save');return true;}
  applyLoadout(index,slot){const p=this.players[index],l=p?.profile.loadouts?.[slot];if(!l)return false;const choices=l.skillChoices||[0,1,2];if(JSON.stringify(choices)!==JSON.stringify(p.profile.skillChoices||[0,1,2])&&!inTown(p)){this.toast('스킬 구성이 다른 빌드는 마을에서 불러오세요.');return false;}const all=[...p.profile.bag,...Object.values(p.profile.equipped).filter(Boolean)],equipment={};for(const k of Object.keys(SLOTS)){equipment[k]=l.equipment[k]?all.find(i=>i.id===l.equipment[k]&&i.slot===k):null;if(l.equipment[k]&&!equipment[k]){this.toast('저장된 장비가 없어 빌드를 불러올 수 없습니다.','error');return false;}}if(!equipment.weapon||!equipment.armor)return false;const total=p.profile.points+p.profile.ranks.reduce((a,r,i)=>a+r-(i<3?1:0),0),spent=l.ranks.reduce((a,r,i)=>a+r-(i<3?1:0),0);if(spent>total)return false;const equippedIds=new Set(Object.values(equipment).filter(Boolean).map(i=>i.id));const bag=all.filter(i=>!equippedIds.has(i.id));if(bag.length>72)return false;p.profile.bag=bag;p.profile.equipped=equipment;for(const item of Object.values(equipment))if(item)item.junk=false;p.profile.ranks=[...l.ranks];p.profile.runes=[...l.runes];if(JSON.stringify(p.profile.skillChoices||[0,1,2])!==JSON.stringify(choices)){this.summons=this.summons.filter(m=>m.owner!==p);this.zones=this.zones.filter(z=>z.owner!==p);}p.profile.skillChoices=[...(l.skillChoices||[0,1,2])];p.profile.points=total-spent;this.profileRefresh(p);this.event('sound',{name:'equip'});return true;}
  spawnRoom(index,quiet=false){
    const r=this.rooms[index];if(index===0)return;r.state='active';r.discovered=!quiet;if(!quiet)this.room=index;
    if(index===4){let x=r.x,z=r.z-2;for(let j=0;j<24;j++){if(this.walkable(x,z,1.3)&&this.players.every(p=>distance(p,{x,z})>6))break;x=r.x+Math.cos(j*2.4)*8;z=r.z+Math.sin(j*2.4)*8;}this.spawnEnemy('boss',x,z,index);if(!quiet)this.toast(`${BOSSES[this.bossKey].short}의 영역입니다.`,'legendary',BOSSES[this.bossKey].desc);if(!quiet)this.event('sound',{name:'boss'});return;}
    const kinds=['grunt','hound','wisp','brute','cultist','grunt'];
    for(const pack of FIELD_PACKS.filter(p=>p.group===index))for(let i=0;i<3;i++){
      let x=pack.x,z=pack.z;for(let attempt=0;attempt<24;attempt++){const a=i*Math.PI*2/3+attempt*.61,rad=1.6+attempt*.14;x=pack.x+Math.cos(a)*rad;z=pack.z+Math.sin(a)*rad;if(this.walkable(x,z,.85)&&!inTown({x,z}))break;}
      const type=i===2&&pack.id%4===3?'elite':kinds[(pack.id+i+Math.floor(this.rng()*3))%kinds.length];const e=this.spawnEnemy(type,x,z,index);e.packId=pack.id;
    }
  }
  spawnEnemy(type,x,z,room){
    const types={grunt:{hp:55,speed:2.1,damage:9,r:.48,xp:18,name:'망각의 병사'},hound:{hp:42,speed:3.5,damage:8,r:.43,xp:20,name:'재의 사냥개'},brute:{hp:155,speed:1.5,damage:20,r:.75,xp:40,name:'파쇄자'},wisp:{hp:52,speed:1.9,damage:11,r:.45,xp:23,name:'떠도는 불씨'},cultist:{hp:110,speed:1.8,damage:13,r:.52,xp:35,name:'침묵의 사제'},elite:{hp:280,speed:2,damage:17,r:.68,xp:70,name:'정예 · 폭풍의 망령'},boss:{hp:4400,speed:1.55,damage:26,r:1.25,xp:260,name:'모르바스'}};
    const t=types[type];const d={adventure:.78,standard:1,veteran:1.25}[this.save.settings.difficulty];const scaling=Math.pow(1.28,this.depth-1);const coop=this.players.length===2?1.65:1;
    const hp=Math.round(t.hp*scaling*coop*(type==='boss'?1:1+(room||0)*.1));const e={id:id(),type,x,z,spawnX:x,spawnZ:z,room,hp,maxHp:hp,speed:t.speed,damage:t.damage*scaling*d,r:t.r,xp:t.xp,name:t.name,face:{x:0,z:1},cd:1+this.rng(),state:'idle',wind:0,action:null,hit:0,frozen:0,slow:0,anim:0,walk:this.rng()*10,knockX:0,knockZ:0,phase:0,dead:false,deathT:0};if(type==='boss'){e.bossKey=this.bossKey||'ember';e.name=BOSSES[e.bossKey].name;}this.enemies.push(e);return e;
  }
  walkable(x,z,radius=.35){if(x<WORLD.minX+radius||x>WORLD.maxX-radius||z<WORLD.minZ+radius||z>WORLD.maxZ-radius)return false;return !this.obstacles.some(o=>o.type==='house'?Math.abs(x-o.x)<o.w/2+radius&&Math.abs(z-o.z)<o.d/2+radius:Math.hypot(x-o.x,z-o.z)<(o.r||.5)+radius);}
  allowed(){return true;}
  move(entity,dx,dz,radius=.35,gate=true){const enemy=!gate&&Number.isInteger(entity.room),fits=(x,z)=>!enemy||!inTown({x,z});const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.25));for(let i=0;i<steps;i++){const sx=dx/steps,sz=dz/steps;if(fits(entity.x+sx,entity.z)&&this.walkable(entity.x+sx,entity.z,radius))entity.x+=sx;if(fits(entity.x,entity.z+sz)&&this.walkable(entity.x,entity.z+sz,radius))entity.z+=sz;}}
  inTown(p){return inTown(p);}
  partyInTown(){return this.players.length>0&&this.players.every(p=>inTown(p));}
  requestTown(){if(this.state!=='playing'||this.partyInTown()||this.players.some(p=>p.down)||this.townChannel)return false;if(this.players.some(p=>this.enemies.some(e=>!e.dead&&distance(p,e)<12))){this.toast('적에게서 조금 더 벗어난 뒤 귀환할 수 있습니다.','error');return false;}for(const p of this.players)p.mark=null;this.townChannel={remaining:2.5,origins:this.players.map(p=>({x:p.x,z:p.z}))};this.toast('마을 귀환 · 2.5초간 가만히 계세요.');return true;}
  returnToField(){if(!this.partyInTown()||!this.townReturn)return false;const points=this.townReturn;for(const p of this.players){const q=points[p.id];p.x=q.x;p.z=q.z;p.mark=null;p.invuln=2;}this.townReturn=null;this.summons=[];this.pending=[];this.event('sound',{name:'spell'});return true;}
  restTown(){if(!this.partyInTown())return false;for(const p of this.players){p.hp=p.stats.hp;p.mana=100;p.potionCd=0;p.down=false;p.heat=0;p.overheated=0;}this.toast('생명력·기력·물약을 모두 회복했습니다.');this.event('sound',{name:'heal'});return true;}
  closest(p,range=100){let found=null,best=range;for(const e of this.enemies){if(e.dead)continue;const d=distance(p,e);if(d<best){found=e;best=d;}}return found;}
  alivePlayers(){return this.players.filter(p=>!p.down);}
  target(e){return this.alivePlayers().filter(p=>!inTown(p)).sort((a,b)=>distance(a,e)-distance(b,e))[0];}
  aim(p,input){let dx,dz;if(input?.aim){dx=input.aim.x-p.x;dz=input.aim.z-p.z;}else{const e=this.closest(p,15);if(e){dx=e.x-p.x;dz=e.z-p.z;}else return p.face;}const n=Math.hypot(dx,dz);return n>.05?{x:dx/n,z:dz/n}:p.face;}
  aimPoint(p,input,range){if(input?.aim){const d=distance(p,input.aim);return{x:p.x+(input.aim.x-p.x)*Math.min(1,range/(d||1)),z:p.z+(input.aim.z-p.z)*Math.min(1,range/(d||1))};}const e=this.closest(p,range);return e?{x:e.x,z:e.z}:{x:p.x+p.face.x*range*.65,z:p.z+p.face.z*range*.65};}
  basic(p,input){
    if(p.down||inTown(p)||p.attackCd>0||p.overheated>0)return false;
    const type=p.bear>0?'greatsword':weaponType(p.profile.equipped.weapon,p.cls),w=p.bear>0?{...WEAPONS.greatsword,cd:.6,mult:p.profile.runes[p.profile.skillChoices?.indexOf(2)??2]===1?1.5:p.profile.runes[p.profile.skillChoices?.indexOf(2)??2]===2?2.3:1.8,range:3.8,arc:2.8,color:'#d7eaa1'}:WEAPONS[type];p.face=this.aim(p,input);const haste=p.stats.haste+(p.overdrive>0?(p.profile.runes[p.profile.skillChoices?.indexOf(2)??2]===1?40:60):0);p.attackCd=w.cd/(1+haste/100);p.anim=Math.min(.6,p.attackCd);p.animType='attack';p.combo=(p.combo+1)%3;
    let damage=p.stats.damage*w.mult*(p.combo===0?1.2:1);if(p.cls==='ranger'&&p.focus>=2){damage*=1.8;p.focus=0;this.effect('aimburst',p.x,p.z,'#d8fba0',{r:1.3,life:.4});}if(p.overdrive>0&&p.profile.runes[p.profile.skillChoices?.indexOf(2)??2]===2)damage*=1.3;
    if(p.cls==='engineer'&&p.overdrive<=0){p.heat=Math.min(100,p.heat+12);if(p.heat>=100){p.overheated=1.8;this.toast('과열 · 냉각탄으로 즉시 해제할 수 있습니다.');}}
    p.actionPose={type,life:p.anim,total:p.anim,combo:p.combo,angle:Math.atan2(p.face.z,p.face.x)};
    const angle=Math.atan2(p.face.z,p.face.x);
    if(w.mode==='melee'||w.mode==='thrust'){
      const delay=Math.min(.13,p.attackCd*.22);this.pending.push({delay,owner:p,x:p.x,z:p.z,angle,range:w.range,arc:w.arc,damage,type,combo:p.combo});
      this.effect('windup',p.x,p.z,w.color,{r:w.range*.65,angle,life:delay});
    }else{
      const n=w.pellets||1;for(let j=0;j<n;j++){const a=angle+(j-(n-1)/2)*.12;this.fire(p.x,p.z,Math.cos(a),Math.sin(a),w.shot,damage,p,{speed:w.speed,life:w.range/w.speed,pierce:w.pierce,radius:type==='crossbow'?.23:.27});}
      this.effect('muzzle',p.x+p.face.x*.6,p.z+p.face.z*.6,w.color,{r:type==='cannon'?1.2:.65,angle,life:.22});
    }
    p.mana=clamp(p.mana+6,0,100);this.event('sound',{name:w.sound});return true;
  }
  resolveStrike(a){const p=a.owner;if(p.down)return;const w=WEAPONS[a.type];this.effect(a.type==='spear'?'thrust':'slash',a.x,a.z,w.color,{r:a.range,angle:a.angle,life:a.type==='greatsword'?.38:.24,combo:a.combo,heavy:a.type==='greatsword'});let connected=false;for(const e of this.enemies){if(e.dead)continue;const dx=e.x-a.x,dz=e.z-a.z,d=Math.hypot(dx,dz),dot=(dx*Math.cos(a.angle)+dz*Math.sin(a.angle))/(d||1);if(d<a.range+e.r&&(dot>Math.cos(a.arc/2)||d<.8)){connected=true;this.hitEnemy(e,a.damage,p,a.monk?'skill':'basic');if(a.monk){p.chargeResource=Math.min(6,p.chargeResource+1);if(a.freeze)this.stun(e,.5);}this.knock(e,{x:a.x,z:a.z},a.type==='greatsword'?2.2:.6);}}if(connected){this.impact(a.type==='greatsword'?.045:.022,a.type==='greatsword'?5:2);}}
  impact(stop,shake){if(this.save.settings.impact===false)return;this.hitStop=Math.max(this.hitStop,stop);this.shake=Math.max(this.shake,shake);this.flash=Math.max(this.flash,.1);}
  summon(p,type,count,point,damage,opts={}){const existing=this.summons.filter(s=>s.owner===p&&s.type===type);const cap=opts.cap||(type==='turret'?2:4);for(let i=0;i<count;i++){if(existing.length>=cap){const old=existing.shift();this.summons=this.summons.filter(s=>s!==old);}const a=i*2.4,s={type,owner:p,x:point.x+Math.cos(a)*1.1,z:point.z+Math.sin(a)*1.1,life:opts.life||12,cd:.2+i*.15,damage,range:opts.range||10,interval:opts.interval||1,angle:0};if(!this.walkable(s.x,s.z,.4)){s.x=p.x;s.z=p.z;}this.summons.push(s);existing.push(s);this.effect('summon',s.x,s.z,type==='turret'?'#ffce86':'#83ebd0',{r:1.5,life:.8});}}
  skill(p,index,input){
    if(p.down||inTown(p)||!Number.isInteger(index)||index<0||index>2||p.cd[index]>0)return false;const slot=index,spec=playerSkill(p,index),rune=spec.rune;if(p.mana<spec.cost)return false;
    p.mana-=spec.cost;p.cd[index]=spec.cd;p.face=this.aim(p,input);p.anim=.55;p.animType='skill';p.actionPose={type:'skill',life:.55,total:.55,angle:Math.atan2(p.face.z,p.face.x),combo:index};
    let damage=p.stats.damage*spec.mult*(1+(p.profile.ranks[index]-1)*.22)*(1+p.stats.skill/100);const vortex=index===0&&p.stats.legends.includes('vortex');if(vortex)damage*=1.35;const range=spec.range*(vortex?1.35:1),point=this.aimPoint(p,input,range),resource=p.chargeResource;
    index=spec.sourceIndex;
    if(p.cls==='knight'&&resource>=5){damage*=1.5;p.chargeResource=0;this.effect('empower',p.x,p.z,'#ffd483',{r:3,life:.5});}
    if(p.cls==='mage'){if(resource>=3){damage*=1.45;p.chargeResource=0;this.effect('empower',p.x,p.z,'#8cddff',{r:3,life:.5});}else if(p.lastSkill!==index&&p.lastSkill>=0)p.chargeResource=Math.min(3,resource+1);p.lastSkill=index;}
    if(p.cls==='assassin'&&index===0){damage*=1+resource*.2;p.chargeResource=0;}
    const cue=skillCue(p,index,range,p.cls==='assassin'&&index===4?(this.closest(p,range)||p):point,rune);this.effect(cue.type,cue.x,cue.z,cue.color,cue);this.effect('castsigil',p.x,p.z,CLASSES[p.cls].color,{r:index===2?2.2:1.1,life:.45});
    if(p.cls==='knight'){
      if(index===0){const color=rune===2?'#ed9585':'#edc178';this.effect('spin',p.x,p.z,color,{r:range,life:.55});let hits=0;for(const e of this.enemies)if(!e.dead&&distance(p,e)<range+e.r){hits++;this.hitEnemy(e,damage,p,'skill');this.knock(e,p,rune===1?-2.6:3);}if(rune===2&&hits){const heal=Math.min(5,hits)*p.stats.hp*.04;p.hp=Math.min(p.stats.hp,p.hp+heal);this.float(p,'+'+Math.round(heal),'#a7dfb4');}}
      if(index===1){const angle=Math.atan2(p.face.z,p.face.x),spread=rune===1?[-.28,0,.28]:[0];for(const offset of spread)this.fire(p.x,p.z,Math.cos(angle+offset),Math.sin(angle+offset),'wave',damage,p,{speed:12,life:.85,pierce:true,radius:rune===1?.7:1.1,stun:rune===2?3:1.5,kind:'skill'});this.effect('burst',p.x,p.z,'#f1c87e',{r:1.3,life:.35});}
      if(index===2){p.invuln=rune===1?6:rune===2?1:4;this.aoe(p.x,p.z,range,damage,p,'#ffbb73');this.effect('pillar',p.x,p.z,'#ffe0a3',{r:range,life:1.3});}
    }else if(p.cls==='mage'){
      if(index===0){if(rune===1){for(let i=0;i<8;i++){const a=i*Math.PI/4;this.fire(p.x,p.z,Math.cos(a),Math.sin(a),'ice',damage,p,{speed:11,life:1.25,pierce:true,radius:.3,stun:1.6,kind:'skill'});}}else{this.aoe(p.x,p.z,range,damage,p,'#a6e5f5',rune===2?4:2.5);this.effect('frost',p.x,p.z,'#94e9ff',{r:range,life:.85});}}
      if(index===1){if(rune===2)this.aoe(point.x,point.z,3,damage*3.2,p,'#ffac76');else this.zone(rune===1?p.x:point.x,rune===1?p.z:point.z,3,4,damage,p,'fire',{follow:rune===1});}
      if(index===2){const offsets=rune===1?[[0,-2.5],[-2.3,1.4],[2.3,1.4]]:[[0,0]];for(const [dx,dz]of offsets){const r=rune===1?2.7:4.2;this.zone(point.x+dx,point.z+dz,r,.85,0,p,'meteor',{delay:.7,burst:damage,starfire:p.stats.legends.includes('starfire')});this.effect('meteor',point.x+dx,point.z+dz,'#ffad71',{life:.7,r});}}
    }else if(p.cls==='ranger'){
      if(index===0){const a=Math.atan2(p.face.z,p.face.x),spread=rune===1?[-.045,0,.045]:[-.34,-.17,0,.17,.34];for(const offset of spread)this.fire(p.x,p.z,Math.cos(a+offset),Math.sin(a+offset),rune===2?'ice':'arrow',damage,p,{speed:18,life:1.1,pierce:true,radius:.4,stun:rune===2?1.3:0,kind:'skill',seeker:p.stats.legends.includes('seeker')});}
      if(index===1){if(rune===1){this.zone(point.x,point.z,3.5,.9,0,p,'trap',{delay:.7,burst:damage*3});this.effect('frost',point.x,point.z,'#c5cf83',{life:.7,r:3.5});}else this.zone(point.x,point.z,3.1,5,damage,p,'poison',{mark:rune===2});}
      if(index===2)this.zone(rune===1?p.x:point.x,rune===1?p.z:point.z,rune===2?2.7:4.2,4,damage*2,p,'rain',{follow:rune===1});
    }
    if(p.cls==='assassin'){
      if(index===0){this.aoe(p.x,p.z,range,damage,p,'#dcb4ff');this.effect('crosscut',p.x,p.z,'#e5beff',{r:range,life:.4});if(rune===1)for(const e of this.enemies)if(!e.dead&&distance(e,p)<range)e.marked=3;if(rune===2)p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*resource*.03);if(resource>=3&&p.stats.legends.includes('shadow'))this.zone(p.x,p.z,range,.5,0,p,'shadow',{delay:.3,burst:damage*.7});}
      if(index===1){p.invuln=rune===1?3:2;this.aoe(p.x,p.z,range,damage,p,'#bb92e6',rune===2?.5:1.5);this.effect('smoke',p.x,p.z,'#bd91ea',{r:range,life:1});}
      if(index===2)this.zone(p.x,p.z,rune===2?2.5:3.5,rune===1?9:6,damage,p,'blades',{follow:true});
    }
    if(p.cls==='necromancer'){
      if(index===0){const bonus=p.stats.legends.includes('legion')?2:0,cap=(rune===2?5:4)+bonus,count=Math.min(cap,2+Math.floor(resource/2)+(rune===2?1:0)+bonus);p.chargeResource=0;this.summon(p,'wraith',count,p,damage,{life:rune===1?18:12,cap});if(p.stats.legends.includes('ossuary')){this.summon(p,'archer',2,p,damage*.8,{life:14,cap:2,range:13,interval:.8});this.summon(p,'golem',1,p,damage*2.8,{life:14,cap:1,range:12,interval:1.6});}if(p.stats.legends.includes('eternal'))for(const m of this.summons.filter(m=>m.owner===p)){m.life=Infinity;m.permanent=true;}}

      if(index===1)this.zone(rune===1?p.x:point.x,rune===1?p.z:point.z,3.5,5,damage,p,'curse',{mark:true,follow:rune===1,freeze:rune===2});
      if(index===2){const minions=this.summons.filter(s=>s.owner===p&&['wraith','archer','golem'].includes(s.type)),before=this.enemies.reduce((a,e)=>a+Math.max(0,e.hp),0);this.aoe(point.x,point.z,4,damage*(1+minions.length*.25),p,'#9aefd7');this.effect('soulburst',point.x,point.z,'#94f5d1',{r:4,life:.85});if(p.stats.legends.includes('requiem'))for(const m of minions)this.aoe(m.x,m.z,2.8,p.stats.damage*1.2,p,'#b3fae0');if(rune===1){const dealt=before-this.enemies.reduce((a,e)=>a+Math.max(0,e.hp),0);p.hp=Math.min(p.stats.hp,p.hp+Math.min(p.stats.hp*.25,dealt*.08));}}
    }
    if(p.cls==='engineer'){
      if(index===0)this.summon(p,'turret',p.stats.legends.includes('battery')?2:1,point,damage,{life:rune===1?8:10,range:rune===1?16:11,interval:rune===2?.4:.7,cap:p.stats.legends.includes('battery')?4:2});
      if(index===1){p.heat=0;p.overheated=0;this.aoe(point.x,point.z,3.4,damage,p,'#91e1ff',rune===1?3:rune===2?1:2);if(p.stats.legends.includes('overdrive'))for(const t of this.summons.filter(s=>s.owner===p&&s.type==='turret')){t.life=Math.min(20,t.life+3);const e=this.closest(t,t.range);if(e){this.effect('lightning',t.x,t.z,'#ffe6a0',{tx:e.x,tz:e.z,life:.3});this.hitEnemy(e,p.stats.damage*1.5,p,'legend',false);}}}
      if(index===2){p.overdrive=(rune===1?9:rune===2?4:6)+(p.profile.ranks[slot]-1)*.6;p.heat=0;p.overheated=0;this.effect('empower',p.x,p.z,'#ffd582',{r:3,life:1});}
    }
    if(p.cls==='druid'){
      if(index===0){this.zone(point.x,point.z,rune===2?4.25:3.4,rune===2?7:5,damage,p,'roots',{root:rune!==1,follow:p.bear>0&&p.stats.legends.includes('wildstorm')});p.chargeResource=Math.min(6,resource+2);}
      if(index===1){this.summon(p,'wolf',rune===1?3:2,p,damage,{life:14,range:12,interval:.85,cap:3});for(const m of this.summons.filter(m=>m.owner===p&&m.type==='wolf'))m.freeze=rune===2;p.chargeResource=Math.min(6,resource+2);}
      if(index===2){p.bear=(rune===2?5:7)+resource*.5;p.chargeResource=0;this.aoe(p.x,p.z,range,damage,p,'#d8e7a0',1);if(p.stats.legends.includes('wildstorm'))for(const z of this.zones)if(z.owner===p&&z.type==='roots')z.follow=true;if(p.stats.legends.includes('wildheart'))for(const m of this.summons.filter(m=>m.owner===p&&m.type==='wolf'))m.life=Math.min(24,m.life+5);}
    }
    if(p.cls==='monk'){
      if(index===0)for(let i=0;i<3;i++)this.pending.push({delay:.08+i*.14,owner:p,x:p.x,z:p.z,angle:Math.atan2(p.face.z,p.face.x),range,arc:1.8,damage,type:'spear',combo:i,monk:true,freeze:rune===1});
      if(index===1){p.ward=5;p.chargeResource=Math.min(6,resource+2);this.aoe(p.x,p.z,range,damage,p,'#b6efff',rune===2?3:2);if(rune===1)p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*.2);}
      if(index===2){damage*=1+resource*.25;p.chargeResource=0;this.aoe(p.x,p.z,range,damage,p,'#91ddff');if(rune===1)this.zone(p.x,p.z,range,3,p.stats.damage*.7,p,'thunder',{});if(p.stats.legends.includes('thunder'))this.zone(p.x,p.z,range,.6,0,p,'thunder',{delay:.4,burst:damage*.6});}
    }
    if(index>=3){
      if(p.cls==='knight'){if(index===3){p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*.2);p.battleBuff=5;}else{this.aoe(p.x,p.z,range,damage,p,'#ffd19a',2);for(const e of this.enemies)if(!e.dead&&distance(p,e)<range)this.knock(e,p,-2);}}
      if(p.cls==='mage'){if(index===3){let from=p;for(const e of this.enemies.filter(e=>!e.dead&&distance(p,e)<range).sort((a,b)=>distance(a,p)-distance(b,p)).slice(0,6)){this.effect('lightning',from.x,from.z,'#a3e9ff',{tx:e.x,tz:e.z,life:.4});this.hitEnemy(e,damage,p,'skill');from=e;}}else this.fire(p.x,p.z,p.face.x,p.face.z,'ice',damage,p,{speed:18,life:range/18,pierce:true,stun:2,kind:'skill'});}
      if(p.cls==='ranger'){if(index===3)this.fire(p.x,p.z,p.face.x,p.face.z,'arrow',damage,p,{speed:24,life:range/24,pierce:true,kind:'skill'});else{p.mana=Math.min(100,p.mana+35);p.focus=2;p.battleBuff=5;}}
      if(p.cls==='assassin'){if(index===3)this.zone(point.x,point.z,3.5,5,damage,p,'poison',{});else{const e=this.closest(p,range);if(e)this.hitEnemy(e,damage*(e.hp/e.maxHp<.35?2:1),p,'skill');}}
      if(p.cls==='necromancer'){const type=index===3?'archer':'golem';this.summon(p,type,index===3?3:1,p,damage,{life:index===3?16:20,cap:index===3?3:1,range:12,interval:index===3?.8:1.6});if(p.stats.legends.includes('eternal'))for(const m of this.summons.filter(m=>m.owner===p)){m.life=Infinity;m.permanent=true;}}
      if(p.cls==='engineer'){if(index===3)this.zone(point.x,point.z,4,.8,0,p,'trap',{delay:.6,burst:damage});else for(let i=-3;i<=3;i++){const a=Math.atan2(p.face.z,p.face.x)+i*.13;this.fire(p.x,p.z,Math.cos(a),Math.sin(a),'bolt',damage,p,{speed:18,life:range/18,pierce:true,stun:1,kind:'skill'});}}
      if(p.cls==='druid'){p.chargeResource=Math.min(6,resource+2);if(index===3)this.zone(point.x,point.z,4,5,damage,p,'thunder',{});else{p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*.3);p.ward=5;}}
      if(p.cls==='monk'){if(index===3)this.fire(p.x,p.z,p.face.x,p.face.z,'wave',damage,p,{speed:14,life:range/14,pierce:true,stun:1,kind:'skill'});else{p.chargeResource=6;p.mana=Math.min(100,p.mana+35);p.ward=4;}}
    }
    if(p.cls==='knight'&&index===1&&p.stats.legends.includes('aftershock'))for(let n=1;n<=3;n++)this.zone(p.x+p.face.x*n*2.5,p.z+p.face.z*n*2.5,2.4,.4+n*.2,0,p,'thunder',{delay:.12+n*.2,burst:damage*.45});
    if(p.cls==='ranger'&&index===2&&p.stats.legends.includes('hail')){const z=this.zones.at(-1);z.life+=3;z.total+=3;z.chill=true;}
    if(p.cls==='assassin'&&index===2&&p.stats.legends.includes('twinshade'))this.zone(point.x,point.z,rune===2?2.5:3.5,rune===1?9:6,damage*.65,p,'blades',{});
    if(p.cls==='monk'&&index===1&&p.stats.legends.includes('stillstorm'))this.zone(p.x,p.z,3.8,5,p.stats.damage*.9,p,'thunder',{follow:true});
    if(p.cls==='knight'&&index===0&&p.stats.legends.includes('cyclone'))this.zone(p.x,p.z,range,3,p.stats.damage*.9,p,'cyclone',{});
    if(slot===2&&p.stats.legends.includes('nova'))this.aoe(p.x,p.z,5.5,p.stats.damage*1.8,p,'#bdadff');
    this.shake=Math.max(this.shake,index===2?6:2.5);this.event('sound',{name:index>=3?({knight:['roar','heavy'],mage:['thunder','ice'],ranger:['pierce','heal'],assassin:['cast','blade'],necromancer:['soul','soul'],engineer:['cast','heavyshot'],druid:['thunder','heal'],monk:['thunder','heal']}[p.cls][index-3]):p.cls==='druid'?(index===2?'roar':'nature'):p.cls==='monk'?'thunder':p.cls==='mage'?(index===0?'ice':index===2?'ultimate':'fire'):p.cls==='necromancer'?'soul':index===2?'ultimate':'spell'});return true;
  }
  potion(p){if(p.down||p.potionCd>0||p.hp>=p.stats.hp)return false;p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*.65);p.potionCd=18;this.effect('heal',p.x,p.z,'#8fdfad',{life:1,r:1.5});this.float(p,'+회복','#a2e4b5');this.event('sound',{name:'heal'});return true;}
  fire(x,z,dx,dz,type,damage,owner,opts={}){const shot={id:id(),x,z,dx,dz,type,damage,owner,kind:opts.kind||'basic',speed:opts.speed||9,life:opts.life||2,radius:opts.radius||.33,pierce:opts.pierce||false,stun:opts.stun||0,seeker:opts.seeker||false,color:opts.color,hit:new Set()};this.shots.push(shot);return shot;}
  zone(x,z,r,life,dps,owner,type,opts={}){this.zones.push({x,z,r,life,total:life,dps,owner,type,tick:0,...opts});}
  effect(type,x,z,color,opts={}){this.fx.push({type,x,z,color,life:opts.life??.6,total:opts.life??.6,...opts});if(this.fx.length>220){const disposable=this.fx.findIndex(f=>!f.action);if(disposable>=0)this.fx.splice(disposable,1);}}
  float(e,text,color='#ecebd9',crit=false){this.texts.push({x:e.x,z:e.z,text:String(text),color,crit,life:crit?1:.8,total:crit?1:.8,drift:(this.rng()-.5)*.6});if(this.texts.length>70)this.texts.shift();}
  knock(e,p,force){if(e.type==='boss')return;if(Math.abs(force)>1.5){e.action=null;e.charge=null;e.cd=Math.max(e.cd,.5);}const d=distance(e,p)||1;e.knockX=(e.x-p.x)/d*force;e.knockZ=(e.z-p.z)/d*force;}
  aoe(x,z,r,damage,p,color='#ffba72',frozen=0){this.effect('burst',x,z,color,{r,life:.5});for(const e of this.enemies){if(!e.dead&&distance(e,{x,z})<r+e.r){this.hitEnemy(e,damage,p,'skill');if(!e.dead&&frozen)this.stun(e,frozen);}}}
  stun(e,seconds){if(e.dead||seconds<=0)return;e.frozen=Math.max(e.frozen,seconds*(e.type==='boss'?.3:1));e.action=null;e.charge=null;e.cd=Math.max(e.cd,.6);}
  hitEnemy(e,damage,p,kind='skill',trigger=true){
    if(e.dead||!p)return;const crit=this.rng()<p.stats.crit/100;const shatter=trigger&&kind==='skill'&&p.cls==='mage'&&p.stats.legends.includes('shatter')&&e.frozen>0&&p.legendCd<=0;const amount=Math.max(1,Math.round(damage*(p.battleBuff>0?1.3:1)*(crit?1.7:1)*(e.marked>0?1.2:1)*(shatter?1.45:1)));const applied=Math.min(e.hp,amount);e.hp-=amount;e.hit=.14;e.anim=.15;this.float(e,amount,crit?'#ffdd8b':kind==='dot'?'#c7d3af':'#eee7d6',crit);p.hp=Math.min(p.stats.hp,p.hp+applied*p.stats.leech/100);this.effect('hit',e.x,e.z,crit?'#ffe7a8':'#f4c37d',{life:.22,r:.7});
    if(kind==='basic'){if(['knight','assassin','druid','monk'].includes(p.cls))p.chargeResource=Math.min(['druid','monk'].includes(p.cls)?6:5,p.chargeResource+1);if(p.cls==='necromancer'&&++p.traitHits%3===0)p.chargeResource=Math.min(6,p.chargeResource+1);}
    if(shatter){p.legendCd=.8;this.effect('shatter',e.x,e.z,'#c0f4ff',{r:2.5,life:.5});for(const other of this.enemies)if(other!==e&&!other.dead&&distance(other,e)<2.5)this.hitEnemy(other,p.stats.damage,p,'legend',false);}
    if(kind==='skill')this.effect('skillimpact',e.x,e.z,CLASSES[p.cls].color,{r:crit?1.7:1,life:.4});
    if(kind!=='dot'){this.effect('impact',e.x,e.z,crit?'#fff0bb':CLASSES[p.cls].color,{r:crit?1.4:.75,life:.25,angle:Math.atan2(e.z-p.z,e.x-p.x)});if(crit)this.impact(.026,3);}
    if(kind!=='dot')this.event('sound',{name:crit?'critical':'hit'});
    if(e.hp<=0)this.kill(e,p);
    if(trigger&&kind==='basic'&&p.stats.legends.includes('echo')){this.effect('burst',e.x,e.z,'#ed9868',{life:.35,r:1.7});for(const target of this.enemies){if(target!==e&&!target.dead&&distance(e,target)<2)this.hitEnemy(target,p.stats.damage*.4,p,'legend',false);}}
    if(trigger&&crit&&p.stats.legends.includes('chain')){const targets=this.enemies.filter(t=>t!==e&&!t.dead&&distance(t,e)<6).sort((a,b)=>distance(a,e)-distance(b,e)).slice(0,3);let from=e;for(const t of targets){this.effect('lightning',from.x,from.z,'#91d6ff',{tx:t.x,tz:t.z,life:.25});this.hitEnemy(t,p.stats.damage*.7,p,'legend',false);from=t;}}
  }
  hurt(p,damage,source){if(p.down||inTown(p)||p.invuln>0)return;this.townChannel=null;const n=Math.max(1,Math.round(damage*(1-p.stats.armor/100)*(p.bear>0?(p.profile.runes[p.profile.skillChoices?.indexOf(2)??2]===1?.55:.7):1)*(p.ward>0?.75:1)));p.hp-=n;p.invuln=.4;p.hit=.2;this.float(p,`−${n}`,'#f09d8b');this.shake=Math.max(this.shake,4);this.event('sound',{name:'hurt'});if(p.stats.legends.includes('frost')&&p.frostCd<=0&&p.hp>0){p.frostCd=6;this.aoe(p.x,p.z,3.7,p.stats.damage*.7,p,'#9de5fa',2);this.effect('frost',p.x,p.z,'#a6e9ff',{r:3.7,life:.7});}if(p.hp<=0){p.hp=0;p.down=true;p.revive=0;p.mark=null;this.toast(`${p.id+1}P 쓰러짐 · 동료가 가까이 3초 머물면 부활합니다.`,'error');if(this.players.every(p=>p.down)){this.state='defeat';this.event('defeat');this.event('save');}}}
  kill(e,p){
    if(e.dead)return;e.dead=true;e.deathT=.65;this.kills++;if(e.type!=='boss'&&this.rift?.phase==='hunting'){this.rift.progress=Math.min(this.rift.goal,this.rift.progress+({elite:8,brute:4,cultist:3}[e.type]||2));if(this.rift.progress>=this.rift.goal)this.awakenGuardian();}if(p.cls==='necromancer')p.chargeResource=Math.min(6,p.chargeResource+1);this.effect('death',e.x,e.z,e.type==='boss'?'#f2ab68':'#abaca5',{life:.75,r:e.r*2});
    const gold=Math.round((5+this.rng()*7+this.depth*2)*(e.type==='boss'?12:e.type==='elite'?4:1));this.save.gold+=gold;this.runGold+=gold;for(const player of this.players)this.gainXP(player,Math.round(e.xp*(1+(this.depth-1)*.2)));
    if(e.type==='boss'){
      for(const player of this.players){const boss=BOSSES[e.bossKey||this.bossKey||'ember'],pool=boss.drops.filter(k=>!LEGENDS[k].cls||LEGENDS[k].cls===player.cls),key=pool[Math.floor(this.rng()*pool.length)],item=makeItem(player.cls,this.depth*3+3,4,this.rng,key);this.giveItem(player,item);this.runLegends++;}
      this.rift.timed=this.rift.elapsed<=this.rift.limit;this.rift.phase='complete';if(this.rift.timed){this.save.bestDepth=Math.max(this.save.bestDepth,Math.min(100,this.depth+1));this.save.shards=(this.save.shards||0)+8+this.depth*2;}this.completed=true;this.shots=this.shots.filter(s=>s.owner&&Object.hasOwn(s.owner,'cls'));this.zones=this.zones.filter(z=>z.owner&&Object.hasOwn(z.owner,'cls'));for(const mob of this.enemies)if(mob!==e&&!mob.dead&&mob.room===4){mob.dead=true;mob.deathT=.5;}this.rooms[4].state='clear';this.portal={x:ROOMS[4].x,z:ROOMS[4].z+9};for(const player of this.players){player.hp=player.stats.hp;player.mana=100;player.down=false;}
      this.toast(`${BOSSES[e.bossKey||'ember'].short} 처치`,'legendary','각 플레이어에게 전설 장비 지급 · 차원문으로 다음 심층 진입');this.event('sound',{name:'victory'});this.event('victory');
    }else for(const owner of this.players){
      // Each player independently rolls a drop. Neither last hit nor another player's roll consumes it.
      if(e.type!=='elite'&&this.rng()>=.30)continue;
      const roll=this.rng();let rarity=roll<.04?4:roll<.17?3:roll<.47?2:roll<.85?1:0;if(e.type==='elite')rarity=Math.max(2,rarity);
      this.drops.push({x:e.x+(owner.id? .45:-.45),z:e.z,item:makeItem(owner.cls,this.depth*3+Math.floor(this.rng()*3),rarity,this.rng),owner:owner.id,t:0});
    }
    this.event('save');
  }
  gainXP(p,value){
    if(p.profile.level>=50)return;p.profile.xp+=value;let up=false;while(p.profile.xp>=xpNeeded(p.profile.level)&&p.profile.level<50){p.profile.xp-=xpNeeded(p.profile.level);p.profile.level++;p.profile.points+=2;up=true;}if(p.profile.level>=50)p.profile.xp=0;
    if(up){this.profileRefresh(p);p.hp=p.stats.hp;p.mana=100;this.effect('level',p.x,p.z,'#f8d48f',{life:1.3,r:3});this.toast(`${p.id+1}P 레벨 ${p.profile.level} · 스킬 포인트 +2`,'legendary',`${this.players.length===2?'T':'K'} 키로 스킬을 강화하세요`);this.event('sound',{name:'level'});}
  }
  giveItem(p,item){if(p.profile.bag.length>=72){p.profile.overflow??=[];p.profile.overflow.push(item);this.toast(`${p.id+1}P ${item.name} · 보관 대기함으로 이동`);this.event('save');return;}p.profile.bag.push(item);this.toast(item.name,item.rarity===4?'legendary':'normal',`${p.id+1}P 획득 · ${RARITIES[item.rarity].name} ${SLOTS[item.slot]} · 위력 ${item.power}`);this.event('sound',{name:item.rarity===4?'legend':'loot'});this.event('save');}
  claimOverflow(index){const p=this.players[index];if(!p)return false;const pending=p.profile.overflow||[];while(pending.length&&p.profile.bag.length<72)p.profile.bag.push(pending.shift());this.event('save');return true;}
  openChest(chest){if(chest.open)return;chest.open=true;for(const p of this.players){const roll=this.rng();this.giveItem(p,makeItem(p.cls,this.depth*3+2,roll<.08?4:roll<.32?3:2,this.rng));}this.save.gold+=25+this.depth*10;this.runGold+=25+this.depth*10;this.effect('pillar',chest.x,chest.z,'#f5d28c',{life:1.4,r:2});this.event('save');}
  step(dt,inputs=[]){
    dt=Math.min(Math.max(dt,0),.04);if(this.paused||this.state!=='playing')return;
    if(this.rift?.phase==='ready'&&this.players.some(p=>!inTown(p)))this.startRift();
    if(this.rift&&['hunting','guardian'].includes(this.rift.phase))this.rift.elapsed+=dt;
    if(this.townChannel){if(this.players.some(p=>p.mark||distance(p,this.townChannel.origins[p.id])>.1)||inputs.some(i=>i&&(i.mx||i.mz||i.attack||i.skills?.some(Boolean)))){this.townChannel=null;this.toast('움직임·공격으로 귀환을 취소했습니다.');}else{this.townChannel.remaining-=dt;if(this.townChannel.remaining<=0){this.townReturn=this.townChannel.origins;this.townChannel=null;for(const p of this.players){p.x=p.id*2-1;p.z=4.5;p.mark=null;p.invuln=2;}this.summons=[];this.pending=[];this.restTown();}}}
    this.hitStop=Math.max(0,this.hitStop-dt);this.flash=Math.max(0,this.flash-dt*2);if(this.hitStop>0&&this.save.settings.impact!==false)dt*=.3;this.time+=dt;this.shake=Math.max(0,this.shake-dt*22);
    for(const p of this.players){
      const input=inputs[p.id]||{};p.cd=p.cd.map(v=>Math.max(0,v-dt));for(const key of ['attackCd','potionCd','frostCd','invuln','anim','hit','overheated','overdrive','bear','ward','battleBuff','legendCd'])p[key]=Math.max(0,p[key]-dt);
      if(p.actionPose){p.actionPose.life-=dt;if(p.actionPose.life<=0)p.actionPose=null;}if(p.cls==='engineer')p.heat=Math.max(0,p.heat-dt*(5+p.profile.ranks[5]*2));
      if(p.down){const friend=this.players.find(a=>a!==p&&!a.down&&distance(a,p)<2.1);p.revive=friend?p.revive+dt:Math.max(0,p.revive-dt*.5);if(p.revive>=3){p.down=false;p.hp=p.stats.hp*.6;p.invuln=3;p.revive=0;this.effect('heal',p.x,p.z,'#8fdfad',{life:1,r:2});this.toast(`${p.id+1}P 부활 · 3초간 보호됩니다.`);}continue;}
      if(inTown(p)){p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*dt*.25);p.potionCd=Math.max(0,p.potionCd-dt*5);}
      p.mana=clamp(p.mana+dt*7*(1+p.stats.resource/100),0,100);
      let mx=input.mx||0,mz=input.mz||0;
      if(p.mark&&Math.hypot(mx,mz)<.05&&!input.attack){const d=distance(p,p.mark);if(d<.35)p.mark=null;else{mx=(p.mark.x-p.x)/d;mz=(p.mark.z-p.z)/d;}}
      if(input.mx||input.mz)p.mark=null;
      if(p.cls==='ranger')p.focus=clamp(p.focus+dt*(Math.hypot(mx,mz)>.1?-2:1),0,2);
      if(input.potion)this.potion(p);
      let movement=Math.hypot(mx,mz);if(movement>.1){mx/=Math.max(1,movement);mz/=Math.max(1,movement);this.move(p,mx*p.stats.speed*dt,mz*p.stats.speed*dt);if(!input.attack&&p.anim===0)p.face={x:mx/(Math.hypot(mx,mz)||1),z:mz/(Math.hypot(mx,mz)||1)};p.walk+=dt*10;}else p.walk*=.8;
      for(let i=0;i<3;i++)if(input.skills?.[i])this.skill(p,i,input);
      if(input.attack)this.basic(p,input);
      // Both heroes remain on one shared view; a downed companion may always be reached.
      if(this.players.length===2){const other=this.players[1-p.id],d=distance(p,other);if(d>27&&!other.down){const f=(d-27)/d;this.move(p,(other.x-p.x)*f,(other.z-p.z)*f);}}
      const at=regionAt(p);if(p.id===0)this.room=at;const region=this.rooms[at];if(at>0&&!region.discovered&&distance(p,region)<region.w){region.discovered=true;if(at===4&&this.rift.phase==='guardian')this.toast('평원에서 수호자를 발견했습니다.','normal',BOSSES[this.bossKey].name);if(at===4&&this.rift.phase==='guardian')this.event('sound',{name:'boss'});}
      for(const c of this.chests)if(!c.open&&distance(p,c)<1.8)this.openChest(c);
      for(const drop of this.drops){if(!drop.picked&&distance(p,drop)<1.65){drop.picked=true;this.giveItem(this.players[drop.owner],drop.item);}}
    }
    // Make player separation soft so local cooperative heroes cannot occupy exactly the same point.
    if(this.players.length===2){const [a,b]=this.players,d=distance(a,b);if(d<.7&&d>.005&&!a.down&&!b.down){const push=(.7-d)*.25;this.move(a,(a.x-b.x)/d*push,(a.z-b.z)/d*push);this.move(b,(b.x-a.x)/d*push,(b.z-a.z)/d*push);}}
    for(const a of this.pending){a.delay-=dt;if(a.delay<=0&&!a.done){a.done=true;this.resolveStrike(a);}}this.pending=this.pending.filter(a=>!a.done);
    for(const m of this.summons){m.life-=dt;m.cd-=dt;if(m.owner.down||inTown(m.owner))continue;const e=this.closest(m,m.range);if(['wraith','wolf','archer','golem'].includes(m.type)){const target=e||m.owner,d=distance(m,target),keep=e?(['wolf','golem'].includes(m.type)?1.1:m.type==='archer'?6:2):1.8;if(d>keep)this.move(m,(target.x-m.x)/(d||1)*dt*5.5,(target.z-m.z)/(d||1)*dt*5.5,.25);if(distance(m,m.owner)>20){m.x=m.owner.x;m.z=m.owner.z;}}
      if(e){m.angle=Math.atan2(e.z-m.z,e.x-m.x);if(m.type==='golem'){if(m.cd<=0&&distance(m,e)<2.2){m.cd=m.interval;this.aoe(e.x,e.z,2.5,m.damage,m.owner,'#c4d8b5',.4);this.effect('skillcue',e.x,e.z,'#bde4bf',{style:'earthsplit',r:2.5,life:.6});}continue;}if(m.type==='wolf'){if(m.cd<=0&&distance(m,e)<1.8){m.cd=m.interval;this.hitEnemy(e,m.damage*(m.owner.bear>0&&m.owner.stats.legends.includes('wildheart')?1.5:1),m.owner,'summon');if(m.freeze)this.stun(e,.6);this.effect('slash',e.x,e.z,'#d5e7ad',{r:1.2,angle:m.angle,life:.22});}continue;}if(m.cd<=0){m.cd=m.interval/(m.owner.overdrive>0?2:1);this.fire(m.x,m.z,Math.cos(m.angle),Math.sin(m.angle),m.type==='turret'?'bolt':m.type==='archer'?'arrow':'soul',m.damage,m.owner,{speed:14,life:m.range/14,pierce:m.type==='turret',kind:'summon'});this.effect('muzzle',m.x,m.z,m.type==='turret'?'#ffd28b':'#9effdc',{r:.5,life:.16,angle:m.angle});}}}
    this.summons=this.summons.filter(m=>m.life>0);
    for(const e of this.enemies)this.enemyStep(e,dt);
    for(const shot of this.shots){
      shot.life-=dt;shot.x+=shot.dx*shot.speed*dt;shot.z+=shot.dz*shot.speed*dt;
      if(!this.walkable(shot.x,shot.z,0)||inTown(shot)){shot.life=0;continue;}
      if(shot.owner&&Object.hasOwn(shot.owner,'cls')){for(const e of this.enemies){if(e.dead||shot.hit.has(e.id))continue;if(distance(shot,e)<shot.radius+e.r){shot.hit.add(e.id);this.hitEnemy(e,shot.damage,shot.owner,shot.kind);if(shot.stun)this.stun(e,shot.stun);if(shot.seeker&&shot.owner.legendCd<=0){const target=this.enemies.find(t=>t!==e&&!t.dead&&distance(t,e)<6);if(target){shot.owner.legendCd=.2;this.effect('lightning',e.x,e.z,'#dcf4ab',{tx:target.x,tz:target.z,life:.25});this.hitEnemy(target,shot.owner.stats.damage*.8,shot.owner,'legend',false);}}if(!shot.pierce){shot.life=0;break;}}}}
      else for(const p of this.players){if(!p.down&&distance(shot,p)<shot.radius+.38){this.hurt(p,shot.damage,shot.owner);shot.life=0;break;}}
    }
    for(const z of this.zones){
      z.life-=dt;z.tick-=dt;if(z.follow){z.x=z.owner.x;z.z=z.owner.z;}
      if(z.delay>0){z.delay-=dt;if(z.delay<=0&&z.burst){this.aoe(z.x,z.z,z.r,z.burst,z.owner,'#ffb36c');this.effect(z.type==='meteor'?'meteorimpact':'skillimpact',z.x,z.z,'#ffb36c',{r:z.r,life:.85});this.impact(.04,9);if(z.starfire)this.zone(z.x,z.z,z.r,4,z.owner.stats.damage,z.owner,'fire',{});z.burst=0;}continue;}
      if(z.tick<=0&&z.dps){z.tick=.5;for(const e of this.enemies)if(!e.dead&&distance(z,e)<z.r+e.r){if(z.mark)e.marked=2;this.hitEnemy(e,z.dps*.5,z.owner,'dot',false);if(z.chill||z.type==='poison'||z.type==='roots')e.slow=.7;if(z.root)this.stun(e,.6);if(z.freeze)this.stun(e,1);}if(z.type==='rain')this.effect('arrows',z.x,z.z,'#d9daa3',{life:.3,r:z.r});}
    }
    for(const current of this.rooms.slice(1,4))if(current.state==='active'&&!this.enemies.some(e=>!e.dead&&e.room===current.id)){
      current.state='clear';current.discovered=true;this.chests.push({x:current.x+2,z:current.z-2,open:false,room:current.id});for(const p of this.players){p.hp=Math.min(p.stats.hp,p.hp+p.stats.hp*.2);p.mana=100;}
      this.toast(`${current.name} 근처에 보급 상자가 나타났습니다.`,'normal','평원은 계속 탐험할 수 있습니다. B 마을 귀환');this.event('sound',{name:'clear'});this.event('save');
    }
    for(const fx of this.fx)fx.life-=dt;for(const t of this.texts)t.life-=dt;for(const d of this.drops)d.t+=dt;
    this.fx=this.fx.filter(f=>f.life>0);this.texts=this.texts.filter(t=>t.life>0);this.shots=this.shots.filter(s=>s.life>0);this.zones=this.zones.filter(z=>z.life>0);this.drops=this.drops.filter(d=>!d.picked);this.enemies=this.enemies.filter(e=>!e.dead||e.deathT>0);
  }
  enemyStep(e,dt){
    if(e.dead){e.deathT-=dt;return;}e.hit=Math.max(0,e.hit-dt);e.swing=Math.max(0,(e.swing||0)-dt);e.anim=Math.max(0,e.anim-dt);e.slow=Math.max(0,e.slow-dt);e.marked=Math.max(0,(e.marked||0)-dt);
    if(e.frozen>0){e.frozen-=dt;return;}e.cd-=dt;
    if(!e.action&&(Math.abs(e.knockX)+Math.abs(e.knockZ)>.03)){this.move(e,e.knockX*dt*7,e.knockZ*dt*7,e.r,false);e.knockX*=Math.exp(-dt*15);e.knockZ*=Math.exp(-dt*15);}
    if(e.charge){const q=e.charge,remaining=distance(e,q),travel=Math.min(remaining,q.speed*dt),before={x:e.x,z:e.z};this.move(e,q.dx*travel,q.dz*travel,e.r,false);e.face={x:q.dx,z:q.dz};q.life-=dt;this.effect('trail',e.x,e.z,'#dca17e',{life:.18,r:e.r});for(const p of this.players)if(!p.down&&!q.hit.has(p.id)&&distance(e,p)<e.r+.38){q.hit.add(p.id);this.hurt(p,e.damage,e);}if(q.life<=0||remaining<.2||distance(e,before)<travel*.25){e.charge=null;e.recovery=.6;this.effect('enemyburst',e.x,e.z,'#d3977a',{life:.35,r:1.5});}return;}
    if(e.recovery>0){e.recovery-=dt;return;}
    const p=this.target(e),home={x:e.spawnX,z:e.spawnZ},hd=distance(e,home);if(!p||hd>30)e.returning=true;
    if(e.returning){e.action=null;e.charge=null;if(hd>.6){e.face={x:(home.x-e.x)/hd,z:(home.z-e.z)/hd};this.move(e,e.face.x*e.speed*dt,e.face.z*e.speed*dt,e.r,false);e.walk+=dt*8;}else e.returning=false;return;}if(!p)return;const d=distance(e,p);e.face={x:(p.x-e.x)/(d||1),z:(p.z-e.z)/(d||1)};
    if(e.action){const aim=distance(e,e.action)||1;e.face={x:(e.action.x-e.x)/aim,z:(e.action.z-e.z)/aim};e.wind-=dt;if(e.wind<=0){this.enemyAttack(e);e.action=null;e.state='idle';}return;}
    if(d>(e.type==='boss'?20:13))return;
    if(e.type==='boss'){
      if(e.hp<e.maxHp*.5&&e.phase===0){e.phase=1;this.toast(`${BOSSES[e.bossKey||'ember'].short} 광폭화`,'error');for(let i=0;i<4;i++)this.spawnEnemy(i%2?'hound':'grunt',e.x+Math.cos(i*Math.PI/2)*4,e.z+Math.sin(i*Math.PI/2)*4,e.room);}
      if(e.cd<=0){const count=e.attackCount||0;e.attackCount=count+1;if(e.bossKey==='frost'&&count%3===0){e.action={type:'frostnova',x:p.x,z:p.z,r:2.6};e.wind=1.5;}else if(e.bossKey==='hollow'&&count%3===2){e.action={type:'cross',x:p.x,z:p.z};e.wind=1.2;}else if(e.bossKey==='frost'&&count%3===2){e.action={type:'ring',x:p.x,z:p.z};e.wind=1.3;}else if(count%3===0){e.action={type:'slam',x:p.x,z:p.z,r:e.phase?4.6:3.8};e.wind=e.phase?1.55:1.4;}else if(count%3===1){e.action={type:'fan',x:p.x,z:p.z};e.wind=1.15;}else{e.action={type:'charge',x:p.x,z:p.z,r:1.5};e.wind=1.25;}e.cd=e.phase?3.5:4;this.telegraph(e);return;}
    }else if(e.type==='wisp'||e.type==='cultist'){
      if(e.cd<=0&&d<13){e.action={type:e.type==='cultist'?'triple':'shot',x:p.x,z:p.z};e.wind=.7;e.cd=e.type==='cultist'?2.8:2.3;this.telegraph(e);return;}
    }else if(e.type==='elite'){
      if(e.cd<=0&&d<8){e.action={type:'slam',x:p.x,z:p.z,r:2.5};e.wind=1.15;e.cd=3.2;this.telegraph(e);return;}
    }else if(e.type==='brute'){
      if(e.cd<=0&&d<3.5){e.action={type:'slam',x:p.x,z:p.z,r:2.3};e.wind=1.05;e.cd=2.4;this.telegraph(e);return;}
    }else if(e.type==='hound'&&e.cd<=0&&d<6&&d>2){e.action={type:'charge',x:p.x,z:p.z,r:.7};e.wind=.95;e.cd=3.1;this.telegraph(e);return;}
    else if(e.cd<=0&&d<1.4){e.action={type:'melee',x:p.x,z:p.z,r:1.7};e.wind=.5;e.cd=1.5;e.anim=.5;return;}
    let away=(e.type==='wisp'||e.type==='cultist')&&d<5?-1:d>(e.type==='wisp'||e.type==='cultist'?7:1.1)?1:0;
    if(away){let dx=e.face.x*away,dz=e.face.z*away;for(const o of this.obstacles){const dd=distance(e,o);if(dd<o.r+e.r+1.4&&dd>.01){dx+=(e.x-o.x)/dd*.85;dz+=(e.z-o.z)/dd*.85;}}for(const other of this.enemies){if(other===e||other.dead)continue;const dd=distance(e,other);if(dd<e.r+other.r+.3&&dd>.01){dx+=(e.x-other.x)/dd*.6;dz+=(e.z-other.z)/dd*.6;}}const n=Math.hypot(dx,dz)||1;const speed=e.speed*(e.slow>0?.45:1);this.move(e,dx/n*speed*dt,dz/n*speed*dt,e.r,false);e.walk+=dt*8;}
  }
  telegraph(e){
    const a=e.action;a.duration=e.wind;if(a.type==='charge'){a.r=e.r+.38;const dx=a.x-e.x,dz=a.z-e.z,d=Math.hypot(dx,dz)||1,max=e.type==='boss'?9:6,scale=Math.min(max,d)/d;a.x=e.x+dx*scale;a.z=e.z+dz*scale;}
    if(a.type==='frostnova'){a.points=[{x:a.x,z:a.z},{x:a.x-4,z:a.z+1},{x:a.x+4,z:a.z-1}];for(const q of a.points)this.effect('danger',q.x,q.z,'#9fdfff',{r:a.r,life:e.wind,owner:e,action:a});return;}
    if(['cross','ring'].includes(a.type)){a.count=a.type==='cross'?4:10;a.spread=Math.PI*2/a.count;this.effect('radialwarning',e.x,e.z,BOSSES[e.bossKey].color,{r:9,life:e.wind,owner:e,action:a,count:a.count,angle:Math.atan2(a.z-e.z,a.x-e.x)});return;}
    a.count=a.type==='fan'?(e.phase?7:5):a.type==='triple'?3:1;a.spread=a.type==='fan'?.29:.22;
    this.effect(a.type==='charge'?'dangerline':a.type==='slam'?'danger':'fanwarning',a.type==='slam'?a.x:e.x,a.type==='slam'?a.z:e.z,e.type==='boss'?BOSSES[e.bossKey||'ember'].color:e.type==='elite'?'#ccb1ff':'#f4aa86',{tx:a.x,tz:a.z,r:a.r||8,life:e.wind,owner:e,action:a,count:a.count,spread:a.spread});
    if(e.type==='boss')this.event('sound',{name:'warning'});
  }
  enemyAttack(e){const a=e.action;if(!a)return;e.anim=.4;e.swing=.35;
    if(a.type==='frostnova'){for(const q of a.points){this.effect('shatter',q.x,q.z,'#b6edff',{r:a.r,life:.75});for(const p of this.players)if(!p.down&&distance(p,q)<a.r)this.hurt(p,e.damage,e);}e.recovery=.6;}
    else if(['cross','ring'].includes(a.type)){for(let i=0;i<a.count;i++){const angle=Math.atan2(a.z-e.z,a.x-e.x)+i*a.spread;this.fire(e.x,e.z,Math.cos(angle),Math.sin(angle),'enemy',e.damage,e,{speed:5.5,life:3.5,color:BOSSES[e.bossKey].color});}e.recovery=.4;}
    else if(a.type==='slam'){this.effect('enemyburst',a.x,a.z,e.type==='elite'?'#c7b1f7':'#f09b71',{life:.65,r:a.r});for(const p of this.players)if(!p.down&&distance(p,a)<a.r)this.hurt(p,e.damage,e);this.shake=Math.max(this.shake,3);this.event('sound',{name:'slam'});e.recovery=.45;}
    else if(a.type==='melee'){for(const p of this.players)if(!p.down&&distance(p,e)<1.8)this.hurt(p,e.damage,e);}
    else if(a.type==='charge'){a.r=e.r+.38;const dx=a.x-e.x,dz=a.z-e.z,d=Math.hypot(dx,dz),speed=e.type==='boss'?18:15;if(d>.02)e.charge={x:a.x,z:a.z,dx:dx/d,dz:dz/d,speed,life:d/speed+.1,hit:new Set()};}
    else{const angle=Math.atan2(a.z-e.z,a.x-e.x),n=a.count||1;for(let i=0;i<n;i++){const aa=angle+(i-(n-1)/2)*(a.spread||.22);this.fire(e.x,e.z,Math.cos(aa),Math.sin(aa),'enemy',e.damage,e,{speed:e.type==='boss'?6.2:5.7,life:3.5,radius:e.type==='boss'?.31:.24});}this.event('sound',{name:'enemyshot'});}
  }
  nextDepth(){if(!this.completed)return false;const classes=this.players.map(p=>p.cls);this.begin(classes,Math.min(100,this.depth+(this.rift?.timed?1:0)));return true;}
  summary(){return{mode:this.state,paused:this.paused,depth:this.depth,room:this.room,roomName:this.rooms[this.room].name,remaining:this.enemies.filter(e=>!e.dead).length,kills:this.kills,gold:this.save.gold,completed:this.completed,players:this.players.map(p=>({player:p.id+1,class:CLASSES[p.cls].name,level:p.profile.level,hp:Math.round(p.hp),maxHp:p.stats.hp,resource:Math.round(p.mana),skillPoints:p.profile.points,items:p.profile.bag.length,down:p.down}))};}
}
