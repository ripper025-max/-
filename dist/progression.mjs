import{NATURE_RUNES}from'./nature.mjs';
// Each active skill keeps one variant. Rank 2 unlocks A, rank 4 unlocks B.
export const RUNE_RANKS=[1,2,4];
export const RUNES={
  knight:[
    [{name:'끌어당기는 칼날',desc:'범위 +25%. 적을 끌어당깁니다. 피해 −15%.',damage:.85,range:1.25},{name:'피의 회오리',desc:'적중한 적마다 최대 생명력 4% 회복, 최대 20%. 피해 −10%.',damage:.9}],
    [{name:'갈라진 대지',desc:'충격파를 3갈래로 발사합니다. 각 충격파는 기본 피해의 55%.',damage:.55},{name:'대지의 속박',desc:'기절 시간이 3초로 증가합니다. 피해 −20%.',damage:.8}],
    [{name:'불멸의 수호',desc:'피해 면역이 6초로 증가합니다. 피해 −30%.',damage:.7},{name:'심판의 잿불',desc:'피해 +40%. 피해 면역은 1초로 감소합니다.',damage:1.4}]
  ],
  mage:[
    [{name:'서리 파편',desc:'고리 대신 8방향 관통 서리탄. 각 탄은 기본 피해의 55%, 1.6초 동결.',damage:.55},{name:'절대영도',desc:'범위 +30%, 동결 4초. 피해 −35%.',damage:.65,range:1.3}],
    [{name:'떠도는 불길',desc:'불길이 시전자를 따라 이동합니다. 초당 피해 −15%.',damage:.85},{name:'폭발하는 화염',desc:'지속 지대 대신 즉시 폭발. 기존 초당 피해의 3.2배를 한 번에 줍니다.'}],
    [{name:'혜성우',desc:'소형 운석 3개를 넓게 떨어뜨립니다. 각 운석은 기본 피해의 45%.',damage:.45},{name:'시간의 균열',desc:'기력 40, 기본 재사용 12초로 감소합니다. 피해 −30%.',damage:.7,cost:40,cd:12}]
  ],
  ranger:[
    [{name:'집중 사격',desc:'정면에 화살 3발을 집중합니다. 각 화살 피해 +20%.',damage:1.2},{name:'서리 화살',desc:'화살이 적을 1.3초 얼립니다. 피해 −15%.',damage:.85}],
    [{name:'폭발 덫',desc:'독 지대 대신 0.7초 뒤 폭발. 기존 초당 피해의 3배를 한 번에 줍니다.'},{name:'사냥꾼의 표식',desc:'적이 2초 동안 받는 모든 피해 +20%. 지대 피해 −35%.',damage:.65}],
    [{name:'이동 사격',desc:'화살비가 시전자를 따라 이동합니다. 피해 −15%.',damage:.85},{name:'집중 포화',desc:'피해 +50%. 화살비 반경이 4.2에서 2.7로 줄어듭니다.',damage:1.5}]
  ]
};
Object.assign(RUNES,{
 assassin:[
  [{name:'도살자의 낙인',desc:'연계 베기 적중 시 3초간 받는 피해 +20%.'},{name:'피의 계약',desc:'연계 베기 피해 −15%, 적중 시 소비한 연계마다 최대 생명력 3% 회복.',damage:.85}],
  [{name:'짙은 장막',desc:'피해 면역 3초. 피해 −25%.',damage:.75},{name:'날카로운 장막',desc:'피해 +60%. 기절은 0.5초로 감소.',damage:1.6}],
  [{name:'긴 밤',desc:'칼날 폭풍 지속시간 9초. 초당 피해 −20%.',damage:.8},{name:'칼날의 심장',desc:'반경 2.5로 감소, 초당 피해 +50%.',damage:1.5}]
 ],
 necromancer:[
  [{name:'영원한 시종',desc:'망령 지속시간 18초. 피해 −15%.',damage:.85},{name:'군단의 분노',desc:'망령 수 +1, 최대 5기. 각 망령 피해 −20%.',damage:.8}],
  [{name:'죽음의 손길',desc:'저주 지대가 시전자를 따라 이동합니다.'},{name:'뼈의 감옥',desc:'저주 적중 시 1초 동결. 지대 피해 −25%.',damage:.75}],
  [{name:'영혼 포식',desc:'영혼 폭발 피해의 8%만큼 생명력 회복, 최대 생명력의 25%까지.'},{name:'끝없는 장송',desc:'기력 40, 기본 재사용 11초. 피해 −25%.',cost:40,cd:11,damage:.75}]
 ],
 engineer:[
  [{name:'장거리 포대',desc:'포탑 사거리 16, 피해 +20%. 지속시간 8초.',damage:1.2},{name:'속사 포대',desc:'포탑 발사 간격 0.4초. 탄 피해 −30%.',damage:.7}],
  [{name:'급속 냉각',desc:'동결 3초. 피해 −20%.',damage:.8},{name:'충격 냉각탄',desc:'피해 +50%, 동결 1초.',damage:1.5}],
  [{name:'안정화 장치',desc:'과출력 지속시간 9초. 기본 공격 속도 보너스 +40%로 감소.'},{name:'폭주 장치',desc:'과출력 중 기본 공격 피해 +30%. 지속시간 4초.'}]
 ]
});
export function runeChoice(profile,index){const selected=profile.runes?.[index]||0;return profile.ranks[index]>=RUNE_RANKS[selected]?selected:0;}
export function skillSpec(profile,index,base,cdr=0){const rune=runeChoice(profile,index),mod=rune?RUNES[profile.cls][profile.skillChoices?.[index]??index][rune-1]:{};return{...base,rune,name:mod.name||base.name,cost:mod.cost??base.cost,cd:(mod.cd??base.cd)*(1-cdr/100),mult:base.mult*(mod.damage??1),range:base.range*(mod.range??1)};}
export function affixValue(key,level,rarity,rng){const values={damage:3+level*.8,health:14+level*2.5,crit:3+level*.2,haste:5+level*.4,cdr:3+level*.18,leech:1+level*.1,armor:3+level*.15,resource:8+level*.6,skill:8+level*.8,speed:4+level*.2};return Math.max(1,Math.round(values[key]*(.75+rng()*.5)*(1+rarity*.13)));}
export function enchantCost(item){return Math.round((35+item.level*7+item.rarity*10)*(1+Math.min(12,item.enchantRolls||0)*.35));}

Object.assign(RUNES,NATURE_RUNES);
