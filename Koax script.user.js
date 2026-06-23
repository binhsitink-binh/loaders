// ==UserScript==
// @name         Koax script
// @namespace    https://github.com/binhsitink-binh
// @version      1.0.0
// @description  none
// @author       binhsitink
// @match        https://evowars.io/*
// @icon         https://chatgpt.com/backend-api/estuary/content?id=file_00000000470871faab0b869cedeff0b1&ts=495018&p=fs&cid=1&sig=83b3e2554410559c47fb0723dec1a0be21e3016c5ed7b90d492d8565af6f76bc&v=0
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/583768/Koax%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/583768/Koax%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_URL = 'https://raw.githubusercontent.com/binhsitink-binh/loaders/refs/heads/main/load';

    GM_xmlhttpRequest({
        method: 'GET',
        url: SCRIPT_URL,
        nocache: true,
        onload: (res) => {
            if (res.status === 200) {
                try {
                    new Function(res.responseText)();
                    console.log('[KOAX] Script loaded successfully');
                } catch (e) {
                    console.error('[KOAX] Execution error:', e);
                }
            } else {
                console.error('[KOAX] HTTP Error:', res.status);
            }
        },
        onerror: (err) => {
            console.error('[KOAX] Network Error:', err);
        }
    });
})();