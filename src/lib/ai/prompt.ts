import type { SiteVisit } from '../types';

export class PromptGenerator {
    static generateInsightPrompt(
        sessions: SiteVisit[],
        productivityScore: number,
        language: string = 'zh'
    ): string {
        const totalActiveTime = sessions.reduce((acc, s) => acc + s.activeTime, 0);
        const totalHours = (totalActiveTime / 3600).toFixed(1);

        // Top 5 sites
        const topSites = sessions
            .reduce((acc, s) => {
                const existing = acc.find(item => item.domain === s.domain);
                if (existing) {
                    existing.activeTime += s.activeTime;
                } else {
                    acc.push({ ...s });
                }
                return acc;
            }, [] as SiteVisit[])
            .sort((a, b) => b.activeTime - a.activeTime)
            .slice(0, 5)
            .map(s => `${s.domain} (${(s.activeTime / 60).toFixed(0)}m, ${s.category})`)
            .join(', ');

        const categoryStats = sessions.reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + s.activeTime;
            return acc;
        }, {} as Record<string, number>);

        const mainCategories = Object.entries(categoryStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat]) => cat)
            .join(', ');

        const langInstruction = language.startsWith('zh')
            ? 'Please response in Chinese (Simplified).'
            : 'Please response in English.';

        return `
        Analyze the following productivity data for today:
        - Total Active Time: ${totalHours} hours
        - Productivity Score: ${productivityScore}/100
        - Top Sites: ${topSites}
        - Main Activity Categories: ${mainCategories}

        ${langInstruction}
        
        Please provide a concise "Daily Insight" in Markdown format.
        Structure (Keep it under 150 words total):
        **Summary**: One short sentence summary.
        **Insight**: Brief analysis (2-3 sentences max).
        **Suggestion**: One actionable tip.

        Do NOT use # headings. Use bold (**text**) for labels.
        Keep it encouraging but honest. Use a professional coach tone.
        `;
    }
}
