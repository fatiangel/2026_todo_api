# Todo API 教學工具

這是一個設計給學員了解如何串接 Todo API 的視覺化教學互動工具，擁有深淺色分離的現代化兩欄佈局介面。它可以讓學生在操作前端畫面的同時，直觀地了解每個動作背後觸發了什麼樣的網路請求 (Network Request)。

## 專案功能

- **待辦清單操作**：在左明亮區塊可以新增、刪除待辦項目，並且擁有「全部」、「待完成」、「已完成」狀態列。
- **視覺化 API 運作監控**：右側深色區塊可以即時監控：
  - **API Endpoint**：即時顯示目前觸發的是哪個 `HTTP Method` (如 `GET`、`POST`、`DELETE`) 以及路徑。
  - **互動網路動畫**：前端傳送請求到後端伺服器時會觸發綠色的網路連線動畫。
  - **JSON 格式回應**：即時透過語法高亮 (Syntax Highlighting) 的方式展現伺服器回傳的 Body (`Response JSON`)。
  - **請求日誌系統**：底部的「請求紀錄」清單會動態記載發送過的 API Endpoint 與相對應的狀態碼跟毫秒數。

## 檔案架構

- `index.html`: 負責介面的完整 HTML 結構模型與 FontAwesome 圖示載入。
- `style.css`: 為應用程式提供完整的現代感 UI 設計，包含按鈕、開關 (Toggle Switch)、各項狀態徽章等佈局。
- `script.js`: 控制並處理「新增、刪除事項」的 JavaScript 邏輯，並同步更新畫面中所有 API 對應的值、JSON 與日誌紀錄。

## 如何使用？

這是一個純前端的網頁專案，不需要安裝額外套件或是 NodeJS。
請透過任何主流瀏覽器（Google Chrome, Edge 等）直接打開 `index.html` 或是使用 VSCode 的 `Live Server` 執行即可開始操作。
