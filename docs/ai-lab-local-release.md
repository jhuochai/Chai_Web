# AI 實驗室發行與部署

2026-09-25。網站使用 GitHub Pages；桌面程式使用 GitHub Releases，兩者分開發行。

- 網站：https://jhuochai.github.io/Chai_Web/
- 程式發行頁：https://github.com/jhuochai/Chai_Web/releases/tag/apps-2026-09-25
- `.github/workflows/deploy-pages.yml` 在 `master` 或 `codex/ai-lab-interactive` 推送時執行 lint、測試、建置與部署。
- `npm run build:pages` 使用 `/Chai_Web/` 網址前綴，並產生各站點的靜態入口，支援直接開啟與重新整理。

## 下載

| 檔案 | 版本 | 大小（bytes） |
| --- | --- | --- |
| public/downloads/livestream-workbench-0.4.1-win-x64.zip | 0.4.1 | 165071134 |
| public/downloads/Refrain-0.1.1-win-x64.zip | 0.1.1 | 190389359 |

皆為 Windows x64 免安裝版；需完整解壓縮，不能只移動 exe。兩條本機下載 URL 均經 HTTP HEAD 確認 200 與正確 Content-Length。

ZIP 依既有規則被 Git 忽略。正式建置從 `.env.pages` 取得 Release 下載路徑；本機開發仍使用 `/downloads/`。更新程式版本時需另外上傳 Release 資產，再同步檔名與版本設定。發行頁另附 `SHA256SUMS.txt` 供核對。

重建方式（PowerShell）：

```powershell
./scripts/prepare-lab-downloads.ps1 -WorkbenchFolder 'C:\Users\any50\OneDrive\文件\ChatGPT\直播專用\dist\直播工作台-0.4.1-win32-x64' -RefrainZip 'C:\Users\any50\Documents\Codex\2026-09-16\yt\outputs\Refrain-0.1.1-win-x64.zip'
```

只從既有打包資料夾及發行 ZIP 建立；未複製個人 userData、帳號連線或直播紀錄。準備腳本檢查常見使用者資料及憑證檔名。

## 展示範圍

- 直播：班表詳情、待辦新增／編輯／完成／刪除、外觀切換。
- 歌詞：原創文字、無音訊時間軸、翻譯、透明度、拖曳／方向鍵移動、位置鎖定。
- 示範資料只留在記憶體；切換作品分頁保留，關閉或重設清除。
- 專業能力已移至個人簡介。AI 實驗室只呈現作品與史達普。

## 射擊頁美術

使用內建 imagegen 修正材質與手臂結構，再調整成白皙、年輕但有戰鬥痕跡的手。現行來源為 exec-81aa152f-7fbb-4503-9f12-085fe66f1dfc.png，網站資產為 src/assets/scenes/gun-hand-fair-v2.webp；先前版本 gun-hand-textured.webp 保留。

最終提示重點：單一右前臂由左下伸向槍柄，肩與肘留在畫外；保留蛇戒、紫青雕花舊鋼左輪、深藍刺繡袖、手繪布料與皮膚細節；替換成均勻 #080b10 背景，構圖與姿勢不變。

透明輸出曾生成不含 alpha 的棋盤格，因此最終使用不透明深色底搭配 CSS lighten，未執行會破壞皮膚的像素去背。原始素材保留。已在實際 loading 畫面確認前臂方向及無破洞黑塊。

夜間停泊港已整合：低亮遠城燈、飛船剪影、地面少量反光，射擊與煙火區域留空。艦長檔案室新版美術亦已套用至個人簡介。整合與素材紀錄見 `docs/superpowers/plans/2026-09-23-scene-integration.md`。
