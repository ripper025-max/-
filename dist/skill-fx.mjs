// Each effect uses the same origin/radius as its combat event. No damage is applied here.
const TAU=Math.PI*2;
const clamp=v=>Math.max(0,Math.min(1,v));
const colors={knight:'#ffd687',mage:'#a3eaff',ranger:'#c9eea0',assassin:'#d9acff',necromancer:'#8ff4d3',engineer:'#91e5ff',druid:'#c6e991',monk:'#96eaff'};
export const SKILL_VISUALS={knight:['sunwheel','earthsplit','judgment','rally','implosion'],mage:['glacier','inferno','meteorcall','chaincast','icecast'],ranger:['volley','venom','arrowstorm','piercecast','focus'],assassin:['execution','veil','bladestorm','venom','puncture'],necromancer:['soulgate','hex','requiem','archers','golem'],engineer:['assembly','cryo','overload','fuse','volley'],druid:['roots','pack','bear','thunder','renewal'],monk:['flurry','sanctuary','thunder','wavecast','meditation']};
export function skillCue(p,index,range,point,rune){
 const atPlayer=p.cls==='monk'||p.cls==='druid'&&index!==0||p.cls==='knight'||p.cls==='assassin'||p.cls==='mage'&&(index===0||index===1&&rune===1)||p.cls==='ranger'&&(index===0||index===2&&rune===1)||p.cls==='necromancer'&&(index===0||index===1&&rune===1)||p.cls==='engineer'&&index===2;
 const extraAtPlayer=index>=3&&!(p.cls==='assassin'||index===3&&['engineer','druid'].includes(p.cls));
 const q=(index>=3?extraAtPlayer:atPlayer)?p:point;
 const sizes={knight:[range,4,range,3,range],mage:[range,3,rune===1?5:4.2,1.5,1.5],ranger:[4,rune===1?3.5:3.1,rune===2?2.7:4.2,1.5,1.4],assassin:[range,range,rune===2?2.5:3.5,3.5,1],necromancer:[2,3.5,4,2,2],engineer:[1.6,3.4,1.6,4,2],druid:[rune===2?4.25:3.4,2,range,4,1.8],monk:[range,range,range,1.5,1.5]};
 return {type:'skillcue',x:q.x,z:q.z,color:colors[p.cls],style:SKILL_VISUALS[p.cls][index],r:sizes[p.cls][index],angle:Math.atan2(p.face.z,p.face.x),life:p.cls==='engineer'&&index===3?.6:index===2?1.15:.75,rune};
}
function arc(r,x,z,rr,a,length,h,color,width){const pts=Array.from({length:23},(_,i)=>{const angle=a+i/22*length;return r.point(x+Math.cos(angle)*rr,z+Math.sin(angle)*rr,h);});r.line(pts,color,width);return pts;}
function ribbon(r,x,z,rr,a,length,h,color,alpha=.8){const c=r.ctx;c.save();c.globalAlpha*=alpha;const outer=[],inner=[];for(let i=0;i<=24;i++){const t=i/24,angle=a+t*length,w=Math.sin(t*Math.PI)*.22;outer.push(r.point(x+Math.cos(angle)*rr,z+Math.sin(angle)*rr,h));inner.unshift(r.point(x+Math.cos(angle)*rr*(1-w),z+Math.sin(angle)*rr*(1-w),h+.03));}r.poly([...outer,...inner],color);r.line(outer,'#fff9e6',1.8);c.restore();}
function sparks(r,x,z,rr,t,color,count=18,height=1){for(let i=0;i<count;i++){const a=i*2.399,dist=rr*(.15+t*(.6+(i%5)*.09)),h=.1+Math.sin(t*Math.PI)*height*(.5+i%3*.3),from=r.point(x+Math.cos(a)*dist,z+Math.sin(a)*dist,h),to=r.point(x+Math.cos(a)*(dist+.2*(1-t)),z+Math.sin(a)*(dist+.2*(1-t)),h+.15);r.line([from,to],i%3?color:'#fff9dc',Math.max(.5,2.5*(1-t)));}}
function beam(r,x,z,height,width,color,alpha){const c=r.ctx,q=r.point(x,z),top=r.point(x,z,height);c.save();c.globalAlpha*=alpha;const g=c.createLinearGradient(q.x,q.y,top.x,top.y);g.addColorStop(0,color);g.addColorStop(.5,color+'88');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(q.x-width*r.scale/2,top.y,width*r.scale,q.y-top.y);r.line([q,top],'#fff7dc',Math.max(1,width*r.scale*.12));c.restore();}
function dagger(r,x,z,a,h,color,size=.8){const f={x:Math.cos(a),z:Math.sin(a)},s={x:-f.z,z:f.x};r.poly([r.point(x+f.x*size,z+f.z*size,h),r.point(x+s.x*.13,z+s.z*.13,h),r.point(x-f.x*.22,z-f.z*.22,h),r.point(x-s.x*.13,z-s.z*.13,h)],color,'#ffefff',.8);}
function lightning(r,from,to,color,width=2,phase=0){const a=r.point(from.x,from.z,from.h||1),b=r.point(to.x,to.z,to.h||1);const pts=Array.from({length:9},(_,i)=>({x:a.x+(b.x-a.x)*i/8+(i&&i<8?Math.sin(i*7.4+phase)*7:0),y:a.y+(b.y-a.y)*i/8+(i&&i<8?Math.cos(i*5.6+phase)*6:0)}));r.line(pts,color,width*2);r.line(pts,'#efffff',width*.65);}
export function drawSkillFx(r,f){
 if(!['skillcue','skillimpact','meteorimpact','meteor'].includes(f.type))return false;
 const c=r.ctx,t=clamp(1-f.life/f.total),fade=Math.min(1,(1-t)*2.4),rr=f.r||3,col=f.color||'#ffe0a0',a=f.angle||0,detail=r.game.save.settings.particles!==false;
 const screen=r.point(f.x,f.z);if(screen.x< -rr*r.scale*2||screen.x>r.w+rr*r.scale*2||screen.y< -rr*r.scale*2||screen.y>r.h+rr*r.scale*2+400)return true;
 c.save();c.globalCompositeOperation='lighter';c.globalAlpha=fade;
 if(f.type==='meteor'){
  const fall=1-t,h=fall*14,x=f.x-fall*5,z=f.z-fall*2;
  r.groundCircle(f.x,f.z,rr,'#ffca88',.65,2);r.groundCircle(f.x,f.z,rr*t,'#ff9d68',.22,3);
  for(let i=5;i>=0;i--){const trail=i*.35;r.glow(x-trail*.4,z-trail*.15,.7+i*.2,'#ff9857',.16*(1-i*.12),h+trail);}
  r.line([r.point(x-2,z-.7,h+5),r.point(x,z,h)],'#ff9f67',12);r.line([r.point(x-1,z-.35,h+2.5),r.point(x,z,h)],'#ffe8b3',5);r.crystal(x,z,h,.45,'#fff0c9',t*4);
 }else if(f.type==='skillimpact'||f.type==='meteorimpact'){
  const impact=f.type==='meteorimpact';r.glow(f.x,f.z,rr*(1+t),col,(impact?.35:.2)*(1-t));r.groundCircle(f.x,f.z,rr*(1-Math.pow(1-t,3)),col,.8*(1-t),Math.max(1,7*(1-t)));
  sparks(r,f.x,f.z,rr,t,col,detail?(impact?30:12):6,impact?3:1);
  if(impact){beam(r,f.x,f.z,6*(1-t),1.1,col,.6*(1-t));for(let i=0;i<(detail?12:5);i++){const angle=i*2.4,dist=rr*(.3+t*.7);r.crystal(f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist,Math.sin(t*Math.PI)*2.4,.13*(1-t)+.01,i%2?'#ffdca1':'#ea8258',angle);}}
 }else{
  const s=f.style;
  if(['rally','focus','renewal','meditation'].includes(s)){
   const color=s==='renewal'?'#c6e991':s==='meditation'?'#96eaff':col;
   for(let i=0;i<2;i++)arc(r,f.x,f.z,rr*(.5+t*.5),a+i*Math.PI,Math.PI*.8,.15+i*.35,color,2.5*(1-t)+.5);
   r.glow(f.x,f.z,rr,color,.16*(1-t));sparks(r,f.x,f.z,rr*.6,t,color,detail?10:4,.8);
  }else if(s==='implosion'){
   for(let i=0;i<3;i++)arc(r,f.x,f.z,rr*(1-t*.8),a+i*TAU/3,1.4,.12,col,4*(1-t)+1);
   sparks(r,f.x,f.z,rr,1-t,col,detail?15:5,.4);
  }else if(['chaincast','icecast','piercecast','wavecast','puncture'].includes(s)){
   // Short launch cues stay at the source; projectiles and hit events draw the actual path.
   const color=s==='icecast'?'#b2f0ff':col;
   ribbon(r,f.x,f.z,rr*(.5+t*.5),a-.5,1,.7,color,1-t);
   if(s==='chaincast')lightning(r,{x:f.x,z:f.z,h:.6},{x:f.x+Math.cos(a),z:f.z+Math.sin(a),h:1.1},color,1.5,t*10);
  }else if(s==='archers'||s==='golem'){
   const count=s==='archers'?3:1;
   for(let i=0;i<count;i++){const angle=i*2.4,x=f.x+Math.cos(angle)*1.1,z=f.z+Math.sin(angle)*1.1;
    arc(r,x,z,s==='golem'?1:.45,-t*3,TAU,.05,col,2);beam(r,x,z,(s==='golem'?2.5:1.5)*(1-t),.22,col,.3*(1-t));}
  }else if(s==='fuse'){
   r.groundCircle(f.x,f.z,rr,'#ffc985',.45,1.5);arc(r,f.x,f.z,rr*.9,-Math.PI/2,TAU*t,.08,'#ffe2aa',3);
  }else if(['sunwheel','execution','bladestorm'].includes(s)){
   const n=s==='execution'?3:2;for(let i=0;i<n;i++){const angle=a+t*TAU*(s==='sunwheel'?1.25:.65)+i*TAU/n;ribbon(r,f.x,f.z,rr*(.7+t*.3),angle,Math.PI*1.15,.6+i*.18,col,.85);}
   if(s==='execution')for(let i=0;i<3;i++){const angle=a+(i-1)*.7;const q={x:f.x+Math.cos(angle)*rr*.6,z:f.z+Math.sin(angle)*rr*.6};beam(r,q.x,q.z,2,.35,col,.3);}
   sparks(r,f.x,f.z,rr,t,col,detail?20:7,.5);
  }else if(s==='earthsplit'||s==='volley'){
   for(let i=0;i<(s==='volley'?5:3);i++){const angle=a+(i-(s==='volley'?2:1))*.18,len=rr*(.3+t*.9);const q={x:f.x+Math.cos(angle)*len,z:f.z+Math.sin(angle)*len};r.line([r.point(f.x,f.z,.6),r.point(q.x,q.z,.6)],col,5*(1-t)+1);dagger(r,q.x,q.z,angle,.6,'#fff9d9',.6);}
   arc(r,f.x,f.z,rr*.35,a-.7,1.4,.4,col,3);
  }else if(s==='glacier'||s==='cryo'){
   const spread=rr*(1-Math.pow(1-t,3));r.groundCircle(f.x,f.z,spread,'#d1faff',.8*(1-t),4);r.glow(f.x,f.z,rr,'#74cfff',.25*(1-t));
   for(let i=0;i<(detail?16:8);i++){const angle=i*TAU/(detail?16:8),delay=(i%3)*.045,growth=clamp((t-delay)*5)*clamp((1-t)*3),dist=rr*(.6+(i%3)*.15);r.crystal(f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist,growth*.65,.14+growth*.23,'#b6f4ff',angle);if(detail)r.line([r.point(f.x,f.z),r.point(f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist)],'#b7eeff',1);}
   if(s==='cryo')for(let i=0;i<4;i++){const angle=i*Math.PI/2;lightning(r,{x:f.x,z:f.z,h:.2},{x:f.x+Math.cos(angle)*rr,z:f.z+Math.sin(angle)*rr,h:.1},'#8bdfff',1,t*5);}
  }else if(s==='judgment'){
   r.groundCircle(f.x,f.z,rr,'#ffe3a2',.75*(1-t),3);beam(r,f.x,f.z,10,1.5,'#ffe7a7',.55*(1-t));
   for(let i=0;i<(detail?8:4);i++){const angle=i*TAU/(detail?8:4),dist=rr*.8;beam(r,f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist,5*(1-t),.28,'#ffd381',.65);}
   arc(r,f.x,f.z,rr*.65,t*2,TAU,.1,col,2);sparks(r,f.x,f.z,rr,t,col,detail?24:8,2.5);
  }else if(s==='inferno'||s==='meteorcall'){
   const fire='#ffac65';r.groundCircle(f.x,f.z,rr*(.7+t*.3),fire,.6,2);r.glow(f.x,f.z,rr,fire,.3*(1-t));
   for(let i=0;i<(detail?12:5);i++){const angle=i*2.4,dist=rr*(.3+i%3*.18);beam(r,f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist,(1-t)*(1.5+i%3),.18,fire,.65);}
   sparks(r,f.x,f.z,rr,t,fire,detail?22:7,2);
  }else if(s==='venom'||s==='hex'||s==='soulgate'||s==='requiem'){
   const soul=s==='soulgate'||s==='requiem',color=s==='venom'?'#c0e577':'#94f4d1';
   arc(r,f.x,f.z,rr*(.6+t*.4),t*2.5,TAU,.04,color,2.5);arc(r,f.x,f.z,rr*.5,-t*3,TAU,.05,color,1.2);
   for(let i=0;i<(detail?8:4);i++){const angle=i*TAU/(detail?8:4)+t*2,dist=rr*(s==='requiem'?1-t*.65:.65);const x=f.x+Math.cos(angle)*dist,z=f.z+Math.sin(angle)*dist;
    if(soul){r.glow(x,z,.85,color,.4,1+t*2);r.crystal(x,z,1+t*2,.16,color,angle);arc(r,x,z,.25,angle,2.7,1+t*2,color,2);}else beam(r,x,z,.5+Math.sin(t*Math.PI)*1.5,.24,color,.4);
   }
   if(s==='requiem')beam(r,f.x,f.z,7,1.1,color,.4*(1-t));
  }else if(s==='veil'){
   for(let i=0;i<(detail?8:4);i++){const angle=i*2.4,dist=rr*t;r.glow(f.x+Math.cos(angle)*dist,f.z+Math.sin(angle)*dist,rr*.55,col,.18,1+t);ribbon(r,f.x,f.z,dist+.3,angle,1,.7,col,.35);}
  }else if(s==='arrowstorm'){
   for(let i=0;i<(detail?16:6);i++){const phase=(t+i*.11)%1,angle=i*2.4,dist=rr*Math.sqrt((i+.5)/(detail?16:6)),x=f.x+Math.cos(angle)*dist,z=f.z+Math.sin(angle)*dist;const h=(1-phase)*6;r.line([r.point(x-.3,z-.3,h+1.3),r.point(x,z,h)],'#eaffbe',2);}
   r.groundCircle(f.x,f.z,rr,col,.5,1.5);
  }else if(s==='roots'||s==='pack'||s==='bear'){
   const green='#ceee9b';r.glow(f.x,f.z,rr,green,.25*(1-t));
   for(let i=0;i<(detail?12:6);i++){const a=i*2.399,dist=rr*(.2+t*.8),x=f.x+Math.cos(a)*dist,z=f.z+Math.sin(a)*dist;arc(r,x,z,.25+t*.4,a,2.5,Math.sin(t*Math.PI)*1.3,green,3);r.crystal(x,z,.2+Math.sin(t*Math.PI)*1.8,.1,green,a+t);}
   if(s==='bear'){r.groundCircle(f.x,f.z,rr*t,'#e8d7a6',1-t,5);for(let i=0;i<3;i++)ribbon(r,f.x,f.z,rr*(.6+i*.18),f.angle-.9,1.8,.3+i*.18,'#eff7c6',1-t);}
  }else if(s==='flurry'||s==='sanctuary'||s==='thunder'){
   if(s==='flurry')for(let i=0;i<3;i++){const pulse=clamp(t*3-i*.5);ribbon(r,f.x,f.z,rr*(.3+pulse*.7),f.angle-.8,1.6,.5+i*.3,'#bcf5ff',1-pulse);}
   else{arc(r,f.x,f.z,rr,t*2,TAU,.06,'#b8f2ff',3);for(let i=0;i<(detail?10:5);i++){const a=i*TAU/(detail?10:5),x=f.x+Math.cos(a)*rr,z=f.z+Math.sin(a)*rr;lightning(r,{x:f.x,z:f.z,h:s==='thunder'?6:1},{x,z,h:.1},'#8ae5ff',2,t*20);}sparks(r,f.x,f.z,rr,t,'#e7fbff',detail?24:8,2);}
  }else if(s==='assembly'||s==='overload'){
   for(let i=0;i<(detail?6:3);i++){const angle=i*TAU/(detail?6:3)+t,dist=rr*(1-t*.4),x=f.x+Math.cos(angle)*dist,z=f.z+Math.sin(angle)*dist;lightning(r,{x:f.x,z:f.z,h:1.2},{x,z,h:.3},s==='assembly'?'#ffc985':'#a2ecff',1.5,t*12);r.crystal(x,z,.3+t,.08,'#ffd78a',angle);}
   arc(r,f.x,f.z,rr*.75,t*4,Math.PI*1.6,.15,'#ffd28b',3);beam(r,f.x,f.z,3,.5,col,.4);
  }
 }
 c.restore();return true;
}
export function drawZoneFx(r,z){
 const c=r.ctx,col={fire:'#ffb568',poison:'#b6dc77',curse:'#8fefd3',rain:'#dff5b8',blades:'#d7abff',cyclone:'#ffd18b',shadow:'#d1b2ff',meteor:'#ffb276',trap:'#dbed99',roots:'#c7e999',thunder:'#9eeaff'}[z.type]||'#c9dce9',detail=r.game.save.settings.particles!==false,fade=Math.min(1,z.life*2),time=r.clock;
 c.save();c.globalAlpha=fade;c.globalCompositeOperation='lighter';r.groundCircle(z.x,z.z,z.r,col,.32,1.3);
 if(z.type==='roots'){
  for(let i=0;i<(detail?12:5);i++){const a=i*2.399,rr=z.r*(.3+i%4*.17),x=z.x+Math.cos(a)*rr,zz=z.z+Math.sin(a)*rr;arc(r,x,zz,.3,a+time,Math.PI*1.5,.1+Math.sin(time*2+i)*.08,'#bbd98a',3);r.crystal(x,zz,.4,.09,'#cceca0',a);}
 }else if(z.type==='thunder'){
  for(let i=0;i<(detail?7:3);i++){const a=i*2.399+time,rr=z.r*.8;lightning(r,{x:z.x,z:z.z,h:2},{x:z.x+Math.cos(a)*rr,z:z.z+Math.sin(a)*rr,h:.1},col,1.5,time*15);}
 }else if(z.type==='fire'){
  r.glow(z.x,z.z,z.r*1.1,col,.18);for(let i=0;i<(detail?18:6);i++){const phase=(time*.65+i*.17)%1,a=i*2.4,rr=z.r*Math.sqrt((i+.5)/(detail?18:6)),x=z.x+Math.cos(a)*rr,zz=z.z+Math.sin(a)*rr,h=.3+Math.sin(phase*Math.PI)*(1+i%3*.3);const p=r.point(x,zz,.05),q=r.point(x+Math.sin(time*3+i)*.2,zz,h);r.poly([r.point(x-.2,zz,.05),q,r.point(x+.2,zz,.05)],i%2?'#ffb75e':'#f87d42');r.line([p,r.point(x,zz,h*.55)],'#ffe6ac',2);}
 }else if(z.type==='rain'){
  for(let i=0;i<(detail?24:8);i++){const phase=(time*1.6+i*.137)%1,a=i*2.4,rr=z.r*Math.sqrt((i+.5)/(detail?24:8)),x=z.x+Math.cos(a)*rr,zz=z.z+Math.sin(a)*rr,h=(1-phase)*7;r.line([r.point(x-.3,zz-.15,h+1.2),r.point(x,zz,h)],'#edffbe',1.6);if(phase>.86)r.groundCircle(x,zz,(phase-.86)*3,col,(1-phase)*4,1);}
 }else if(z.type==='blades'||z.type==='cyclone'){
  for(let i=0;i<(z.type==='blades'?6:3);i++){const a=time*7+i*TAU/(z.type==='blades'?6:3);ribbon(r,z.x,z.z,z.r,a-.8,.8,.7,col,.6);if(z.type==='blades')dagger(r,z.x+Math.cos(a)*z.r,z.z+Math.sin(a)*z.r,a+Math.PI/2,.8,'#f0d5ff');}
 }else if(z.type==='poison'||z.type==='curse'){
  arc(r,z.x,z.z,z.r*.87,time*.3,TAU,.04,col,1);for(let i=0;i<(detail?10:4);i++){const a=i*2.4,rr=z.r*(.35+i%3*.2),phase=(time*.5+i*.19)%1,x=z.x+Math.cos(a)*rr,zz=z.z+Math.sin(a)*rr;
   if(z.type==='curse'){beam(r,x,zz,.5+phase*1.4,.12,col,(1-phase)*.6);r.crystal(x,zz,.4+phase,.06,col,a);}else{r.glow(x,zz,.7,col,.15*(1-phase),phase);r.groundCircle(x,zz,.1+phase*.3,col,(1-phase)*.6,1,phase*.8);}}
 }
 c.restore();
}
export function drawShotFx(r,s){
 const col=s.color||(s.type==='ice'?'#b2f0ff':s.type==='soul'?'#97fbd8':s.type==='wave'?'#ffd488':s.owner?.cls==='mage'?'#ffc289':'#eaffbc');
 if(s.kind!=='skill'&&s.kind!=='summon')return;
 const c=r.ctx;c.save();c.globalCompositeOperation='lighter';
 const tail=s.kind==='skill'?2.2:1.2;for(let i=3;i>0;i--){c.globalAlpha=.12+(3-i)*.12;r.line([r.point(s.x-s.dx*tail*i/3,s.z-s.dz*tail*i/3,.9),r.point(s.x,s.z,.9)],col,i*2.2);}
 c.globalAlpha=.9;r.line([r.point(s.x-s.dx*.65,s.z-s.dz*.65,.9),r.point(s.x,s.z,.9)],'#f8fff1',2);
 if(s.type==='wave'){const a=Math.atan2(s.dz,s.dx);ribbon(r,s.x-s.dx*.6,s.z-s.dz*.6,Math.max(.9,s.radius*1.4),a-.9,1.8,.65,col,.85);}
 if(s.type==='ice')r.crystal(s.x,s.z,.95,.22,'#d6faff',r.clock*3);
 if(s.type==='soul')r.glow(s.x,s.z,.9,col,.3,1);
 c.restore();
}
export function drawBuffFx(r,p){
 if(p.down)return;const c=r.ctx;c.save();c.globalCompositeOperation='lighter';
 if(p.cls==='knight'&&p.invuln>1){arc(r,p.x,p.z,1.05,r.clock*1.2,TAU,.1,'#ffe1a2',1.5);for(let i=0;i<4;i++){const a=r.clock+i*TAU/4;beam(r,p.x+Math.cos(a),p.z+Math.sin(a),1.7,.08,'#ffe8b5',.25);}}
 if(p.ward>0){arc(r,p.x,p.z,1.1,r.clock,TAU,.1,'#c2f4ff',2);r.glow(p.x,p.z,1.7,'#93dfff',.17,1);}
 if(p.cls==='engineer'&&p.overdrive>0){for(let i=0;i<3;i++){const a=r.clock*3+i*TAU/3;lightning(r,{x:p.x,z:p.z,h:1},{x:p.x+Math.cos(a),z:p.z+Math.sin(a),h:.4},'#96e9ff',.9,r.clock*10);}arc(r,p.x,p.z,1.2,-r.clock*3,Math.PI*1.4,.1,'#ffd78e',2);}
 c.restore();
}
