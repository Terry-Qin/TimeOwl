import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StorageManager } from '../lib/storage';
import { SiteCategory, type SiteVisit } from '../lib/types';
import { calculateProductivityScore } from '../lib/analysis';
import { SiteCategorizer } from '../lib/categorizer';
import Charts, { type ChartMode } from './components/Charts';
import AIInsights from './components/AIInsights';

type TimeRange = 'today' | '3d' | '7d' | '30d';

export default function DashboardApp() {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState<TimeRange>('today');
    const [sessions, setSessions] = useState<SiteVisit[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartMode, setChartMode] = useState<ChartMode>('pie');
    const [productivityScore, setProductivityScore] = useState(0);

    const COLORS = {
        [SiteCategory.WORK]: '#3b82f6',
        [SiteCategory.LEARNING]: '#10b981',
        [SiteCategory.SOCIAL]: '#ec4899',
        [SiteCategory.ENTERTAINMENT]: '#a855f7',
        [SiteCategory.SHOPPING]: '#f59e0b',
        [SiteCategory.NEWS]: '#06b6d4',
        [SiteCategory.PRODUCTIVITY]: '#4f46e5',
        [SiteCategory.AI]: '#e11d48',
        [SiteCategory.OTHER]: '#64748b',
    };

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const loadData = async () => {
        const rules = await StorageManager.getCustomRules();
        SiteCategorizer.loadCustomRules(rules);

        const end = new Date();
        const start = new Date();

        if (timeRange === 'today') {
            // start is already today
        } else if (timeRange === '3d') {
            start.setDate(start.getDate() - 2);
        } else if (timeRange === '7d') {
            start.setDate(start.getDate() - 6);
        } else if (timeRange === '30d') {
            start.setDate(start.getDate() - 29);
        }

        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        const rangeData = await StorageManager.getDataRange(startStr, endStr);

        let allSessions: SiteVisit[] = [];
        rangeData.forEach(day => {
            const daySessions = day.sessions.map(s => ({
                ...s,
                category: SiteCategorizer.categorize(s.domain)
            }));
            allSessions = [...allSessions, ...daySessions];
        });

        setSessions(allSessions);
        setProductivityScore(calculateProductivityScore(allSessions));

        if (timeRange === 'today') {
            setChartMode('pie');
            const pieData = allSessions.reduce((acc, session) => {
                const existing = acc.find((item: any) => item.name === t(`categories.${session.category}`));
                if (existing) {
                    existing.value += session.activeTime;
                } else {
                    acc.push({
                        name: t(`categories.${session.category}`),
                        value: session.activeTime,
                        color: COLORS[session.category] || COLORS[SiteCategory.OTHER]
                    });
                }
                return acc;
            }, [] as any[]);
            setChartData(pieData);
        } else {
            setChartMode('bar');
            const barData = rangeData.map(day => {
                const dateLabel = day.date.slice(5); // MM-DD
                const dayEntry: any = { date: dateLabel };

                day.sessions.forEach(s => {
                    const currentCat = SiteCategorizer.categorize(s.domain);
                    dayEntry[currentCat] = (dayEntry[currentCat] || 0) + s.activeTime;
                });
                return dayEntry;
            });
            setChartData(barData);
        }
    };

    const handleCategoryChange = async (domain: string, newCategory: SiteCategory) => {
        await StorageManager.setCustomRule(domain, newCategory);
        await StorageManager.updateSessionCategories(domain, newCategory);

        const rules = await StorageManager.getCustomRules();
        await chrome.runtime.sendMessage({ type: 'RULES_UPDATED', rules });

        loadData();
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto font-sans text-slate-900 bg-slate-50">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-owl-600 to-indigo-600">
                        {t('app_name')} Dashboard 🦉
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex space-x-1">
                    {(['today', '3d', '7d', '30d'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === range
                                ? 'bg-owl-50 text-owl-600 shadow-sm ring-1 ring-owl-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {range === 'today' ? t('dashboard.range.today') :
                                range === '3d' ? t('dashboard.range.3d') :
                                    range === '7d' ? t('dashboard.range.7d') :
                                        t('dashboard.range.30d')}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden h-[340px]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-9xl">⚡</span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-500 mb-2 relative z-10">{t('dashboard.productivity_score')}</h2>
                    <div className={`text-6xl font-bold relative z-10 ${getScoreColor(productivityScore)}`}>
                        {productivityScore}
                    </div>
                    <div className="text-sm text-slate-400 mt-2 relative z-10">
                        {timeRange === 'today' ? t('dashboard.range.today') : t('dashboard.average')}
                    </div>
                </div>

                <div className="col-span-1 h-[340px]">
                    <AIInsights sessions={sessions} productivityScore={productivityScore} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col h-[340px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-500">
                            {chartMode === 'pie' ? t('dashboard.time_distribution') : t('dashboard.history_trend')}
                        </h2>
                    </div>
                    <div className="flex-1 w-full h-full min-h-0 min-w-0 overflow-hidden">
                        <Charts mode={chartMode} data={chartData} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-500 mb-4">{t('dashboard.top_sites')} ({sessions.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="pb-3 px-4 font-medium">{t('dashboard.table.site')}</th>
                                <th className="pb-3 px-4 font-medium">{t('dashboard.table.category')}</th>
                                <th className="pb-3 px-4 font-medium">{t('dashboard.table.active_time')}</th>
                                <th className="pb-3 px-4 font-medium">{t('dashboard.table.idle_time')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400">{t('no_data')}</td>
                                </tr>
                            ) : (
                                Object.values(sessions.reduce((acc, s) => {
                                    if (!acc[s.domain]) {
                                        acc[s.domain] = { ...s, activeTime: 0, idleTime: 0 };
                                    }
                                    acc[s.domain].activeTime += s.activeTime;
                                    acc[s.domain].idleTime += s.idleTime;
                                    return acc;
                                }, {} as Record<string, SiteVisit>))
                                    .sort((a, b) => b.activeTime - a.activeTime)
                                    .slice(0, 10)
                                    .map((session) => (
                                        <tr key={session.domain} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-medium flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    {session.faviconUrl ? (
                                                        <img src={session.faviconUrl} className="w-5 h-5" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                    ) : (
                                                        <span className="text-xs text-slate-400">{session.domain[0].toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <span className="truncate max-w-[200px]">{session.domain}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={session.category}
                                                    onChange={(e) => handleCategoryChange(session.domain, e.target.value as SiteCategory)}
                                                    className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-600 outline-none hover:border-owl-300 focus:border-owl-500 focus:ring-1 focus:ring-owl-200 transition-all cursor-pointer"
                                                >
                                                    {Object.values(SiteCategory).map(cat => (
                                                        <option key={cat} value={cat}>
                                                            {t(`categories.${cat}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-600">
                                                {Math.floor(session.activeTime / 3600)}h {Math.floor((session.activeTime % 3600) / 60)}m
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-400 text-sm">
                                                {Math.floor(session.idleTime / 3600)}h {Math.floor((session.idleTime % 3600) / 60)}m
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
