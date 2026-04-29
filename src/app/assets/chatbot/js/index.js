(function () {
    if (window.CHATBOT_WIDGET_INITIALIZED) {
        console.warn('Chatbot widget already initialized.');
        return;
    }

    if (!window.CLIENT_SECRET_KEY || typeof window.CLIENT_SECRET_KEY !== 'string') {
        console.warn('CLIENT_SECRET_KEY is missing or invalid. Chatbot will not initialize.');
        return;
    }

    const clientSecret = window.CLIENT_SECRET_KEY.trim();
    const chatbotToken = (window.AI_CHATBOT_TOKEN || '').trim();

    let htmlLoadingUrl = `https://aichat.tronex.ai/chatbot/widget?client_secret=${encodeURIComponent(clientSecret)}&chatbot_token=${encodeURIComponent(chatbotToken)}`;
    let cssPath;
    let dynamicCssUrl;
    let welcomePopupUrl;

    try {
        const scriptSrc = document.currentScript?.src;
        if (!scriptSrc) {
            throw new Error('Could not determine script origin');
        }
        baseUrl = new URL(scriptSrc).origin;
        cssPath = `${baseUrl}/assets/frontend/css/chatbot-widget.css?v=${Date.now()}`;
        dynamicCssUrl = `https://aichat.tronex.ai/chatbot/css?client_secret=${encodeURIComponent(clientSecret)}&chatbot_token=${encodeURIComponent(chatbotToken)}`;
        welcomePopupUrl = `https://aichat.tronex.ai/chatbot/welcome-popup?client_secret=${encodeURIComponent(clientSecret)}&chatbot_token=${encodeURIComponent(chatbotToken)}`;
    } catch (error) {
        console.error('Failed to determine chatbot base URL:', error);
        return;
    }

    const config = {
        timeout: 30000,
        maxRetries: 2,
        retryDelay: 2000,
        cssTimeout: 10000
    };

    let currentRetry = 0;

    const messageIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>`;
    const closeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6l-12 12"/>
            <path d="M6 6l12 12"/>
        </svg>`;

    function createChatbotElements() {
        if (document.getElementById('chatbot-toggler') || document.getElementById('chatbot-widget-frame')) {
            console.warn('Chatbot elements already exist in DOM');
            return false;
        }

        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = cssPath;

        let cssLoadTimeout = setTimeout(() => {
            console.warn('Chatbot CSS took too long to load, proceeding anyway.');
        }, config.cssTimeout);

        style.addEventListener('load', () => {
            clearTimeout(cssLoadTimeout);
        });

        style.addEventListener('error', () => {
            clearTimeout(cssLoadTimeout);
            console.error('Chatbot widget CSS failed to load.');
        });

        document.head.appendChild(style);

        // Load dynamic CSS for client-specific styling
        const dynamicStyle = document.createElement('link');
        dynamicStyle.rel = 'stylesheet';
        dynamicStyle.href = dynamicCssUrl;

        dynamicStyle.addEventListener('error', () => {
            console.warn('Dynamic chatbot CSS failed to load, using defaults.');
        });

        document.head.appendChild(dynamicStyle);

        const btn = document.createElement('div');
        btn.id = 'chatbot-toggler';
        btn.setAttribute('aria-label', 'Toggle AI Chatbot');
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = `
            <button type="button" id="chatbot-toggler-btn">
                ${messageIcon}
            </button>
            `;
        btn.style.cursor = 'pointer';

        const iframe = document.createElement('iframe');
        iframe.id = 'chatbot-widget-frame';
        iframe.src = htmlLoadingUrl;
        iframe.setAttribute('sandbox',
            'allow-scripts ' +
            'allow-same-origin ' +
            'allow-forms ' +
            'allow-popups ' +
            'allow-modals ' +
            'allow-popups-to-escape-sandbox ' +
            'allow-downloads'
        );
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('title', 'AI-powered Support Bot');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('aria-live', 'polite');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.setAttribute('aria-expanded', 'false');
        iframe.setAttribute('allow', 'clipboard-write');

        const chatbotWidgetContainer = document.createElement('div');
        chatbotWidgetContainer.className = 'chat-toggler-wraper';
        chatbotWidgetContainer.style.visibility = 'hidden';
        chatbotWidgetContainer.style.opacity = '0';
        chatbotWidgetContainer.style.transition = 'opacity 0.3s ease';

        const iframeWrapper = document.createElement('div');
        iframeWrapper.className = 'chatbot-widget-iframe';

        chatbotWidgetContainer.appendChild(btn);
        iframeWrapper.appendChild(iframe);
        chatbotWidgetContainer.appendChild(iframeWrapper);

        document.body.appendChild(chatbotWidgetContainer);

        return { btn, iframe, container: chatbotWidgetContainer };
    }

    function createWelcomePopup(container, settings) {
        if (!settings.enabled || !settings.text) {
            return null;
        }

        const popup = document.createElement('div');
        popup.id = 'chatbot-welcome-popup';
        popup.className = 'chatbot-welcome-popup';
        
        const avatarHtml = settings.avatar 
            ? `<img src="${settings.avatar}" alt="Chatbot" class="chatbot-welcome-popup-avatar" />`
            : `<div class="chatbot-welcome-popup-avatar-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                </svg>
               </div>`;

        popup.innerHTML = `
            <div class="chatbot-welcome-popup-avatar-wrapper">
                ${avatarHtml}
            </div>
            <button type="button" class="chatbot-welcome-popup-close" aria-label="Close welcome message">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6l-12 12"/><path d="M6 6l12 12"/>
                </svg>
            </button>
            <div class="chatbot-welcome-popup-content">
                <p class="chatbot-welcome-popup-text">${settings.text}</p>
            </div>
        `;

        container.appendChild(popup);

        // Close button handler
        const closeBtn = popup.querySelector('.chatbot-welcome-popup-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.add('hidden');
        });

        // Click on popup opens chatbot
        popup.addEventListener('click', () => {
            popup.classList.add('hidden');
            const togglerBtn = document.getElementById('chatbot-toggler');
            if (togglerBtn) {
                togglerBtn.click();
            }
        });

        return popup;
    }

    async function fetchWelcomePopupSettings() {
        try {
            const response = await fetch(welcomePopupUrl);
            if (!response.ok) {
                return { enabled: false };
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to fetch welcome popup settings:', error);
            return { enabled: false };
        }
    }

    function setupEventListeners(btn, iframe, welcomePopup) {
        function toggleChatbot() {
            const isVisible = iframe.parentElement.classList.toggle('visible');

            btn.classList.remove("bouncing");
            void btn.offsetWidth;
            btn.classList.add("bouncing");
            btn.setAttribute('aria-pressed', String(isVisible));
            btn.setAttribute('aria-expanded', String(isVisible));

            iframe.setAttribute('aria-hidden', String(!isVisible));
            iframe.setAttribute('aria-expanded', String(isVisible));

            // Hide welcome popup when chatbot is opened
            if (isVisible && welcomePopup) {
                welcomePopup.classList.add('hidden');
            }

            // Prevent body scroll on mobile when widget is open
            if (window.innerWidth <= 480) {
                if (isVisible) {
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                    document.body.style.top = `-${window.scrollY}px`;
                } else {
                    const scrollY = document.body.style.top;
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            }

            if (isVisible) {
                document.getElementById('chatbot-toggler-btn').innerHTML = closeIcon;

                setTimeout(() => {
                    iframe.focus();
                    iframe.contentWindow?.postMessage({ action: 'scrollToBottom' }, '*');
                }, 100);
            } else {
                document.getElementById('chatbot-toggler-btn').innerHTML = messageIcon;
                btn.focus();
            }
        }

        btn.addEventListener('click', toggleChatbot);

        // Listen for close messages from iframe (mobile close button)
        window.addEventListener('message', function(event) {
            if (event.data && event.data.action === 'closeChatbot') {
                const isVisible = iframe.parentElement.classList.contains('visible');
                if (isVisible) {
                    toggleChatbot();
                }
            }
        });
    }

    function loadIframe(iframe, retryCount = 0) {
        return new Promise((resolve, reject) => {
            let iframeLoadTimeout = setTimeout(() => {
                const errorMsg = `Chatbot iframe took too long to load (attempt ${retryCount + 1}/${config.maxRetries + 1}).`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            }, config.timeout);

            const cleanup = () => {
                clearTimeout(iframeLoadTimeout);
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
            };

            const onLoad = (event) => {
                cleanup();
                resolve();
            };

            const onError = (event) => {
                cleanup();
                const errorMsg = `Chatbot iframe failed to load (attempt ${retryCount + 1}).`;
                console.error(errorMsg, event);
                reject(new Error(errorMsg));
            };

            iframe.addEventListener('load', onLoad);
            iframe.addEventListener('error', onError);

            if (!iframe.src) {
                iframe.src = htmlLoadingUrl;
            }
        });
    }

    async function tryLoadIframe(iframe) {
        for (let i = 0; i <= config.maxRetries; i++) {
            try {
                await loadIframe(iframe, i);
                return;
            } catch (error) {
                if (i === config.maxRetries) {
                    console.error('All iframe load attempts failed.');

                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #d01e11cc;
                        color: white;
                        padding: 12px 16px;
                        border-radius: 10px;
                        z-index: 99999;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        max-width: 300px;
                        box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 9px 1px;
                    `;
                    errorDiv.innerHTML = 'Failed to load the AI chatbot. Please refresh the page or contact support at (https://aichat.tronex.ai).';
                    document.body.appendChild(errorDiv);

                    setTimeout(() => {
                        if (errorDiv.parentNode) {
                            errorDiv.parentNode.removeChild(errorDiv);
                        }
                    }, 7000);

                    return;
                }

                await new Promise(resolve => setTimeout(resolve, config.retryDelay));

                iframe.src = '';
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    // Page visit tracking for parent page
    function setupPageVisitTracking(iframe) {

        let lastTrackedUrl = window.location.href;
        let isTracking = false;

        function getPageData() {
            const pageUrl = window.location.href;
            const pageTitle = document.title;
            const referrer = document.referrer || null;
            
            // Try to get favicon
            let siteFavicon = null;
            const faviconLink = document.querySelector("link[rel*='icon']");
            if (faviconLink) {
                siteFavicon = faviconLink.href;
                // Convert relative URL to absolute
                if (siteFavicon && siteFavicon.startsWith('/')) {
                    siteFavicon = window.location.origin + siteFavicon;
                }
            } else {
                // Fallback to default favicon location
                siteFavicon = window.location.origin + '/favicon.ico';
            }

            const data = { pageUrl, pageTitle, siteFavicon, referrer };
            return data;
        }

        function sendPageVisitToIframe(force = false) {

            if (!iframe) {
                console.warn('[PageVisit] No iframe available');
                return;
            }

            // Check if iframe is loaded
            if (iframe.contentWindow === null) {
                console.warn('[PageVisit] Iframe contentWindow not ready yet');
                return;
            }

            if (isTracking && !force) {
                return;
            }

            const { pageUrl, pageTitle, siteFavicon, referrer } = getPageData();
            
            // Skip if URL hasn't changed (unless forced)
            if (pageUrl === lastTrackedUrl && !force) {
                return;
            }

            // Don't set tracking flag if forced
            if (!force) {
                isTracking = true;
            }
            lastTrackedUrl = pageUrl;

            const message = {
                type: 'CHATBOT_PAGE_VISIT',
                pageUrl: pageUrl,
                pageTitle: pageTitle,
                siteFavicon: siteFavicon,
                referrer: referrer,
                timestamp: Date.now()
            };

            // Send page visit data to iframe
            try {
                const iframeOrigin = new URL(iframe.src).origin;
                iframe.contentWindow.postMessage(message, iframeOrigin);
            } catch (e) {
                // Fallback to wildcard for cross-origin
                try {
                    iframe.contentWindow.postMessage(message, '*');
                } catch (e2) {
                    console.error('[PageVisit] Failed to send page visit to iframe:', e2);
                }
            }

            if (!force) {
                setTimeout(() => {
                    isTracking = false;
                }, 1000);
            }
        }

        // Listen for requests from iframe
        window.addEventListener('message', (event) => {

            if (event.data && event.data.type === 'CHATBOT_REQUEST_PAGE_DATA') {
                sendPageVisitToIframe(true);
            }
        });

        // Track initial page load - wait for iframe to be ready
        sendPageVisitToIframe(true);
        setTimeout(() => {
            sendPageVisitToIframe(true);
        }, 1000);
        setTimeout(() => {
            sendPageVisitToIframe(true);
        }, 2000);
        setTimeout(() => {
            sendPageVisitToIframe(true);
        }, 4000);
        setTimeout(() => {
            sendPageVisitToIframe(true);
        }, 6000);

        // Track page visits when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                setTimeout(() => {
                    sendPageVisitToIframe();
                }, 500);
            }
        });

        // Track page visits for SPAs
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(() => {
                sendPageVisitToIframe();
            }, 300);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(() => {
                sendPageVisitToIframe();
            }, 300);
        };

        // Track page visits on popstate (back/forward navigation)
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                sendPageVisitToIframe();
            }, 300);
        });
    }

    async function initChatbotWidget() {
        try {
            const elements = createChatbotElements();
            if (!elements) {
                return;
            }

            const { btn, iframe, container } = elements;
            
            // Fetch welcome popup settings and create popup
            const welcomePopupSettings = await fetchWelcomePopupSettings();
            const welcomePopup = createWelcomePopup(container, welcomePopupSettings);
            
            setupEventListeners(btn, iframe, welcomePopup);
            await tryLoadIframe(iframe);
            
            // Setup page visit tracking after iframe loads
            setupPageVisitTracking(iframe);
            
            setTimeout(() => {
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            }, 100);

            window.CHATBOT_WIDGET_INITIALIZED = true;
        } catch (error) {
            console.error('Failed to initialize chatbot widget:', error);
        }
    }

    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            setTimeout(callback, 0);
        }
    }

    onDOMReady(initChatbotWidget);
})();