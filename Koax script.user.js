// ==UserScript==
// @name         Koax Script Loader
// @namespace    https://github.com/binhsitink-binh
// @version      1.0.1
// @description  Koax Loader with Cache + CDN Fallback
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
        "https://cdn.jsdelivr.net/gh/binhsitink-binh/loaders@main/load",
        "https://raw.githubusercontent.com/binhsitink-binh/loaders/main/load"
    ];

    const CACHE_KEY = "KOAX_SCRIPT_CACHE";
    const CACHE_TIME_KEY = "KOAX_SCRIPT_CACHE_TIME";

    // Cache 10 phút
    const CACHE_DURATION = 10 * 60 * 1000;

    function execute(code) {
        try {
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

    function loadFromCache() {
        const code = localStorage.getItem(CACHE_KEY);
        const time = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

        if (!code) return false;

        if (Date.now() - time < CACHE_DURATION) {
            console.log("[KOAX] Loaded from cache");
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

        if (index >= URLS.length) {

            const cache = localStorage.getItem(CACHE_KEY);

            if (cache) {
                console.warn("[KOAX] All servers failed, using expired cache.");
                execute(cache);
            } else {
                console.error("[KOAX] Unable to load script.");
            }

            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: URLS[index],
            timeout: 10000,

            onload(res) {

                if (res.status === 200 && res.responseText.length > 100) {

                    saveCache(res.responseText);

                    console.log("[KOAX] Loaded from", URLS[index]);

                    execute(res.responseText);

                } else {

                    console.warn("[KOAX] Server failed:", URLS[index]);

                    request(index + 1);

                }

            },

            onerror() {

                console.warn("[KOAX] Network error:", URLS[index]);

                request(index + 1);

            },

            ontimeout() {

                console.warn("[KOAX] Timeout:", URLS[index]);

                request(index + 1);

            }

        });

    }

    // Ưu tiên cache
    if (!loadFromCache()) {
        request();
    }

})();
