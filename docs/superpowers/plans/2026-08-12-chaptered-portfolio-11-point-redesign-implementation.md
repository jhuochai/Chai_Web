# 章節式作品集 11 點改版實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將現有履歷網站改造成可探索的 Arcane 工業觀景台，完成已確認的 11 項 Hero、簡介、生涯大樹、作品、聯絡與製作彩蛋改版。

**Architecture:** 保留 React/Vite 單頁應用與現有 Lenis、GSAP、Motion 技術，新增輕量路徑狀態、章節出口、絲帶內容頁與遊戲花朵元件。資料與畫面分離；GSAP 只管理生涯大樹的固定與鏡頭推進，Motion 管理離散狀態，Lenis 維持唯一的平滑捲動引擎。

**Tech Stack:** React 19、Vite 8、Vitest、Testing Library、Lenis、GSAP/ScrollTrigger、Motion、CSS、ImageGen、Sharp。

## Global Constraints

- 所有訪客文字使用自然繁體中文；中文字型優先，不對中文套用拉丁斜體。
- Hero 正式入口固定為自我介紹、生涯大樹、精選作品、AI 實驗室。
- 生涯與遊戲共用生涯大樹；十一款遊戲各有一朵花。
- KOC／KOL 內容保留於資料來源，但本輪從訪客介面隱藏。
- 移除倒掛人物、隨機 Picsum 輪播、ROG Phone 9、獨立 Interests、主頁 BuildStory、奇怪裝飾框線與常駐走路人物。
- LinkedIn 固定使用 `https://www.linkedin.com/in/yichen-chai-3019492b4/`，並以 `target="_blank" rel="noreferrer"` 開啟。
- 不修改 Loading 視覺，除非測試發現回歸。
- 減少動態模式必須跳過視差、鏡頭 scrub、走路影格與自動播放媒體。
- 驗收寬度：360、768、910、1024、1440 像素。

## File Map

- Modify `src/data/content.js`: 四入口、自然文案、十一款遊戲、聯絡與 making-of 內容。
- Create `src/data/chapterMap.js`: 章節順序與目標 selector。
- Create `src/lib/siteRoute.js`: `/` 與 `/making-of` 的 History API 路徑狀態。
- Modify `src/App.jsx`, `src/App.test.jsx`: 新章節順序、making-of 路徑、移除 Interests/BuildStory。
- Modify `src/index.css`: 繁中排版、共享背景、共用動態退化規則。
- Modify `src/components/Hero.jsx`, `Hero.css`, `Hero.test.jsx`: 觀景台、背影人物、四入口、AI 空狀態、垃圾桶。
- Modify `src/components/Intro.jsx`, `Intro.css`, `Intro.test.jsx`: 無框簡介與玩家視角。
- Create `src/components/CareerRibbonSheet.jsx`, `.css`, `.test.jsx`: 絲帶拖曳與內容展開。
- Create `src/components/GameBloom.jsx`, `.css`, `.test.jsx`: 十一朵花與延遲媒體槽。
- Create `src/components/ChapterTransition.jsx`, `.css`, `.test.jsx`: 事件驅動的走路轉場。
- Create `src/components/ChapterExit.jsx`, `.css`, `.test.jsx`: 回觀景台與下一章。
- Modify `src/components/CareerTree.jsx`, `CareerTree.css`, `CareerTree.test.jsx`: 大樹固定推進與新互動。
- Create `src/data/catCafeCase.js`, `.test.js`: 貓咪造咖 1+8 證據資料。
- Modify `src/components/Portfolio.jsx`, `Portfolio.css`, `Portfolio.test.jsx`: 貓咪造咖主案例與素材牆。
- Create `src/components/MakingOf.jsx`, `.css`, `.test.jsx`: 廢案檔案室時間線。
- Modify `src/components/Contact.jsx`, `Contact.css`, `Contact.test.jsx`: 無框聯絡區與 LinkedIn。
- Create `src/assets/scenes/hero-observatory.webp`, `hero-character-back.webp`。
- Create `src/assets/scenes/ribbons/ribbon-{smoke,copper,moss,plum}.webp`。
- Create `src/assets/scenes/blooms/bloom-01.webp` 至 `bloom-11.webp`。
- Create `src/assets/cases/cat-cafe/` 下九個已核准素材的最佳化網頁版本。

