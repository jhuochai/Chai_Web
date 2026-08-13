# Task 3 Report：船艙站點轉場

## 範圍

- 新增僅接受 `/`、`/profile`、`/career-tree`、`/portfolio` 的 `playStationTransition(pathname)`。
- 以固定工業船艙框架、窗外藍青紫光帶、右下固定位置的近黑輪廓 walker 與接地陰影取代橫越畫面的 walker。
- 新增 `ShuffleText`：可存取的完整原文常駐、裝飾字元僅在到站時單次洗牌、支援 Unicode 與 reduced motion 清理。
- 將 Task 2 的 Route Map 與 Station Controls 改接至轉場；中點才執行 `navigateToRoute`、非平滑回到頂端，並把焦點放到新站標題。
- 未修改 LoadingScreen、ClickSpark、Hero、Intro、CareerTree、Portfolio。

## TDD 證據

- RED：`npm.cmd test -- src/lib/chapterTransition.test.js src/components/ShuffleText.test.jsx src/components/ChapterTransition.test.jsx src/components/ChapterTransition.styles.test.js` 在實作前失敗：新 ShuffleText 匯入不存在、`playStationTransition`/安全 pathname helper 不存在、既有 CSS 仍含橫越畫面的 walker keyframe。
- GREEN：同一組聚焦測試通過；再加入 App 路由整合測試，其在 Task 2 的即時導航行為下先正確失敗，改為中點導航後通過。

## 驗證

- Focused + integration：7 個檔案、43 個測試通過。
- 全量：`npm.cmd test` — 32 個檔案、168 個測試通過。
- `npm.cmd run lint` — exit 0；僅保留既有的 `LanguageContext.jsx` 與 `SmoothScroll.jsx` 兩個 warning。
- `npm.cmd run build` — 成功；保留既有大 chunk advisory。
- `git diff --check` — 通過。

## 注意事項

- 舊的 `playChapterTransition` 暫時保留為不動作相容出口，避免本任務提前改動 Hero/舊場景內容；Task 4 會將那些呼叫端改為正式 pathname。
- 目前已不再把場景 hash 導入新的站點轉場流程。
