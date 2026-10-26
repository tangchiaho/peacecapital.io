# Google Search Console：需站長手動完成的設定

本文件只列出**需要你手動完成**的步驟。代理人無法假設帳號已驗證，也不能代替你完成網域所有權確認。

內部規劃文件位於 `_research/`，**不會**由 GitHub Pages 部署；請勿把內部路徑提交到 Sitemap。

## A. 驗證網站所有權（擇一）

建議優先使用 **網域屬性（Domain）**，一次涵蓋 `peacecapital.io` 與 `www`（若有）。

### 方案 1：DNS TXT（推薦）

1. 登入 [Google Search Console](https://search.google.com/search-console)。
2. 新增資源 → 選擇「網域」→ 輸入 `peacecapital.io`。
3. 複製 Google 提供的 TXT 記錄。
4. 到網域 DNS 託管商新增 TXT（主機名稱依指示，多為 `@`）。
5. 等到 DNS 生效後，回到 GSC 按「驗證」。
6. 驗證成功後，**不要刪除**該 TXT（除非改用其他長期驗證方式）。

### 方案 2：HTML 檔案上傳

1. 在 GSC 選擇「網址前綴」資源：`https://peacecapital.io/`。
2. 下載 Google 提供的 `googleXXXXXXXX.html`。
3. 把檔案放到網站根目錄（與 `index.html` 同層）並部署。
4. 確認 `https://peacecapital.io/googleXXXXXXXX.html` 可開啟後再驗證。

### 方案 3：HTML meta 標籤

1. 取得 GSC 提供的 `<meta name="google-site-verification" ...>`。
2. 加到全站共用頁面的 `<head>`（至少首頁）。
3. 部署後再驗證。

> 若之後要加驗證碼到程式庫，請再開一張任務；本 PR **未預填**任何驗證碼。

## B. 提交 Sitemap

驗證完成後：

1. GSC → 索引 → Sitemap。
2. 提交：`https://peacecapital.io/sitemap.xml`
3. 確認狀態為「成功」；若失敗，檢查是否回傳非 200。
4. 目前 `robots.txt` 已宣告：`Sitemap: https://peacecapital.io/sitemap.xml`
5. Sitemap **只應包含**正式公開頁（首頁、About、Focus、Contact、Insights、已發布研究）。

## C. 索引檢查（每篇正式文章上線後）

1. 使用「網址檢查」測試 canonical URL（例如既有文章  
   `https://peacecapital.io/insights/materials-lab-to-industry/`）。
2. 確認：可建立索引、canonical 由 Google 選定為你指定的 URL、行動裝置可用性無重大錯誤。
3. 若顯示「已發現但尚未建立索引」，先等待；重複大量要求索引無助於品質。
4. 新文章上線後：更新 sitemap `lastmod` → 部署 → 再於 GSC 檢查該 URL。

## D. 建議定期檢視

| 項目 | 頻率 | 目的 |
|------|------|------|
| 涵蓋範圍／頁面索引 | 每月 | 發現 404、軟 404、重複頁 |
| 強化項目（結構化資料） | 有新文章時 | 確認 Article／Breadcrumb 無錯誤 |
| 核心網頁指標 | 每季 | 行動裝置閱讀體驗 |
| 搜尋效能 | 每月 | 觀察實際查詢與點擊，回頭調整標題與摘要 |

## E. 不要做的事

- 不要提交 `_research/` 或不存在的內部路徑。
- 不要用 `robots.txt Disallow` 假裝隱藏已部署頁面，又同時依賴 `noindex`（兩者併用會互相打架）。
- 不要為了加速索引而製造大量薄內容頁。
- 不要在未驗證前假設「已可於 Google 搜尋到最新內容」。

## F. 與本站架構的對應

- 正式研究頁：`/insights/{slug}/` → 進 sitemap  
- 內部規劃與模板：`_research/` → Pages 建置排除  
- 分類入口：僅在達門檻後建立並再提交 sitemap  


## G. Favicon 在 Google 搜尋結果更新

Google 搜尋結果的網站 icon 可能快取數天到數週。站方已提供 48／96 PNG 與多尺寸 `favicon.ico`。

若結果仍顯示舊標誌：

1. GSC →「網址檢查」→ `https://peacecapital.io/` →「要求建立索引」。
2. 確認 `https://peacecapital.io/favicon-48x48.png`、`/favicon-96x96.png`、`/favicon.ico` 皆可公開存取（非 robots 封鎖）。
3. 等待重新抓取；無法強制即時替換。
