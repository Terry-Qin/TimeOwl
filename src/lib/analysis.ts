import { SiteCategory, type SiteVisit } from './types';

export function calculateProductivityScore(sessions: SiteVisit[]): number {
    if (sessions.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalTime = 0;

    sessions.forEach(session => {
        const time = session.activeTime; // Using activeTime for accuracy
        totalTime += time;

        let weight = 0;
        switch (session.category) {
            case SiteCategory.WORK:
            case SiteCategory.LEARNING:
            case SiteCategory.PRODUCTIVITY:
            case SiteCategory.AI:
                weight = 100;
                break;
            case SiteCategory.NEWS:
            case SiteCategory.OTHER:
                weight = 50;
                break;
            case SiteCategory.SOCIAL:
            case SiteCategory.ENTERTAINMENT:
            case SiteCategory.SHOPPING:
                weight = 0;
                break;
        }

        totalWeightedScore += time * weight;
    });

    if (totalTime === 0) return 0;

    return Math.round(totalWeightedScore / totalTime);
}
