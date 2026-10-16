# 產業研究出版架構（第一階段）

適用網站：https://peacecapital.io  
目標：把 Insights 建成可搜尋、可閱讀、可收藏與可引用的**產業研究資料庫**，而非品牌宣傳頻道。

> 本文件位於 `_research/`，供 repo 內協作與 PR 審查。  
> GitHub Pages（legacy Jekyll）**不會**把 `_` 開頭目錄部署到正式網站。  
> 公開 repo 的原始碼仍可見；若文件需保密，應使用 private repository。

## 1. URL 與目錄原則

| 類型 | 路徑模式 | 說明 |
|------|----------|------|
| 研究總覽 | `/insights/` | 唯一正式入口；中文優先 |
| 研究文章 | `/insights/{slug}/` | 與既有文章一致；**不改既有路徑** |
| 主題分類頁 | `/insights/topics/{topic}/` | **僅在內容足夠時建立** |
| 內部規劃／模板 | `_research/publishing/`、`_research/article-template/` | **不部署**；不進 sitemap |

**既有文章必須保留：**

- Canonical：`https://peacecapital.io/insights/materials-lab-to-industry/`
- 實體路徑：`insights/materials-lab-to-industry/index.html`

新文章一律採 `insights/{slug}/index.html`，避免副檔名與巢狀過深。

## 2. 中文優先分類（taxonomy）

初期規劃三個主題（用於文章 metadata 與未來入口；**前台不展示施工狀態**）：

| 主題 ID | 中文名稱 | 建立正式入口條件 |
|---------|----------|------------------|
| `advanced-materials` | 先進材料 | 已發布 ≥ 2 篇獨立研究 |
| `semiconductors` | 半導體 | 已發布 ≥ 2 篇獨立研究 |
| `industry-investing` | 產業投資研究 | 已發布 ≥ 2 篇獨立研究 |

**規則：**

1. 文章可標記 1 個主主題 + 最多 1 個次主題。
2. 主題名稱以 HTML 文字呈現；在正式入口建立前，**不要**做成指向空白頁的連結。
3. 達到門檻後，才新增 `/insights/topics/{topic}/`，並寫入 `sitemap.xml`。
4. 目前僅「先進材料」有 1 篇正式文章 → **暫不建立任何分類入口頁**。
5. Insights 首頁只列出已發布、可點擊的研究；未上線選題僅留在 `_research/publishing/topics-batch-1.md`。

## 3. 文章頁必備結構

每篇正式研究頁應包含：

1. `lang="zh-Hant"`
2. SEO `<title>`、meta description、canonical
3. Open Graph / Twitter（`og:type=article`）
4. 可見的**發佈日期**（單一欄位；一般修訂不另顯示更新日期）
5. 作者／編輯單位（和平資本；組織作者即可）
6. H1 唯一；正文使用 H2／H3
7. 摘要（HTML 文字，非僅圖片）
8. 正文、圖表（圖表重點須能用文字讀懂）
9. 資料來源（可點擊原始連結）
10. 延伸閱讀（真實 HTML 內部連結）
11. JSON-LD：`Article` + `BreadcrumbList`（建議 `@graph`）
12. 低調免責聲明（非行銷口號）

可重複使用的參考實作：`_research/article-template/`（原始碼模板，不部署）。

## 4. 可檢索性原則

- 關鍵定義、比較結論、時間點與數字必須出現在 HTML 文字中。
- 圖表是輔助，不可成為唯一資訊載體。
- 圖片說明使用「產業研究示意圖」或「根據公開資料整理之示意圖」等表述；不把 AI 概念圖標示成真實現場照片。
- 內部連結用 `<a href>`，不用純 JS 導向。

## 5. Sitemap／robots／部署

- 正式頁面才加入 `sitemap.xml`。
- 內部文件與模板放在 `_research/`，由 GitHub Pages／Jekyll **排除於建置輸出**；不以 `robots.txt Disallow` 充當隱藏手段。
- 勿對「未部署的內部路徑」同時依賴 Disallow + noindex（爬蟲看不見 HTML 時，noindex 無效）。
- 新文章上線時同步更新：canonical、OG URL、JSON-LD `@id`、sitemap `lastmod`。
- Google Search Console 驗證與 Sitemap 提交見 `google-search-console.md`（需站長手動完成）。

### GitHub Pages 建置備註（已驗證）

- Repo Pages 設定：`build_type: legacy`，來源 `main` / `/`
- 站點**沒有** `.nojekyll` → 走 Jekyll 建置
- `_config.yml` 明確 `exclude: [_research, ...]`
- 底線目錄 `_research/` 依 Jekyll 慣例也不會輸出到 `_site`

## 6. 維護流程（無 CMS）

1. 從 `_research/article-template/` 複製到 `insights/{slug}/`。
2. 替換 title、description、日期、主題、正文、來源、延伸閱讀、JSON-LD。
3. 在 `insights/index.html` 新增列表項目（只列已完成文章）。
4. 更新 `sitemap.xml`。
5. 若主題達門檻，再建 topic 頁並補 sitemap。
6. 對照 `topics-batch-1.md` 勾選狀態，避免重複選題。

## 7. 明確不做的事（第一階段）

- 不安裝大型 CMS、搜尋後端或評論系統。
- 不批量生成內容薄弱的文章。
- 不建立空白分類頁。
- 不更改既有文章 URL。
- 不加入「Peace Capital View」等宣傳區塊。
- 不在 Insights 前台暴露「規劃中／入口未開」等站務文字。