---

### Task 1: 鎖定資料模型與自然文案

**Files:**
- Modify: `src/data/content.js`
- Create: `src/data/content.test.js`
- Create: `src/data/chapterMap.js`
- Create: `src/data/chapterMap.test.js`

**Interfaces:**
- Produces: `chapterMap`, `content.en.hero.entries`, `content.zh.hero.entries`, `careerTree.flowers[11]`, `makingOf.timeline`。
- Consumed by: Hero、CareerTree、MakingOf、ChapterExit、Contact。

- [ ] **Step 1: 寫出會失敗的資料完整性測試**

```js
import { describe, expect, it } from 'vitest';
import { content } from './content';
import { chapterMap } from './chapterMap';

describe('chaptered portfolio content', () => {
  it('defines four hero entries and eleven distinct games in both languages', () => {
    for (const lang of ['zh', 'en']) {
      expect(content[lang].hero.entries).toHaveLength(4);
      expect(content[lang].careerTree.flowers).toHaveLength(11);
      expect(new Set(content[lang].careerTree.flowers.map((game) => game.id)).size).toBe(11);
    }
  });

  it('keeps the chapter order stable', () => {
    expect(chapterMap.map((chapter) => chapter.id)).toEqual([
      'intro', 'career', 'portfolio', 'contact',
    ]);
  });

  it('publishes the real LinkedIn profile', () => {
    expect(content.zh.contact.linkedin).toBe(
      'https://www.linkedin.com/in/yichen-chai-3019492b4/'
    );
  });
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/data/content.test.js src/data/chapterMap.test.js`  
Expected: FAIL，因為 `entries`、十一款遊戲與 `chapterMap` 尚未存在。

- [ ] **Step 3: 建立章節映射**

```js
export const chapterMap = [
  { id: 'intro', target: '#scene-2' },
  { id: 'career', target: '#scene-3' },
  { id: 'portfolio', target: '#scene-5' },
  { id: 'contact', target: '#scene-7' },
];

export function getNextChapter(id) {
  const index = chapterMap.findIndex((chapter) => chapter.id === id);
  return chapterMap[(index + 1) % chapterMap.length];
}
```

- [ ] **Step 4: 更新雙語內容**

將 Hero 改為四入口；將遊戲資料改為 `mlbb`、`identity-v`、`stardew`、`lol`、`valorant`、`r6`、`gta5`、`minecraft`、`palworld`、`dont-starve`、`raft`。簡介能力文案每項必須包含實際工作證據，不保留「右腦型人才」「橫跨多元類型」等抽象自評。加入 making-of 五段真實時間線資料結構與 LinkedIn URL。

- [ ] **Step 5: 驗證並提交**

Run: `npm test -- src/data/content.test.js src/data/chapterMap.test.js`  
Expected: PASS。

```bash
git add src/data/content.js src/data/content.test.js src/data/chapterMap.js src/data/chapterMap.test.js
git commit -m "feat: define chaptered portfolio content"
```

### Task 2: 路徑狀態與章節出口

**Files:**
- Create: `src/lib/siteRoute.js`
- Create: `src/lib/siteRoute.test.js`
- Create: `src/components/ChapterExit.jsx`
- Create: `src/components/ChapterExit.css`
- Create: `src/components/ChapterExit.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Produces: `getSiteRoute(pathname)`, `navigateToRoute(pathname)`, `<ChapterExit chapterId />`。
- Consumes: `chapterMap`, `getNextChapter`, `scrollToScene`。

- [ ] **Step 1: 寫路徑與出口測試**

```js
it('maps only /making-of away from the home route', () => {
  expect(getSiteRoute('/making-of')).toBe('making-of');
  expect(getSiteRoute('/anything-else')).toBe('home');
});

