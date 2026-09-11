// Original class kits; stable IDs preserve existing character saves.
const passive=(name,icon,desc)=>({name,icon,desc});
export const NATURE_CLASSES={
 druid:{name:'드루이드',role:'곰 변신 · 자연·야수',color:'#b5d77e',icon:'relic',basic:'야생의 일격',baseHp:150,baseDamage:14,range:3.4,speed:5.6,
 skills:[{name:'휘감는 뿌리',icon:'trap',desc:'조준 지점에 5초간 뿌리 지대. 초당 90% 피해와 속박. 자연의 힘 +2.',cost:25,cd:5,mult:.9,range:10},{name:'늑대 무리',icon:'relic',desc:'14초간 근접 공격하는 늑대 2마리 소환. 0.85초마다 75% 피해. 자연의 힘 +2.',cost:30,cd:8,mult:.75,range:8},{name:'곰 변신',icon:'shield',desc:'7초간 곰으로 변신. 기본 공격이 180% 발톱 공격으로 변경, 받는 피해 30% 감소. 자연의 힘당 지속 +0.5초.',cost:50,cd:18,mult:2.5,range:4}],
 passives:[passive('야생의 힘','sword','단계마다 모든 공격력 +8%.'),passive('참나무 피부','shield','단계마다 생명력 +12%, 흡수 +1%.'),passive('자연의 순환','bolt','단계마다 기력 회복 +12%, 재사용 감소 +4%.')]},
 monk:{name:'수도사',role:'연타 · 기 폭발',color:'#8ed9f1',icon:'shock',basic:'수련봉',baseHp:140,baseDamage:14,range:3.4,speed:6.1,
 skills:[{name:'연환격',icon:'whirl',desc:'전방에 3차례 100% 타격. 적중마다 기 획득. 마지막 타격은 적을 밀칩니다.',cost:25,cd:4,mult:1,range:4},{name:'정화의 진',icon:'frost',desc:'주변에 150% 피해와 2초 기절. 5초간 받는 피해 25% 감소, 기 +2.',cost:30,cd:8,mult:1.5,range:3.8},{name:'천둥 해방',icon:'bolt',desc:'주변에 350% 번개 피해. 기를 모두 소비해 중첩당 피해 +25%.',cost:55,cd:15,mult:3.5,range:6}],
 passives:[passive('단련된 일격','shock','단계마다 모든 공격력 +8%.'),passive('강철의 호흡','shield','단계마다 생명력 +12%, 흡수 +1%.'),passive('기 순환','bolt','단계마다 기력 회복 +12%, 재사용 감소 +4%.')]}
};
export const NATURE_TRAITS={druid:{name:'자연의 힘',max:6,desc:'기본 공격 적중으로 +1, 뿌리·늑대 시전으로 +2. 곰 변신 시 모두 소비해 중첩당 지속 +0.5초.',color:'#b5d77e'},monk:{name:'기',max:6,desc:'기본 공격·연환격 적중으로 +1. 천둥 해방 시 모두 소비해 중첩당 피해 +25%.',color:'#8ed9f1'}};
export const NATURE_RUNES={
 druid:[[{name:'가시 덩굴',desc:'뿌리 피해 +40%, 속박 대신 55% 둔화.',damage:1.4},{name:'깊은 뿌리',desc:'범위 +25%, 지속 7초. 피해 −20%.',damage:.8}], [{name:'무리의 우두머리',desc:'늑대 1마리 추가. 각 늑대 피해 −20%.',damage:.8},{name:'겨울 늑대',desc:'늑대가 적중 시 0.6초 기절. 피해 −10%.',damage:.9}], [{name:'거목의 수호',desc:'곰 변신 중 받는 피해 45% 감소. 기본 공격 150%로 감소.'},{name:'흉포한 발톱',desc:'곰 기본 공격 230%, 기본 변신 지속 5초.'}]],
 monk:[[{name:'뇌전 연타',desc:'각 타격에 0.5초 기절.'},{name:'집중된 권격',desc:'각 타격 피해 +35%, 범위 −20%.',damage:1.35,range:.8}], [{name:'치유의 진',desc:'자신의 최대 생명력 20% 즉시 회복.'},{name:'반격의 진',desc:'기절 3초, 피해 +40%.',damage:1.4}], [{name:'잔류 번개',desc:'3초간 초당 70% 추가 번개 지대.'},{name:'끝없는 수련',desc:'기력 40, 기본 재사용 11초. 피해 −25%.',damage:.75,cost:40,cd:11}]]
};
export const NATURE_LEGENDS={wildheart:{name:'오래된 숲의 심장',cls:'druid',text:'드루이드가 곰으로 변신하면 늑대의 남은 시간이 5초 늘어나고 변신 중 늑대 피해가 50% 증가합니다.'},thunder:{name:'고요 끝의 천둥',cls:'monk',text:'수도사의 천둥 해방이 0.4초 뒤 같은 위치에 원래 피해의 60%로 다시 폭발합니다.'}};

