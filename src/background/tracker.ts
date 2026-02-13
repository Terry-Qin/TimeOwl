import { StorageManager } from '../lib/storage';
import type { SiteVisit } from '../lib/types';
import { SiteCategorizer } from '../lib/categorizer';

class TimeTracker {
    private currentSite: string | null = null;
    private startTime: number | null = null;
    private currentFavicon: string | undefined = undefined;
    private currentActiveTime: number = 0;

    async init() {
        // Load custom rules
        const rules = await StorageManager.getCustomRules();
        SiteCategorizer.loadCustomRules(rules);

        // Listen for tab activation
        chrome.tabs.onActivated.addListener(this.onTabActivated);

        // Listen for tab updates (URL changes)
        chrome.tabs.onUpdated.addListener(this.onTabUpdated);

        // Listen for window focus changes
        chrome.windows.onFocusChanged.addListener(this.onWindowFocusChanged);

        // Listen for messages from popup and content script
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage = (request: any, _sender: any, sendResponse: (response: any) => void) => {
        if (request.type === 'GET_CURRENT_SESSION') {
            sendResponse({
                domain: this.currentSite,
                startTime: this.startTime,
                activeTime: this.currentActiveTime,
                category: SiteCategorizer.categorize(this.currentSite ?? ''),
                faviconUrl: this.currentFavicon
            });
        } else if (request.type === 'HEARTBEAT') {
            // Only count if the heartbeat comes from the current site
            if (this.currentSite && request.domain === this.currentSite) {
                this.currentActiveTime += 1; // Assume 1 second heartbeat
            }
        } else if (request.type === 'RULES_UPDATED') {
            SiteCategorizer.loadCustomRules(request.rules);
        }
        return true;
    };

    onTabActivated = async (activeInfo: any) => {
        await this.saveCurrentSession();

        try {
            const tab = await chrome.tabs.get(activeInfo.tabId);
            if (tab.url) {
                this.startTracking(tab.url, tab.favIconUrl);
            }
        } catch (error) {
            console.log("Tab might be closed or inaccessible", error);
        }
    };

    onTabUpdated = async (_tabId: number, changeInfo: any, tab: chrome.tabs.Tab) => {
        if (changeInfo.status === 'complete' && tab.active && tab.url) {
            await this.saveCurrentSession();
            this.startTracking(tab.url, tab.favIconUrl);
        }
    };

    onWindowFocusChanged = async (windowId: number) => {
        if (windowId === chrome.windows.WINDOW_ID_NONE) {
            await this.saveCurrentSession();
            this.currentSite = null;
        } else {
            const [tab] = await chrome.tabs.query({ active: true, windowId });
            if (tab?.url) {
                this.startTracking(tab.url, tab.favIconUrl);
            }
        }
    };

    startTracking(url: string, faviconUrl?: string) {
        if (!url.startsWith('http')) return; // Ignore chrome:// pages etc.

        const domain = this.extractDomain(url);
        if (!domain) return;

        this.currentSite = domain;
        this.startTime = Date.now();
        this.currentActiveTime = 0; // Reset active time
        this.currentFavicon = faviconUrl;
    }

    async saveCurrentSession() {
        if (!this.currentSite || !this.startTime) return;

        const endTime = Date.now();
        const duration = (endTime - this.startTime) / 1000; // seconds

        // Ignore short sessions (< 2 seconds)
        if (duration < 2) return;

        // Ensure activeTime doesn't exceed duration (clock skew protection)
        const finalActiveTime = Math.min(this.currentActiveTime, duration);
        const idleTime = Math.max(0, duration - finalActiveTime);

        const session: SiteVisit = {
            id: crypto.randomUUID(),
            domain: this.currentSite,
            startTime: this.startTime,
            endTime: endTime,
            duration: duration,
            activeTime: finalActiveTime,
            idleTime: idleTime,
            category: SiteCategorizer.categorize(this.currentSite),
            faviconUrl: this.currentFavicon
        };

        await StorageManager.saveSession(session);

        this.currentSite = null;
        this.startTime = null;
        this.currentActiveTime = 0;
        this.currentFavicon = undefined;
    }

    extractDomain(url: string): string | null {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return null;
        }
    }
}

const tracker = new TimeTracker();
tracker.init();
