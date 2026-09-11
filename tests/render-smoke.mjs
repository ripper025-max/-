import{createRequire}from'node:module';
import assert from'node:assert/strict';
import{Renderer}from'../dist/render.mjs';
import{Game,CLASSES,WEAPONS,itemForSlot,seeded}from'../dist/sim.mjs';
const require=createRequire(import.meta.url);
const{createCanvas}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?`${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/@napi-rs/canvas`:'@napi-rs/canvas');
globalThis.window={devicePixelRatio:1};
const canvas=createCanvas(1280,800);canvas.clientWidth=1280;canvas.clientHeight=800;
const map=createCanvas(240,175),g=new Game(),renderer=new Renderer(canvas,map,g);
renderer.frame(1/60);
g.begin(['knight','mage']);g.enterRift();g.players.forEach((p,i)=>{p.x=-39+i*2;p.z=-29;});g.spawnEnemy('boss',3,-3,0);g.spawnEnemy('elite',2,1,0);g.spawnEnemy('cultist',-3,-3,0);g.spawnEnemy('brute',-3,0,0);g.spawnEnemy('wisp',1,4,0);
for(let i=0;i<50;i++){g.step(1/30,[{attack:true,skills:[true,true,true]},{attack:true,skills:[true,true,true]}]);renderer.frame(1/30);renderer.minimap();}
const p={x:4.2,z:-8.1},screen=renderer.point(p.x,p.z),world=renderer.unproject(screen.x,screen.y);assert(Math.abs(world.x-p.x)<1e-8);assert(Math.abs(world.z-p.z)<1e-8);
g.players[0].down=true;g.players[0].revive=1.5;g.players[1].cls='ranger';g.portal={x:0,z:-1};renderer.frame(1/60);
console.log('Canvas API execution and projection round-trip passed. No screenshots or browser testing performed.');

// Execute every added actor, weapon, summon, warning and layered effect branch without images.
for(const cls of Object.keys(CLASSES)){
 g.begin([cls]);g.enterRift();const hero=g.players[0];hero.x=-39;hero.z=-29;hero.profile.ranks=[4,4,4,0,0,0];
 for(let slot=0;slot<3;slot++){hero.cd=[0,0,0];hero.mana=100;g.chooseRune(0,slot,2);g.skill(hero,slot,{});}
 for(let frame=0;frame<12;frame++){g.step(.04,[{attack:true}]);renderer.frame(.04);}
 for(const type of Object.keys(WEAPONS)){hero.profile.equipped.weapon.weaponType=type;hero.actionPose={type,life:.25,total:.5};renderer.frame(.01);}
}
for(const boss of ['frost','hollow']){g.bossKey=boss;const e=g.spawnEnemy('boss',0,0,0);e.action={type:boss==='frost'?'frostnova':'cross',x:2,z:2,r:2.6};e.wind=1;g.telegraph(e);renderer.frame(.01);g.enemyAttack(e);renderer.frame(.01);}
for(const type of ['impact','muzzle','thrust','windup','castsigil','crosscut','smoke','soulburst','shatter','summon','empower','aimburst']){g.effect(type,0,0,'#aaffdd',{r:3,life:.5,angle:1});renderer.frame(.01);}
console.log('Six class silhouettes, ten weapon poses, summons, boss warnings and combat effects executed successfully.');

g.begin(['knight']);g.enterRift();renderer.camera={x:0,z:0};renderer.frame(.04);
renderer.fieldMap(createCanvas(900,570));g.targetRegion=4;renderer.minimap();
g.townReturn=[{x:-30,z:0}];renderer.frame(.04);
g.players[0].x=-30;g.players[0].z=0;g.townChannel={remaining:1,origins:[{x:-30,z:0}]};renderer.camera={x:-30,z:0};renderer.frame(.04);
for(const region of g.rooms.slice(1)){g.players[0].x=region.x;g.players[0].z=region.z;renderer.camera={x:region.x,z:region.z};renderer.frame(.04);}
console.log('Village, field biomes, full map, recall and return portal drawing executed successfully.');

// New selectable skills and mixed permanent army, actually in the camera frustum.
for(const cls of Object.keys(CLASSES))for(let source=0;source<5;source++){
 g.begin([cls]);g.enterRift();const p=g.players[0];p.x=-26;p.z=-14;p.profile.skillChoices=[source,...[0,1,2,3,4].filter(n=>n!==source).slice(0,2)];renderer.camera={x:p.x,z:p.z};g.skill(p,0,{aim:{x:p.x+2,z:p.z}});for(let i=0;i<24;i++){g.step(.04,[{}]);renderer.frame(.04);}
}
g.begin(['necromancer']);g.enterRift();const nec=g.players[0];nec.x=-26;nec.z=-14;['legion','eternal','ossuary'].forEach((key,i)=>nec.profile.equipped[['ring','relic','armor'][i]]=itemForSlot(['ring','relic','armor'][i],nec.cls,3,4,seeded(i),key));g.profileRefresh(nec);g.skill(nec,0,{});renderer.camera={x:nec.x,z:nec.z};renderer.frame(.04);g.save.settings.particles=false;renderer.frame(.04);
console.log('All 40 selectable skill presentations and mixed permanent summons execute; both effect detail settings exercised.');
