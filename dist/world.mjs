export const WORLD={minX:-76,maxX:76,minZ:-68,maxZ:68};
export const TOWN={x:0,z:0,r:18,name:'새벽불 마을'};
export const FIELD_NAME='잿불 균열';
export const RIFT_ENTRY={x:0,z:-23};
export const RIFT_GATE={x:0,z:-7};
// These are navigation landmarks in one continuous meadow, never arena bounds.
export const REGIONS=[
 {name:'새벽불 마을',x:0,z:0,w:18,h:18,biome:'town',desc:'안전 지역 · 회복과 장비 정비'},
 {name:'서쪽 고목',x:-39,z:-29,w:20,h:18,biome:'grass',desc:'평원의 길잡이 · 고목이 서 있는 곳'},
 {name:'옛 돌기둥',x:40,z:-30,w:21,h:19,biome:'grass',desc:'평원의 길잡이 · 오래된 유적 흔적'},
 {name:'남쪽 야영지',x:-40,z:31,w:21,h:19,biome:'grass',desc:'평원의 길잡이 · 버려진 모닥불'},
 {name:'수호자의 흔적',x:42,z:33,w:23,h:22,biome:'grass',desc:'같은 평원 안에서 수호자를 만나세요'}
];
export const FIELD_PACKS=[[-26,-14],[-21,-39],[-48,-24],[-60,-49],[-41,1],[-62,22],[22,-18],[46,-10],[22,-48],[57,-46],[60,3],[1,-61],[-19,24],[-40,44],[-12,57],[17,52],[59,55],[2,31]].map(([x,z],i)=>({x,z,id:i,group:Math.floor(i/6)+1}));
export function meadowTone(x,z){return .5+Math.sin(x*.074+Math.sin(z*.052)*1.4)*.19+Math.cos(z*.089-x*.026)*.14;}
export const SERVICES=[
 {key:'inventory',name:'대장간',desc:'강화 · 분해 · 옵션 재설정',x:-6,z:-3,color:'#ffc186'},
 {key:'skills',name:'훈련소',desc:'스킬 · 룬 · 직업 특성',x:6,z:-3,color:'#a6dbff'},
 {key:'hunts',name:'사냥 게시판',desc:'보스 선택 · 전설 보상',x:0,z:10,color:'#e8d194'}
];
export const inTown=p=>p.scene!=='rift'&&Math.hypot(p.x-TOWN.x,p.z-TOWN.z)<TOWN.r;
function segmentDistance(p,a,b){const x=b.x-a.x,z=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*x+(p.z-a.z)*z)/(x*x+z*z)));return Math.hypot(p.x-a.x-x*t,p.z-a.z-z*t);}
export function onRoad(x,z,width=4.2){return REGIONS.slice(1).some(r=>segmentDistance({x,z},TOWN,r)<width);}
export function regionAt(p){if(inTown(p))return 0;let best=1,d=Infinity;for(let i=1;i<REGIONS.length;i++){const r=REGIONS[i],n=Math.hypot(p.x-r.x,p.z-r.z);if(n<d){d=n;best=i;}}return best;}
export function worldObjects(scene='town'){
 let seed=1249;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const objects=[];
 for(const [x,z,w,d,h,color] of [[0,-14,7,5,3.8,'#79634b'],[14,0,5,7,4,'#536b76'],[-14,0,5,7,3.5,'#6e6950'],[0,14,6,4,3.5,'#72564b']])objects.push({type:'house',x,z,w,d,h,color,solid:true});
 objects.push({type:'fountain',x:0,z:0,r:1.25,solid:true});
 for(const service of SERVICES)objects.push({type:'station',...service,r:.75,solid:true});
 for(const [x,z] of [[-5,-11],[5,-11],[-9,2],[9,2],[-5,12],[5,12]])objects.push({type:'lamp',x,z,r:.22,solid:false});
 for(let i=0;i<145;i++){
  const x=WORLD.minX+3+rng()*(WORLD.maxX-WORLD.minX-6),z=WORLD.minZ+3+rng()*(WORLD.maxZ-WORLD.minZ-6);
  if(Math.hypot(x,z)<22||onRoad(x,z,5.5)||REGIONS.slice(1).some(r=>Math.hypot(x-r.x,z-r.z)<7)||FIELD_PACKS.some(p=>Math.hypot(x-p.x,z-p.z)<4))continue;
  const tree=rng()<.3;objects.push({type:tree?'tree':'boulder',x,z,r:tree?.5:.7+rng()*.55,size:tree?1.7+rng()*1.3:1+rng(),h:tree?3.2+rng()*2:1+rng()*1.3,solid:true,variant:Math.floor(rng()*3)});
 }
 for(const r of REGIONS.slice(1))for(const side of [-1,1]){
  const x=r.x+side*15,z=onRoad(x,r.z-13,5.5)?r.z+13:r.z-13;
  objects.push({type:'ruin',x,z,r:1,solid:true,h:2.2+side*.4});
  objects.push({type:'campfire',x:r.x+side*10,z:r.z+10,r:.5,solid:false});
 }
 objects.push({type:'tree',x:-46,z:-25,r:.7,size:3,h:5.6,solid:true,variant:1});
 objects.push({type:'ruin',x:48,z:-28,r:1,h:3.4,solid:true});
 objects.push({type:'campfire',x:-40,z:31,r:.5,solid:false});
 if(scene==='rift')for(const side of [-1,1])for(const offset of [-7,7])objects.push({type:'ruin',x:RIFT_ENTRY.x+side*8,z:RIFT_ENTRY.z+offset,r:1,solid:true,h:3.4});
 return scene==='rift'?objects.filter(o=>Math.hypot(o.x,o.z)>22&&Math.hypot(o.x-RIFT_ENTRY.x,o.z-RIFT_ENTRY.z)>8).map(o=>o.type==='tree'?{...o,type:'ruin',r:.8,h:2.2}:o):objects;
}
