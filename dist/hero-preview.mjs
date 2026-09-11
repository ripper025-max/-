import{Game,CLASSES}from'./sim.mjs';
import{Renderer}from'./render.mjs';
export class HeroPreview{
 constructor(canvas){this.canvas=canvas;this.game=new Game();this.renderer=new Renderer(canvas,document.createElement('canvas'),this.game);this.angle=.8;this.auto=true;this.elapsed=0;this.signature='';}
 select(classes,save){const signature=JSON.stringify([classes,save.profiles]);if(signature===this.signature)return;this.signature=signature;this.game=new Game(JSON.parse(JSON.stringify(save)));this.game.begin(classes);this.renderer.game=this.game;for(const p of this.game.players){p.x=0;p.z=0;p.invuln=0;}this.elapsed=1;}
 turn(amount){this.auto=false;this.angle+=amount;this.elapsed=1;}
 toggle(){this.auto=!this.auto;return this.auto;}
 frame(dt){this.elapsed+=dt;if(this.elapsed<1/30)return;const r=this.renderer,c=r.ctx,w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;if(r.w!==w||r.h!==h)r.resize();if(this.auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches)this.angle+=Math.min(this.elapsed,.05)*.3;this.elapsed=0;r.clock+=dt;r.scale=Math.min(w/(this.game.players.length===2?7:4.2),(h-110)/4.2,110);r.cy=h*.78;const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#101922');bg.addColorStop(1,'#070d13');c.fillStyle=bg;c.fillRect(0,0,w,h);
 for(const [i,p]of this.game.players.entries()){r.cx=w*(i+.5)/this.game.players.length;const glow=c.createRadialGradient(r.cx,h*.4,4,r.cx,h*.45,h*.5);glow.addColorStop(0,CLASSES[p.cls].color+'27');glow.addColorStop(1,'transparent');c.fillStyle=glow;c.fillRect(0,0,w,h);r.box(0,0,2.5,2.5,.16,'#46515a',-.16,.78);r.box(0,0,2.8,2.8,.13,'#282f36',-.29,.78);p.face={x:Math.cos(this.angle),z:Math.sin(this.angle)};r.hero(p,true);}
 }
}
