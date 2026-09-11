import assert from'node:assert/strict';
import{Game,stats,validateSave,WEAPONS,weaponType}from'../dist/sim.mjs';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function path(game,from,to){
  const sx=Math.round(from.x),sz=Math.round(from.z),tx=Math.round(to.x),tz=Math.round(to.z),key=(x,z)=>`${x},${z}`;const nodes=new Map(),open=[];
  const start={x:sx,z:sz,g:0,h:Math.hypot(tx-sx,tz-sz),p:null};nodes.set(key(sx,sz),start);open.push(start);let best=start;
  for(let count=0;open.length&&count<4000;count++){
    open.sort((a,b)=>(a.g+a.h)-(b.g+b.h));const n=open.shift();if(n.closed)continue;n.closed=true;if(n.h<best.h)best=n;if(n.h<1.1){best=n;break;}
    for(const [dx,dz]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=n.x+dx,z=n.z+dz;if(!game.walkable(x,z,.42)||!game.allowed(x,z)||!game.allowed((x+n.x)/2,(z+n.z)/2))continue;if(dx&&dz&&(!game.walkable(n.x+dx,n.z,.42)||!game.walkable(n.x,n.z+dz,.42)))continue;const k=key(x,z),g=n.g+Math.hypot(dx,dz),old=nodes.get(k);if(old&&g>=old.g)continue;const next={x,z,g,h:Math.hypot(tx-x,tz-z),p:n};nodes.set(k,next);open.push(next);}
  }
  const result=[];while(best.p){result.unshift({x:best.x,z:best.z});best=best.p;}result.push(to);return result;
}
function run(classes,seed,boss='ember'){
  const g=new Game(undefined,seed);g.save.settings.boss=boss;g.begin(classes);g.enterRift();const navigation=classes.map(()=>({at:-1,path:[]}));let reached=0;
  for(let frame=0;frame<18000&&g.state==='playing'&&!g.completed;frame++){
    for(const p of g.players){while(p.profile.points){const node=[3,0,4,1,2,5].find(n=>p.profile.ranks[n]<5);if(node===undefined)break;g.learn(p.id,node);}for(const i of [...p.profile.bag]){const score=s=>s.damage+s.hp*.045+s.crit*.5+s.skill*.4+s.leech+s.legends.length*3;const future=stats({...p.profile,equipped:{...p.profile.equipped,[i.slot]:i}});if(score(future)>score(p.stats))g.equip(p.id,i.id);}}
    const inputs=g.players.map(p=>{
      if(p.down)return{};const chest=null,encounter=g.rift.phase==='guardian'?4:1,enemy=g.enemies.filter(e=>!e.dead&&(g.rift.phase!=='guardian'||e.type==='boss')).sort((a,b)=>dist(g.players[0],a)-dist(g.players[0],b))[0],r=g.rooms[encounter];let target,move=true,attack=false,aim;
      const down=g.players.find(a=>a!==p&&a.down);
      if(down){target=down;move=dist(p,down)>1.3;}
      else if(enemy){target=enemy;aim={x:enemy.x,z:enemy.z};attack=true;const w=WEAPONS[weaponType(p.profile.equipped.weapon,p.cls)],melee=w.mode!=='shot';move=dist(p,enemy)>(melee?w.range*.65:Math.min(7,w.range*.6));if(!move&&!melee&&dist(p,enemy)<4){target={x:p.x+(p.x-enemy.x),z:p.z+(p.z-enemy.z)};move=true;}}
      else{target=chest||r;}
      let mx=0,mz=0;
      const threat=g.enemies.find(e=>e.action&&e.wind<.65&&['slam','charge'].includes(e.action.type)&&dist(p,e.action)<(e.action.r||2)+1.2);
      if(threat){let dx=p.x-threat.action.x,dz=p.z-threat.action.z;if(Math.hypot(dx,dz)<.2){dx=1;dz=1;}const n=Math.hypot(dx,dz);mx=dx/n;mz=dz/n;}
      else if(move&&target){const nav=navigation[p.id];if(frame-nav.at>22||!nav.path.length){nav.path=path(g,p,target);nav.at=frame;}while(nav.path.length>1&&dist(p,nav.path[0])<.55)nav.path.shift();const q=nav.path[0]||target,d=dist(p,q);if(d>.08){mx=(q.x-p.x)/d;mz=(q.z-p.z)/d;}}
      return{mx,mz,aim,attack,skills:enemy?[true,true,true]:[false,false,false],potion:p.hp<p.stats.hp*.62};
    });
    g.step(1/30,inputs);g.events=[];reached=Math.max(reached,g.room);
  }
  const result={classes,seed,boss,completed:g.completed,state:g.state,seconds:Math.round(g.time),reached:reached+1,kills:g.kills,players:g.players.map(p=>({hp:Math.round(p.hp),level:p.profile.level,x:+p.x.toFixed(1),z:+p.z.toFixed(1),items:p.profile.bag.length}))};
  assert(validateSave(JSON.parse(JSON.stringify(g.save))));
  console.log(JSON.stringify(result));
  assert.equal(g.rift.progress,100,'Hunting must fill rift progress');assert.equal(g.rift.phase,'complete');assert(g.rift.timed,'Basic run should complete within the time target');
  assert(g.completed,`Full run incomplete: ${JSON.stringify(result)}`);
  assert(g.players.every(p=>Object.values(p.profile.equipped).some(i=>i?.rarity===4)||p.profile.bag.some(i=>i.rarity===4)));
  assert(g.nextDepth());assert.equal(g.depth,2);return result;
}
run(['knight'],41);
run(['mage'],53);
run(['ranger'],71);
run(['knight','mage'],62);

run(['assassin'],84,'hollow');
run(['necromancer'],97,'frost');
run(['engineer'],111,'ember');
run(['necromancer','engineer'],124,'hollow');

run(['druid'],133,'frost');
run(['monk'],144,'hollow');
run(['druid','monk'],155,'frost');
