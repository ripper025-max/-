import assert from 'node:assert/strict';
import {Game,inTown} from '../dist/sim.mjs';
import {WORLD,worldObjects} from '../dist/world.mjs';
const checks=[];const check=(name,fn)=>{fn();checks.push(name);};const tick=(g,n=64,inputs=[])=>{for(let i=0;i<n;i++)g.step(.04,inputs);};
check('Town and outdoor space never spawn enemies or start a rift by walking',()=>{
 const g=new Game();g.begin();const p=g.players[0];assert.equal(g.enemies.length,0);assert.equal(g.spawnEnemy('grunt',25,0,1),null);p.x=-30;p.z=0;p.invuln=0;const hp=p.hp;
 tick(g,100,[{attack:true,skills:[true,true,true]}]);g.hurt(p,1000);assert.equal(p.hp,hp);assert.equal(g.rift.phase,'ready');assert.equal(g.rift.elapsed,0);assert.equal(g.enemies.length,0);assert.equal(g.shots.length,0);assert(!g.enterRift());assert(g.requestTown());assert(g.partyInTown());assert(g.enterRift());assert.equal(g.scene,'rift');assert.equal(g.rift.phase,'hunting');assert(g.enemies.length>0);assert(!g.enterRift());assert(!g.obstacles.some(o=>['house','station','fountain'].includes(o.type)));
 for(const e of g.enemies)assert(g.walkable(e.x,e.z,e.r));assert(!g.walkable(WORLD.maxX+1,0));assert.deepEqual(g.obstacles,worldObjects('rift').filter(o=>o.solid));
 p.x=0;p.z=0;assert(!inTown(p),'Dungeon centre is not a safe town');assert(g.basic(p,{}));assert(!g.chooseSkill(0,0,3));
});
check('Recall cancels for nearby enemies, movement, attacks and damage',()=>{
 const g=new Game();g.begin();g.enterRift();g.enemies=[];const p=g.players[0];p.x=-30;p.z=0;p.invuln=0;const e=g.spawnEnemy('grunt',-32,0,1);assert(!g.requestTown());e.dead=true;
 assert(g.requestTown());g.step(.04,[{mx:1}]);assert.equal(g.townChannel,null);assert(g.requestTown());g.step(.04,[{attack:true}]);assert.equal(g.townChannel,null);assert(g.requestTown());g.hurt(p,1);assert.equal(g.townChannel,null);
});
check('Cooperative instance recall preserves enemies, loot, progress and return positions',()=>{
 for(const cls of [['engineer'],['necromancer','engineer']]){const g=new Game();g.begin(cls);g.enterRift();const enemies=g.enemies;g.players.forEach((p,i)=>{p.x=-30+i*2;p.z=0;p.hp=1;});g.enemies.forEach(e=>{e.x=50;e.z=50;});g.rift.progress=40;const origins=g.players.map(p=>({x:p.x,z:p.z}));g.drops.push({x:45,z:45,owner:0,item:{id:'kept'},picked:false});assert(g.requestTown());tick(g);assert.equal(g.scene,'town');assert(g.partyInTown());assert.equal(g.enemies.length,0);assert.equal(g.drops.length,0);assert(g.chooseSkill(0,0,3));assert(g.returnToField());assert.equal(g.scene,'rift');assert.deepEqual(g.enemies.map(e=>e.id),enemies.map(e=>e.id));assert.equal(g.drops[0].item.id,'kept');assert.equal(g.rift.progress,40);assert.deepEqual(g.players.map(p=>({x:p.x,z:p.z})),origins);assert(!g.returnToField());}
});
check('Progress summons one guardian and timed clear unlocks next preparation in town',()=>{
 const g=new Game(undefined,124);g.begin();g.enterRift();const p=g.players[0];for(const e of [...g.enemies]){if(g.rift.phase==='guardian')break;g.kill(e,p);}assert.equal(g.rift.progress,100);assert.equal(g.enemies.filter(e=>e.type==='boss').length,1);g.kill(g.enemies.find(e=>e.type==='boss'),p);assert(g.completed);assert.equal(g.save.bestDepth,2);assert.equal(g.save.shards,10);assert(g.nextDepth());assert.equal(g.depth,2);assert(g.partyInTown());assert.equal(g.scene,'town');assert.equal(g.enemies.length,0);assert.equal(g.rift.phase,'ready');
});
check('Late clear still grants personal equipment but no tier or time bonus',()=>{
 const g=new Game();g.begin();g.enterRift();g.rift.elapsed=901;g.awakenGuardian();const p=g.players[0],before=p.profile.bag.length;g.kill(g.enemies.find(e=>e.type==='boss'),p);assert.equal(p.profile.bag.length,before+1);assert.equal(g.save.bestDepth,1);assert.equal(g.save.shards,0);assert(g.nextDepth());assert.equal(g.depth,1);
});
console.log(JSON.stringify({passed:checks.length,checks},null,2));
