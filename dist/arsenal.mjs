import{NATURE_CLASSES,NATURE_TRAITS,NATURE_LEGENDS}from'./nature.mjs';
export const WEAPONS={
 sword:{name:'장검',icon:'sword',mode:'melee',cd:.46,mult:1,range:2.8,arc:1.8,color:'#ffe0a0',sound:'blade'},
 greatsword:{name:'대검',icon:'sword',mode:'melee',cd:.82,mult:1.9,range:3.6,arc:2.5,color:'#ffb969',sound:'heavy'},
 duals:{name:'쌍검',icon:'sword',mode:'melee',cd:.27,mult:.62,range:2.35,arc:1.5,color:'#e7aeff',sound:'blade'},
 spear:{name:'수련봉',icon:'shock',mode:'thrust',cd:.6,mult:1.4,range:4.8,arc:.65,color:'#d0efff',sound:'pierce'},
 staff:{name:'원소 지팡이',icon:'staff',mode:'shot',cd:.62,mult:1.35,range:15,speed:13,shot:'fire',color:'#ffac76',sound:'cast'},
 wand:{name:'자연 지팡이',icon:'staff',mode:'shot',cd:.32,mult:.7,range:15,speed:17,shot:'arcane',color:'#bb9fff',sound:'cast'},
 bow:{name:'장궁',icon:'bow',mode:'shot',cd:.43,mult:1,range:18,speed:22,shot:'arrow',color:'#d6eea4',sound:'bowshot'},
 crossbow:{name:'쇠뇌',icon:'bow',mode:'shot',cd:.85,mult:2.15,range:19,speed:26,shot:'bolt',pierce:true,color:'#ffd69b',sound:'heavyshot'},
 scythe:{name:'영혼 낫',icon:'whirl',mode:'melee',cd:.67,mult:1.45,range:3.4,arc:2.8,color:'#80f2cf',sound:'reap'},
 cannon:{name:'산탄포',icon:'blast',mode:'shot',cd:.8,mult:.58,range:10,speed:16,shot:'pellet',pellets:5,color:'#ffca84',sound:'cannon'}
};
export const CLASS_WEAPONS={knight:['greatsword'],mage:['staff'],ranger:['bow'],assassin:['duals'],necromancer:['scythe'],engineer:['crossbow'],druid:['wand'],monk:['spear']};
export function weaponType(item,cls){return CLASS_WEAPONS[cls||item?.cls]?.[0]||'greatsword';}
export function normalizeWeapons(profile){for(const item of [...profile.bag,...(profile.overflow||[]),...Object.values(profile.equipped).filter(Boolean)])if(item.slot==='weapon'){const type=CLASS_WEAPONS[profile.cls][0];if(item.weaponType!==type&&!item.legend)item.name=WEAPONS[type].name;item.cls=profile.cls;item.weaponType=type;}return profile;}
export const TRAITS={
 knight:{name:'투지',max:5,desc:'기본 공격 적중으로 투지 획득. 5중첩에서 다음 스킬 피해 +50%.',color:'#f6bd70'},
 mage:{name:'원소 공명',max:3,desc:'서로 다른 스킬을 번갈아 쓰면 공명 획득. 3중첩에서 다음 스킬 피해 +45%.',color:'#88dfff'},
 ranger:{name:'정밀 조준',max:2,desc:'제자리에서 2초 조준하면 다음 기본 공격 피해 +80%. 이동 중에는 조준 감소.',color:'#c4e895'},
 assassin:{name:'연계',max:5,desc:'기본 공격 적중으로 연계 획득. 연계 베기 사용 시 중첩당 피해 +20%.',color:'#d3a0ff'},
 necromancer:{name:'영혼',max:6,desc:'적 처치 또는 기본 공격 3회 적중마다 영혼 획득. 영혼을 소비해 망령 추가 소환.',color:'#8ce8c8'},
 engineer:{name:'열기',max:100,desc:'기본 공격마다 열기 +12. 100에서 1.8초 과열. 냉각탄으로 즉시 냉각.',color:'#ffb67c'}
};
const passive=(name,icon,desc,key)=>({name,icon,desc,key});
export const EXTRA_CLASSES={
 assassin:{name:'도적',role:'쌍검 · 연계 마무리',color:'#bb8be7',icon:'sword',basic:'쌍날',baseHp:130,baseDamage:14,range:2.4,speed:6.3,
 skills:[{name:'연계 베기',icon:'whirl',desc:'주변을 가르는 240% 참격. 연계를 소비해 중첩당 피해 +20%.',cost:25,cd:3.8,mult:2.4,range:3.5},{name:'그림자 장막',icon:'frost',desc:'2초 피해 면역. 주변에 150% 피해를 주고 1.5초 기절.',cost:30,cd:8,mult:1.5,range:3.2},{name:'칼날 폭풍',icon:'arrows',desc:'6초 동안 몸 주변에 칼날을 회전시켜 초당 160% 피해.',cost:55,cd:17,mult:1.6,range:3.5}],
 passives:[passive('급소 해부','sword','단계마다 극대화 확률 +4%.','crit'),passive('그림자 가죽','shield','단계마다 생명력 +10%, 이동 속도 +3%.','shadow'),passive('끊기지 않는 연계','bolt','단계마다 기력 회복 +15%, 재사용 감소 +3%.','flow')]},
 necromancer:{name:'강령술사',role:'소환 · 영혼 수확',color:'#78d3b1',icon:'relic',basic:'영혼 수확',baseHp:125,baseDamage:15,range:3.4,speed:5.4,
 skills:[{name:'망령 소환',icon:'relic',desc:'12초 동안 망령 2기를 소환합니다. 영혼 2개당 1기 추가, 최대 4기. 매초 65% 공격.',cost:30,cd:7,mult:.65,range:9},{name:'쇠락의 저주',icon:'trap',desc:'5초간 저주 지대. 초당 75% 피해, 적이 받는 피해 +20%.',cost:30,cd:6,mult:.75,range:10},{name:'영혼 폭발',icon:'meteor',desc:'조준 지점에 400% 폭발. 활성 망령마다 피해 +25%.',cost:55,cd:16,mult:4,range:11}],
 passives:[passive('망자의 계약','relic','단계마다 스킬·소환 피해 +12%.','summon'),passive('생명 착취','shield','단계마다 생명력 +9%, 흡수 +1.5%.','vigor'),passive('영혼 순환','bolt','단계마다 재사용 감소 +4%, 기력 회복 +10%.','flow')]},
 engineer:{name:'용병',role:'쇠뇌 · 포탑·과열',color:'#e4a166',icon:'blast',basic:'산탄 사격',baseHp:145,baseDamage:13,range:10,speed:5.5,
 skills:[{name:'자동 포탑',icon:'blast',desc:'조준 지점에 10초간 포탑 설치. 0.7초마다 85% 관통탄. 최대 2대.',cost:30,cd:6,mult:.85,range:8},{name:'냉각탄',icon:'frost',desc:'열기를 모두 제거하고 과열 해제. 200% 폭발과 2초 동결.',cost:25,cd:5,mult:2,range:10},{name:'과출력',icon:'bolt',desc:'6초 동안 기본 공격 속도 +60%, 포탑 공격 속도 2배, 열기 발생 중단. 강화 단계마다 지속시간 +0.6초.',cost:55,cd:18,mult:1,range:8}],
 passives:[passive('탄도 설계','blast','단계마다 모든 공격력 +7%, 공격 속도 +3%.','might'),passive('강화 외골격','shield','단계마다 생명력 +10%, 피해 감소 +2%.','vigor'),passive('고속 냉각','bolt','단계마다 재사용 감소 +4%, 초당 추가 냉각 +2.','cool')]} 
};
export const EXTRA_LEGENDS={
 cyclone:{name:'폭풍을 가르는 검',cls:'knight',text:'전사의 회전베기가 3초간 칼날 회오리를 남깁니다. 초당 공격력 90% 피해. 선택한 룬과 함께 적용.'},
 shatter:{name:'빙하의 심장',cls:'mage',text:'원소술사의 스킬이 동결된 적에게 적중하면 45% 추가 피해와 주변 100% 파편 폭발. 재사용 0.8초.'},
 seeker:{name:'메아리 사냥꾼',cls:'ranger',text:'사냥꾼의 다중 사격이 적에게 적중하면 가까운 다른 적에게 80% 유도 화살. 재사용 0.2초.'},
 shadow:{name:'밤을 찢는 송곳니',cls:'assassin',text:'도적이 연계 3 이상으로 연계 베기 사용 시 0.3초 뒤 같은 위치에 70% 잔상 참격.'},
 requiem:{name:'망자의 왕관',cls:'necromancer',text:'강령술사의 영혼 폭발이 각 망령 위치에서 120% 추가 폭발을 일으킵니다.'},
 overdrive:{name:'영구기관',cls:'engineer',text:'용병의 냉각탄이 포탑 남은 시간을 3초 연장하고 포탑마다 근처 적에게 150% 번개를 방출합니다.'}
};
export const BOSSES={
 ember:{name:'잿불 군주 · 모르바스',short:'잿불 군주',color:'#ffac70',desc:'강타 · 부채꼴 화염탄 · 돌진',drops:['cyclone','overdrive','echo','nova'],hint:'회전베기 회오리 / 포탑 번개'},
 frost:{name:'서리 여왕 · 이세라',short:'서리 여왕',color:'#99dfff',desc:'삼중 서리 폭발 · 얼음 창 · 원형 탄막',drops:['shatter','seeker','frost','vortex'],hint:'동결 파쇄 / 유도 화살'},
 hollow:{name:'망령 대공 · 네크로스',short:'망령 대공',color:'#c3a4ff',desc:'저주 폭발 · 십자 탄막 · 망자 소환',drops:['shadow','requiem','blood','chain'],hint:'잔상 참격 / 망령 연쇄 폭발'}
};
export function traitValue(p){return p.cls==='ranger'?p.focus||0:p.cls==='engineer'?p.heat||0:p.chargeResource||0;}

