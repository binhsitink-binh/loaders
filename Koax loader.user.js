// ==UserScript==
// @name         Koax Script Loader
// @namespace    https://github.com/binhsitink-binh
// @version      1.0.2
// @description  Koax Loader with Cache + CDN Fallback (Fixed & Cleaned)
// @author       binhsitink
// @match        https://evowars.io/*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @downloadURL  https://update.greasyfork.org/scripts/583768/Koax%20script.user.js
// @updateURL    https://update.greasyfork.org/scripts/583768/Koax%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const URLS = [
        "https://cdn.jsdelivr.net/gh/binhsitink-binh/loaders@refs/heads/main/loader",
        "https://raw.githubusercontent.com/binhsitink-binh/loaders/refs/heads/main/loader"
    ];

    const CACHE_KEY = "KOAX_SCRIPT_CACHE";
    const CACHE_TIME_KEY = "KOAX_SCRIPT_CACHE_TIME";
    const CACHE_DURATION = 10 * 60 * 1000; // 10 phút

    function execute(code) {
        try {
            // Chuyển đổi code thành function và thực thi
            new Function(code)();
            return true;
        } catch (e) {
            console.error("[KOAX] Script execution failed:", e);
            return false;
        }
    }

    function clearCache() {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIME_KEY);
    }

    function loadFromCache(ignoreExpiry = false) {
        const code = localStorage.getItem(CACHE_KEY);
        const time = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

        if (!code) return false;

        // Nếu ignoreExpiry = true (dùng khi đứt mạng), bỏ qua check 10 phút
        if (ignoreExpiry || (Date.now() - time < CACHE_DURATION)) {
            console.log(ignoreExpiry ? "[KOAX] All servers failed. Loaded from expired cache." : "[KOAX] Loaded from cache");
            if (execute(code)) return true;
            clearCache();
        }
        return false;
    }

    function saveCache(code) {
        localStorage.setItem(CACHE_KEY, code);
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    }

    function request(index = 0) {
        // Nếu thử hết các URL mà vẫn lỗi, lôi cache cũ ra dùng tạm làm fallback cuối cùng
        if (index >= URLS.length) {
            if (!loadFromCache(true)) {
                console.error("[KOAX] Unable to load script từ cả Server lẫn Cache.");
            }
            return;
        }

        const nextUrl = () => request(index + 1);

        GM_xmlhttpRequest({
            method: "GET",
            url: URLS[index],
            timeout: 10000,
            onload(res) {
                const text = res.responseText || "";
                
                // Kiểm tra: Phải status 200, độ dài > 100 ký tự VÀ không phải là trang lỗi HTML (thường bắt đầu bằng <!DOCTYPE hoặc <html)
                if (res.status === 200 && text.length > 100 && !text.trim().startsWith("<")) {
                    saveCache(text);
                    console.log("[KOAX] Loaded successfully from:", URLS[index]);
                    execute(text);
                } else {
                    console.warn("[KOAX] Server returned invalid data:", URLS[index]);
                    nextUrl();
                }
            },
            onerror() {
                console.warn("[KOAX] Network error:", URLS[index]);
                nextUrl();
            },
            ontimeout() {
                console.warn("[KOAX] Timeout:", URLS[index]);
                nextUrl();
            }
        });
    }

    // Khởi chạy loader: Ưu tiên cache còn hạn, nếu không có/hết hạn thì tải mới
    if (!loadFromCache(false)) {
        request();
    }
})();
