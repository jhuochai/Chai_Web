# Task 5 — 航跡樹

## 實作摘要

- 以 `createCareerCameraController` 取代舊有 ScrollTrigger 鏡頭；向上／負 `deltaY` 接近樹、向下／正 `deltaY` 拉遠。鍵盤、觸控與 reduced motion 均有等效操作。
- Pointer 在移動超過 18px 後接管，包含 capture、lostcapture、pointercancel 與 blur 的完整清理；reduced motion 預設進入可立即使用的近景（progress 1）。
- 移除外部大標題，畫內標示依語系僅顯示「航跡／Career」與「遊戲／Games」；四條絲帶為同一金黃色系並附著枝條。
- 夜景 11 朵花採同一 bloom 基底、獨立短花梗與枝條錨點，遠近狀態及既有詳細資訊對話框均保留。
- Career route 的 StationControls 以 slot 方式嵌入 stage 底部，而非作為 route 外的 sibling。

## 首輪複審修正

- 每朵花與每條絲帶加入局部遮罩，壓暗背景中已烘焙的舊花／藍粉絲帶，避免雙重視覺。
- 絲帶 idle、hover、focus 與 pulling 狀態一律保留 gold filter。
- 導覽標籤下移至 fixed nav 與 safe-area 下方；以 `impact-qa=1` 保留檢視入口。

## 第二輪複審修正

- 航跡樹 stage 改為 `touch-action: none`，指標輸入自進場到邊界均由 camera controller 接管；只有 pointerup、pointercancel、lost pointer capture 與 blur 會釋放手勢狀態。
- 行動版站點控制列固定在 safe-area 上方 12px，提示保留於 132px，鏡頭控制與日夜切換放於 176px 的同一高度、左右分置；360×800 與 390×844 的幾何契約測試確認三列不重疊，且兩個站點按鈕維持單列。
- Stardew Valley 與 League of Legends 的花朵位置降至桌面版 32.2%／34.4%、行動版 30%／31%，避開固定導覽列。
- 絲帶與花朵遮罩各擴大至 `-24px -30px` 與 `-20px`，並以 source-style 契約測試鎖定，持續壓住背景內建的重複附件。

## 驗證

- `npm.cmd test -- src/components/careerCamera.test.js src/components/CareerTree.test.jsx src/App.test.jsx src/components/GameBloom.test.jsx src/components/CareerRibbonSheet.test.jsx`：57 tests passed。
- `npm.cmd run lint`：通過；僅保留既有 SmoothScroll、LanguageContext 警告。
- `npm.cmd run build`、`git diff --check`：通過。
- 本輪瀏覽器 runtime 不可用，未宣稱完成瀏覽器 QA；pointer、source-style 與 360/390 幾何契約均以自動測試覆蓋。
