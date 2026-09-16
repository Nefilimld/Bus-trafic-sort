/**
 * Yandex Games Mock SDK for Local Development & Testing
 * Emulates official YaGames SDK v2 behaviors in localhost / offline environments.
 */
window.initMockSDK = function() {
    if (window.ysdk) return window.ysdk;

    console.info('[MockSDK] Initializing local Yandex Games Mock SDK...');

    window.ysdk = {
        environment: {
            app: { id: 'local-test-app' },
            browser: { lang: 'ru' },
            i18n: { lang: 'ru', t: (k) => k }
        },
        deviceInfo: {
            type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            isMobile: () => /Mobi|Android/i.test(navigator.userAgent),
            isDesktop: () => !/Mobi|Android/i.test(navigator.userAgent),
            isTablet: () => false
        },
        features: {
            LoadingAPI: {
                ready: () => console.log('[MockSDK] LoadingAPI.ready() called.')
            }
        },
        adv: {
            showFullscreenAdv: ({ callbacks = {} }) => {
                console.log('[MockSDK] Simulating Fullscreen Ad...');
                if (callbacks.onOpen) callbacks.onOpen();
                setTimeout(() => {
                    console.log('[MockSDK] Fullscreen Ad Closed.');
                    if (callbacks.onClose) callbacks.onClose(true);
                }, 800);
            },
            showRewardedVideo: ({ callbacks = {} }) => {
                console.log('[MockSDK] Simulating Rewarded Video Ad...');
                if (callbacks.onOpen) callbacks.onOpen();
                setTimeout(() => {
                    console.log('[MockSDK] Rewarded Video Reward Granted!');
                    if (callbacks.onRewarded) callbacks.onRewarded();
                    if (callbacks.onClose) callbacks.onClose();
                }, 1000);
            }
        },
        getPlayer: async () => {
            return {
                getMode: () => 'lite',
                getName: () => 'LocalPlayer',
                getUniqueID: () => 'player-12345',
                setData: async (data) => {
                    localStorage.setItem('bus_traffic_save_data', JSON.stringify(data));
                    return true;
                },
                getData: async () => {
                    const d = localStorage.getItem('bus_traffic_save_data');
                    return d ? JSON.parse(d) : {};
                }
            };
        },
        getLeaderboards: async () => {
            return {
                setLeaderboardScore: async (name, score) => {
                    console.log(`[MockSDK] Leaderboard "${name}" score set:`, score);
                }
            };
        },
        feedback: {
            canReview: async () => ({ value: true }),
            requestReview: async () => console.log('[MockSDK] Feedback review requested.')
        },
        shortcut: {
            canShowPrompt: async () => ({ canShow: true }),
            showPrompt: async () => console.log('[MockSDK] Shortcut prompt shown.')
        }
    };

    return window.ysdk;
};
