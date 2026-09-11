import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Game,ROOMS,CLASSES,RUNES,playerSkill,itemForSlot,seeded,validateSave,stats,enchantCost} from '../dist/sim.mjs';
const checks=[];
function check(name,fn){fn();checks.push(name);}
function arena(cls='knight'){
  const g=new Game(undefined,42);g.begin([cls]);g.enemies=[];
  const p=g.players[0];p.x=-39;p.z=-29;p.invuln=0;p.stats.crit=0;
  const e=g.spawnEnemy('boss',p.x+2,p.z,1);e.cd=100;
  return {g,p,e};
}
check('Legacy equipment, currency, growth and player profiles survive migration',()=>{
  const old=JSON.parse(readFileSync(new URL('./fixtures/legacy-save.json',import.meta.url))),save=validateSave(old);
  assert(save);assert.equal(save.gold,old.gold);assert.equal(save.bestDepth,old.bestDepth);
  for(const [key,value] of Object.entries(old.profiles)){const expected=structuredClone(value),weapon=save.profiles[key].equipped.weapon;expected.equipped.weapon.name=weapon.name;expected.equipped.weapon.weaponType=weapon.weaponType;assert.deepEqual(save.profiles[key],{...expected,runes:[0,0,0]});}
  assert.equal(save.settings.zoom,.88);const g=new Game(save);g.begin(save.lastClasses);
  assert.equal(g.players[0].profile.equipped.ring.legend,'frost');
});
check('Open arenas provide clear maneuvering space',()=>{const {g}=arena();for(const r of ROOMS.slice(1))for(let a=0;a<Math.PI*2;a+=Math.PI/16)assert(g.walkable(r.x+6*Math.cos(a),r.z+6*Math.sin(a),.4));assert(g.allowed(20,0));});
check('Removed dash inputs do nothing; walking speed stays full while attacking',()=>{
  const {g,p}=arena();assert.equal(g.dodge,undefined);
  g.step(.04,[{dodge:true}]);assert.equal(p.x,-39);assert.equal(p.z,-29);assert.equal(p.invuln,0);
  g.step(.04,[{mx:1,attack:true}]);assert(Math.abs(p.x+39-p.stats.speed*.04)<1e-8);
});
check('Normal walking avoids both boss slams after a 0.3 second reaction',()=>{
  for(const phase of [0,1]){
    const {g,p,e}=arena('mage');e.phase=phase;e.cd=0;e.attackCount=0;
    g.enemyStep(e,.01);assert.equal(e.action.type,'slam');const hp=p.hp;
    for(let i=0;i<8;i++)g.step(.04,[{}]);
    for(let i=0;i<36;i++)g.step(.04,[{mx:-1}]);
    assert.equal(p.hp,hp);assert.equal(e.action,null);
  }
});
check('Enemy charges move over time, hit once, and stun cancels warned attacks',()=>{
  const {g,p,e}=arena();e.x=p.x-6;e.action={type:'charge',x:p.x+6,z:p.z,r:1.5};e.wind=1.25;g.telegraph(e);
  assert.equal(e.action.x,p.x+3);const before=e.x;g.enemyAttack(e);e.action=null;
  assert.equal(e.x,before);assert(e.charge);g.enemyStep(e,.04);
  assert(e.x>before&&e.x<before+1);let health=p.hp;
  for(let i=0;i<20;i++){p.invuln=0;g.enemyStep(e,.04);}
  assert.equal(health-p.hp,Math.round(e.damage));
  e.action={type:'slam',x:p.x,z:p.z,r:4};e.wind=.1;g.telegraph(e);
  g.stun(e,2);assert.equal(e.action,null);assert.equal(e.charge,null);
  health=p.hp;for(let i=0;i<12;i++)g.enemyStep(e,.04);assert.equal(p.hp,health);
});
check('All 18 runes enforce unlock ranks, cost, cooldown and distinct effects',()=>{
  for(const cls of Object.keys(CLASSES))for(let i=0;i<3;i++)for(const rune of [1,2]){
    const {g,p,e}=arena(cls);assert(!g.chooseRune(0,i,rune));p.profile.ranks[i]=rune===1?2:4;
    assert(g.chooseRune(0,i,rune));const spec=playerSkill(p,i);assert.equal(spec.name,RUNES[cls][i][rune-1].name);
    const hp=e.hp;p.hp=p.stats.hp/2;const playerHP=p.hp;
    assert(g.skill(p,i,{aim:{x:p.x+2,z:p.z}}));assert.equal(p.mana,100-spec.cost);assert.equal(p.cd[i],spec.cd);
    assert(!g.skill(p,i,{}));assert(validateSave(JSON.parse(JSON.stringify(g.save))));
    if(cls==='knight'&&i===0){assert(e.hp<hp);if(rune===2)assert(p.hp>playerHP);else assert(g.fx.some(f=>f.r>4.7));}
    if(cls==='knight'&&i===1){assert.equal(g.shots.length,rune===1?3:1);assert.equal(g.shots[0].stun,rune===2?3:1.5);}
    if(cls==='knight'&&i===2)assert.equal(p.invuln,rune===1?6:1);
    if(cls==='mage'&&i===0){if(rune===1)assert.equal(g.shots.length,8);else assert.equal(e.frozen,1.2);}
    if(cls==='mage'&&i===1){if(rune===1)assert(g.zones[0].follow);else {assert.equal(g.zones.length,0);assert(e.hp<hp);}}
    if(cls==='mage'&&i===2){assert.equal(g.zones.length,rune===1?3:1);if(rune===2){assert.equal(spec.cost,40);assert.equal(spec.cd,12);}}
    if(cls==='ranger'&&i===0){assert.equal(g.shots.length,rune===1?3:5);if(rune===2)assert(g.shots.every(s=>s.stun===1.3));}
    if(cls==='ranger'&&i===1){if(rune===1)assert(g.zones[0].burst>0);else assert(g.zones[0].mark);}
    if(cls==='ranger'&&i===2){if(rune===1)assert(g.zones[0].follow);else assert.equal(g.zones[0].r,2.7);}
    for(let frame=0;frame<30;frame++)g.step(.04,[{mx:-1}]);
    if(g.zones[0]?.follow){assert.equal(g.zones[0].x,p.x);assert.equal(g.zones[0].z,p.z);}
    g.respec(0);assert.deepEqual(p.profile.runes,[0,0,0]);
  }
});
check('Enchantment charges once, restores pending options, preserves old choices and locks one slot',()=>{
  const {g,p}=arena();const item=itemForSlot('weapon','knight',5,3,seeded(55));p.profile.bag.push(item);g.equip(0,item.id);
  const original=structuredClone(item.affixes),baseStats={...p.stats};g.save.gold=5000;const cost=enchantCost(item);
  assert(g.enchant(0,item.id,1));assert.equal(g.save.gold,5000-cost);assert(!g.enchant(0,item.id,1));assert.deepEqual(item.affixes,original);
  assert.deepEqual(p.stats,baseStats);const save=validateSave(JSON.parse(JSON.stringify(g.save)));assert(save);
  const restored=new Game(save);restored.begin(['knight']);const restoredItem=restored.findItem(0,item.id);
  assert.deepEqual(restoredItem.enchantOffer,item.enchantOffer);assert(restored.resolveEnchant(0,item.id,-1));assert.deepEqual(restoredItem.affixes,original);
  assert.equal(restored.save.gold,5000-cost);assert(!restored.enchant(0,item.id,0));
  assert(restored.enchant(0,item.id,1));const chosen={...restoredItem.enchantOffer.options[0]};
  assert(restored.resolveEnchant(0,item.id,0));assert.deepEqual(restoredItem.affixes,[original[0],chosen,original[2]]);
  assert.deepEqual(restored.players[0].stats,stats(restored.players[0].profile));assert(!restored.resolveEnchant(0,item.id,0));
  restored.save.gold=0;assert(!restored.enchant(0,item.id,1));assert.equal(restored.save.gold,0);
});
check('Invalid rune unlocks and malformed enchant offers are rejected',()=>{
  const {g,p}=arena();p.profile.runes=[2,0,0];assert.equal(validateSave(g.save),null);p.profile.runes=[0,0,0];
  const item=itemForSlot('ring','knight',4,3,seeded(1));p.profile.bag.push(item);g.save.gold=500;
  assert(g.enchant(0,item.id,0));item.enchantOffer.index=1;assert.equal(validateSave(g.save),null);
});
console.log(JSON.stringify({passed:checks.length,checks},null,2));
