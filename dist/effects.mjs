// Layered Canvas combat effects share world coordinates with hit detection.
export function combatFx(r,f){
 const c=r.ctx,t=Math.max(0,Math.min(1,1-f.life/f.total)),radius=f.r||1,col=f.color||'#ffe0a0',angle=f.angle||0;
 const ray=(a,len,h=.8)=>r.line([r.point(f.x+Math.cos(a)*.15,f.z+Math.sin(a)*.15,h),r.point(f.x+Math.cos(a)*len,f.z+Math.sin(a)*len,h)],col,Math.max(1,3*(1-t)));
 const ring=(rr,alpha,width)=>r.groundCircle(f.x,f.z,rr,col,alpha,width);
 if(!['impact','muzzle','thrust','windup','castsigil','crosscut','smoke','soulburst','shatter','summon','empower','aimburst','radialwarning'].includes(f.type))return false;
 if(f.type==='radialwarning'&&(f.owner?.dead||f.owner?.action!==f.action))return true;
 if(f.type==='summon'){r.glow(f.x,f.z,.65,col,.14*(1-t),.5+t);return true;}
 c.save();
 if(f.type==='radialwarning'){
  for(let i=0;i<f.count;i++)ray(angle+i*Math.PI*2/f.count,radius,.04);ring(.8,.6,2);
 }else{
  c.globalCompositeOperation='lighter';c.globalAlpha=1-t;
  if(f.type==='impact'||f.type==='muzzle'){
   const q=r.point(f.x,f.z,1);r.glow(f.x,f.z,radius*1.7,col,.4*(1-t),1);
   for(let i=0;i<9;i++)ray(angle+(i-4)*.34,radius*(.3+t*1.6));
   c.fillStyle='#fffbe7';c.beginPath();c.ellipse(q.x,q.y,Math.max(.2,(1-t)*radius*9),Math.max(.2,(1-t)*radius*3),angle,0,Math.PI*2);c.fill();
  }else if(f.type==='thrust'){
   const from=r.point(f.x,f.z,.9),end=r.point(f.x+Math.cos(angle)*radius*(.55+t*.5),f.z+Math.sin(angle)*radius*(.55+t*.5),.9);r.line([from,end],col,9*(1-t)+1);r.line([from,end],'#ffffff',2);ring(radius*t,.15,2);
  }else if(f.type==='windup'){
   for(let i=-2;i<=2;i++){const a=angle+i*.16;const q=r.point(f.x+Math.cos(a)*radius*(1-t*.6),f.z+Math.sin(a)*radius*(1-t*.6),.75);c.fillStyle=col;c.fillRect(q.x,q.y,2,2);}
  }else if(f.type==='crosscut'){
   for(const a of [angle-.6,angle+.6]){const q=r.point(f.x-Math.cos(a)*radius,f.z-Math.sin(a)*radius,.8),v=r.point(f.x+Math.cos(a)*radius,f.z+Math.sin(a)*radius,.8);r.line([q,v],col,Math.max(1,10*(1-t)));r.line([q,v],'#fff4ff',2);}ring(radius*(.5+t*.5),.35,2);
  }else if(f.type==='shatter'||f.type==='soulburst'){
   ring(radius*(.1+t),.7*(1-t),4);r.glow(f.x,f.z,radius,col,.25*(1-t));
   for(let i=0;i<14;i++){const a=i*2.4,rr=radius*(.2+t*.85);r.crystal(f.x+Math.cos(a)*rr,f.z+Math.sin(a)*rr,.2+Math.sin(t*Math.PI)*(i%3+1)*.8,Math.max(.01,(1-t)*.18),col,a+t);}
  }else if(f.type==='smoke'){
   for(let i=0;i<6;i++){const a=i*Math.PI/3;r.glow(f.x+Math.cos(a)*radius*t,f.z+Math.sin(a)*radius*t,radius*.65,col,.12,1-t);}
  }else{
   ring(radius*(.65+t*.35),.7,2);ring(radius*(.4+t*.2),.4,1);
   const pts=Array.from({length:7},(_,i)=>{const a=i*Math.PI/3+t*.5;return r.point(f.x+Math.cos(a)*radius*.8,f.z+Math.sin(a)*radius*.8,.035);});r.line(pts,col,1.3);
   for(let i=0;i<6;i++){const a=i*Math.PI/3;r.crystal(f.x+Math.cos(a)*radius*.65,f.z+Math.sin(a)*radius*.65,t*2,.07,col,a);}
  }
 }
 c.restore();return true;
}
export function drawSummon(r,m){
 const p=r.point(m.x,m.z,1),c=r.ctx;const col=m.type==='turret'?'#f9c587':'#8bf6d3';
 r.groundCircle(m.x,m.z,.5,col,.22,1);if(r.game.summons.length<6)r.glow(m.x,m.z,1,col,.08);
 if(m.type==='turret'){
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;r.box(m.x+Math.cos(a)*.35,m.z+Math.sin(a)*.35,.18,.8,.2,'#627178',0,a);}
  r.box(m.x,m.z,.7,.7,.65,'#927657',.15);r.box(m.x+Math.cos(m.angle)*.4,m.z+Math.sin(m.angle)*.4,.25,1.2,.25,'#c4c9bd',.75,m.angle-Math.PI/2);
  r.crystal(m.x,m.z,1.05,.12,col,r.clock);
 }else if(m.type==='archer'||m.type==='golem'){
  const heavy=m.type==='golem',size=heavy?1.4:.7,col=heavy?'#aebc9a':'#d4ddc2',a=m.angle-Math.PI/2; r.box(m.x,m.z,size,size*.7,heavy?1.1:.7,col,.45,a);r.box(m.x,m.z,heavy?.8:.38,heavy?.7:.36,.45,'#e0e6ca',heavy?1.55:1.2,a);
  for(const side of [-1,1]){r.box(m.x+side*size*.3,m.z,.2,.25,.5,'#818d77',0,a);r.box(m.x+side*size*.65,m.z,.23,.3,heavy?.9:.6,col,heavy?.8:.65,a);}
  if(!heavy)r.line([r.point(m.x+.6,m.z,1.6),r.point(m.x+.85,m.z,1),r.point(m.x+.6,m.z,.45)],'#9cc9ac',3);else r.glow(m.x,m.z,1.5,'#a0e1b2',.17,1);
 }else if(m.type==='wolf'){
  const a=m.angle-Math.PI/2,co=Math.cos(a),si=Math.sin(a),part=(x,z,w,d,h,col,b=0)=>r.box(m.x+x*co-z*si,m.z+x*si+z*co,w,d,h,col,b,a),stride=Math.sin(r.clock*14+m.x)*.08;
  part(0,0,.5,1,.4,'#b9c4a6',.32);part(0,.48,.42,.45,.4,'#d5dfc3',.56);part(0,.73,.25,.26,.16,'#86927c',.58);for(const side of [-1,1]){part(side*.16,.4,.13,.17,.27,'#b6c69e',.89);part(side*.2,-.35,.13,.19,.35,'#79836e',.06+stride*side);part(side*.2,.3,.13,.19,.35,'#79836e',.06-stride*side);part(side*.12,.7,.04,.03,.05,'#e4ffa6',.8);}part(0,-.7,.15,.55,.15,'#c6d0b4',.5);
 }else{
  const h=1+Math.sin(r.clock*4+m.x)*.16;r.crystal(m.x,m.z,h,.31,'#83dabc',r.clock*.4);
  r.box(m.x,m.z,.36,.3,.34,'#c8f5dd',h+.3);r.line([r.point(m.x-.45,m.z,h),r.point(m.x-.8,m.z,h+.6)],'#bdfae7',3);
  r.groundCircle(m.x,m.z,.4,col,.2);for(let i=0;i<3;i++)r.crystal(m.x,m.z,h-.3-i*.2,.15-i*.035,col,i);
 }
 c.fillStyle='#102027';c.fillRect(p.x-15,p.y+18,30,3);c.fillStyle=col;c.fillRect(p.x-15,p.y+18,30*Math.min(1,m.life/12),3);if(m.permanent){c.font='12px sans-serif';c.textAlign='center';c.fillText('∞',p.x,p.y+32);}
}
