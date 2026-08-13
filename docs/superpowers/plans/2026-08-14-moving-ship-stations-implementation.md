# Moving Ship Stations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將現有長頁履歷重建為可分享的獨立飛船站點，並完成一致的航線、航行轉場、艦長辦公室、航跡樹與影像分析艙互動。

**Architecture:** 以現有 History API router 擴充正式站點，`App` 每次只渲染一個站點。全域 `ShipTravelTransition` 接收路由目的地並在中點導航；各站共用 `StationControls` 與右上角 `RouteMap`。作品內容以案例資料模型驅動 Circular Gallery、Stack 與同步分析說明。

**Tech Stack:** React 19、Vite 8、Vitest、Testing Library、GSAP、Motion、Lenis、CSS、現有 CircularGallery。

## Global Constraints

- LoadingScreen 與其火花／射擊流程本輪不得修改。
- 所有新互動遵循 TDD：先寫測試、看見預期失敗，再實作。
- 所有正式站點都是獨立 URL，頁面內不渲染其他站點。
- 航線名稱：駕駛艙、艦長辦公室、航跡樹站、影像分析艙、AI 實驗艙、私人典藏艙、通訊台。
- 航行轉場站名只顯示目前語言；reduced motion 不播放走路或字元重排。
- 桌面與手機控制至少 44×44px，中文字距與換行不可相黏。
- 不生成阿居／克克肖像，只保留協作者席位。

---

### Task 1: 獨立站點路由與站點資料

**Files:**
- Create: `src/data/stations.js`
- Modify: `src/lib/siteRoute.js`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`
- Test: `src/lib/siteRoute.test.js`

**Interfaces:**
- Produces `STATIONS`, `getStationByRoute(route)`, `getRecommendedNext(route)`。
- `getSiteRoute(pathname)` 回傳 `cockpit | profile | career-tree | portfolio | making-of`。
- `navigateToRoute(pathname)` 維持 History API 與 popstate 契約。

- [ ] **Step 1: 寫路由與單站渲染失敗測試**

測試 `/profile`、`/career-tree`、`/portfolio`、`/making-of` 映射，以及每個 route 只渲染對應站點，不同站點 DOM 不同時存在。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/lib/siteRoute.test.js src/App.test.jsx`  
Expected: FAIL，因新 route 與 station data 尚不存在。

- [ ] **Step 3: 實作最小路由與站點渲染**

以 `switch(route)` 只渲染 Hero、Intro、CareerTree、Portfolio 或 MakingOf；正式站點包含 Nav 與未來控制插槽。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/lib/siteRoute.test.js src/App.test.jsx`  
Expected: PASS。

Commit: `feat: split the portfolio into ship stations`

### Task 2: 航線圖與場景內離站控制

**Files:**
- Create: `src/components/RouteMap.jsx`
- Create: `src/components/RouteMap.css`
- Create: `src/components/RouteMap.test.jsx`
- Create: `src/components/StationControls.jsx`
- Create: `src/components/StationControls.css`
- Create: `src/components/StationControls.test.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Nav.css`
- Modify: `src/components/MobileMenu.jsx`

**Interfaces:**
- `RouteMap({ open, currentRoute, onClose, onTravel, onOpenContact })`。
- `StationControls({ currentRoute, onTravel })` 使用推薦路線產生返回駕駛艙與下一站。

- [ ] **Step 1: 寫航線、建置中、焦點與控制失敗測試**

覆蓋正式站點導航、AI／典藏建置中不可導航、Escape、focus trap/return、背景與 body lock、場景控制不含 `chapter-exit`。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/components/RouteMap.test.jsx src/components/StationControls.test.jsx src/components/Nav.test.jsx`  
Expected: FAIL，因元件尚不存在。

- [ ] **Step 3: 實作航線圖與操作台控制**

