import{loadVisualAssets,drawImpactSprite}from'./visual-assets.mjs';
import{RIFT_GATE}from'./world.mjs';
import{ActorModel}from'./actor-model.mjs';
import{drawSkillFx,drawZoneFx,drawShotFx,drawBuffFx}from'./skill-fx.mjs';
import{combatFx,drawSummon}from'./effects.mjs';
import{WEAPONS,weaponType,BOSSES,TRAITS}from'./arsenal.mjs';
import{ROOMS,CLASSES,RARITIES,seeded,WORLD,TOWN,SERVICES}from'./sim.mjs';
import{createField,fieldObject,fieldMap}from'./world-render.mjs';
const TAU=Math.PI*2;
const palette={stone:'#4c6065',dark:'#273c45',top:'#6b7c78',gold:'#bc9860',iron:'#24323b',pale:'#d5d1ba'};
const colorCache=new Map();
function shade(hex,f){const key=hex+f;if(colorCache.has(key))return colorCache.get(key);const n=parseInt(hex.replace('#',''),16),r=Math.min(255,Math.round((n>>16)*f)),g=Math.min(255,Math.round(((n>>8)&255)*f)),b=Math.min(255,Math.round((n&255)*f));const result=`rgb(${r},${g},${b})`;colorCache.set(key,result);return result;}
export class Renderer{
  constructor(canvas,minimap,game){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.map=minimap;this.mc=minimap.getContext('2d');this.game=game;this.w=1;this.h=1;this.scale=34;this.camera={x:0,z:0};this.cx=0;this.cy=0;this.clock=0;this.dpr=1;this.staticObjects=[];this.tiles=[];this.floorCache=null;this.cachedScale=0;this.visualAssets=loadVisualAssets();this.makeWorld();this.resize();}
  resize(){this.w=this.canvas.clientWidth;this.h=this.canvas.clientHeight;this.dpr=Math.min(window.devicePixelRatio||1,1.7);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.scale=Math.min(40,Math.max(20,32*Math.pow(this.h/800,.48)));if(this.w<600)this.scale=Math.max(17,this.w/21);this.floorCache=null;}
  makeWorld(){createField(this);}
  point(x,z,h=0){return{x:this.cx+(x-z)*this.scale,y:this.cy+(x+z)*this.scale*.5-h*this.scale};}
  unproject(sx,sy){const a=(sx-this.cx)/this.scale,b=(sy-this.cy)/(this.scale*.5);return{x:(a+b)/2,z:(b-a)/2};}
  poly(points,fill,stroke=null,width=.7){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  box(x,z,w,d,h,color,bottom=0,angle=0){
    const co=Math.cos(angle),si=Math.sin(angle);const corners=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([xx,zz])=>({x:x+xx*co-zz*si,z:z+xx*si+zz*co}));
    const p=corners.map(v=>this.point(v.x,v.z,bottom)),q=corners.map(v=>this.point(v.x,v.z,bottom+h));
    const faces=[];for(let i=0;i<4;i++){const j=(i+1)%4,dx=corners[j].x-corners[i].x,dz=corners[j].z-corners[i].z;const toward=dz-dx;if(toward>0){faces.push({p:[p[i],p[j],q[j],q[i]],f:.51+.19*Math.abs(dz)/(Math.abs(dx)+Math.abs(dz)+.001),sort:(corners[i].x+corners[j].x+corners[i].z+corners[j].z)/2});}}
    faces.sort((a,b)=>a.sort-b.sort);for(const f of faces)this.poly(f.p,shade(color,f.f),'#06141c29',.5);this.poly(q,shade(color,1.07),'#d1e1d00a',.45);
  }
  crystal(x,z,h,r,color,angle=0){const top=this.point(x,z,h+r*2.1),bottom=this.point(x,z,h-r*.9);const p=Array.from({length:4},(_,i)=>this.point(x+Math.cos(angle+i*Math.PI/2)*r,z+Math.sin(angle+i*Math.PI/2)*r,h));for(let i=0;i<4;i++){this.poly([top,p[i],p[(i+1)%4]],shade(color,.67+i*.13));this.poly([bottom,p[i],p[(i+1)%4]],shade(color,.45+i*.1));}}
  groundCircle(x,z,r,color,alpha=1,line=0,height=.025){const p=this.point(x,z,height),c=this.ctx;c.save();c.globalAlpha*=alpha;c.beginPath();c.ellipse(p.x,p.y,r*this.scale*1.414,r*this.scale*.707,0,0,TAU);if(line){c.strokeStyle=color;c.lineWidth=line;c.stroke();}else{c.fillStyle=color;c.fill();}c.restore();}
  glow(x,z,r,color,alpha=.28,height=.1){const p=this.point(x,z,height),c=this.ctx;c.save();c.globalAlpha*=alpha;const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r*this.scale);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.translate(p.x,p.y);c.scale(1,.55);c.fillRect(-r*this.scale,-r*this.scale,r*this.scale*2,r*this.scale*2);c.restore();}
  line(points,color,width=1){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  floor(){
    const c=this.ctx,stone=this.visualAssets?.stone;
    if(this.game.scene==='rift'&&stone?.complete&&stone.naturalWidth){
     for(let x=WORLD.minX;x<WORLD.maxX;x+=8)for(let z=WORLD.minZ;z<WORLD.maxZ;z+=8){const q=this.point(x+4,z+4);if(q.x<-this.scale*9||q.x>this.w+this.scale*9||q.y<-this.scale*5||q.y>this.h+this.scale*5)continue;const p=this.point(x,z);c.save();c.transform(this.scale,this.scale*.5,-this.scale,this.scale*.5,p.x,p.y);c.drawImage(stone,0,0,8.015,8.015);c.fillStyle='#0d172d55';c.fillRect(0,0,8.015,8.015);c.restore();}
     return;
    }
    for(const t of this.tiles){const p=this.point(t.x,t.z);if(p.x<-this.scale*2||p.x>this.w+this.scale*2||p.y<-this.scale||p.y>this.h+this.scale)continue;
      const inlay=t.road||t.town;const material=this.game.scene==='rift'?(t.road?'#626573':'#444b59'):t.town?'#6b7b7a':t.road?'#858775':'#6b865b';const color=shade(material,t.town?.76+t.v*.13:.76+t.tone*.2+t.v*.055);
      const w=this.game.scene==='rift'?.975:t.town?.98:1.012;this.poly([this.point(t.x-w/2,t.z-w/2),this.point(t.x+w/2,t.z-w/2),this.point(t.x+w/2,t.z+w/2),this.point(t.x-w/2,t.z+w/2)],color);
      if(t.town&&t.v>.6)this.line([this.point(t.x-.38,t.z-.36),this.point(t.x+.36,t.z-.36)],'#bac1ac24',.6);
      if(this.game.scene!=='rift'&&!inlay&&t.v<.12){const sway=Math.sin(this.clock*1.8+t.x*.5+t.z*.18)*.11;const q=this.point(t.x,t.z,.02);this.line([q,this.point(t.x+sway-.09,t.z,.22),q,this.point(t.x+sway+.12,t.z-.05,.17)],t.tone>.5?'#adc08866':'#889e7066',.8);}
      if(this.game.scene!=='rift'&&!inlay&&t.v>.992){const q=this.point(t.x+.12,t.z,.12);c.fillStyle=t.tone>.5?'#d9d1a3':'#b7bcdb';c.fillRect(q.x,q.y,1.8,1.8);}

    }
  }
  architecture(o){if(['house','tree','boulder','ruin','fountain','station','lamp','campfire'].includes(o.type)){fieldObject(this,o);return;}
    const c=this.ctx;let p=this.point(o.x,o.z);if(p.x<-180||p.x>this.w+180||p.y<-100||p.y>this.h+230)return;
    const affected=this.game.players.some(hero=>{const hp=this.point(hero.x,hero.z,1.4);return Math.abs(hp.x-p.x)<this.scale*1.2&&hp.y<p.y-12&&hp.y>p.y-this.scale*5;});c.save();if(affected&&(o.type==='column'||o.type==='wall'))c.globalAlpha=.35;
    if(o.type==='column'){
      this.groundCircle(o.x+.2,o.z+.2,1.2,'#06141e',.25);this.box(o.x,o.z,1.55,1.55,.25,'#667674');this.box(o.x,o.z,1.17,1.17,.28,'#8b9180',.25);this.box(o.x,o.z,.85,.85,3.85,'#76817a',.5);this.box(o.x,o.z,.96,.96,.15,'#a1a18a',3.85);this.box(o.x,o.z,1.4,1.4,.3,'#899481',4);this.box(o.x,o.z,1.65,1.65,.22,'#b0ac8f',4.3);
      this.box(o.x-.05,o.z,.9,.91,.1,'#c1b489',1.1);
    }else if(o.type==='wall'){
      this.box(o.x,o.z,o.axis?.52:1.99,o.axis?1.99:.52,o.h,'#52666b');this.box(o.x,o.z,o.axis?.68:2.02,o.axis?2.02:.68,.17,'#839080',o.h);
      for(let i=1;i<o.h;i+=.7)this.box(o.x,o.z,o.axis?.535:1.98,o.axis?1.98:.535,.025,'#202f3b',i);
      if(o.axis===0)this.box(o.x,o.z+.31,.23,.2,o.h+.25,'#718078');else this.box(o.x+.31,o.z,.2,.23,o.h+.25,'#718078');
    }else if(o.type==='torch'){
      this.box(o.x,o.z,.7,.7,.2,'#637375');this.box(o.x,o.z,.26,.26,1.38,'#47545a',.2);this.box(o.x,o.z,.77,.77,.18,'#a68d5a',1.56);this.box(o.x,o.z,.6,.6,.25,'#765638',1.72);
      const flicker=Math.sin(this.clock*8+o.x)*.11;this.crystal(o.x,o.z,2.08,.17+flicker*.2,'#ffb859',this.clock*.4);this.crystal(o.x+.03,o.z+.025,2.0,.08,'#fff0ae',this.clock*.8);
      const s=this.point(o.x,o.z,2.15),g=c.createRadialGradient(s.x,s.y,0,s.x,s.y,48);g.addColorStop(0,'#ffd78752');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(s.x-48,s.y-48,96,96);
    }else if(o.type==='rock'){this.box(o.x,o.z,o.size,o.size*.8,o.height,'#47565d',-.03,o.rotation);}
    else if(o.type==='banner'){
      this.box(o.x,o.z,.28,.28,4.1,'#818b80');const q=[this.point(o.x,o.z+.04,3.8),this.point(o.x+1.05,o.z+.04,3.8),this.point(o.x+1.05,o.z+.04,1.6),this.point(o.x+.54,o.z+.04,1.18),this.point(o.x,o.z+.04,1.6)];this.poly(q,o.room%2?'#694745':'#315965','#b8975b66',1);this.line([this.point(o.x+.48,o.z+.05,3.25),this.point(o.x+.48,o.z+.05,1.85)],'#bcad7980',2);this.line([this.point(o.x+.15,o.z+.05,2.55),this.point(o.x+.8,o.z+.05,2.55)],'#bcad7980',2);
    }else if(o.type==='tomb'){this.box(o.x,o.z,1.25,2.5,.65,'#74807a');this.box(o.x,o.z,1.4,2.65,.17,'#979d8d',.65);this.box(o.x,o.z-.65,.9,.33,1.8,'#8b9489',.8);this.box(o.x,o.z-.65,1.4,.35,.3,'#8b9489',1.9);}
    else if(o.type==='throne'){
      for(let i=0;i<3;i++)this.box(o.x,o.z+i*.28,5.2-i*.7,3.7-i*.3,.22,'#687578',i*.22);this.box(o.x,o.z,2.5,1.2,4.5,'#74807d',.6);this.box(o.x,o.z+.8,2.5,1.8,1,'#676e6e',.65);for(const s of[-1,1]){this.box(o.x+s*1.5,o.z+.4,.4,2,1.8,'#8b8a78',.65);this.crystal(o.x+s*1.5,o.z-.2,3.1,.28,'#d0a767');}this.crystal(o.x,o.z,5.5,.6,'#a78651');
    }
    c.restore();
  }
  hero(p,title=false){
    const model=new ActorModel(this);
    const c=this.ctx,pose=p.actionPose,phase=pose?1-pose.life/pose.total:0,action=pose?Math.sin(phase*Math.PI):0,a=(pose?.angle??Math.atan2(p.face?.z??1,p.face?.x??0))-Math.PI/2+(pose?.type==='greatsword'?Math.sin(phase*Math.PI*2)*.5:pose?.type==='duals'?Math.sin(phase*Math.PI*2)*.24:0);const co=Math.cos(a),si=Math.sin(a),s=this.scale;
    const pos=(lx,lz)=>({x:p.x+lx*co-(lz+action*.18)*si,z:p.z+lx*si+(lz+action*.18)*co});
    const part=(lx,lz,w,d,h,color,bottom=0,rotation=0)=>{const q=pos(lx,lz);model.box(q.x,q.z,w,d,h,color,bottom,a+rotation);};
    if(p.down){this.groundCircle(p.x,p.z,.7,'#080d13',.55);part(0,0,.72,1.6,.45,'#665e57',.1);const q=this.point(p.x,p.z,1.7);c.fillStyle='#edb597';c.font='12px sans-serif';c.textAlign='center';c.fillText('쓰러짐',q.x,q.y);if(p.revive){this.groundCircle(p.x,p.z,1,'#bcdeae',.7,3);c.fillStyle='#b5deb4';c.fillText(`${Math.min(100,Math.round(p.revive/3*100))}%`,q.x,q.y+19);}model.draw();return;}
    if(p.bear>0&&!p.down){
      this.groundCircle(p.x,p.z,1.1,'#08130b',.5);const stride=Math.sin(p.walk||0)*.2;part(0,0,1.55,1.9,1.05,'#675744',.55);part(0,.85,1.1,.9,.9,'#8d7956',1.15);part(0,1.33,.64,.35,.36,'#c1ab79',1.18);part(0,1.55,.26,.1,.17,'#292c25',1.38);
      for(const side of [-1,1]){part(side*.6,-.55,.4,.5,.7,'#594d3e',.08+Math.max(0,stride*side));part(side*.64,.6,.44,.5,.75,'#756248',.1+action*.5);part(side*.36,.78,.27,.25,.25,'#5b513e',2);part(side*.32,1.31,.08,.05,.08,'#e5eea7',1.69);for(let i=0;i<3;i++)part(side*.64+(i-1)*.11,.91,.07,.27,.09,'#ece4bf',.23+action*.5);}
      model.draw();return;
    }
    this.groundCircle(p.x+.12,p.z+.1,.6,'#020a13',.5);this.groundCircle(p.x,p.z,.66,p.id===1?'#7dc6e7':'#c8d18c',.58,1.5);
    const walk=p.walk?Math.sin(p.walk)*.15:0;let hop=action*(pose?.type==='greatsword'?.13:.035);
    const cloak={knight:'#8b453b',mage:'#366b83',ranger:'#57715c',assassin:'#5d397e',necromancer:'#214a48',engineer:'#735332',druid:'#486741',monk:'#356b85'}[p.cls];const armor={knight:'#8e9ca5',mage:'#7fadc0',ranger:'#8b9980',assassin:'#715588',necromancer:'#8caf9d',engineer:'#b48b55',druid:'#a5b47d',monk:'#a2b8b9'}[p.cls];
    part(0,-.36,.91,.09,1.2,cloak,.42+hop);
    part(-.22,walk,.28,.42,.58,'#343943',.1+hop+Math.max(0,walk));part(.22,-walk,.28,.42,.58,'#343943',.1+hop+Math.max(0,-walk));
    part(-.22,.13+walk,.34,.54,.19,'#5d655f',.05+hop+Math.max(0,walk));part(.22,.13-walk,.34,.54,.19,'#5d655f',.05+hop+Math.max(0,-walk));
    if(p.cls==='mage'){part(0,0,.82,.58,.47,'#517488',.47+hop);part(0,0,.66,.5,.72,'#6d9daa',.82+hop);}else part(0,0,.76,.49,.85,armor,.65+hop);
    part(0,.26,.76,.09,.14,'#66563f',.84+hop);part(0,.32,.15,.12,.17,'#d1b579',.82+hop);
    // Local-space armor details share the same transform as the body and weapon.
    const trim=p.cls==='necromancer'?'#b4c8b8':p.cls==='mage'?'#aec9ce':'#baa17a';
    part(0,.268,.56,.055,.43,p.cls==='knight'?'#596c7b':cloak,1.03+hop);
    for(const side of [-1,1]){
      part(side*.29,.29,.055,.07,.48,trim,1.0+hop);
      part(side*.22,.225+(side<0?walk:-walk),.24,.08,.22,armor,.35+hop+Math.max(0,walk*-side));
      part(side*.22,.36+(side<0?walk:-walk),.29,.1,.07,trim,.13+hop+Math.max(0,walk*-side));
      part(side*.49,.245,.26,.06,.06,trim,1.48+hop);
      part(side*.26,-.422,.045,.025,1.02,trim,.48+hop);
    }
    part(0,.305,.12,.07,.15,trim,1.21+hop);
    for(const x of [-.2,0,.2])part(x,-.422,.1,.025,.2,cloak,.31+hop);
    const attack=action,gripZ=.12+attack*.22;
    const grip=side=>pos(side*.48,gripZ);
    part(-.49,0,.29,.47,.3,armor,1.3+hop);part(.49,0,.29,.47,.3,armor,1.3+hop);
    part(-.48,gripZ,.24,.28,.55,p.cls==='mage'?'#41687e':'#706b5d',.86+hop);part(.48,gripZ,.24,.29,.54,p.cls==='mage'?'#41687e':'#706b5d',.9+hop);
    part(0,0,.51,.49,.5,'#dfb694',1.53+hop);
    if(p.cls==='knight'){part(0,-.025,.6,.54,.26,'#b8b9a7',1.88+hop);part(0,.275,.08,.08,.4,'#c9c1a1',1.61+hop);part(-.54,-.02,.35,.56,.37,'#c3b497',1.4+hop);}
    else if(p.cls==='mage'){part(0,-.12,.6,.37,.35,'#adc6c8',1.91+hop);const q=pos(0,0);for(let i=0;i<3;i++){const a=this.clock+i*TAU/3;model.crystal(q.x+Math.cos(a)*.8,q.z+Math.sin(a)*.8,1.5,.09,i%2?'#ffb87f':'#98eaff',a);}}
    else if(p.cls==='ranger'){part(0,-.08,.6,.54,.23,'#688363',1.92+hop);part(0,-.18,.59,.29,.45,'#688363',1.58+hop);part(-.32,-.38,.32,.3,1.15,'#79644a',.85+hop);}
    else if(p.cls==='assassin'){part(0,-.07,.64,.57,.3,'#42334e',1.85+hop);part(0,.28,.56,.08,.21,'#544065',1.55+hop);for(const side of [-1,1])part(side*.52,0,.24,.4,.22,'#bba3cd',1.48+hop);}
    else if(p.cls==='necromancer'){part(0,-.1,.77,.62,1.1,'#2d514f',.35+hop);for(const side of [-1,1])part(side*.24,0,.11,.15,.57,'#c7ddcb',1.98+hop);part(0,.27,.48,.1,.15,'#b7d5c1',1.6+hop);}
    else if(p.cls==='druid'){for(const side of [-1,1]){part(side*.3,-.05,.12,.15,.8,'#d5c6a0',1.98+hop,side*.25);part(side*.42,-.1,.34,.13,.13,'#d5c6a0',2.4+hop);part(side*.51,0,.4,.55,.24,'#8aa265',1.4+hop);}part(0,-.13,.6,.5,.25,'#5b6945',1.95+hop);}
    else if(p.cls==='monk'){part(0,-.02,.55,.5,.15,'#765c45',1.98+hop);part(0,.28,.56,.06,.1,'#81d5eb',1.89+hop);for(let i=0;i<7;i++){const aa=i*Math.PI/6;part(Math.cos(aa)*.3,.26,.09,.09,.09,'#c8a36d',1.4+Math.sin(aa)*.15+hop);}part(0,-.32,.36,.11,1.35,'#44778a',.55+hop);}
    else if(p.cls==='engineer'){part(0,-.01,.64,.57,.24,'#ac814b',1.92+hop);part(0,.28,.59,.09,.15,'#363c40',1.8+hop);for(const side of [-1,1])part(side*.14,.34,.17,.07,.13,'#8dd5db',1.8+hop);part(0,-.4,.65,.35,.85,'#6e6452',.83+hop);part(.3,-.42,.17,.17,1.1,'#a2aaa2',1+hop);}
    if(p.cls==='knight'){
      part(0,.263,.57,.085,.08,'#647783',1.89+hop);
      for(const side of [-1,1]){part(side*.26,.23,.1,.16,.32,'#85949d',1.57+hop);part(side*.49,gripZ+.16,.23,.06,.23,'#9daab0',.95+hop);}
      part(0,-.02,.09,.55,.045,'#d0c5a7',2.14+hop);
    }
    const wt=weaponType(p.profile?.equipped?.weapon,p.cls),w=WEAPONS[wt],extension=attack*(wt==='spear'?1.2:.45),swing=pose?(phase<.22?-1.1+phase/.22*1.1:Math.sin((phase-.22)/.78*Math.PI)*1.35)*(p.combo===1?-1:1):0;
    if(['sword','greatsword','duals','scythe','spear'].includes(wt)){
      const sides=wt==='duals'?[-1,1]:[1];for(const side of sides){const q=grip(side),wa=a+swing*side,len=wt==='greatsword'?2.15:wt==='spear'?2.9:wt==='duals'?1:wt==='scythe'?1.9:1.45;
      model[wt==='spear'?'box':'blade'](q.x-Math.sin(wa)*(len*.45+extension),q.z+Math.cos(wa)*(len*.45+extension),wt==='greatsword'?.28:.12,len,.13,wt==='scythe'?'#9bd9c4':wt==='spear'?'#be9c6f':'#d9e5e2',1.08+hop,wa);
      model.box(q.x,q.z,.42,.14,.13,'#ceb37c',1.08+hop,wa);model.box(q.x+Math.sin(wa)*.18,q.z-Math.cos(wa)*.18,.13,.4,.13,'#66503f',1.07+hop,wa);if(wt==='scythe')model.box(q.x-Math.sin(wa)*len,q.z+Math.cos(wa)*len,.85,.2,.16,'#c9ffe8',1.08+hop,wa);
      }
    }else if(wt==='staff'||wt==='wand'){const q=grip(1);model.box(q.x,q.z,.11,.11,wt==='staff'?1.95:.9,'#b19466',.4+hop);model.crystal(q.x,q.z,(wt==='staff'?2.5:1.5)+hop,.2,w.color,this.clock);this.glow(q.x,q.z,1,w.color,.15,2);}
    else if(wt==='bow'){const q=grip(1),pts=[{x:q.x,z:q.z,h:1.95+hop},{x:q.x+.3*co,z:q.z+.3*si,h:1.2+hop},{x:q.x,z:q.z,h:.45+hop}];model.line(pts,'#d9b981',3);model.line([pts[0],{x:q.x-attack*.25*co,z:q.z-attack*.25*si,h:1.15+hop},pts[2]],'#eeeecc',1);}
    else {const q=grip(1);model.box(q.x,q.z,wt==='cannon'?.6:.34,1.15,.4,'#9fada9',.95+hop,a);model.box(q.x,q.z,.72,.16,.16,'#bc9763',1.05+hop,a);if(wt==='cannon')model.box(q.x,q.z,.68,.65,.44,'#806c53',.94+hop,a);}
    part(-.135,.252,.07,.035,.075,'#172a2f',1.75+hop);part(.135,.252,.07,.035,.075,'#172a2f',1.75+hop);
    part(-.48,gripZ,.19,.22,.2,'#cfac89',1.05+hop);part(.48,gripZ,.19,.22,.2,'#cfac89',1.05+hop);
    model.draw();
    if(p.hit>0){c.save();c.globalAlpha=p.hit*2.4;this.groundCircle(p.x,p.z,.85,'#ffb6a0');c.restore();}
    if(p.invuln>1&&!title){this.groundCircle(p.x,p.z,.8,'#b6dce2',.35,1.5);this.glow(p.x,p.z,1.5,'#b6dcdf',.13,1);}
  }
  enemy(e){
    const c=this.ctx;if(e.dead){c.save();c.globalAlpha=Math.max(0,e.deathT/.65);}
    const a=Math.atan2(e.face.z,e.face.x)-Math.PI/2,co=Math.cos(a),si=Math.sin(a),f=e.type==='boss'?2.05:e.type==='brute'?1.35:1;
    const wind=e.action?Math.max(0,1-e.wind/(e.action.duration||.5)):0,strike=e.swing>0?Math.sin(e.swing/.35*Math.PI):0,recoil=e.hit>0?e.hit*.9:0;const pos=(x,z)=>({x:e.x+(x*co-(z-recoil)*si)*f,z:e.z+(x*si+(z-recoil)*co)*f});const part=(x,z,w,d,h,col,bottom=0)=>{const arm=x>.5;if(arm){z+=strike*.55-wind*.35;bottom+=wind*.55-strike*.2;}const p=pos(x,z);this.box(p.x,p.z,w*f,d*f,h*f,e.hit>0?'#d9c9b1':e.frozen>0?'#8ec6db':col,bottom*f,a);};
    const walk=Math.sin(e.walk)*.12,base=e.dead?-.4:0;
    this.groundCircle(e.x+.1,e.z+.1,e.r*1.15,'#061018',.43);
    if(e.type==='wisp'){
      const hover=1+Math.sin(this.clock*2.7+e.walk)*.22;this.glow(e.x,e.z,1.9,'#f49368',.15,hover);this.crystal(e.x,e.z,hover,.35,e.frozen>0?'#9ccfe2':e.hit>0?'#fff1cc':'#e99767',this.clock*.6);this.groundCircle(e.x,e.z,.5,'#e7ac77',.18,1);for(let i=0;i<3;i++){const ang=this.clock*1.6+i*TAU/3;this.crystal(e.x+Math.cos(ang)*.65,e.z+Math.sin(ang)*.65,hover-.35,.08,'#e0be8d',ang);}
    }else if(e.type==='hound'){
      for(const xx of[-.32,.32])for(const zz of[-.4,.4])part(xx,zz+walk*(xx>0?1:-1),.18,.23,.5,'#393d43',.02);
      part(0,-.1,.68,1.08,.5,'#806758',.45);part(0,.58,.65,.55,.5,'#b5aa8e',.6);part(0,.91,.44,.44,.2,'#716d5a',.6);part(-.22,.52,.16,.19,.4,'#b8ad8b',1);part(.22,.52,.16,.19,.4,'#b8ad8b',1);part(-.2,.855,.13,.06,.07,'#f2a174',.87);part(.2,.855,.13,.06,.07,'#f2a174',.87);part(0,-.79,.18,.55,.18,'#7c6a5a',.73);
    }else{
      const isBoss=e.type==='boss',elite=e.type==='elite',cult=e.type==='cultist';const armor=isBoss?(e.bossKey==='frost'?'#709cba':e.bossKey==='hollow'?'#78628f':'#746752'):elite?'#6f6389':cult?'#68506d':e.type==='brute'?'#726b61':'#78827c';const dark=isBoss?'#403d3b':elite?'#403d59':cult?'#493653':'#414c54';
      part(-.24,walk,.3,.38,.64,dark,.08+base);part(.24,-walk,.3,.38,.64,dark,.08+base);part(0,0,cult?.76:.92,.61,.9,armor,.58+base);
      if(cult||elite)part(0,-.1,1,.66,.4,dark,.33+base);
      part(-.62,0,.38,.57,.36,armor,1.28+base);part(.62,0,.38,.57,.36,armor,1.28+base);part(-.6,.1,.25,.3,.55,dark,.88+base);part(.6,.2,.25,.3,.55,dark,.88+base);
      part(0,0,.58,.53,.5,isBoss?'#c1ac85':cult?'#c4b69e':'#c2c5b3',1.53+base);part(0,-.13,.68,.39,.32,dark,1.82+base);
      part(-.14,.28,.12,.035,.105,isBoss?'#f7b269':elite?'#c7a2ec':cult?'#ec9a89':'#94d3cf',1.75+base);part(.14,.28,.12,.035,.105,isBoss?'#f7b269':elite?'#c7a2ec':cult?'#ec9a89':'#94d3cf',1.75+base);
      part(0,.285,.19,.05,.065,'#3c4242',1.59+base);
      if(isBoss){
        if(e.bossKey==='frost'){for(let i=0;i<5;i++){const aa=i*Math.PI*2/5+this.clock*.4;this.crystal(e.x+Math.cos(aa)*2.2,e.z+Math.sin(aa)*2.2,2.5,.35,'#b6edff',aa);}}if(e.bossKey==='hollow'){this.groundCircle(e.x,e.z,2.2,'#c3a5ff',.6,2);for(const side of [-1,1])part(side*1.05,-.12,.48,.48,1.3,'#86749e',1.5);}
        for(const side of[-1,1]){part(side*.4,-.03,.2,.24,.6,'#c8ba92',1.96);part(side*.51,-.07,.2,.27,.25,'#c8ba92',2.44);part(side*.78,-.04,.17,.22,.49,'#b3a481',1.64);}
        part(.67,.8,.23,1.5,.3,'#bea985',.98);part(.67,.3,.65,.19,.25,'#897148',.96);part(-.64,.16,.5,.32,.8,'#6c655a',.75);const gem=pos(0,.34);this.crystal(gem.x,gem.z,1.13*f,.18*f,'#ffc284',this.clock*.4);
      }else if(cult||elite){part(.69,.42,.12,.12,2.1,'#a08e72',.1);const q=pos(.69,.42);this.crystal(q.x,q.z,2.4,.19,elite?'#c6a5ed':'#f2af85',this.clock*.5);if(elite){for(const side of[-1,0,1])part(side*.23,0,.12,.12,.3,'#b7a780',2.11);this.groundCircle(e.x,e.z,1,'#b6a1e8',.55,1.3);}}
      else{part(.67,.67,e.type==='brute'?.4:.14,1.14,.17,'#b0afa1',.91);part(.67,.18,.4,.16,.18,'#837658',.91);}
    }
    if(e.dead)c.restore();
    if(!e.dead&&e.marked>0){const q=this.point(e.x,e.z,e.type==='boss'?5.9:3.15);this.poly([{x:q.x,y:q.y-6},{x:q.x+5,y:q.y},{x:q.x,y:q.y+6},{x:q.x-5,y:q.y}],null,'#eadca1',1.5);}
    if(!e.dead&&e.type!=='boss'&&(e.hp<e.maxHp||e.type==='elite')){const p=this.point(e.x,e.z,e.type==='brute'?3.45:2.65),w=e.type==='elite'?62:42;c.fillStyle='#0a1720';c.fillRect(p.x-w/2-1,p.y-1,w+2,5);c.fillStyle=e.type==='elite'?'#bea3d6':'#cf9d82';c.fillRect(p.x-w/2,p.y,w*Math.max(0,e.hp/e.maxHp),3);}
  }
  chest(o){this.groundCircle(o.x,o.z,.8,'#030d16',.5);this.box(o.x,o.z,1.25,.84,.58,'#967345',.08);this.box(o.x,o.z,1.3,.89,.16,'#a99564',o.open?1.08:.66,o.open?-.15:0);for(const x of[-.43,.43])this.box(o.x+x,o.z,.095,.86,.61,'#b1a078',.09);this.box(o.x,o.z+.48,.2,.09,.23,'#dfc591',.37);if(!o.open){this.glow(o.x,o.z,2.8,'#d6b45f',.13);const p=this.point(o.x,o.z,1.75);this.ctx.font='11px sans-serif';this.ctx.textAlign='center';this.ctx.fillStyle='#e0c69a';this.ctx.fillText('보물상자',p.x,p.y);}}
  item(drop){const color=RARITIES[drop.item.rarity].color;this.groundCircle(drop.x,drop.z,.35,color,.5,1);this.glow(drop.x,drop.z,1.6,color,.16);const p=this.point(drop.x,drop.z,.12),c=this.ctx;const h=(drop.item.rarity>=3?4:2.3)*this.scale;const grad=c.createLinearGradient(p.x,p.y,p.x,p.y-h);grad.addColorStop(0,color+'88');grad.addColorStop(1,color+'00');c.fillStyle=grad;c.fillRect(p.x-4,p.y-h,8,h);this.crystal(drop.x,drop.z,.35+Math.sin(this.clock*3+drop.t)*.08,.14,color,this.clock);c.font='bold 12px sans-serif';c.textAlign='center';c.strokeStyle='#0a1117';c.lineWidth=3;c.strokeText(`${drop.owner+1}P`,p.x,p.y-15);c.fillStyle=drop.owner?'#9bdcff':'#f5dba0';c.fillText(`${drop.owner+1}P`,p.x,p.y-15);}
  drawFx(f){if(f.type==='spin')return;/* The sunwheel skill cue already draws this sweep. */if(drawImpactSprite(this,f))return;if(drawSkillFx(this,f)||combatFx(this,f))return;const c=this.ctx;const t=1-f.life/f.total,p=this.point(f.x,f.z,.07),s=this.scale;const radius=f.r||1;c.save();
    if(['danger','dangerline','chargeup','fanwarning'].includes(f.type)&&(f.owner?.dead||(f.action&&f.owner?.action!==f.action))){c.restore();return;}
    if(f.type==='danger'){
      this.groundCircle(f.x,f.z,radius,f.color,.13+t*.13);this.groundCircle(f.x,f.z,radius,f.color,.8,1.8);this.groundCircle(f.x,f.z,radius*Math.max(.08,t),f.color,.15,3);this.line([this.point(f.x-.3,f.z),this.point(f.x+.3,f.z)],f.color,1.4);this.line([this.point(f.x,f.z-.3),this.point(f.x,f.z+.3)],f.color,1.4);
    }else if(f.type==='dangerline'){
      const dx=f.tx-f.x,dz=f.tz-f.z,l=Math.hypot(dx,dz)||1,px=-dz/l*radius,pz=dx/l*radius;const pts=[this.point(f.x+px,f.z+pz),this.point(f.tx+px,f.tz+pz),this.point(f.tx-px,f.tz-pz),this.point(f.x-px,f.z-pz)];this.poly(pts,f.color+'44',f.color,1.3);this.groundCircle(f.tx,f.tz,radius,f.color,.15);this.groundCircle(f.tx,f.tz,radius,f.color,.65,1.3);
    }else if(f.type==='fanwarning'){const angle=Math.atan2(f.tz-f.z,f.tx-f.x);for(let i=0;i<(f.count||1);i++){const a=angle+(i-((f.count||1)-1)/2)*(f.spread||.22);this.line([this.point(f.x+Math.cos(a),f.z+Math.sin(a)),this.point(f.x+Math.cos(a)*8,f.z+Math.sin(a)*8)],f.color+'99',1.4);}this.groundCircle(f.x,f.z,.7,f.color,.45,2);
    }else if(f.type==='chargeup'){this.groundCircle(f.x,f.z,radius*.6,f.color,.35+.4*t,1.5);}
    else if(f.type==='slash'||f.type==='spin'){
      const a=f.type==='spin'?t*TAU*1.5:(f.angle||0)-1.1+t*2.7;const len=f.type==='spin'?Math.PI*1.2:.95;
      const out=[],inn=[];for(let i=0;i<=16;i++){const aa=a-len+i/16*len;out.push(this.point(f.x+Math.cos(aa)*radius,f.z+Math.sin(aa)*radius,.55));inn.unshift(this.point(f.x+Math.cos(aa)*radius*.66,f.z+Math.sin(aa)*radius*.66,.57));}
      c.globalAlpha=Math.sin(Math.PI*t)*.9;c.globalCompositeOperation='lighter';this.poly([...out,...inn],f.color+'aa');this.line(out,'#fff9df',f.heavy?4:2.5);this.line(inn,f.color,1.3);this.glow(f.x,f.z,radius,f.color,.14);
    }else if(f.type==='burst'||f.type==='enemyburst'||f.type==='frost'){
      const r=radius*(.15+t*.85);this.groundCircle(f.x,f.z,r,f.color,(1-t)*.7,Math.max(1,(1-t)*5));this.groundCircle(f.x,f.z,r*.9,f.color,(1-t)*.12);if(f.type==='frost')for(let i=0;i<8;i++){const a=i*TAU/8;this.line([p,this.point(f.x+Math.cos(a)*r,f.z+Math.sin(a)*r,.1)],f.color+'99',1.3);}
      for(let i=0;i<8;i++){const a=i*TAU/8;this.crystal(f.x+Math.cos(a)*r*.9,f.z+Math.sin(a)*r*.9,(1-t)*.5,.08*(1-t),f.color,a);}
    }else if(f.type==='hit'||f.type==='death'){
      c.globalAlpha=1-t;const count=f.type==='death'?12:5;for(let i=0;i<count;i++){const a=i*TAU/count+.4,r=(.2+t*1.3)*radius;const q=this.point(f.x+Math.cos(a)*r,f.z+Math.sin(a)*r,1+t*(1-t)*3-i%3*.2);c.fillStyle=f.color;c.fillRect(q.x,q.y,(1-t)*3+1,(1-t)*3+1);}
    }else if(f.type==='pillar'||f.type==='level'||f.type==='heal'){
      this.groundCircle(f.x,f.z,radius*(.4+t*.6),f.color,(1-t)*.7,2);c.globalAlpha=(1-t)*.22;const h=(f.type==='pillar'?9:4)*s;const grad=c.createLinearGradient(p.x,p.y,p.x,p.y-h);grad.addColorStop(0,f.color);grad.addColorStop(1,'transparent');c.fillStyle=grad;c.fillRect(p.x-radius*s*.5,p.y-h,radius*s,h);c.globalAlpha=1;this.glow(f.x,f.z,radius*1.4,f.color,(1-t)*.2);
      for(let i=0;i<9;i++){const a=i*2.4;const q=this.point(f.x+Math.cos(a)*radius*.6,f.z+Math.sin(a)*radius*.6,t*4+i%3*.3);c.fillStyle=f.color;c.globalAlpha=(1-t)*.8;c.fillRect(q.x,q.y,2,4);}
    }else if(f.type==='lightning'){
      const end=this.point(f.tx,f.tz,1);const from=this.point(f.x,f.z,1);const pts=[from];for(let i=1;i<6;i++)pts.push({x:from.x+(end.x-from.x)*i/6+Math.sin(i*123+t*24)*8,y:from.y+(end.y-from.y)*i/6+Math.cos(i*98)*8});pts.push(end);c.globalAlpha=1-t;this.line(pts,f.color,4);this.line(pts,'#e5faff',1.2);
    }else if(f.type==='trail'){this.groundCircle(f.x,f.z,.45,f.color,(1-t)*.4);}
    else if(f.type==='meteor'){
      this.groundCircle(f.x,f.z,radius,f.color,.45,1);const q=this.point(f.x-(1-t)*4,f.z,(1-t)*14);const g=c.createRadialGradient(q.x,q.y,0,q.x,q.y,50);g.addColorStop(0,'#fff1c0');g.addColorStop(.3,'#ffbd69');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(q.x-50,q.y-50,100,100);this.line([{x:q.x-30,y:q.y-90},q],'#efad7266',15);
    }else if(f.type==='arrows'){c.globalAlpha=1-t;for(let i=0;i<12;i++){const a=i*2.4,rr=((i%4)+1)/4*radius,x=f.x+Math.cos(a)*rr,z=f.z+Math.sin(a)*rr;this.line([this.point(x-.2,z,(1-t)*5+1),this.point(x,z,(1-t)*5)],'#dfdbc1',1.2);}}
    c.restore();
  }
  portal(o){const c=this.ctx;this.glow(o.x,o.z,3.5,'#aad6c0',.3);this.groundCircle(o.x,o.z,1.6,'#afddbf',.7,2);this.groundCircle(o.x,o.z,1.35,'#6bbcb2',.3,4);const p=this.point(o.x,o.z,2.1);c.save();const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,this.scale*1.8);g.addColorStop(0,'#e3f8c077');g.addColorStop(.6,'#9ed3b33b');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(p.x-this.scale*2,p.y-this.scale*3,this.scale*4,this.scale*5);c.translate(p.x,p.y);c.rotate(-.12);c.beginPath();c.ellipse(0,0,this.scale*.75,this.scale*1.65,0,0,TAU);c.strokeStyle='#d1e7b5';c.lineWidth=3;c.stroke();c.beginPath();c.ellipse(0,0,this.scale*.59,this.scale*1.52,0,0,TAU);c.strokeStyle='#79bcb1';c.lineWidth=1;c.stroke();c.restore();c.textAlign='center';c.font='13px sans-serif';c.fillStyle='#e9eacb';c.fillText(o.label||'다음 심층으로',p.x,p.y-this.scale*2);}
  frame(dt){
    this.clock+=dt;const g=this.game,c=this.ctx;const title=g.state==='title';if(this.renderScene!==g.scene){this.renderScene=g.scene;this.makeWorld();const p=g.players[0];if(p)this.camera={x:p.x,z:p.z};}
    let target={x:0,z:0};if(!title&&g.players.length){const alive=g.players.filter(p=>!p.down),all=alive.length?alive:g.players;target={x:all.reduce((a,p)=>a+p.x,0)/all.length,z:all.reduce((a,p)=>a+p.z,0)/all.length};}
    else target={x:2+Math.sin(this.clock*.05)*.6,z:-1.8};
    const ease=title?.025:Math.min(1,dt*7);this.camera.x+=(target.x-this.camera.x)*ease;this.camera.z+=(target.z-this.camera.z)*ease;
    let baseScale=Math.min(40,Math.max(20,32*Math.pow(this.h/800,.48)));if(this.w<600)baseScale=Math.max(17,this.w/21);
    baseScale*=g.save.settings.zoom??.88;
    if(g.players.length===2&&!title){const a=g.players[0],b=g.players[1];const extentX=Math.abs((a.x-a.z)-(b.x-b.z)),extentY=Math.abs((a.x+a.z)-(b.x+b.z))*.5;baseScale=Math.min(baseScale,(this.w-170)/(extentX+10),(this.h-230)/(extentY+9));baseScale=Math.max(12,baseScale);}
    this.scale+=(baseScale-this.scale)*.08;
    this.cx=this.w*(title?.69:.5)-(this.camera.x-this.camera.z)*this.scale;this.cy=this.h*(title?.61:.47)-(this.camera.x+this.camera.z)*this.scale*.5;
    if(g.shake>0&&!g.paused&&g.save.settings.impact!==false){this.cx+=Math.sin(this.clock*83)*g.shake;this.cy+=Math.cos(this.clock*71)*g.shake*.5;}
    c.setTransform(this.dpr,0,0,this.dpr,0,0);const bg=c.createLinearGradient(0,0,this.w,this.h);bg.addColorStop(0,'#0d1c29');bg.addColorStop(.55,'#152c35');bg.addColorStop(1,'#132530');c.fillStyle=bg;c.fillRect(0,0,this.w,this.h);
    this.floor();if(g.scene==='rift')for(const p of g.players)this.glow(p.x,p.z,7,'#86a7dc',.085);for(const o of this.staticObjects){const q=this.point(o.x,o.z);if(q.x>-180&&q.x<this.w+180&&q.y>-180&&q.y<this.h+200)this.groundCircle(o.x+.4,o.z+.5,o.type==='house'?Math.max(o.w,o.d)*.62:(o.r||.6)*1.7,'#030810',.25);}for(const t of this.staticObjects)if(t.type==='torch')this.glow(t.x,t.z,4.2,'#efb871',.21);
    for(const z of g.zones)drawZoneFx(this,z);
    for(const f of g.fx)if(['danger','dangerline','chargeup','fanwarning','radialwarning','frost'].includes(f.type))this.drawFx(f);
    const objects=[...(g.summons||[]).map(m=>({depth:m.x+m.z,draw:()=>drawSummon(this,m)})),...this.staticObjects.map(o=>({depth:o.x+o.z+.1,draw:()=>this.architecture(o)})),...g.chests.map(o=>({depth:o.x+o.z,draw:()=>this.chest(o)})),...g.enemies.map(e=>({depth:e.x+e.z,draw:()=>this.enemy(e)})),...g.players.map(p=>({depth:p.x+p.z+.05,draw:()=>this.hero(p)})),...g.drops.map(d=>({depth:d.x+d.z,draw:()=>this.item(d)}))];
    if(title){const p={id:0,x:1,z:2.4,face:{x:.5,z:.9},cls:'knight',walk:0,anim:0};objects.push({depth:p.x+p.z,draw:()=>this.hero(p,true)});const b={id:1,x:-.8,z:2.8,face:{x:.7,z:.5},cls:'mage',walk:0,anim:0};objects.push({depth:b.x+b.z,draw:()=>this.hero(b,true)});objects.push({depth:1,draw:()=>this.portal({x:1,z:-1})});}
    objects.sort((a,b)=>a.depth-b.depth);for(const o of objects)o.draw();for(const p of g.players)drawBuffFx(this,p);
    for(const shot of g.shots){drawShotFx(this,shot);const p=this.point(shot.x,shot.z,.95);if(['arrow','bolt','pellet'].includes(shot.type)){const q=this.point(shot.x-shot.dx*.7,shot.z-shot.dz*.7,.95);this.line([q,p],shot.type==='bolt'?'#ffe1a0':'#e4d4ad',shot.type==='bolt'?3:2);this.glow(shot.x,shot.z,.7,'#ffdca1',.1,1);this.crystal(shot.x,shot.z,.95,.07,'#edf0d5',Math.atan2(shot.dz,shot.dx));}else if(shot.type==='wave'){this.groundCircle(shot.x,shot.z,1,'#e7d6aa',.6,4);this.glow(shot.x,shot.z,1.6,'#e5c088',.2);}else{this.glow(shot.x,shot.z,1.5,shot.color||(shot.type==='enemy'?'#ef855d':shot.type==='ice'?'#95dbef':shot.type==='soul'?'#8cf9d3':shot.type==='arcane'?'#bd99ff':'#ffc275'),.2,1);this.crystal(shot.x,shot.z,.95,shot.type==='enemy'?.18:.2,shot.color||(shot.type==='enemy'?'#ed9876':shot.type==='ice'?'#b8e9fb':shot.type==='soul'?'#bcffe2':shot.type==='arcane'?'#e2cbff':'#ffd79d'),this.clock*6);}}
    for(const f of g.fx)if(!['danger','dangerline','chargeup','fanwarning','radialwarning','frost'].includes(f.type))this.drawFx(f);
    for(const f of g.fx)if(['danger','dangerline','fanwarning','radialwarning'].includes(f.type))this.drawFx(f);
    if(g.scene==='town'&&g.rift?.phase==='ready')this.portal({...RIFT_GATE,label:'균열 입장 · B'});if(g.portal)this.portal({...g.portal,label:'마을로 · 다음 단계 준비'});if(g.scene==='town'&&g.townReturn)this.portal({x:3,z:5,label:'균열 복귀 · B'});if(g.townChannel){for(const p of g.players)this.groundCircle(p.x,p.z,1.7,'#b0edd6',.8,3);}
    if(g.flash>0&&g.save.settings.impact!==false){c.fillStyle=`rgba(255,230,187,${g.flash*.14})`;c.fillRect(0,0,this.w,this.h);}
    // Low fog and ember motes sit behind crisp interface typography.
    c.save();c.globalCompositeOperation='screen';for(const a of this.ambient){const xx=(a.x*this.w+Math.sin(this.clock*.17+a.phase)*26)%this.w,yy=((a.y*this.h-this.clock*a.speed*8)%this.h+this.h)%this.h;c.globalAlpha=.13+.12*Math.sin(this.clock+a.phase);c.fillStyle=a.phase>3?'#c4d9d2':'#edc28f';c.fillRect(xx,yy,a.s,a.s);}c.restore();
    for(const drop of g.drops){const p=this.point(drop.x,drop.z,.85);const color=RARITIES[drop.item.rarity].color;c.font='11px sans-serif';c.textAlign='center';const label=`${drop.owner+1}P · ${drop.item.name}`,w=c.measureText(label).width+16;c.fillStyle='#0b1720dd';c.fillRect(p.x-w/2,p.y-13,w,20);c.strokeStyle=color+'88';c.lineWidth=.7;c.strokeRect(p.x-w/2,p.y-13,w,20);c.fillStyle=color;c.fillText(label,p.x,p.y+1);}
    // Player identifiers remain readable above summons and skill effects.
    if(!title)for(const p of g.players){const q=this.point(p.x,p.z,p.bear>0?2.9:2.65),label=`${p.id+1}P${p.down?' · 구조 대기':p.bear>0?' · 곰 '+p.bear.toFixed(1)+'초':''}`;c.save();c.font='bold 14px sans-serif';c.textAlign='center';const w=c.measureText(label).width+12;c.fillStyle='#07131ce8';c.fillRect(q.x-w/2,q.y-15,w,22);c.fillStyle=p.id===1?'#9dd6ef':'#e7d7a4';c.fillText(label,q.x,q.y+1);c.restore();}
    for(const t of g.texts){const elapsed=1-t.life/t.total,p=this.point(t.x+t.drift*elapsed,t.z,1.9+elapsed*1.4);c.save();c.globalAlpha=Math.min(1,t.life*4);c.textAlign='center';c.font=`${t.crit?'bold 26':'bold 17'}px sans-serif`;c.strokeStyle='#07131c';c.lineWidth=3;c.strokeText(t.text,p.x,p.y);c.shadowColor='#060a10';c.shadowBlur=4;c.fillStyle=t.color;c.fillText(t.text,p.x,p.y);c.restore();}
  }
  minimap(){fieldMap(this);}
  fieldMap(canvas){fieldMap(this,canvas);}
}
