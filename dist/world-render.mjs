import {WORLD,REGIONS,TOWN,SERVICES,onRoad,regionAt,worldObjects,meadowTone} from './world.mjs';
export function createField(r){
 r.staticObjects=worldObjects(r.game.scene);r.tiles=[];
 for(let x=WORLD.minX;x<=WORLD.maxX;x++)for(let z=WORLD.minZ;z<=WORLD.maxZ;z++){
  const hash=Math.abs(Math.sin(x*12.9898+z*78.233)*43758.5453)%1,area=regionAt({x,z});
  r.tiles.push({x,z,room:area,v:hash,tone:meadowTone(x,z),road:onRoad(x,z,1.8)&&hash>.1,town:r.game.scene!=='rift'&&Math.hypot(x,z)<18,crack:hash>.97,moss:hash<.15});
 }
 r.ambient=Array.from({length:38},(_,i)=>({x:(i*.618)%1,y:(i*.414)%1,speed:.1+(i%5)*.07,s:1+(i%3)*.3,phase:i}));
}
export function fieldObject(r,o){
 const c=r.ctx,p=r.point(o.x,o.z);if(p.x< -230||p.x>r.w+230||p.y< -160||p.y>r.h+280)return;
 c.save();const obscures=r.game.players.some(hero=>{const q=r.point(hero.x,hero.z,1.4);return Math.abs(q.x-p.x)<r.scale*(o.type==='house'?4:1.8)&&q.y<p.y&&q.y>p.y-r.scale*(o.h||4);});if(obscures&&['house','tree','ruin'].includes(o.type))c.globalAlpha=.4;
 if(o.type==='house'){
  r.box(o.x,o.z,o.w+.5,o.d+.5,.25,'#657275');r.box(o.x,o.z,o.w,o.d,o.h,o.color,.25);
  for(const side of [-1,1])r.box(o.x+side*(o.w/2-.18),o.z+o.d/2+.04,.22,.16,o.h,'#393c3b',.25);
  r.box(o.x,o.z+o.d/2+.1,1.4,.12,2.1,'#273137',.25);r.box(o.x,o.z+o.d/2+.2,1.8,.8,.16,'#9e9d88');
  const w=o.w/2+.6,d=o.d/2+.5,h=o.h+.25,ridge=h+2.2;
  r.poly([r.point(o.x-w,o.z-d,h),r.point(o.x+w,o.z-d,h),r.point(o.x+w,o.z,ridge),r.point(o.x-w,o.z,ridge)],'#485965','#243840');
  r.poly([r.point(o.x-w,o.z+d,h),r.point(o.x+w,o.z+d,h),r.point(o.x+w,o.z,ridge),r.point(o.x-w,o.z,ridge)],o.x>0?'#536778':'#755b4a','#26323b');
  r.poly([r.point(o.x+w,o.z-d,h),r.point(o.x+w,o.z+d,h),r.point(o.x+w,o.z,ridge)],'#3f4b50');
  for(const side of [-1,1]){r.box(o.x+side*o.w*.3,o.z+o.d/2+.1,.75,.1,.9,'#ebc280',1.8);r.box(o.x+side*o.w*.3,o.z+o.d/2+.17,.05,.1,.9,'#4f5048',1.8);}
  r.box(o.x-o.w*.3,o.z-1,.65,.6,2.2,'#7a7c74',o.h+1);
 }else if(o.type==='tree'){
  r.groundCircle(o.x+.4,o.z+.5,o.size*.8,'#091d20',.35);r.box(o.x,o.z,.43,.45,o.h*.6,'#696450');
  const colors=['#46665b','#557363','#526963'];for(let j=0;j<3;j++){const w=o.size*(1-j*.23);r.box(o.x,o.z,w,w,o.h*.25,colors[o.variant],o.h*.42+j*o.h*.2,j*.28);}
 }else if(o.type==='boulder'){
  r.box(o.x,o.z,o.size*1.3,o.size,o.h,'#657478',-.1,o.variant*.4);r.box(o.x+.25,o.z-.15,o.size*.8,o.size*.7,.3,'#82908a',o.h-.1,o.variant*.4);
 }else if(o.type==='ruin'){
  r.box(o.x,o.z,2.3,1.2,.3,'#8a9487');r.box(o.x-.7,o.z,.7,.8,o.h,'#778987',.3);r.box(o.x+.7,o.z,.65,.8,o.h*.6,'#7f8b84',.3);r.box(o.x-.6,o.z,1.1,1,.25,'#a0a58d',o.h+.3);
 }else if(o.type==='fountain'){
  r.groundCircle(o.x,o.z,1.65,'#acaa8e',1);r.box(o.x,o.z,2.3,2.3,.32,'#8d9c93');r.box(o.x,o.z,1.8,1.8,.15,'#6eabb9',.32);r.box(o.x,o.z,.65,.65,1.1,'#b0b7a1',.45);r.crystal(o.x,o.z,2,.25,'#b8f2df',r.clock*.3);r.glow(o.x,o.z,3,'#9edfcc',.15);
 }else if(o.type==='station'){
  if(o.key==='inventory'){r.box(o.x,o.z,1.7,1.1,.8,'#676d65');r.box(o.x,o.z,1.8,.7,.23,'#bdc3b5',.8);r.box(o.x-.7,o.z-.6,.8,.8,1.3,'#756858');r.glow(o.x-.7,o.z-.6,1.7,'#ffaf64',.3,1.4);}
  else if(o.key==='skills'){r.box(o.x,o.z,.25,.25,2.4,'#9b8967');r.box(o.x,o.z,1.6,.25,.22,'#bda680',1.65);r.box(o.x,o.z,.7,.5,.9,'#687d8a',.8);r.crystal(o.x,o.z,2.8,.18,'#b7e4fa',0);}
  else{r.box(o.x-.6,o.z,.16,.2,2.4,'#8d7959');r.box(o.x+.6,o.z,.16,.2,2.4,'#8d7959');r.box(o.x,o.z,1.8,.25,1.25,'#9c8965',1.15);r.box(o.x,o.z+.16,.85,.04,.75,'#ddd5b6',1.4);}
  const q=r.point(o.x,o.z,3.7);c.textAlign='center';c.font='bold 14px sans-serif';c.strokeStyle='#0a1723';c.lineWidth=4;c.strokeText(o.name,q.x,q.y);c.fillStyle=o.color;c.fillText(o.name,q.x,q.y);
 }else if(o.type==='lamp'||o.type==='campfire'){
  const lamp=o.type==='lamp';if(lamp){r.box(o.x,o.z,.16,.16,2.5,'#6c7164');r.box(o.x,o.z,.45,.45,.55,'#cbb583',2.35);}else r.box(o.x,o.z,1,.8,.22,'#7f6c50');
  r.crystal(o.x,o.z,lamp?2.9:.65,.16,'#ffe0a2',r.clock);r.glow(o.x,o.z,lamp?3:2,'#ffbd7b',.2,lamp?2.6:.4);
 }
 c.restore();
}
export function fieldMap(r,canvas=r.map){
 const c=canvas===r.map?r.mc:canvas.getContext('2d'),w=canvas.width,h=canvas.height,g=r.game,pad=18;
 c.clearRect(0,0,w,h);c.fillStyle='#102631';c.fillRect(0,0,w,h);
 const sx=(w-pad*2)/(WORLD.maxX-WORLD.minX),sz=(h-pad*2)/(WORLD.maxZ-WORLD.minZ),map=p=>({x:pad+(p.x-WORLD.minX)*sx,y:pad+(p.z-WORLD.minZ)*sz});
 const dungeon=g.scene==='rift',center=map(TOWN);c.fillStyle=dungeon?'#333b48':'#526f50';c.fillRect(pad,pad,w-pad*2,h-pad*2);
 for(let i=0;i<(dungeon?0:70);i++){const x=pad+(Math.sin(i*12.3)*.5+.5)*(w-pad*2),y=pad+(Math.cos(i*8.7)*.5+.5)*(h-pad*2);c.fillStyle=i%2?'#6e855c33':'#9ba27522';c.beginPath();c.ellipse(x,y,w*.08,h*.07,0,0,Math.PI*2);c.fill();}
 if(!dungeon)for(const area of REGIONS.slice(1)){const q=map(area);c.beginPath();c.moveTo(center.x,center.y);c.lineTo(q.x,q.y);c.strokeStyle='#c1ba9355';c.lineWidth=canvas===r.map?1:3;c.stroke();}
 if(!dungeon){c.beginPath();c.ellipse(center.x,center.y,TOWN.r*sx,TOWN.r*sz,0,0,Math.PI*2);c.fillStyle='#95b6a766';c.fill();}
 REGIONS.forEach((area,i)=>{if(dungeon&&i===0||!dungeon&&i!==0)return;const q=map(area);c.beginPath();c.arc(q.x,q.y,i===0?5:3,0,Math.PI*2);c.fillStyle=i===0?'#c6f6dd':i===4?'#e9aa86':'#dfd5ae';c.fill();c.textAlign='center';c.font=canvas===r.map?'10px sans-serif':'bold 16px sans-serif';c.fillStyle='#e8eee0';c.fillText(i===0?'마을':i===4?'수호자':canvas===r.map?'':area.name,q.x,q.y-10);if(g.targetRegion===i){c.strokeStyle='#fff0b5';c.lineWidth=2;c.strokeRect(q.x-9,q.y-9,18,18);}});
 for(const e of g.enemies){if(e.dead||!g.players.some(p=>Math.hypot(p.x-e.x,p.z-e.z)<24))continue;const q=map(e);c.fillStyle=e.type==='boss'?'#ff896f':e.type==='elite'?'#f5ba72':'#e9b29a';c.fillRect(q.x-1,q.y-1,e.type==='boss'?5:2,e.type==='boss'?5:2);}
 for(const p of g.players){const q=map(p);c.beginPath();c.arc(q.x,q.y,3.5,0,Math.PI*2);c.fillStyle=p.down?'#e68484':p.id?'#87cdff':'#fff5c2';c.fill();c.strokeStyle='#102632';c.lineWidth=1;c.stroke();}
 c.strokeStyle='#76949580';c.strokeRect(1,1,w-2,h-2);
}
