// ==UserScript==
// @name         Koax Key System
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-end
// @noframes
// ==/UserScript==

(function() {
    if (window.top !== window.self) return;

    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxDqVcEL0-JdHwctSgJgPsD3B7IEVYKMwciP8lJE7RRnu51g6fzknnxARZj3CeZnbI/exec';
    const CACHE_TTL = 3600 * 1000 * 2; // Cache 2 giờ

    const GET_KEY_URL = 'https://www.youtube.com/@binhsitinks';
    const YT_URL = 'https://www.youtube.com/@binhsitinks';
    const DISCORD_URL = 'https://discord.gg/e68SsCqsKT';

    const i18n = {
        vi: {
            title: "KOAX SYSTEM",
            placeholder: "Nhập Key xác thực...",
            activate: "KÍCH HOẠT KEY",
            getKey: "🔑 LẤY KEY TRỰC TUYẾN",
            youtube: "▶ YouTube",
            discord: "💬 Discord",
            connecting: "⏳ Đang kết nối máy chủ...",
            activated: "✅ Kích hoạt thành công!",
            errResponse: "❌ Lỗi phản hồi server!",
            errNetwork: "❌ Lỗi kết nối mạng!",
            errEmpty: "⚠️ Vui lòng nhập Key!"
        },
        en: {
            title: "KOAX SYSTEM",
            placeholder: "Enter Key here...",
            activate: "ACTIVATE KEY",
            getKey: "🔑 GET KEY ONLINE",
            youtube: "▶ YouTube",
            discord: "💬 Discord",
            connecting: "⏳ Connecting to server...",
            activated: "✅ Activated successfully!",
            errResponse: "❌ Server response error!",
            errNetwork: "❌ Network connection error!",
            errEmpty: "⚠️ Please enter Key!"
        }
    };

    let currentLang = localStorage.getItem('koax_lang') || 'vi';

    function getHWID() {
        const raw = [navigator.userAgent, screen.width + 'x' + screen.height, navigator.language].join('|');
        let hash = 0;
        for (let i = 0; i < raw.length; i++) hash = (hash << 5) - hash + raw.charCodeAt(i);
        return 'KOAX_HWID-' + Math.abs(hash);
    }

    function runScript(code) {
        try {
            new Function('unsafeWindow', 'window', code)(unsafeWindow, unsafeWindow);
        } catch (e) {
            console.error("Lỗi thực thi script Koax:", e);
        }
    }

    const savedKey = localStorage.getItem('K_vip_key');
    const cachedCode = localStorage.getItem('cached_script');
    const cacheTime = localStorage.getItem('cache_time');

    const isCacheValid = cachedCode && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_TTL);

    if (savedKey && isCacheValid) {
        runScript(cachedCode);
        verifyKeyBackground(savedKey);
        return;
    }

    createGUI();

    function createGUI() {
        if (document.getElementById('ks-overlay')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes ksFadeIn {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
            }

            #ks-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(6, 15, 11, 0.82); backdrop-filter: blur(10px);
                z-index: 9999999; display: flex; align-items: center; justify-content: center;
                font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            }

            #ks-card {
                background: linear-gradient(160deg, #142820 0%, #0a1410 100%);
                color: #e0f2fe; border-radius: 20px; padding: 26px 24px;
                width: 340px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(87, 204, 153, 0.15);
                border: 1px solid rgba(128, 237, 153, 0.25); text-align: center;
                box-sizing: border-box; position: relative; animation: ksFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            /* Header & Logo K */
            .ks-brand-wrapper {
                display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 18px;
            }
            .ks-logo-box {
                width: 52px; height: 52px;
                background: linear-gradient(135deg, #80ed99 0%, #2a9d8f 100%);
                border-radius: 14px; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 0 20px rgba(128, 237, 153, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4);
                transform: rotate(-3deg); transition: transform 0.3s ease;
            }
            .ks-logo-box:hover { transform: rotate(0deg) scale(1.05); }
            .ks-logo-text {
                font-size: 30px; font-weight: 900; color: #08120e;
                font-family: Arial, sans-serif; letter-spacing: -1px; line-height: 1;
            }

            .ks-title-row {
                display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
            }
            #ks-title {
                font-size: 16px; color: #80ed99; font-weight: 800; letter-spacing: 1.5px;
            }

            /* Language Button */
            #ks-lang-btn {
                position: absolute; top: 18px; right: 18px;
                background: rgba(27, 58, 47, 0.6); color: #80ed99;
                border: 1px solid rgba(87, 204, 153, 0.4); border-radius: 20px;
                padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 700;
                transition: all 0.2s ease; backdrop-filter: blur(4px);
            }
            #ks-lang-btn:hover { background: #57cc99; color: #08120e; box-shadow: 0 0 10px rgba(87, 204, 153, 0.4); }

            /* Input Field */
            #ks-input {
                width: 100%; padding: 12px 14px; border-radius: 12px;
                border: 1px solid rgba(87, 204, 153, 0.25); background: rgba(8, 18, 14, 0.7);
                color: #80ed99; font-size: 14px; outline: none; box-sizing: border-box;
                margin-bottom: 12px; text-align: center; font-weight: 600;
                transition: all 0.2s ease;
            }
            #ks-input::placeholder { color: #3d6356; font-weight: 400; }
            #ks-input:focus {
                border-color: #80ed99; box-shadow: 0 0 12px rgba(128, 237, 153, 0.25);
                background: rgba(8, 18, 14, 0.9);
            }

            /* Buttons */
            #ks-btn {
                width: 100%; padding: 12px; border-radius: 12px; border: none;
                background: linear-gradient(135deg, #57cc99 0%, #2a9d8f 100%);
                color: #06110d; font-weight: 800; cursor: pointer;
                transition: all 0.25s ease; font-size: 13px; letter-spacing: 0.5px;
                box-shadow: 0 4px 15px rgba(87, 204, 153, 0.25);
            }
            #ks-btn:hover {
                transform: translateY(-2px); box-shadow: 0 6px 20px rgba(128, 237, 153, 0.4);
                background: linear-gradient(135deg, #80ed99 0%, #38b000 100%);
            }
            #ks-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

            /* Get Key Main Link */
            .ks-btn-getkey-main {
                width: 100%; margin-top: 10px; padding: 11px 0; border-radius: 12px;
                background: rgba(42, 157, 143, 0.15); color: #80ed99; text-decoration: none;
                font-weight: 700; font-size: 12px; display: block; text-align: center;
                box-sizing: border-box; border: 1px solid rgba(87, 204, 153, 0.3);
                transition: all 0.2s ease;
            }
            .ks-btn-getkey-main:hover {
                background: rgba(87, 204, 153, 0.25); border-color: #80ed99;
                color: #ffffff; transform: translateY(-1px);
            }

            /* Links Group */
            .ks-links-group { display: flex; gap: 10px; margin-top: 10px; }
            .ks-link-btn {
                flex: 1; padding: 9px 0; border-radius: 10px; text-decoration: none;
                font-size: 12px; font-weight: 700; display: flex;
                align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;
            }
            .ks-btn-yt { background: rgba(220, 38, 38, 0.15); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.3); }
            .ks-btn-yt:hover { background: #dc2626; color: #ffffff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }

            .ks-btn-dc { background: rgba(88, 101, 242, 0.15); color: #818cf8; border: 1px solid rgba(88, 101, 242, 0.3); }
            .ks-btn-dc:hover { background: #5865f2; color: #ffffff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3); }

            /* Status */
            #ks-status { margin-top: 16px; font-size: 12.5px; font-weight: 600; min-height: 18px; }
            .ks-err { color: #ff6b6b; }
            .ks-succ { color: #80ed99; }
            .ks-info { color: #4ea8de; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'ks-overlay';
        overlay.innerHTML = `
            <div id="ks-card">
                <button id="ks-lang-btn">🌐 VN</button>

                <div class="ks-brand-wrapper">
                    <div class="ks-logo-box">
                        <span class="ks-logo-text">K</span>
                    </div>
                    <div class="ks-title-row">
                        <span id="ks-title">KOAX SYSTEM</span>
                    </div>
                </div>

                <input type="text" id="ks-input" />
                <button id="ks-btn"></button>

                <a href="${GET_KEY_URL}" target="_blank" id="ks-btn-getkey" class="ks-btn-getkey-main"></a>

                <div class="ks-links-group">
                    <a href="${YT_URL}" target="_blank" id="ks-btn-yt" class="ks-link-btn ks-btn-yt"></a>
                    <a href="${DISCORD_URL}" target="_blank" id="ks-btn-dc" class="ks-link-btn ks-btn-dc"></a>
                </div>

                <div id="ks-status"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const inputEl = document.getElementById('ks-input');
        const btnEl = document.getElementById('ks-btn');
        const statusEl = document.getElementById('ks-status');
        const langBtn = document.getElementById('ks-lang-btn');
        const titleEl = document.getElementById('ks-title');
        const getKeyEl = document.getElementById('ks-btn-getkey');
        const ytEl = document.getElementById('ks-btn-yt');
        const dcEl = document.getElementById('ks-btn-dc');

        function applyLanguage() {
            const t = i18n[currentLang];
            titleEl.textContent = t.title;
            inputEl.placeholder = t.placeholder;
            btnEl.textContent = t.activate;
            getKeyEl.textContent = t.getKey;
            ytEl.textContent = t.youtube;
            dcEl.textContent = t.discord;
            langBtn.textContent = currentLang === 'vi' ? '🌐 VN' : '🌐 EN';
        }

        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'vi' ? 'en' : 'vi';
            localStorage.setItem('koax_lang', currentLang);
            applyLanguage();
        });

        applyLanguage();

        if (savedKey) inputEl.value = savedKey;

        function setStatus(msg, type = 'info') {
            statusEl.className = `ks-${type}`;
            statusEl.textContent = msg;
        }

        function verifyKey(key) {
            const t = i18n[currentLang];
            btnEl.disabled = true;
            inputEl.disabled = true;
            setStatus(t.connecting, "info");

            GM_xmlhttpRequest({
                method: "POST",
                url: WEB_APP_URL,
                headers: { "Content-Type": "text/plain" },
                data: JSON.stringify({ key: key, hwid: getHWID() }),
                onload: function(res) {
                    try {
                        let data = JSON.parse(res.responseText);
                        if (data.error) {
                            setStatus("❌ " + data.error, "err");
                            clearStorage();
                            btnEl.disabled = false; inputEl.disabled = false;
                        } else if (data.script) {
                            setStatus(t.activated, "succ");
                            saveCache(key, data.script);
                            setTimeout(() => {
                                overlay.remove();
                                runScript(data.script);
                            }, 400);
                        }
                    } catch(e) {
                        setStatus(t.errResponse, "err");
                        btnEl.disabled = false; inputEl.disabled = false;
                    }
                },
                onerror: function() {
                    setStatus(t.errNetwork, "err");
                    btnEl.disabled = false; inputEl.disabled = false;
                }
            });
        }

        btnEl.addEventListener('click', () => {
            const val = inputEl.value.trim();
            if (!val) return setStatus(i18n[currentLang].errEmpty, "err");
            verifyKey(val);
        });

        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') btnEl.click();
        });

        if (savedKey) verifyKey(savedKey);
    }

    function verifyKeyBackground(key) {
        GM_xmlhttpRequest({
            method: "POST",
            url: WEB_APP_URL,
            headers: { "Content-Type": "text/plain" },
            data: JSON.stringify({ key: key, hwid: getHWID() }),
            onload: function(res) {
                try {
                    let data = JSON.parse(res.responseText);
                    if (data.error) {
                        clearStorage();
                    } else if (data.script) {
                        saveCache(key, data.script);
                    }
                } catch(e) {}
            }
        });
    }

    function saveCache(key, script) {
        localStorage.setItem('K_vip_key', key);
        localStorage.setItem('cached_script', script);
        localStorage.setItem('cache_time', Date.now().toString());
    }

    function clearStorage() {
        localStorage.removeItem('K_vip_key');
        localStorage.removeItem('cached_script');
        localStorage.removeItem('cache_time');
    }
})();
