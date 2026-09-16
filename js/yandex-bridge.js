/**
 * YandexBridge: Complete Integration layer for Yandex Games SDK v2.
 * Adheres strictly to all Yandex Games moderation and QA requirements.
 */
class YandexBridge {
    constructor() {
        this.ysdk = null;
        this.player = null;
        this.isAdShowing = false;
        this.isInitialized = false;
    }

    async init() {
        try {
            if (typeof YaGames !== 'undefined') {
                this.ysdk = await YaGames.init();
                console.log('[YandexBridge] Official SDK initialized successfully.');
            } else {
                this.ysdk = window.initMockSDK();
                console.log('[YandexBridge] Running with Local Mock SDK.');
            }
        } catch (e) {
            console.warn('[YandexBridge] SDK init error, fallback to Mock:', e);
            this.ysdk = window.initMockSDK();
        }

        // Init player account
        try {
            if (this.ysdk.getPlayer) {
                this.player = await this.ysdk.getPlayer({ scopes: false });
            }
        } catch (e) {
            console.warn('[YandexBridge] Could not get player:', e);
        }

        this.setupVisibilityListener();
        this.isInitialized = true;
        return this.ysdk;
    }

    notifyGameReady() {
        if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
            this.ysdk.features.LoadingAPI.ready();
            console.log('[YandexBridge] LoadingAPI.ready() sent.');
        }
    }

    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (window.soundManager) window.soundManager.mute();
                if (window.game) window.game.isPaused = true;
            } else {
                if (!this.isAdShowing) {
                    if (window.soundManager) window.soundManager.unmute();
                    if (window.game) window.game.isPaused = false;
                }
            }
        });
    }

    showFullscreenAd(onCloseCallback) {
        if (this.isAdShowing) return;
        this.isAdShowing = true;

        if (window.soundManager) window.soundManager.mute();
        if (window.game) window.game.isPaused = true;

        this.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => {
                    console.log('[YandexBridge] Interstitial Ad opened');
                },
                onClose: (wasShown) => {
                    console.log('[YandexBridge] Interstitial Ad closed, wasShown:', wasShown);
                    this.isAdShowing = false;
                    if (window.soundManager) window.soundManager.unmute();
                    if (window.game) window.game.isPaused = false;
                    if (onCloseCallback) onCloseCallback(wasShown);
                },
                onError: (error) => {
                    console.warn('[YandexBridge] Interstitial Ad error:', error);
                    this.isAdShowing = false;
                    if (window.soundManager) window.soundManager.unmute();
                    if (window.game) window.game.isPaused = false;
                    if (onCloseCallback) onCloseCallback(false);
                }
            }
        });
    }

    showRewardedVideo(onRewardCallback, onCloseCallback) {
        if (this.isAdShowing) return;
        this.isAdShowing = true;

        let rewarded = false;
        if (window.soundManager) window.soundManager.mute();
        if (window.game) window.game.isPaused = true;

        this.ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    console.log('[YandexBridge] Rewarded Video opened');
                },
                onRewarded: () => {
                    console.log('[YandexBridge] Rewarded Video rewarded');
                    rewarded = true;
                    if (onRewardCallback) onRewardCallback();
                },
                onClose: () => {
                    console.log('[YandexBridge] Rewarded Video closed');
                    this.isAdShowing = false;
                    if (window.soundManager) window.soundManager.unmute();
                    if (window.game) window.game.isPaused = false;
                    if (onCloseCallback) onCloseCallback(rewarded);
                },
                onError: (error) => {
                    console.warn('[YandexBridge] Rewarded Video error:', error);
                    this.isAdShowing = false;
                    if (window.soundManager) window.soundManager.unmute();
                    if (window.game) window.game.isPaused = false;
                    if (onCloseCallback) onCloseCallback(false);
                }
            }
        });
    }

    async saveData(data) {
        try {
            const str = JSON.stringify(data);
            localStorage.setItem('bus_traffic_save_data', str);

            if (this.player && this.player.setData) {
                await this.player.setData(data, true);
            }
        } catch (e) {
            console.warn('[YandexBridge] Save data error:', e);
        }
    }

    async loadData() {
        try {
            if (this.player && this.player.getData) {
                const cloudData = await this.player.getData();
                if (cloudData && Object.keys(cloudData).length > 0) {
                    return cloudData;
                }
            }

            const localStr = localStorage.getItem('bus_traffic_save_data');
            return localStr ? JSON.parse(localStr) : null;
        } catch (e) {
            console.warn('[YandexBridge] Load data error:', e);
            const localStr = localStorage.getItem('bus_traffic_save_data');
            return localStr ? JSON.parse(localStr) : null;
        }
    }
}

window.yandexBridge = new YandexBridge();