const skill=(name,icon,desc,cost,cd,mult,range)=>({name,icon,desc,cost,cd,mult,range});
export const EXTRA_SKILLS={
 knight:[skill('전투 함성','shield','생명력 20% 회복. 5초간 모든 공격 피해 +30%.',30,12,0,4),skill('분쇄의 진','shock','주변에 260% 피해, 적을 끌어당기고 2초 기절.',35,7,2.6,5)],
 mage:[skill('연쇄 번개','bolt','가까운 적 최대 6명에게 각각 220% 번개 피해.',30,5,2.2,11),skill('얼음 창','frost','관통하는 얼음 창. 300% 피해와 2초 동결.',25,4.5,3,14)],
 ranger:[skill('관통 사격','bow','정면을 꿰뚫는 380% 관통 화살.',30,5,3.8,18),skill('사냥 준비','bolt','기력 35 회복, 정밀 조준 충전. 5초간 피해 +30%.',0,14,0,1)],
 assassin:[skill('독 묻은 칼날','trap','조준 위치에 5초간 초당 130% 독 지대.',30,6,1.3,9),skill('급소 찌르기','sword','가까운 적에게 500% 피해. 대상 생명력이 35% 미만이면 피해 2배.',40,9,5,4)],
 necromancer:[skill('망자의 군세','relic','해골 궁수 3기를 16초 소환. 영원의 서약 적용. 0.8초마다 85% 사격.',40,10,.85,12),skill('뼈 골렘','shield','뼈 골렘 1기를 20초 소환. 1.6초마다 250% 광역 강타. 영원의 서약 적용.',45,12,2.5,10)],
 engineer:[skill('폭발 화살','blast','조준 지점에 0.6초 후 420% 폭발.',35,7,4.2,12),skill('제압 사격','arrows','전방에 관통탄 7발. 각각 100% 피해와 1초 기절.',30,5,1,14)],
 druid:[skill('폭풍 소환','bolt','조준 지점에 5초간 초당 120% 번개. 자연의 힘 +2.',35,7,1.2,10),skill('재생의 숨결','potion','생명력 30% 회복. 5초간 받는 피해 25% 감소. 자연의 힘 +2.',30,12,0,1)],
 monk:[skill('기공파','shock','관통하는 280% 기공파. 적을 1초 기절시킵니다.',30,5,2.8,12),skill('명상','relic','기 6 충전, 기력 35 회복. 4초간 받는 피해 25% 감소.',0,14,0,1)]
};
export function addExtraSkills(classes,runes){for(const [key,list]of Object.entries(EXTRA_SKILLS)){classes[key].skills.push(...list);for(const sk of list)runes[key].push(sk.mult>0?[{name:sk.name+' · 증폭',desc:'피해 +35%. 재사용 시간 +20%.',damage:1.35,cd:sk.cd*1.2},{name:sk.name+' · 순환',desc:'기력 소모·재사용 시간 −25%, 피해 −15%.',damage:.85,cost:sk.cost*.75,cd:sk.cd*.75}]:[{name:sk.name+' · 집중',desc:'기력 소모 −40%.',cost:sk.cost*.6},{name:sk.name+' · 순환',desc:'재사용 시간 −25%.',cd:sk.cd*.75}]);}}
