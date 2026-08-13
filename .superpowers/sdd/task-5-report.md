# Task 5 完成報告：航跡樹靠近鏡頭與附著物統一

## 範圍

- 新增不依賴頁面捲動的 `createCareerCameraController`：負值滾輪／上滑／ArrowUp 靠近，正值／下滑／ArrowDown 退回；0 與 1 邊界會釋放頁面控制。
- 以 `pointermove` 的 18px 閾值接管手勢，並完整清理 pointer capture、取消、遺失 capture、視窗失焦與卸載。
- 移除 CareerTree 已渲染的 ScrollTrigger 鏡頭；近景門檻為 0.75，reduced motion 直接進入 progress 1。
- 移除舞台外長標題，改為舞台內單語短標籤：Career/Games 或 航跡/遊戲；加入可見的靠近／退回替代控制。
- 四條絲帶共用同一金色視覺家族與枝條 anchor 資料；11 朵花加入一致的 `lumen-forge-bloom` family、枝條資料與 stem。
- 維持既有 RibbonSheet、GameBloom 的對話框、焦點、取消、媒體行為。

## TDD 證據

- RED：`npm.cmd test -- src/components/careerCamera.test.js src/components/CareerTree.test.jsx` 在新增 controller 前失敗，原因為 `careerCamera` 模組不存在，並列出長標題、反向滾輪、替代控制與視覺 family 的預期失敗。
- GREEN：上述新測試及既有 CareerTree、GameBloom、RibbonSheet 測試均已通過。

## 驗證

- 聚焦與整合測試：7 files、71 tests passed。
- `npm.cmd run lint`：無錯誤；保留既有 `LanguageContext` 與 `SmoothScroll` 兩項警告。
- `npm.cmd run build`：通過；保留既有 bundle 大小警告。
- `git diff --check`：通過。
- Browser QA：1280×720、795×698、644×698、390×844、360×800 都確認近景可互動、四絲帶存在、日夜切換可用；實測向上滾動靠近、向下滾動退回；夜間只掛載 11 朵花、日間絲帶未掛載，範例花朵對話框可正常開啟，console 無 error/warning。

## 整合提醒

`StationControls` 目前由 App 作為 CareerTree 後方 sibling 渲染；需由主整合在 career route 將它貼齊或嵌入舞台底緣，避免成為獨立頁面區塊。