Object.assign(EXTRA_CLASSES,NATURE_CLASSES);Object.assign(TRAITS,NATURE_TRAITS);Object.assign(EXTRA_LEGENDS,NATURE_LEGENDS);BOSSES.frost.drops.push('wildheart');BOSSES.hollow.drops.push('thunder');

// Build-changing equipment stacks with the chosen rune, rather than replacing it.
export const BUILD_LEGENDS={
 aftershock:{name:'산을 깨우는 자',cls:'knight',text:'대지 강타가 전방에 3개의 여진을 남깁니다. 각각 스킬 피해의 45%로 시간차 폭발합니다.'},
 starfire:{name:'별이 타버린 자리',cls:'mage',text:'운석마다 착탄 지점에 4초 동안 초당 공격력 100%의 불바다를 남깁니다. 혜성우 룬이면 세 지점에 생성됩니다.'},
 hail:{name:'끝없는 사냥',cls:'ranger',text:'화살비가 3초 더 지속되고 범위 안의 적을 55% 둔화시킵니다. 이동 사격·집중 포화 룬과 함께 적용됩니다.'},
 twinshade:{name:'쌍둥이 그림자',cls:'assassin',text:'칼날 폭풍 시전 시 조준 위치에도 65% 피해의 고정 칼날 폭풍을 만듭니다. 두 폭풍은 함께 적중할 수 있습니다.'},
 battery:{name:'공성 지휘관',cls:'engineer',text:'자동 포탑을 한 번에 2대 설치하며 최대 4대를 유지합니다. 포탑별 룬과 영구기관 효과가 모두 적용됩니다.'},
 wildstorm:{name:'폭풍을 두른 야수',cls:'druid',text:'곰 변신 시 기존 뿌리 지대가 자신을 따라옵니다. 변신 중 사용하는 뿌리도 자신을 따라옵니다.'},
 stillstorm:{name:'폭풍 속의 고요',cls:'monk',text:'정화의 진이 5초간 자신을 따라오는 번개 지대를 만듭니다. 초당 공격력 90% 피해.'},
 legion:{name:'군단의 인장',cls:'necromancer',text:'망령 소환 수와 최대 유지 수 +2. 영혼·군단의 분노 룬과 합산됩니다.'},
 eternal:{name:'영원의 서약',cls:'necromancer',text:'자신이 소환한 망령·해골 궁수·뼈 골렘의 시간제한을 제거합니다. 최대 수 제한은 유지되며 균열을 새로 시작하면 다시 소환합니다.'},
 ossuary:{name:'뼈 군주의 지휘봉',cls:'necromancer',text:'망령 소환 시 해골 궁수 2기와 뼈 골렘 1기를 추가 소환합니다. 궁수는 원거리 사격, 골렘은 근접 광역 강타를 사용합니다.'}
};
Object.assign(EXTRA_LEGENDS,BUILD_LEGENDS);
BOSSES.ember.drops.push('aftershock','starfire','battery','legion');BOSSES.frost.drops.push('hail','wildstorm','eternal');BOSSES.hollow.drops.push('twinshade','stillstorm','ossuary');
