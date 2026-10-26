# 圖片資產盤點（第一批，僅記錄）

原則：本批**不刪除**未引用圖。先區分「頁面實際載入」與「未引用／原始檔」，後者確認用途與備份後再清理。

## 頁面實際載入（優先保持可讀／已 WebP）

| 用途 | 路徑 | 備註 |
|------|------|------|
| Hero | `assets/img/brand/city-vision-{800,1440}.webp` | 首頁載入；本批只調比例／裁切 |
| Focus 領域 | `assets/img/focus/sector-*-{800,1440}.webp` | 首頁 explorer + Focus |
| 研究封面 WebP | `assets/img/editorial/*-photo.webp`、`*-cover.webp` | Insights 列表／選讀 |
| OG JPG | `assets/img/editorial/*-og.jpg`、`assets/img/og-image.png` | 社群預覽 |

## 疑似未引用或原始檔（下一批再清）

| 路徑模式 | 觀察 |
|----------|------|
| `assets/img/editorial/*-cover.png`（約 1.9–2.1MB） | AI／生技封面原始 PNG；頁面改用 webp |
| `assets/img/editorial/*.png`（非 cover） | 多數為圖表／示意原始檔；文章頁多改用 webp／svg |
| `assets/img/focus/focus-*.webp` | 舊命名；現用 `sector-*` |
| `assets/img/insights/`、`assets/img/figures/`、`assets/img/companies/` | 需逐篇對照 HTML `src` 後再決定 |

清理前請：確認無文章仍引用 → 備份或移入 `_research/media/` → 再從公開目錄移除。
