import assert from 'node:assert/strict';
import {Game,CLASSES,RUNES,BOSSES,WEAPONS,LEGENDS,itemForSlot,seeded,stats,validateSave,playerSkill} from '../dist/sim.mjs';
const results=[];
function check(name,fn){fn();results.push(name);}
function setup(cls='knight'){
 const g=new Game(undefined,53);g.begin([cls]);g.enterRift();g.enemies=[];const p=g.players[0];p.x=-39;p.z=-29;p.invuln=0;p.stats.crit=0;
 const e=g.spawnEnemy('boss',p.x+2,p.z,1);e.cd=100;e.hp=e.maxHp=50000;return {g,p,e};
}
const tick=(g,n=15,inputs=[{}])=>{for(let i=0;i<n;i++)g.step(.04,inputs);};
function equipLegend(g,p,key){p.profile.equipped.ring=itemForSlot('ring',p.cls,3,4,seeded(3),key);g.profileRefresh(p);p.stats.crit=0;}
check('Each class has one dedicated weapon with an actual distinct attack',()=>{
 const seen=new Set();for(const cls of Object.keys(CLASSES)){const {g,p,e}=setup(cls),type=p.profile.equipped.weapon.weaponType,w=WEAPONS[type];seen.add(type);const hp=e.hp;assert(g.basic(p,{aim:e}));assert.equal(p.actionPose.type,type);if(w.mode!=='shot')assert.equal(e.hp,hp);tick(g,20);assert(e.hp<hp,cls+' weapon did not hit');}
 assert.equal(seen.size,8);
});
check('Each of the six class mechanics changes actual combat',()=>{
 const {g,p,e}=setup();for(let i=0;i<5;i++)g.hitEnemy(e,1,p,'basic');assert.equal(p.chargeResource,5);const hp=e.hp;g.skill(p,0,{});assert.equal(p.chargeResource,0);assert.equal(hp-e.hp,Math.round(p.stats.damage*2.1*1.5));
 const mage=setup('mage');for(const i of [0,1,0,1]){mage.p.cd=[0,0,0];mage.p.mana=100;mage.g.skill(mage.p,i,{});}assert.equal(mage.p.chargeResource,3);mage.p.mana=100;mage.g.skill(mage.p,2,{});assert.equal(mage.p.chargeResource,0);
 const ranger=setup('ranger');tick(ranger.g,51);assert.equal(ranger.p.focus,2);ranger.g.basic(ranger.p,{aim:ranger.e});assert.equal(ranger.p.focus,0);assert.equal(ranger.g.shots[0].damage,ranger.p.stats.damage*1.8);
 const assassin=setup('assassin');for(let i=0;i<5;i++)assassin.g.hitEnemy(assassin.e,1,assassin.p,'basic');const before=assassin.e.hp;assassin.g.skill(assassin.p,0,{});assert.equal(before-assassin.e.hp,Math.round(assassin.p.stats.damage*2.4*2));assert.equal(assassin.p.chargeResource,0);
 const necro=setup('necromancer');for(let i=0;i<6;i++)necro.g.hitEnemy(necro.e,1,necro.p,'basic');assert.equal(necro.p.chargeResource,2);necro.g.skill(necro.p,0,{});assert.equal(necro.g.summons.length,3);tick(necro.g,50);assert(necro.e.hp<49994);
 const eng=setup('engineer');eng.p.heat=95;eng.g.basic(eng.p,{aim:eng.e});assert(eng.p.overheated>0);eng.p.attackCd=0;assert(!eng.g.basic(eng.p,{}));eng.g.skill(eng.p,1,{aim:eng.e});assert.equal(eng.p.heat,0);assert.equal(eng.p.overheated,0);assert(eng.g.basic(eng.p,{}));
});
check('All 48 rune variants cast and persist; new variants change summons and buffs',()=>{
 let count=0;
 for(const cls of Object.keys(CLASSES))for(let i=0;i<3;i++)for(const rune of [1,2]){
  const {g,p}=setup(cls);p.profile.ranks[i]=4;assert(g.chooseRune(0,i,rune));const spec=playerSkill(p,i);assert(g.skill(p,i,{}));assert.equal(p.mana,100-spec.cost);assert.equal(p.cd[i],spec.cd);assert.equal(spec.name,RUNES[cls][i][rune-1].name);
  if(cls==='assassin'&&i===2)assert.equal(g.zones[0].life,rune===1?9:6);
  if(cls==='necromancer'&&i===0){assert.equal(g.summons.length,rune===1?2:3);assert.equal(g.summons[0].life,rune===1?18:12);}
  if(cls==='engineer'&&i===0){assert.equal(g.summons[0].interval,rune===1?.7:.4);assert.equal(g.summons[0].range,rune===1?16:11);}
  if(cls==='engineer'&&i===2)assert.equal(p.overdrive,(rune===1?9:4)+1.8);
  tick(g,20);assert(validateSave(JSON.parse(JSON.stringify(g.save))));count++;
 }
 assert.equal(count,48);
});
check('Six class legendary effects activate alongside selected runes',()=>{
 const knight=setup();equipLegend(knight.g,knight.p,'cyclone');knight.p.profile.ranks[0]=2;knight.g.chooseRune(0,0,1);knight.g.skill(knight.p,0,{});assert(knight.g.zones.some(z=>z.type==='cyclone'&&z.r>4));
 const mage=setup('mage');equipLegend(mage.g,mage.p,'shatter');mage.e.frozen=2;mage.g.skill(mage.p,1,{aim:mage.e});tick(mage.g,2);assert(mage.p.legendCd===0,'DOT must not trigger shatter');mage.p.mana=100;mage.g.skill(mage.p,0,{});assert(mage.p.legendCd>0);assert(mage.g.fx.some(f=>f.type==='shatter'));
 const ranger=setup('ranger');equipLegend(ranger.g,ranger.p,'seeker');const second=ranger.g.spawnEnemy('brute',ranger.p.x+3.5,ranger.p.z+1,1);second.cd=100;const hp=second.hp;ranger.g.skill(ranger.p,0,{aim:ranger.e});tick(ranger.g,5);assert(second.hp<hp);assert(ranger.g.fx.some(f=>f.type==='lightning'));
 const assassin=setup('assassin');equipLegend(assassin.g,assassin.p,'shadow');assassin.p.chargeResource=5;assassin.g.skill(assassin.p,0,{});assert(assassin.g.zones.some(z=>z.type==='shadow'&&z.burst>0));const ehp=assassin.e.hp;tick(assassin.g,10);assert(assassin.e.hp<ehp);
 const necro=setup('necromancer');equipLegend(necro.g,necro.p,'requiem');necro.g.skill(necro.p,0,{});necro.p.mana=100;necro.g.skill(necro.p,2,{});assert(necro.g.fx.filter(f=>f.type==='burst').length>=3);
 const eng=setup('engineer');equipLegend(eng.g,eng.p,'overdrive');eng.g.skill(eng.p,0,{aim:eng.e});const life=eng.g.summons[0].life;eng.p.mana=100;eng.g.skill(eng.p,1,{aim:eng.e});assert.equal(eng.g.summons[0].life,life+3);assert(eng.g.fx.some(f=>f.type==='lightning'));
});
check('Boss-specific rewards stay in each published drop pool for every class',()=>{
 for(const boss of Object.keys(BOSSES))for(const cls of Object.keys(CLASSES)){
  const {g,p,e}=setup(cls);g.bossKey=boss;e.bossKey=boss;g.kill(e,p);const reward=p.profile.bag.at(-1);
  assert(BOSSES[boss].drops.includes(reward.legend));assert(!LEGENDS[reward.legend].cls||LEGENDS[reward.legend].cls===cls);assert.equal(g.save.bestDepth,2);
 }
 for(const [boss,pattern] of [['frost','frostnova'],['hollow','cross']]){const {g,e}=setup();e.bossKey=boss;e.cd=0;e.attackCount=boss==='hollow'?2:0;g.enemyStep(e,.01);assert.equal(e.action.type,pattern);assert(g.fx.some(f=>f.action===e.action));g.enemyAttack(e);assert(g.shots.length>0||g.fx.some(f=>f.type==='shatter'));}
});
check('Favorites, pending enchantments and saved builds cannot be sold or bulk salvaged',()=>{
 const {g,p}=setup();const items=Array.from({length:4},(_,n)=>itemForSlot('ring','knight',3,n,seeded(n+1)));p.profile.bag.push(...items);g.save.gold=1000;
 g.toggleFavorite(0,items[0].id);assert(!g.toggleJunk(0,items[0].id));assert(!g.sell(0,items[0].id));
 g.enchant(0,items[1].id,0);assert(!g.toggleJunk(0,items[1].id));assert(!g.sell(0,items[1].id));
 g.equip(0,items[2].id);g.saveLoadout(0,0);g.equip(0,items[3].id);assert(!g.toggleJunk(0,items[2].id));assert(!g.sell(0,items[2].id));
 g.equip(0,items[2].id);g.toggleJunk(0,items[3].id);assert(g.salvage(0,items.map(i=>i.id)));assert.equal(g.save.shards,7);assert(!g.findItem(0,items[3].id));assert(g.findItem(0,items[0].id));assert(g.findItem(0,items[1].id));assert(g.findItem(0,items[2].id));
 const gold=g.save.gold;assert(g.upgrade(0,p.profile.equipped.weapon.id,true));assert.equal(g.save.shards,3);assert.equal(gold-g.save.gold,27);assert(!g.upgrade(0,p.profile.equipped.weapon.id,true));
});
check('Build loading restores equipment, ranks and runes atomically without resetting cooldowns',()=>{
 const {g,p}=setup();g.learn(0,0);g.chooseRune(0,0,1);g.saveLoadout(0,0);const first=p.profile.equipped.weapon.id;
 const item=itemForSlot('weapon','knight',6,3,seeded(7));p.profile.bag.push(item);g.equip(0,item.id);g.respec(0);p.cd=[1,2,3];
 assert(g.applyLoadout(0,0));assert.equal(p.profile.equipped.weapon.id,first);assert.equal(p.profile.ranks[0],2);assert.equal(p.profile.runes[0],1);assert.deepEqual(p.cd,[1,2,3]);assert.deepEqual(p.stats,stats(p.profile));
 const restored=validateSave(JSON.parse(JSON.stringify(g.save)));assert(restored);assert.deepEqual(restored.profiles['0:knight'].loadouts,p.profile.loadouts);
 p.profile.loadouts[0].equipment.ring='missing';const before=JSON.stringify(p.profile);assert(!g.applyLoadout(0,0));assert.equal(JSON.stringify(p.profile),before);
});
console.log(JSON.stringify({passed:results.length,checks:results},null,2));