替換 MobileMenu 的舊 anchor 模型；保留語言、音樂與通訊入口；控制台使用嵌入場景的金屬面板語彙，移除 App 中所有 ChapterExit。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/components/RouteMap.test.jsx src/components/StationControls.test.jsx src/components/Nav.test.jsx src/App.test.jsx`  
Expected: PASS。

Commit: `feat: navigate the ship from an embedded route map`

### Task 3: 固定船艙航行轉場與 Shuffle 站名

**Files:**
- Create: `src/components/ShuffleText.jsx`
- Create: `src/components/ShuffleText.css`
- Create: `src/components/ShuffleText.test.jsx`
- Modify: `src/components/ChapterTransition.jsx`
- Modify: `src/components/ChapterTransition.css`
- Modify: `src/components/ChapterTransition.test.jsx`
- Modify: `src/lib/chapterTransition.js`

**Interfaces:**
- `playStationTransition(pathname)` dispatch 安全站點 pathname。
- `ChapterTransition({ onTravel })` 於轉場中點呼叫 `onTravel(pathname)` 一次。
- `ShuffleText({ text, active, onComplete })` 只在 active 時播放一次。

- [ ] **Step 1: 寫 pathname、安全鎖、單次導航、單語站名與 reduced motion 失敗測試**

同時驗證不再使用穿越整個畫面的 walker，而是右下角固定人物剪影與固定觀景窗。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/components/ShuffleText.test.jsx src/components/ChapterTransition.test.jsx src/lib/chapterTransition.test.js`  
Expected: FAIL。

- [ ] **Step 3: 實作航行視覺與重排文字**

用 CSS 窗外光帶與既有四幀人物；字元重排沿用已安裝 GSAP，不引入 SplitText premium 依賴，以 accessible still text 作底。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/components/ShuffleText.test.jsx src/components/ChapterTransition.test.jsx src/lib/chapterTransition.test.js src/App.test.jsx`  
Expected: PASS。

Commit: `feat: travel between stations inside the ship`

### Task 4: 駕駛艙與艦長辦公室

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`
- Modify: `src/components/Hero.test.jsx`
- Modify: `src/components/Intro.jsx`
- Modify: `src/components/Intro.css`
- Modify: `src/components/Intro.test.jsx`
- Modify: `src/data/content.js`
- Create: `src/components/CollaboratorSeats.jsx`
- Create: `src/components/CollaboratorSeats.test.jsx`
- Modify: `src/components/MakingOf.jsx`

**Interfaces:**
- Hero entry buttons travel by pathname。
- Intro route root uses `data-station="profile"` and captain-office semantics。
- `CollaboratorSeats` renders only Codex/Claude roles and pending-description status, no portrait image。

- [ ] **Step 1: 寫實體控制台、艦長命名、垃圾桶與協作者席位失敗測試**

驗證 Hero 沒有舊 observatory destination list 樣式；Intro 不含「船員」；MakingOf 不渲染假肖像。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/components/Hero.test.jsx src/components/Intro.test.jsx src/components/CollaboratorSeats.test.jsx src/components/MakingOf.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 實作駕駛艙與艦長辦公室**

使用現有背景與角色，以 CSS 建立厚金屬 frame、操作台、儀表、接地陰影、長方形垃圾桶與原創螢光猴子塗鴉；辦公室轉為檔案板布局。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/components/Hero.test.jsx src/components/Intro.test.jsx src/components/CollaboratorSeats.test.jsx src/components/MakingOf.test.jsx`  
Expected: PASS。

Commit: `feat: command the portfolio from a captain cockpit`

### Task 5: 航跡樹的反向滾輪鏡頭與統一附著物

**Files:**
- Modify: `src/components/CareerTree.jsx`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/CareerTree.test.jsx`
- Modify: `src/components/CareerRibbonSheet.jsx`
- Modify: `src/components/GameBloom.jsx`
- Modify: `src/data/content.js`
- Replace: `src/assets/scenes/ribbons/*.webp`
- Replace: `src/assets/scenes/blooms/*.webp`

**Interfaces:**
- `createCareerCameraController({ stage, onProgress })` 將 negative wheel delta 映射為 progress 增加；positive delta 減少。
- `data-interactive` 只在 progress 達門檻後存在。

- [ ] **Step 1: 寫向上滾前進、門檻、單一日夜內容與控制位置失敗測試**

加入幾何測試，確保絲帶／花朵 hit bounds 位於樹冠且遠景不可互動。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/components/CareerTree.test.jsx src/components/CareerRibbonSheet.test.jsx src/components/GameBloom.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 實作相機控制與視覺統一**

