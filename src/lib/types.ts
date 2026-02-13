export const SiteCategory = {
    WORK: 'work',
    LEARNING: 'learning',
    SOCIAL: 'social',
    ENTERTAINMENT: 'entertainment',
    SHOPPING: 'shopping',
    NEWS: 'news',
    PRODUCTIVITY: 'productivity',
    AI: 'ai',
    OTHER: 'other',
} as const;

export type SiteCategory = typeof SiteCategory[keyof typeof SiteCategory];

export type SiteVisit = {
    id: string;
    domain: string;
    startTime: number;
    endTime: number;
    duration: number;
    activeTime: number;
    idleTime: number;
    category: SiteCategory;
    faviconUrl?: string;
};

export type CurrentSessionResponse = {
    domain: string | null;
    startTime: number | null;
    activeTime: number;
    category: SiteCategory;
    faviconUrl?: string;
};

export interface AISettings {
    provider: 'openai' | 'claude' | 'gemini' | 'deepseek' | 'moonshot' | 'moonshot-global' | 'qwen' | 'glm' | 'glm-global' | 'minimax' | 'custom';
    apiKey: string;
    model: string;
    apiBaseUrl?: string;
}

export interface DailyStats {
    date: string;
    totalActiveTime: number;
    productivityScore: number;
    topSites: SiteVisit[];
    categoryBreakdown: Record<string, number>;
}