it('offers home and the next chapter', () => {
  render(<ChapterExit chapterId="intro" />);
  expect(screen.getByRole('button', { name: /回到觀景台/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /生涯大樹/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/lib/siteRoute.test.js src/components/ChapterExit.test.jsx src/App.test.jsx`  
Expected: FAIL，因為路徑與出口元件尚未存在。

- [ ] **Step 3: 實作 History API 路徑**

```js
export function getSiteRoute(pathname = window.location.pathname) {
  return pathname === '/making-of' ? 'making-of' : 'home';
}

export function navigateToRoute(pathname) {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
```

- [ ] **Step 4: 更新 App 結構**

`App` 監聽 `popstate`；`making-of` 路徑只渲染 MakingOf，首頁順序固定為 Hero、Intro、CareerTree、Portfolio、Contact。移除 `Interests` 與 `BuildStory` 的主頁 import/render，但暫不刪除檔案，避免歷史內容遺失。

- [ ] **Step 5: 實作共用章節出口並驗證**

回到觀景台呼叫 `scrollToScene('#scene-1')`；下一章依 `getNextChapter` 捲動。按鈕皆具有可見焦點與減少動態退化。

Run: `npm test -- src/lib/siteRoute.test.js src/components/ChapterExit.test.jsx src/App.test.jsx`  
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/lib/siteRoute.js src/lib/siteRoute.test.js src/components/ChapterExit.jsx src/components/ChapterExit.css src/components/ChapterExit.test.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add portfolio routes and chapter exits"
```

### Task 3: Hero 觀景台與背影人物

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`
- Modify: `src/components/Hero.test.jsx`
- Create: `src/assets/scenes/hero-observatory.webp`
- Create: `src/assets/scenes/hero-character-back.webp`

**Interfaces:**
- Consumes: `hero.entries`, `scrollToScene`, `navigateToRoute`。
- Produces: `#scene-1`、四入口、AI 實驗室狀態、垃圾桶 making-of 入口。

- [ ] **Step 1: 寫 Hero 行為測試**

```js
const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

it('renders four chapter controls and no hanging character', () => {
  const { container } = renderHero();
  for (const entry of content.en.hero.entries) {
    expect(screen.getByRole('button', { name: entry.label })).toBeInTheDocument();
  }
  expect(container.querySelector('.hero__character--hanging')).toBeNull();
  expect(container.querySelector('.hero__character--back')).not.toBeNull();
});

it('opens the making-of route from the trash can', () => {
  renderHero();
  fireEvent.click(screen.getByRole('button', { name: /廢案檔案室/i }));
  expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/making-of');
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/Hero.test.jsx`  
Expected: FAIL，現有 Hero 仍是三背景切換與三入口。

- [ ] **Step 3: 生成兩項新視覺資產**

以 `設計參考/角色三視圖.png`、現有 Hero 與工廠大樹為參考，生成 2400px 寬的觀景台背景與透明背影人物。觀景台必須有左側操作列、近景金屬窗框、遠景工廠斷垣；排除柱廊、荒地、文字與過亮微細節。人物背對觀眾、比例可站在操作台前，頭髮與衣物輪廓清楚。

- [ ] **Step 4: 實作 Hero 結構與空狀態**

移除 `SCENE_SOURCES`、背景 hover 切換與倒掛資產。四入口以單一 `<nav aria-label>` 呈現；AI 實驗室按下後開啟 `role="status"` 的「實驗室整備中」。書架作為不可聚焦的背景物件；垃圾桶使用可聚焦按鈕，呼叫 `/making-of`。

- [ ] **Step 5: 實作低幅度動態**

背景只允許不超過 12px 的滑鼠視差；人物只做 5–7 秒週期、最大 3px 的呼吸／衣物偏移。`prefers-reduced-motion` 取消兩者。不得重新啟用 `LiquidEther autoDemo`。

- [ ] **Step 6: 驗證並提交**

Run: `npm test -- src/components/Hero.test.jsx src/App.test.jsx`  
Expected: PASS。  
Run: `npm run build`  
Expected: PASS。

```bash
git add src/components/Hero.jsx src/components/Hero.css src/components/Hero.test.jsx src/assets/scenes/hero-observatory.webp src/assets/scenes/hero-character-back.webp
git commit -m "feat: rebuild hero as an industrial observatory"
```

### Task 4: 自我介紹、繁中排版與玩家視角

**Files:**
- Modify: `src/components/Intro.jsx`
- Modify: `src/components/Intro.css`
- Modify: `src/components/Intro.test.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: 無 `FramedPanel` 的 `#scene-2` 與 `<ChapterExit chapterId="intro" />`。

- [ ] **Step 1: 寫結構與文案測試**

```js
function renderIntro() {
  return render(
    <LanguageProvider>
      <Intro />
    </LanguageProvider>
  );
}

it('uses evidence-led copy without numbered resume rows', () => {
  const { container } = renderIntro();
  expect(screen.getByText(/靠直覺瞄準，用效率命中/)).toBeInTheDocument();
  expect(screen.getByText(/玩家視角/)).toBeInTheDocument();
  expect(container.querySelector('.framed-panel')).toBeNull();
  expect(container.querySelector('.intro__trait-index')).toBeNull();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/Intro.test.jsx`  
Expected: FAIL，現有簡介仍含舊結構。

- [ ] **Step 3: 重組簡介**

依序呈現主張、姓名／職稱、定位、三項具體能力、玩家視角。三項能力使用不同寬度與對齊節奏，不使用相同卡片、編號或大框線；刪除簡介中的人物資產。

- [ ] **Step 4: 修正繁中全域字型**

```css
:lang(zh-Hant) {
  font-family: "LXGW WenKai TC", "Noto Sans TC", system-ui, sans-serif;
  letter-spacing: 0.02em;
}
:lang(zh-Hant) em,
:lang(zh-Hant) i { font-style: normal; }
:lang(zh-Hant) p { line-height: 1.9; }
```

將中文字型放在中文 scope 的第一順位；標題使用 `text-wrap: balance`，內文使用 `text-wrap: pretty`，最大寬度 70ch。

- [ ] **Step 5: 驗證並提交**

Run: `npm test -- src/components/Intro.test.jsx src/data/content.test.js`  
Expected: PASS。

```bash
git add src/components/Intro.jsx src/components/Intro.css src/components/Intro.test.jsx src/index.css
git commit -m "feat: rewrite intro around real evidence"
```

### Task 5: 大樹鏡頭推進與絲帶內容頁

**Files:**
- Create: `src/components/CareerRibbonSheet.jsx`
- Create: `src/components/CareerRibbonSheet.css`
- Create: `src/components/CareerRibbonSheet.test.jsx`
- Modify: `src/components/CareerTree.jsx`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/CareerTree.test.jsx`
- Create: `src/assets/scenes/ribbons/ribbon-smoke.webp`
- Create: `src/assets/scenes/ribbons/ribbon-copper.webp`
- Create: `src/assets/scenes/ribbons/ribbon-moss.webp`
- Create: `src/assets/scenes/ribbons/ribbon-plum.webp`

**Interfaces:**
- `CareerRibbonSheet({ item, open, onOpen, onClose, triggerRef })`。
- CareerTree produces `data-interactive="true|false"` after scroll progress reaches `0.72`。

- [ ] **Step 1: 寫互動解鎖與鍵盤測試**

```js
function renderTree() {
  return render(
    <LanguageProvider>
      <CareerTree />
    </LanguageProvider>
  );
}

it('keeps hotspots disabled until the camera push completes', () => {
  const { container } = renderTree();
  expect(container.querySelector('.career-tree__stage')).toHaveAttribute('data-interactive', 'false');
  fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
  expect(container.querySelector('.career-tree__stage')).toHaveAttribute('data-interactive', 'true');
});

it('opens with Enter and returns focus after Escape', async () => {
  renderTree();
  fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
  const trigger = screen.getByRole('button', { name: content.en.careerTree.ribbons[0].org });
  trigger.focus();
  fireEvent.keyDown(trigger, { key: 'Enter' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/CareerTree.test.jsx src/components/CareerRibbonSheet.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 生成四條低飽和絲帶**

以現有 `tree-ribbon.webp` 為造型參考，分別輸出煙灰藍、氧化銅、苔綠、灰紫透明 WebP。材質是有重量的舊布，保留金線細節但不發出霓虹光。

- [ ] **Step 4: 實作 GSAP 固定與推進**

在 `useGSAP` 中建立一個 `ScrollTrigger`：`trigger` 為章節、`pin` 為舞台、`start: 'top top'`、`end: '+=140%'`、`scrub: 0.7`。進度控制 `scale(1 → 1.16)`、背景霧與焦點；達 0.72 才啟用互動。減少動態模式跳過 pin 並直接啟用。

- [ ] **Step 5: 實作向下拉開**

拖曳距離達 `min(120px, viewportHeight * 0.16)` 開啟。內容頁從底部 `translateY(100%)` 至 `0`；提供提示、關閉按鈕、Escape、背景關閉、焦點返回與觸控取消復原。

- [ ] **Step 6: 驗證並提交**

Run: `npm test -- src/components/CareerTree.test.jsx src/components/CareerRibbonSheet.test.jsx`  
Expected: PASS。  
Run: `npm run build`  
Expected: PASS。

```bash
git add src/components/CareerTree.jsx src/components/CareerTree.css src/components/CareerTree.test.jsx src/components/CareerRibbonSheet.jsx src/components/CareerRibbonSheet.css src/components/CareerRibbonSheet.test.jsx src/assets/scenes/ribbons
git commit -m "feat: pull career ribbons into readable chapters"
```

### Task 6: 十一朵遊戲花與媒體槽

**Files:**
- Create: `src/components/GameBloom.jsx`
- Create: `src/components/GameBloom.css`
- Create: `src/components/GameBloom.test.jsx`
- Modify: `src/components/CareerTree.jsx`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/CareerTree.test.jsx`
- Create: `src/assets/scenes/blooms/bloom-01.webp` through `bloom-11.webp`

**Interfaces:**
- `GameBloom({ game, position, size, asset, active, onOpen, onClose })`。
- Each game optionally consumes `poster`, `video`, `note`; missing media renders text and flower only。

- [ ] **Step 1: 寫十一朵花與媒體退化測試**

```js
function renderNightTree() {
  const result = render(
    <LanguageProvider>
      <CareerTree />
    </LanguageProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
  return result;
}

it('renders eleven distinct game flowers without the shelf group', () => {
  renderNightTree();
  expect(screen.getAllByTestId('game-bloom')).toHaveLength(11);
  expect(screen.queryByText(/書架上還有/)).toBeNull();
  expect(new Set(screen.getAllByTestId('game-bloom').map((node) => node.dataset.asset)).size).toBe(11);
});

it('shows no play control when a game has no video', () => {
  render(<GameBloom game={{ id: 'raft', name: 'Raft', desc: '...' }} />);
  expect(screen.queryByRole('button', { name: /播放/i })).toBeNull();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/GameBloom.test.jsx src/components/CareerTree.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 生成十一種花朵**

生成一張透明 4×3 花朵工作表：十一朵具有不同輪廓、花瓣數與大小，統一 Arcane 夜間藍紫／暗紅／冷金光影；第十二格留空。使用 Sharp 依固定格切成 `bloom-01` 至 `bloom-11`，裁掉透明邊界並輸出 WebP。

- [ ] **Step 4: 配置受控位置與尺度**

在 CareerTree 中以資料指定 11 個不重疊 anchor，尺寸只使用 `sm`、`md`、`lg` 三級；同一枝條最多三朵，花朵陰影方向與夜間背景一致。按鈕實際點擊區至少 44×44px。

- [ ] **Step 5: 實作媒體槽**

沒有 `video` 時只顯示花、遊戲名與第一人稱心得。有影片時使用 `preload="none"`、`muted`、`playsInline`，點擊才載入；新的影片播放前暫停其他影片。減少動態模式只顯示 poster。

- [ ] **Step 6: 驗證並提交**

Run: `npm test -- src/components/GameBloom.test.jsx src/components/CareerTree.test.jsx`  
Expected: PASS。

```bash
git add src/components/GameBloom.jsx src/components/GameBloom.css src/components/GameBloom.test.jsx src/components/CareerTree.jsx src/components/CareerTree.css src/components/CareerTree.test.jsx src/assets/scenes/blooms
git commit -m "feat: bloom eleven games across the night tree"
```

### Task 7: 事件驅動的角色章節轉場

**Files:**
- Create: `src/components/ChapterTransition.jsx`
- Create: `src/components/ChapterTransition.css`
- Create: `src/components/ChapterTransition.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/ChapterExit.jsx`
- Modify: `src/components/CareerTree.jsx`

**Interfaces:**
- `playChapterTransition(targetSelector)` dispatches `chapter-transition:start`。
- `<ChapterTransition onTravel={scrollToScene} />` owns one transition at a time。

- [ ] **Step 1: 寫不待機循環與單次轉場測試**

```js
function renderTransition() {
  return render(<ChapterTransition onTravel={() => {}} />);
}

it('renders no walker until navigation requests a transition', () => {
  const { container } = renderTransition();
  expect(container.querySelector('.chapter-transition__walker')).toBeNull();
  fireEvent(window, new CustomEvent('chapter-transition:start', { detail: '#scene-3' }));
  expect(container.querySelector('.chapter-transition__walker')).not.toBeNull();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/ChapterTransition.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 實作單次轉場**

事件到達後鎖定新請求約 900ms；角色由 `x: -18vw` 至 `105vw`，背景遮罩由透明至 0.55 再退回。人物抵達 62% 時執行目標捲動。四張影格以相同 CSS `height`、`object-fit: contain`、`object-position: center bottom` 對齊。

- [ ] **Step 4: 移除 CareerTree 的 `WalkStrip`**

刪除大樹上下兩條常駐走路帶；ChapterExit 與 Hero 的章節導航改呼叫 `playChapterTransition`。減少動態模式直接捲動並交叉淡化。

- [ ] **Step 5: 驗證並提交**

Run: `npm test -- src/components/ChapterTransition.test.jsx src/components/CareerTree.test.jsx src/App.test.jsx`  
Expected: PASS。

```bash
git add src/components/ChapterTransition.jsx src/components/ChapterTransition.css src/components/ChapterTransition.test.jsx src/components/ChapterExit.jsx src/components/CareerTree.jsx src/App.jsx
git commit -m "feat: walk only during chapter travel"
```

### Task 8: 貓咪造咖 1+8 作品證據

**Files:**
- Create: `src/data/catCafeCase.js`
- Create: `src/data/catCafeCase.test.js`
- Create: `src/assets/cases/cat-cafe/`
- Modify: `src/components/Portfolio.jsx`
- Modify: `src/components/Portfolio.css`
- Modify: `src/components/Portfolio.test.jsx`

**Interfaces:**
- Produces: `catCafeCase[lang]` with one hero, five reliable metrics, four pillars and eight evidence items。

- [ ] **Step 1: 寫資料與作品結構測試**

```js
function renderPortfolio() {
  return render(
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  );
}

it('contains one hero and eight unique evidence assets', () => {
  for (const lang of ['zh', 'en']) {
    const work = catCafeCase[lang];
    expect(work.pillars).toHaveLength(4);
    expect(work.pillars.flatMap((pillar) => pillar.items)).toHaveLength(8);
    expect(new Set([work.hero.src, ...work.pillars.flatMap((p) => p.items.map((i) => i.src))]).size).toBe(9);
  }
});

it('does not render random, ROG, or KOC work', () => {
  const { container } = renderPortfolio();
  expect(container.querySelector('.circular-gallery')).toBeNull();
  expect(screen.queryByText(/ROG Phone 9/i)).toBeNull();
  expect(screen.queryByText(/KOC 異業合作/i)).toBeNull();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/data/catCafeCase.test.js src/components/Portfolio.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 取得並最佳化九個已核准素材**

從使用者提供的 Google Drive 只取得：三萬粉－2、母親節、世界海洋日、捐款收據、v1.20 版更預告、7 月水果貓、服裝升級攻略、吃啥咪轉盤 Reels、世界幽浮日 Reels。保留原圖，不改字、不裁切帶字內容；網頁副本最長邊 1800px、WebP quality 88。Reels 若只有影片，另輸出首幀 poster。

- [ ] **Step 4: 建立可靠資料**

主視覺只使用 51,173 曝光、3,898 互動、1,476 留言、383 分享、50 追蹤。八張證據依四支柱各兩張，不跨素材比較分母不一致的互動率。

- [ ] **Step 5: 實作不規則作品桌**

主視覺占最大面積；八張證據以 `<figure>` 組成大小有別的工作桌構圖，不使用八張相同卡片。手機退化為單欄、取消傾斜。每張可放大檢視並有繁體中文 alt／figcaption。貓咪造咖之後保留一段精簡的暗棋廣告測試，以「假設、實際數據、及時停損」呈現，不把未達標結果寫成成功驗證。

- [ ] **Step 6: 驗證並提交**

Run: `npm test -- src/data/catCafeCase.test.js src/components/Portfolio.test.jsx`  
Expected: PASS。  
Run: `npm run build`  
Expected: PASS，沒有 Picsum 網路請求。

```bash
git add src/data/catCafeCase.js src/data/catCafeCase.test.js src/assets/cases/cat-cafe src/components/Portfolio.jsx src/components/Portfolio.css src/components/Portfolio.test.jsx
git commit -m "feat: present cat cafe work as evidence"
```

### Task 9: 廢案檔案室與無框聯絡區

**Files:**
- Create: `src/components/MakingOf.jsx`
- Create: `src/components/MakingOf.css`
- Create: `src/components/MakingOf.test.jsx`
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Contact.css`
- Modify: `src/components/Contact.test.jsx`

**Interfaces:**
- MakingOf consumes `makingOf.timeline` and `navigateToRoute('/')`。
- Contact consumes `contact.linkedin`, `email`, `resumeUrl`。

- [ ] **Step 1: 寫路徑頁與聯絡測試**

```js
const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

function renderContact() {
  return render(
    <LanguageProvider>
      <Contact />
    </LanguageProvider>
  );
}

function renderMakingOf() {
  return render(
    <LanguageProvider>
      <MakingOf />
    </LanguageProvider>
  );
}

it('renders the making-of timeline and returns home', () => {
  renderMakingOf();
  expect(screen.getByRole('heading', { name: /廢案檔案室/i })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: /回到觀景台/i }));
  expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/');
});

it('links to the real LinkedIn profile without a decorative frame', () => {
  const { container } = renderContact();
  expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
    'href', 'https://www.linkedin.com/in/yichen-chai-3019492b4/'
  );
  expect(container.querySelector('.framed-panel')).toBeNull();
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npm test -- src/components/MakingOf.test.jsx src/components/Contact.test.jsx src/App.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 實作 making-of**

使用真實五段時間線：初始構想、視覺系統、AI 協作與否決、互動卡關、目前版本與學習。每段支援圖片陣列但沒有圖片時只顯示文字，不放虛擬圖片。返回按鈕回 `/`，App 在下一個 frame 捲到 Hero。

- [ ] **Step 4: 重做聯絡區**

移除 `FramedPanel`，將 email、LinkedIn、履歷做成操作台上的三個語意連結。LinkedIn 新分頁安全開啟；履歷使用現有 `/resume.pdf`；無效或空連結不渲染。

- [ ] **Step 5: 驗證並提交**

Run: `npm test -- src/components/MakingOf.test.jsx src/components/Contact.test.jsx src/App.test.jsx`  
Expected: PASS。

```bash
git add src/components/MakingOf.jsx src/components/MakingOf.css src/components/MakingOf.test.jsx src/components/Contact.jsx src/components/Contact.css src/components/Contact.test.jsx src/App.jsx
git commit -m "feat: archive the site story and open contact"
```

### Task 10: 響應式、無障礙與完整驗收

**Files:**
- Modify only files implicated by the checks below.

**Interfaces:**
- No new public interface; closes the approved scope.

- [ ] **Step 1: 執行完整自動驗證**

Run: `npm run lint`  
Expected: 0 errors。  
Run: `npm test`  
Expected: all tests PASS。  
Run: `npm run build`  
Expected: production build succeeds。

- [ ] **Step 2: 驗證五個寬度**

在 360、768、910、1024、1440px 逐章檢查：無水平捲動、Hero 四入口可操作、背影人物不遮字、中文不重疊、大樹焦點清楚、十一朵花不互相遮住、素材牆可閱讀、聯絡連結可用。

- [ ] **Step 3: 驗證完整互動路徑**

使用滑鼠、觸控模擬與鍵盤完成 Hero → Intro → CareerTree 日／夜 → Portfolio → Contact → Hero；測試絲帶拖曳中斷、Escape 關閉、焦點返回、快速反向滾動及 `/making-of` 重新整理／返回。

- [ ] **Step 4: 驗證減少動態**

模擬 `prefers-reduced-motion: reduce`：沒有鏡頭 scrub、持續人物動態、走路影格或自動影片；所有內容仍立即可見。

- [ ] **Step 5: 檢查素材與主控台**

確認沒有 404、Picsum、空 LinkedIn、影片自動播放、主控台錯誤或離開視窗後仍運作的動畫迴圈。Hero／大樹首屏以外媒體延遲載入。

- [ ] **Step 6: 修正所有本範圍問題並重跑驗證**

重複 lint、完整測試、build 與五寬度瀏覽器檢查，直到沒有未解決問題。

- [ ] **Step 7: 提交**

```bash
git add src public
git commit -m "fix: complete chaptered portfolio quality pass"
```

## Spec Coverage Review

- Hero 觀景台、背影人物、四入口、AI 實驗室、書架與垃圾桶：Tasks 1–3。
- `/making-of`、瀏覽器返回與時間線：Tasks 2、9。
- 無框簡介、自然文案、玩家視角與繁中排版：Task 4。
- 大樹固定推進、互動解鎖、絲帶拖曳與低飽和新色：Task 5。
- 十一款遊戲、自然花朵尺度與媒體退化：Task 6。
- 人物只在章節轉場走路：Task 7。
- 貓咪造咖 1+8、移除 Picsum／ROG／KOC：Task 8。
- 聯絡無框線、正確 LinkedIn、章節出口：Tasks 2、9。
- 響應式、鍵盤、觸控、減少動態、效能與完整驗收：Task 10。
