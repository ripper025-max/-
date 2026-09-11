# DREAD — 이미지 제작 기록

내장 image_gen 도구로 생성한 래스터 이미지를 WebP로 압축해 게임에 사용한다. 원본은 생성 이미지 폴더에 보존했다. 배경·효과 이미지는 독자 생성 에셋이며 참고 영상에서 추출한 이미지를 게임 에셋으로 사용하지 않았다.

| 최종 파일 | 사용 위치 |
| --- | --- |
| dist/assets/dread-logo.webp | 메인 메뉴, 영웅 선택 로고 |
| dist/assets/sanctuary-keyart.webp | 메인 메뉴의 성역 배경 |
| dist/assets/impact-atlas.webp | 4×4, 16프레임 타격/운석 착탄 |
| dist/assets/sanctuary-stone.webp | 균열 석재 바닥 |

## 최종 생성 프롬프트

### 로고
Use case: logo-brand. Production asset: original dark fantasy action RPG title logo. Exact text "DREAD", five letters D R E A D, all capitals, nothing else. Very bold compact monumental custom serif lettering cut from weathered pale steel, exceptionally clear silhouette, a single deep ember-red fissure crossing central letters. Strong restrained design, broad letter forms, readable at thumbnail size. Small pointed ornamental terminals and subtle carved metal relief, no elaborate crest and no sword towering over the text. Wide horizontal wordmark filling image, centered with safe 6% padding, approx 2.3:1 composition. Genuinely transparent alpha background, isolated logo, no background plate, no scene, no watermark, no additional text. Must feel like the title of a finished premium dungeon action game.

### 성역 배경 — 제작 사양 요약
Handcrafted voxel/block ruined cool slate sanctuary. Single armored block knight with greatsword in the lower right, facing a crimson doorway on the right. Left side dark and quiet for a title/menu overlay. Cinematic original dark fantasy key art, no text.

### 타격 아틀라스 — 제작 사양 요약
Exactly 16 equal cells in a 4×4 grid, row-major animation. Frame 1 hot white spark; frames 2–4 explosive white/gold; frames 5–9 orange flames; frames 10–16 smoke and embers. Padded isolated transparent cells, no labels, no circles.

### 바닥 — 제작 사양 요약
Tileable orthographic overhead cool irregular slate fitted flagstones. Chipped bevels, cracks, grit and muted moss. Even lighting, no objects, text or perspective.

## 참고 영상의 확인 범위

https://www.youtube.com/watch?v=z9fujISgzM8 의 약 0:37 재생 프레임을 직접 확인했다. 후속 탐색 지점은 버퍼링으로 확인되지 않았으며 전체 영상을 시청했다고 주장하지 않는다. 확인된 장면의 공간 구분, 조명 대비, 간결한 전투 효과와 협동 캐릭터 가독성을 참고했다.
