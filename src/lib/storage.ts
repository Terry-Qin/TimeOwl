import { SiteCategory, type SiteVisit, type AISettings } from './types';

export class StorageManager {
    static async saveSession(session: SiteVisit): Promise<void> {
        const today = this.getToday();
        const key = `sessions_${today}`;

        const result = await chrome.storage.local.get(key);
        const sessions = (result[key] as SiteVisit[]) || [];

        sessions.push(session);

        await chrome.storage.local.set({ [key]: sessions });
    }

    static async getTodaySessions(): Promise<SiteVisit[]> {
        const today = this.getToday();
        const key = `sessions_${today}`;

        const result = await chrome.storage.local.get(key);
        return (result[key] as SiteVisit[]) || [];
    }

    static async getLanguage(): Promise<string | null> {
        const result = await chrome.storage.local.get('language');
        return (result.language as string) || null;
    }

    static async setLanguage(language: string): Promise<void> {
        await chrome.storage.local.set({ language });
    }

    static async getCustomRules(): Promise<Record<string, SiteCategory>> {
        const result = await chrome.storage.local.get('customRules');
        return (result.customRules as Record<string, SiteCategory>) || {};
    }

    static async setCustomRule(domain: string, category: SiteCategory): Promise<void> {
        const rules = await this.getCustomRules();
        rules[domain] = category;
        await chrome.storage.local.set({ customRules: rules });
    }

    static async updateSessionCategories(domain: string, category: SiteCategory): Promise<void> {
        const today = this.getToday();
        const key = `sessions_${today}`;
        const result = await chrome.storage.local.get(key);
        const sessions = (result[key] as SiteVisit[]) || [];

        const updatedSessions = sessions.map(s => {
            if (s.domain === domain && s.category !== category) {
                return { ...s, category };
            }
            return s;
        });

        // We check if any reference changed or just use a flag
        // Simple optimization: check if we actually found the domain
        const found = sessions.some(s => s.domain === domain);
        if (found) {
            await chrome.storage.local.set({ [key]: updatedSessions });
        }
    }

    static getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    static async getDataRange(startStr: string, endStr: string): Promise<{ date: string; sessions: SiteVisit[] }[]> {
        const result: { date: string; sessions: SiteVisit[] }[] = [];
        const keys: string[] = [];
        const dateMap = new Map<string, string>();

        let current = new Date(startStr);
        const end = new Date(endStr);

        // Loop from start to end ensuring we handle timezone offsets implicitly by using YYYY-MM-DD
        // Actually, let's be careful with Date loop.
        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            const key = `sessions_${dateStr}`;
            keys.push(key);
            dateMap.set(key, dateStr);
            current.setDate(current.getDate() + 1);
        }

        const data = await chrome.storage.local.get(keys);

        // Sort by date ascending
        keys.forEach(key => {
            const sessions = (data[key] as SiteVisit[]) || [];
            // We return all days even if empty to ensure chart continuity
            result.push({
                date: dateMap.get(key)!,
                sessions
            });
        });

        return result;
    }
    static async getAISettings(): Promise<AISettings> {
        const result = await chrome.storage.local.get('aiSettings');
        return (result.aiSettings as AISettings) || {
            provider: 'openai',
            apiKey: '',
            model: 'gpt-3.5-turbo',
            apiBaseUrl: 'https://api.openai.com/v1'
        };
    }

    static async setAISettings(settings: AISettings): Promise<void> {
        await chrome.storage.local.set({ aiSettings: settings });
    }
}
