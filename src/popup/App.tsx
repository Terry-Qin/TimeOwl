import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StorageManager } from '../lib/storage';
import { SiteCategory, type SiteVisit, type AISettings } from '../lib/types';

const getCategoryColor = (category: SiteCategory) => {
    switch (category) {
        case SiteCategory.WORK: return 'bg-blue-100 text-blue-700';
        case SiteCategory.LEARNING: return 'bg-emerald-100 text-emerald-700';
        case SiteCategory.SOCIAL: return 'bg-pink-100 text-pink-700';
        case SiteCategory.ENTERTAINMENT: return 'bg-purple-100 text-purple-700';
        case SiteCategory.SHOPPING: return 'bg-amber-100 text-amber-700';
        case SiteCategory.NEWS: return 'bg-cyan-100 text-cyan-700';
        case SiteCategory.PRODUCTIVITY: return 'bg-indigo-100 text-indigo-700';
        case SiteCategory.AI: return 'bg-rose-100 text-rose-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

function App() {
    const { t, i18n } = useTranslation();
    const [sessions, setSessions] = useState<SiteVisit[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [aiSettings, setAiSettings] = useState<AISettings>({
        provider: 'openai',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        apiBaseUrl: 'https://api.openai.com/v1'
    });

    useEffect(() => {
        loadData();
        loadSettings();
        // Refresh every second to show ticking timer
        const interval = setInterval(loadData, 1000);
        return () => clearInterval(interval);
    }, []);

    const loadSettings = async () => {
        const settings = await StorageManager.getAISettings();
        setAiSettings(settings);
    };

    const loadData = async () => {
        const storedSessions = await StorageManager.getTodaySessions();
        // Don't reload settings here to avoid overwriting user input while editing
        // const settings = await StorageManager.getAISettings();
        // setAiSettings(settings);

        // Get current live session from background
        try {
            const currentSession = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_SESSION' });

            if (currentSession && currentSession.domain && currentSession.startTime) {
                const now = Date.now();
                const duration = (now - currentSession.startTime) / 1000;
                const activeTime = currentSession.activeTime || 0;

                if (duration > 0) {
                    storedSessions.push({
                        id: 'current',
                        domain: currentSession.domain,
                        startTime: currentSession.startTime,
                        endTime: now,
                        duration: duration,
                        activeTime: activeTime,
                        idleTime: Math.max(0, duration - activeTime),
                        category: currentSession.category,
                        faviconUrl: currentSession.faviconUrl
                    });
                }
            }
        } catch (e) {
            console.log("Could not get current session", e);
        }

        setSessions(storedSessions);

        // Load saved language
        const savedLang = await StorageManager.getLanguage();
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    };

    const changeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng);
        await StorageManager.setLanguage(lng);
    };

    const handleCategoryChange = async (domain: string, newCategory: SiteCategory) => {
        await StorageManager.setCustomRule(domain, newCategory);
        await StorageManager.updateSessionCategories(domain, newCategory);
        const rules = await StorageManager.getCustomRules();
        await chrome.runtime.sendMessage({ type: 'RULES_UPDATED', rules });

        // Optimistic update
        const updatedSessions = sessions.map(s => {
            if (s.domain === domain) {
                return { ...s, category: newCategory };
            }
            return s;
        });
        setSessions(updatedSessions);
    };

    const saveSettings = async (newSettings: AISettings) => {
        setAiSettings(newSettings);
        await StorageManager.setAISettings(newSettings);
        setShowSettings(false);
    };

    // Aggregate by domain
    const aggregated = sessions.reduce((acc, session) => {
        if (!acc[session.domain]) {
            acc[session.domain] = { ...session, duration: 0, activeTime: 0 };
        }
        acc[session.domain].duration += session.duration;
        acc[session.domain].activeTime += session.activeTime;
        return acc;
    }, {} as Record<string, SiteVisit>);

    const sorted = Object.values(aggregated).sort((a, b) => b.duration - a.duration);
    const totalActiveTime = sessions.reduce((acc, s) => acc + s.activeTime, 0);

    // Calculate category distribution
    const categoryStats = sessions.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + s.activeTime;
        return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.entries(categoryStats)
        .sort(([, a], [, b]) => b - a)
        .map(([category, time]) => ({
            category: category as SiteCategory,
            percentage: totalActiveTime > 0 ? (time / totalActiveTime) * 100 : 0
        }))
        .filter(item => item.percentage > 0);

    const formatDuration = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    const PROVIDERS = {
        openai: { name: 'OpenAI', url: 'https://api.openai.com/v1', model: 'gpt-4o' },
        deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com', model: 'deepseek-chat' },
        moonshot: { name: 'Moonshot (Kimi CN)', url: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
        'moonshot-global': { name: 'Moonshot (Kimi Global)', url: 'https://api.moonshot.ai/v1', model: 'moonshot-v1-8k' },
        qwen: { name: 'Qwen (Aliyun)', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
        glm: { name: 'Zhipu GLM (CN)', url: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
        'glm-global': { name: 'Zhipu GLM (Global)', url: 'https://api.z.ai/api/paas/v4', model: 'glm-4' },
        minimax: { name: 'MiniMax (M2.5)', url: 'https://api.minimax.chat/v1', model: 'minimax-m2.5' },
        custom: { name: 'Custom', url: '', model: '' }
    };

    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provider = e.target.value as keyof typeof PROVIDERS;
        const preset = PROVIDERS[provider];

        setAiSettings({
            ...aiSettings,
            provider,
            apiBaseUrl: preset.url || aiSettings.apiBaseUrl,
            model: preset.model || aiSettings.model
        });
    };

    if (showSettings) {
        return (
            <div className="w-[400px] min-h-[500px] bg-white text-slate-900 font-sans p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-700">{t('settings.title')}</h2>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.language')}</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-3 py-1.5 rounded border text-sm ${i18n.language === 'en' ? 'bg-owl-50 border-owl-200 text-owl-700' : 'border-slate-200'}`}
                            >English</button>
                            <button
                                onClick={() => changeLanguage('zh')}
                                className={`px-3 py-1.5 rounded border text-sm ${i18n.language === 'zh' ? 'bg-owl-50 border-owl-200 text-owl-700' : 'border-slate-200'}`}
                            >中文</button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-3">{t('settings.ai_config')}</h3>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-slate-500 mb-1">{t('settings.provider')}</label>
                            <select
                                value={aiSettings.provider}
                                onChange={handleProviderChange}
                                className="w-full text-sm border-slate-200 rounded-md p-2 bg-slate-50"
                            >
                                {Object.entries(PROVIDERS).map(([key, value]) => (
                                    <option key={key} value={key}>{value.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-slate-500 mb-1">{t('settings.api_key')}</label>
                            <input
                                type="password"
                                value={aiSettings.apiKey}
                                onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                                placeholder="sk-..."
                                className="w-full text-sm border-slate-200 rounded-md p-2 bg-slate-50"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-slate-500 mb-1">{t('settings.model')}</label>
                            <input
                                type="text"
                                value={aiSettings.model}
                                onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                                placeholder="gpt-4o, deepseek-chat..."
                                className="w-full text-sm border-slate-200 rounded-md p-2 bg-slate-50"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-slate-500 mb-1">{t('settings.base_url')}</label>
                            <input
                                type="text"
                                value={aiSettings.apiBaseUrl}
                                onChange={(e) => setAiSettings({ ...aiSettings, apiBaseUrl: e.target.value })}
                                placeholder="https://api.openai.com/v1"
                                className="w-full text-sm border-slate-200 rounded-md p-2 bg-slate-50"
                            />
                        </div>

                        <button
                            onClick={() => saveSettings(aiSettings)}
                            className="w-full mt-4 bg-owl-600 text-white py-2 rounded-md hover:bg-owl-700 transition"
                        >
                            {t('settings.save')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[400px] min-h-[500px] bg-slate-50 text-slate-900 font-sans p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-owl-600 to-indigo-600">
                    {t('app_name')} 🦉
                </h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => chrome.tabs.create({ url: 'dashboard.html' })}
                        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                        title={t('open_dashboard')}
                    >
                        📊
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    {t('today_stats')}
                </h2>
                <div className="text-3xl font-bold text-slate-900">
                    {formatDuration(totalActiveTime)}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                    {t('total_active_time')}
                </div>
            </div>

            {/* Category Distribution Bar */}
            {totalActiveTime > 0 && (
                <div className="mb-6">
                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                        {categoryDistribution.map((item) => (
                            <div
                                key={item.category}
                                style={{ width: `${item.percentage}%` }}
                                className={getCategoryColor(item.category).split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}
                                title={`${t(`categories.${item.category}`)}: ${Math.round(item.percentage)}%`}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {categoryDistribution.slice(0, 4).map((item) => (
                            <div key={item.category} className="flex items-center text-xs text-slate-500">
                                <div className={`w-2 h-2 rounded-full mr-1 ${getCategoryColor(item.category).split(' ')[0].replace('-100', '-500')}`} />
                                {t(`categories.${item.category}`)} {Math.round(item.percentage)}%
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {sorted.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        {t('no_data')}
                    </div>
                ) : (
                    sorted.map((item) => (
                        <div key={item.domain} className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 flex items-center justify-between hover:scale-[1.01] transition-transform">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                {item.faviconUrl ? (
                                    <img src={item.faviconUrl} className="w-6 h-6 rounded-sm" alt="" />
                                ) : (
                                    <div className="w-6 h-6 rounded-sm bg-slate-200 flex items-center justify-center text-xs">
                                        {item.domain[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-medium truncate max-w-[150px]">{item.domain}</span>
                                    <select
                                        value={item.category}
                                        onChange={(e) => handleCategoryChange(item.domain, e.target.value as SiteCategory)}
                                        className={`text-[10px] px-1 py-0.5 rounded-md w-fit outline-none cursor-pointer ${getCategoryColor(item.category)} bg-transparent appearance-none hover:bg-opacity-80`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {Object.values(SiteCategory).map(cat => (
                                            <option key={cat} value={cat} className="text-slate-900 bg-white">
                                                {t(`categories.${cat}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="font-semibold text-owl-600">
                                {formatDuration(item.duration)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