使用 wheel/touch progress 驅動 camera scale；開場字縮小淡出；日夜各自只渲染對應互動；絲帶統一金色，花朵統一形態並調整 anchor。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/components/CareerTree.test.jsx src/components/CareerRibbonSheet.test.jsx src/components/GameBloom.test.jsx`  
Expected: PASS。

Commit: `feat: approach the route tree before opening its stories`

### Task 6: 圓形影像分析艙、案例 Gallery 與 Stack

**Files:**
- Create: `src/components/CaseStack.jsx`
- Create: `src/components/CaseStack.css`
- Create: `src/components/CaseStack.test.jsx`
- Create: `src/components/CaseAnalysisDesk.jsx`
- Create: `src/components/CaseAnalysisDesk.css`
- Create: `src/components/CaseAnalysisDesk.test.jsx`
- Modify: `src/components/Portfolio.jsx`
- Modify: `src/components/Portfolio.css`
- Modify: `src/components/Portfolio.test.jsx`
- Modify: `src/data/catCafeCase.js`
- Create: `src/data/portfolioCases.js`

**Interfaces:**
- `portfolioCases[lang]` 每案例含 `id,title,cover,items[]`；item 含 `type,src,poster,purpose,role,proof[],learning`。
- `CaseStack({ items, index, onIndexChange })`。
- `CaseAnalysisDesk({ caseData, onClose, returnFocusTo })`。

- [ ] **Step 1: 寫兩案例 Gallery、Stack 同步、影片暫停與焦點失敗測試**

驗證 Gallery 卡是案例不是八素材；按鈕、拖曳、頁數、Escape、關閉保留選中案例、影片換卡／關閉 pause。

- [ ] **Step 2: 執行 RED**

Run: `npm test -- src/components/CaseStack.test.jsx src/components/CaseAnalysisDesk.test.jsx src/components/Portfolio.test.jsx`  
Expected: FAIL。

- [ ] **Step 3: 實作圓窗、Gallery 與分析桌**

復用 CircularGallery；外層建立厚金屬圓窗、鉚釘與掃描刻度。Stack 參考 React Bits 行為但加入 deterministic rotation、上一張／下一張、ARIA live 頁數與 mobile click fallback。

- [ ] **Step 4: 執行 GREEN 並提交**

Run: `npm test -- src/components/CaseStack.test.jsx src/components/CaseAnalysisDesk.test.jsx src/components/Portfolio.test.jsx src/data/catCafeCase.test.js`  
Expected: PASS。

Commit: `feat: inspect portfolio cases from the analysis bay`

### Task 7: 通訊台、全站驗收與回退防護

**Files:**
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Contact.css`
- Modify: `src/components/Contact.test.jsx`
- Modify only files implicated by final QA.

**Interfaces:**
- RouteMap opens Contact as a panel; no abstract closing statement。
- No new public interface after QA.

- [ ] **Step 1: 寫通訊台與 Loading 不變失敗測試**

驗證 closing statement 不存在、Contact panel 安全連結與焦點行為，以及 LoadingScreen 現有測試原封不動通過。

- [ ] **Step 2: 執行 RED 並實作**

Run: `npm test -- src/components/Contact.test.jsx src/components/LoadingScreen.test.jsx`  
Expected: Contact 新契約先 FAIL；Loading PASS。

- [ ] **Step 3: 全套驗證**

Run: `npm test` → all PASS。  
Run: `npm run lint` → 0 errors。  
Run: `npm run build` → production build succeeds。  
Run: `git diff --check` → clean。

- [ ] **Step 4: 實機 QA**

在 360×800、390×844、644×698、795×698、1280×720、1440×900 逐站檢查：獨立路由、航線圖、轉場、站名、辦公室、反向滾輪、日夜、Stack、多圖、影片、通訊台、making-of、reduced motion、無水平溢出與 console 0 error。

- [ ] **Step 5: 提交**

Commit: `fix: complete moving ship station quality pass`

## Self-review

- 規格每一節均有對應 Task；Loading 不動與協作者肖像延後均有測試邊界。
- 計畫沒有以空頁實作未來艙室；符合 YAGNI。
- 路由、轉場、控制與案例資料的介面名稱前後一致。
- 大型視覺資產若需重新生成，必須在 Task 4/5 先提供預覽並以既有資產為基礎，不得擅自取代使用者尚未批准的風格。

