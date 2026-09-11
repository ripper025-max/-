import assert from 'node:assert/strict';
import {Game,ROOMS,inTown} from '../dist/sim.mjs';
import {WORLD,worldObjects} from '../dist/world.mjs';
const checks=[];
const check=(name,fn)=>{fn();checks.push(name);};
const tick=(g,n=64,inputs=[])=>{for(let i=0;i<n;i++)g.step(.04,inputs);};
check('Four continuous roads and every encounter are accessible before any kill',()=>{
 const g=new Game(undefined,124);g.begin();assert(g.partyInTown());
 assert.equal(g.rooms.slice(1).filter(r=>r.state==='active').length,3);
 for(const r of ROOMS.slice(1))for(let t=.05;t<=1;t+=.005)assert(g.walkable(r.x*t,r.z*t,.4),`Road to ${r.name} blocked at ${t}`);
 for(const e of g.enemies)assert(g.walkable(e.x,e.z,e.r),'Enemy spawned inside a prop');
 assert.deepEqual(g.obstacles,worldObjects().filter(o=>o.solid));
 assert(!g.walkable(WORLD.maxX+1,0));assert(g.allowed(ROOMS[4].x,ROOMS[4].z));
});
check('Town blocks combat and enemy entry while restoring health and potions',()=>{
 const g=new Game();g.begin();const p=g.players[0];p.hp=10;p.mana=10;p.invuln=0;p.potionCd=18;
 assert(!g.basic(p,{}));assert(!g.skill(p,0,{}));g.hurt(p,10000);assert.equal(p.hp,10);
 const e=g.spawnEnemy('grunt',19,0,1);g.move(e,-5,0,e.r,false);assert(!inTown(e));
 g.fire(18.1,1,-1,0,'bolt',100,e,{speed:20});g.step(.04);assert.equal(g.shots.length,0);assert(p.hp>10);assert(p.potionCd<17.9);
 assert(g.restTown());assert.equal(p.hp,p.stats.hp);assert.equal(p.mana,100);assert.equal(p.potionCd,0);
});
check('Recall cancels for enemies, movement, attacks and damage',()=>{
 const g=new Game();g.begin();g.enemies=[];const p=g.players[0];p.x=-30;p.z=0;p.invuln=0;
 const e=g.spawnEnemy('grunt',-32,0,1);assert(!g.requestTown());e.dead=true;
 assert(g.requestTown());g.step(.04,[{mx:1}]);assert.equal(g.townChannel,null);
 assert(g.requestTown());g.step(.04,[{attack:true}]);assert.equal(g.townChannel,null);
 assert(g.requestTown());g.hurt(p,1);assert.equal(g.townChannel,null);
 assert(g.requestTown());p.mark={x:-35,z:0};g.step(.04);assert.equal(g.townChannel,null);
 assert(!g.partyInTown());assert(!g.returnToField());
});
check('Solo and cooperative recall restore the exact field positions after town rest',()=>{
 for(const classes of [['engineer'],['necromancer','engineer']]){
  const g=new Game();g.begin(classes);g.enemies=[];
  g.players.forEach((p,i)=>{p.x=-30+i*2;p.z=0;p.hp=1;p.mana=0;p.potionCd=18;p.heat=90;});
  const origins=g.players.map(p=>({x:p.x,z:p.z}));assert(g.requestTown());tick(g,62);assert(!g.partyInTown());tick(g,2);assert(g.partyInTown());
  for(const p of g.players){assert.equal(p.hp,p.stats.hp);assert.equal(p.mana,100);assert.equal(p.potionCd,0);assert.equal(p.heat,0);}
  assert.deepEqual(g.townReturn,origins);assert(g.returnToField());assert.deepEqual(g.players.map(p=>({x:p.x,z:p.z})),origins);assert.equal(g.townReturn,null);assert(!g.returnToField());
 }
});
check('Rift progress summons one guardian without requiring every pack to be cleared',()=>{
 const g=new Game(undefined,124);g.begin();assert(!g.enemies.some(e=>e.type==='boss'));assert.equal(g.rift.phase,'ready');tick(g,10);assert.equal(g.rift.elapsed,0);assert(g.enterRift());assert.equal(g.rift.phase,'hunting');
 const p=g.players[0],regular=[...g.enemies];for(const e of regular){if(g.rift.phase==='guardian')break;g.kill(e,p);}
 assert.equal(g.rift.progress,100);assert.equal(g.enemies.filter(e=>e.type==='boss').length,1);const survivors=g.enemies.filter(e=>!e.dead&&e.type!=='boss');assert(survivors.length>0);
 const before=g.save.shards;g.kill(g.enemies.find(e=>e.type==='boss'),p);assert(g.completed);assert(survivors.every(e=>!e.dead));assert.equal(g.rift.phase,'complete');assert.equal(g.save.shards,before+10);assert.equal(g.save.bestDepth,2);assert(g.nextDepth());assert.equal(g.depth,2);assert(g.partyInTown());assert.equal(g.rift.phase,'ready');
});
check('Late clear keeps equipment rewards but does not award time bonus or unlock a tier',()=>{
 const g=new Game();g.begin();g.enterRift();g.rift.elapsed=901;g.rift.progress=100;g.awakenGuardian();const p=g.players[0],before=p.profile.bag.length;g.kill(g.enemies.find(e=>e.type==='boss'),p);assert.equal(p.profile.bag.length,before+1);assert.equal(g.save.bestDepth,1);assert.equal(g.save.shards,0);assert(!g.rift.timed);assert(g.nextDepth());assert.equal(g.depth,1);
});
check('Enemies return home when the party retreats to town',()=>{
 const g=new Game();g.begin();const e=g.enemies[0];e.x+=5;e.action={type:'melee',x:0,z:4.5};e.wind=1;
 const before=Math.hypot(e.x-e.spawnX,e.z-e.spawnZ);g.enemyStep(e,.04);assert.equal(e.action,null);assert(Math.hypot(e.x-e.spawnX,e.z-e.spawnZ)<before);
});
console.log(JSON.stringify({passed:checks.length,checks},null,2));
